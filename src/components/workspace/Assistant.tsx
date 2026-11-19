import { useEffect, useRef, useState } from "react";
import { Loader2, Maximize2, Minimize2, ChevronDown } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import logoAsset from "@/assets/bunyan-logo-light.svg.asset.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  conversation,
  sources,
  shouldStartReview,
  type SourceReference,
} from "@/lib/workspace-data";

type Message = { from: "user" | "ai"; text: string };
export function Assistant({
  active,
  selectionId,
  onOpen3D,
  onRetrieve,
  onSource,
  planEvent,
}: {
  active: boolean;
  selectionId: string | null;
  onOpen3D: () => void;
  onRetrieve: () => void;
  onSource: (s: SourceReference) => void;
  planEvent?: { id: number; supported: boolean } | null;
}) {
  const [messages, setMessages] = useState<Message[]>([{ from: "ai", text: conversation.welcome }]);
  const [query, setQuery] = useState(""),
    [reviewBusy, setBusy] = useState(false),
    [step, setStep] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chat = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { selectionId } }),
  });
  const generating = chat.status === "submitted" || chat.status === "streaming";
  const busy = reviewBusy || generating;
  const [completed, setCompleted] = useState(false),
    [expanded, setExpanded] = useState(false);
  const scroll = useRef<HTMLDivElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reviewed = useRef<string | null>(null),
    retrieve = useRef(onRetrieve),
    seenPlan = useRef<number | null>(null);
  retrieve.current = onRetrieve;
  useEffect(() => {
    if (!active || !shouldStartReview(selectionId, reviewed.current)) return;
    reviewed.current = selectionId;
    setBusy(true);
    setCompleted(false);
    let index = 0;
    const advance = () => {
      if (index < conversation.steps.length) {
        setStep(index++);
        timer.current = setTimeout(advance, 500);
      } else {
        setBusy(false);
        setStep(null);
        setCompleted(true);
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text: conversation.scenarios.find((s) => s.id === "regulations")?.response ?? "",
          },
        ]);
        retrieve.current();
      }
    };
    advance();
  }, [active, selectionId]);
  useEffect(() => {
    if (!planEvent || seenPlan.current === planEvent.id) return;
    seenPlan.current = planEvent.id;
    setMessages((m) => [
      ...m,
      {
        from: "ai",
        text: planEvent.supported
          ? conversation.planDemoResponse
          : conversation.unsupportedPlanResponse,
      },
    ]);
  }, [planEvent]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, chat.messages, busy, step, expanded]);
  useEffect(() => {
    if (active && !busy && !document.querySelector('[role="dialog"]')) inputRef.current?.focus();
  }, [active, busy]);
  useEffect(() => {
    if (!expanded) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [expanded]);
  const send = async (text: string) => {
    if (!text.trim() || busy || !active) return;
    chat.clearError();
    setQuery("");
    await chat.sendMessage({ text: text.trim() });
  };
  return (
    <>
      {expanded && <div className="fixed inset-0 z-30 bg-forest/70" />}
      <section
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded || undefined}
        aria-label="المساعد الذكي"
        className={cn(
          "glass flex min-h-0 flex-1 flex-col rounded-2xl",
          expanded && "fixed inset-x-4 inset-y-6 z-40 mx-auto max-w-4xl",
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-ivory/10 px-4 py-2.5 text-sm font-semibold">
          <img src={logoAsset.url} alt="بنيان" className="h-5 w-auto" />
          المساعد الذكي<span className="ms-auto text-[10px] font-normal text-ivory/60">Claude</span>
          <Button
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "استعادة المساعد" : "تكبير المساعد"}
            title={expanded ? "استعادة المساعد" : "تكبير المساعد"}
            className="h-auto bg-forest/70 p-1.5"
          >
            {expanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
        <div
          ref={scroll}
          role="log"
          aria-live="polite"
          className={cn(
            "min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-[13px] leading-7",
            expanded && "px-6 text-sm sm:px-10",
          )}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "break-words",
                message.from === "user"
                  ? "ms-auto w-fit max-w-[90%] whitespace-pre-line rounded-lg bg-olive/35 px-3 py-2"
                  : "max-w-full",
              )}
            >
              {message.from === "ai" ? (
                <CitedAnswer text={message.text} onSource={onSource} />
              ) : (
                message.text
              )}
            </div>
          ))}
          {chat.messages.map((message) => (
            <Message key={message.id} from={message.role} className="max-w-full">
              <MessageContent className="group-[.is-assistant]:text-ivory group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse
                      key={i}
                      isAnimating={generating}
                      components={{
                        table: ({ children }) => (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-ivory">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-ivory/20 bg-forest px-3 py-2 text-start">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-ivory/20 px-3 py-2 text-start">
                            {children}
                          </td>
                        ),
                        a: ({ href, children }) => {
                          const ref =
                            href === "#source-1"
                              ? { documentId: "parcel", page: 1 }
                              : href === "#source-2"
                                ? { documentId: "residential", page: 18 }
                                : null;
                          return ref ? (
                            <Button
                              variant="ghost"
                              className="inline h-auto px-1 py-0 text-sand"
                              onClick={() => onSource(ref)}
                              aria-label={`مصدر Claude، صفحة ${ref.page}`}
                            >
                              {children}
                            </Button>
                          ) : (
                            <span>{children}</span>
                          );
                        },
                      }}
                    >
                      {part.text.replace(/\[([12])\](?!\()/g, "[$1](#source-$1)")}
                    </MessageResponse>
                  ) : null,
                )}
                {message.role === "assistant" && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[1, 2]
                      .filter((n) =>
                        message.parts.some((p) => p.type === "text" && p.text.includes(`[${n}]`)),
                      )
                      .map((n) => (
                        <Button
                          key={n}
                          variant="ghost"
                          className="h-auto whitespace-normal px-1 py-0 text-sand"
                          aria-label={`مصدر Claude، صفحة ${n === 1 ? 1 : 18}`}
                          onClick={() =>
                            onSource({
                              documentId: n === 1 ? "parcel" : "residential",
                              page: n === 1 ? 1 : 18,
                            })
                          }
                        >
                          {n === 1 ? "نظام القطعة — صفحة 1" : "اشتراطات المباني السكنية — صفحة 18"}
                        </Button>
                      ))}
                  </div>
                )}
              </MessageContent>
            </Message>
          ))}
          {chat.error && (
            <div role="alert" className="border-s-2 border-restricted ps-3 text-sm text-ivory">
              {(() => {
                try {
                  const parsed = JSON.parse(chat.error.message);
                  return parsed.error ?? parsed.message;
                } catch {
                  return chat.error.message;
                }
              })()}
            </div>
          )}
          {step !== null ? (
            <div role="status" className="border-s-2 border-olive ps-3 text-xs text-sand">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                جاري مراجعة الاشتراطات العمرانية...
              </div>
              <div className="text-ivory/60">{conversation.steps[step]}</div>
            </div>
          ) : null}
          {completed && (
            <details className="text-[11px] text-ivory/55">
              <summary className="flex cursor-pointer list-none items-center gap-1">
                <ChevronDown className="h-3 w-3" />
                تمت مراجعة المصادر التنظيمية
              </summary>
              <ol className="ps-4">
                {conversation.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
        {generating && (
          <div role="status" className="px-4 text-xs text-sand">
            <Shimmer>جاري إعداد الإجابة الموثقة…</Shimmer>
          </div>
        )}
        <div className="shrink-0 border-t border-ivory/10 p-3">
          <PromptInput
            onSubmit={() => send(query)}
            className="[&_[data-slot=input-group]]:bg-ivory/10 [&_[data-slot=input-group]]:border-ivory/20"
          >
            <PromptInputTextarea
              ref={inputRef}
              aria-label="رسالتك للمساعد"
              disabled={!active || reviewBusy}
              maxLength={3000}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                active ? "اسأل عن الاشتراطات أو أسئلة المراجعة…" : "اختر الأرض ونوع المشروع أولًا…"
              }
              className="min-h-10 text-ivory placeholder:text-ivory/50"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={generating ? chat.status : "ready"}
                onStop={() => chat.stop()}
                disabled={!active || reviewBusy || (!generating && !query.trim())}
                aria-label={generating ? "إيقاف الإجابة" : "إرسال"}
                className="bg-olive text-ivory hover:bg-olive/80"
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </section>
    </>
  );
}

