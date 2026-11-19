import { createAnthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { groundingPrompt, CLAUDE_MODEL } from "./grounding";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
} from "./run-id.server";

const input = z.object({
  selectionId: z.literal("725:فيلا سكنية"),
  messages: z
    .array(
      z.object({
        id: z.string().max(100),
        role: z.enum(["user", "assistant"]),
        parts: z
          .array(z.object({ type: z.literal("text"), text: z.string().max(6000) }))
          .min(1)
          .max(4),
      }),
    )
    .min(1)
    .max(24),
});

export async function handleChat(request: Request) {
  // This prototype endpoint exposes only the bundled public parcel context.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "طلب غير مسموح." }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 40000)
    return Response.json({ error: "المحادثة طويلة؛ اختصر رسالتك." }, { status: 413 });
  let body;
  try {
    body = input.parse(JSON.parse(raw));
  } catch {
    return Response.json({ error: "اختر القطعة والفيلا ثم أرسل رسالة صالحة." }, { status: 400 });
  }
  if (body.messages.at(-1)?.role !== "user")
    return Response.json({ error: "يلزم إرسال سؤال جديد." }, { status: 400 });
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return Response.json({ error: "خدمة الذكاء الاصطناعي غير مهيأة." }, { status: 401 });
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const state = await supabaseAdmin
    .from("ai_service_state")
    .select("reason,status")
    .eq("service", CLAUDE_MODEL)
    .maybeSingle();
  if (state.error) return Response.json({ error: "تعذر التحقق من حالة الخدمة." }, { status: 503 });
  if (state.data) return Response.json({ error: state.data.reason }, { status: state.data.status });
  const ip = request.headers.get("cf-connecting-ip") ?? "preview";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  const visitor = Array.from(new Uint8Array(digest), (n) => n.toString(16).padStart(2, "0")).join(
    "",
  );
  const claim = await supabaseAdmin.rpc("claim_ai_request", { visitor });
  if (claim.error) return Response.json({ error: "تعذر بدء الطلب الآن." }, { status: 503 });
  if (!claim.data)
    return Response.json(
      { error: "طلبات كثيرة؛ انتظر دقيقة قبل إرسال سؤال جديد." },
      { status: 429, headers: { "Retry-After": "60" } },
    );

  const gateway = createLovableAiGatewayRunIdFetch();
  let upstream: Response | undefined;
  let upstreamFailure: { status: number; message: string } | undefined;
  let readyResolve: () => void = () => {};
  const ready = new Promise<void>((resolve) => {
    readyResolve = resolve;
  });
  const provider = createAnthropic({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (url, init) => {
      try {
        upstream = await gateway.fetch(url, init);
        if (!upstream.ok) {
          const json = await upstream
            .clone()
            .json()
            .catch(() => ({}));
          const message =
            json.message ?? json.error?.message ?? "تعذر الاتصال بخدمة الذكاء الاصطناعي.";
          upstreamFailure = { status: upstream.status, message };
          if (upstream.status === 402 || upstream.status === 403) {
            const saved = await supabaseAdmin
              .from("ai_service_state")
              .upsert({ service: CLAUDE_MODEL, reason: message, status: upstream.status });
            if (saved.error) throw new Error("تعذر حفظ حالة توقف الخدمة.");
          }
        }
        return upstream;
      } finally {
        readyResolve();
      }
    },
  });
  const result = streamText({
    model: provider(CLAUDE_MODEL),
    system: groundingPrompt(),
    messages: await convertToModelMessages(body.messages as UIMessage[]),
    maxOutputTokens: 2500,
    maxRetries: 0,
    abortSignal: request.signal,
    providerOptions: { anthropic: { thinking: { type: "adaptive", display: "summarized" } } },
  });
  const stream = createUIMessageStream({
    originalMessages: body.messages as UIMessage[],
    execute: async ({ writer }) => {
      let started = false;
      for await (const part of result.fullStream) {
        if (part.type === "text-delta") {
          if (!started) {
            writer.write({ type: "text-start", id: "answer" });
            started = true;
          }
          writer.write({ type: "text-delta", id: "answer", delta: part.text });
        } else if (part.type === "error") {
          const error = part.error as { statusCode?: number; message?: string };
          if (error.statusCode === 403) {
            await supabaseAdmin.from("ai_service_state").upsert({
              service: CLAUDE_MODEL,
              reason: error.message ?? "رفضت الخدمة الوصول.",
              status: 403,
            });
          }
          writer.write({
            type: "error",
            errorText: upstreamFailure?.message ?? "تعذر إكمال الإجابة. حاول لاحقًا.",
          });
        } else if (part.type === "finish" && part.finishReason === "content-filter") {
          writer.write({ type: "error", errorText: "رفضت الخدمة هذا الطلب ولم تصدر إجابة." });
        }
      }
      if (started) writer.write({ type: "text-end", id: "answer" });
      writer.write({ type: "finish" });
    },
    onError: () => upstreamFailure?.message ?? "تعذر إكمال الإجابة. حاول لاحقًا.",
  });
  const response = createUIMessageStreamResponse({ stream });
  await ready;
  if (request.signal.aborted) {
    await response.body?.cancel();
    return new Response(null, { status: 499 });
  }
  if (upstreamFailure) {
    await response.body?.cancel();
    return Response.json({ error: upstreamFailure.message }, { status: upstreamFailure.status });
  }
  return new Response(response.body, {
    headers: getLovableAiGatewayResponseHeaders(upstream?.headers, {
      ...Object.fromEntries(response.headers),
      "Cache-Control": "no-store",
    }),
  });
}