function CitedAnswer({ text, onSource }: { text: string; onSource: (s: SourceReference) => void }) {
  const references: SourceReference[] = [
    { documentId: "parcel", page: 1 },
    { documentId: "residential", page: 18 },
  ];
  const used = [...new Set([...text.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])))];
  const citation = (number: number, label: string) => {
    const reference = references[number - 1];
    if (!reference) return label;
    return (
      <Button
        variant="ghost"
        className="inline h-auto whitespace-normal px-1 py-0 align-baseline text-xs text-sand hover:bg-ivory/10"
        aria-label={`المصدر ${number}، صفحة ${reference.page}`}
        onClick={() => onSource(reference)}
      >
        {label}
      </Button>
    );
  };
  return (
    <>
      {text.split("\n\n").map((paragraph, i) => (
        <p key={i} className="mb-3 last:mb-0">
          {paragraph.split(/(\[\d+\]|\*\*.*?\*\*)/g).map((part, j) => (
            <span key={j}>
              {/^\[\d+\]$/.test(part) ? (
                citation(Number(part.slice(1, -1)), part)
              ) : part.startsWith("**") ? (
                <strong className="font-semibold text-ivory">{part.slice(2, -2)}</strong>
              ) : (
                part
              )}
            </span>
          ))}
        </p>
      ))}
      {used.length > 0 && (
        <div className="mt-3 border-t border-ivory/10 pt-2 text-[11px] leading-6 text-ivory/60">
          <div className="font-semibold">المصادر</div>
          {used.map((n) => {
            const ref = references[n - 1];
            const doc = sources.find((s) => s.id === ref?.documentId);
            return ref && doc ? (
              <div key={n}>
                {citation(n, `[${n}] ${doc.title} — ${doc.authority}، صفحة ${ref.page}`)}
              </div>
            ) : null;
          })}
        </div>
      )}
    </>
  );
}
