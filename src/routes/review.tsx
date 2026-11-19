import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { FloorPlan } from "@/components/FloorPlan";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Bot, UserCheck, Landmark, Check, X, MessageSquare, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/review")({ head: () => seo("المراجعة المتخصصة", "واجهة المختصين لمراجعة التعارضات والتعديلات والمخططات."), component: Review });

type St = "pending" | "accepted" | "rejected" | "info";
const initial = [
  { id: "i1", kind: "تعارض تنظيمي", t: "أقصى ارتفاع: 15 م مقابل 12 م", src: "البند 3.1 / الفقرة 7 (تجريبي)" },
  { id: "i2", kind: "تعديل مقترح (AI)", t: "إزاحة المجلس 1.4 م للداخل", src: "المادة 4.2 (تجريبي)" },
  { id: "i3", kind: "تعديل مقترح (AI)", t: "إزالة الملحق الخارجي", src: "المادة 6.1 (تجريبي)" },
  { id: "i4", kind: "مخطط مرفوع", t: "مخطط_فيلا_الملقا_v3.pdf", src: "3 مخالفات · 3 تحقق يدوي" },
  { id: "i5", kind: "مخطط مبدئي (AI)", t: "الخيار ب — فناء داخلي", src: "متوافق مبدئياً" },
];

function Review() {
  const [items, setItems] = useState(initial.map((i) => ({ ...i, st: "pending" as St, notes: [] as string[] })));
  const [cur, setCur] = useState("i1");
  const [note, setNote] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const it = items.find((i) => i.id === cur)!;
  const set = (st: St, msg: string) => { setItems(items.map((i) => (i.id === cur ? { ...i, st, notes: note ? [...i.notes, note] : i.notes } : i))); setNote(""); toast.success(msg); };
  const stTone = { pending: "neutral", accepted: "ok", rejected: "bad", info: "warn" } as const;
  const stLabel = { pending: "بانتظار المراجعة", accepted: "مؤكد من المختص", rejected: "مرفوض", info: "طُلبت معلومات" };
  return (
    <AppShell>
      <PageHeader eyebrow="بوابة المختص · م. سارة العتيبي (تجريبي)" title="المراجعة والاعتماد المهني" desc="بنيان لا يصدر رخص بناء رسمية. المراجعة هنا مهنية استشارية."
        actions={<Button disabled={reviewed} onClick={() => { setReviewed(true); toast.success("تم وسم المخطط كـ «تمت مراجعته من مختص»"); }}><UserCheck className="h-4 w-4" />{reviewed ? "تمت المراجعة" : "وسم المخطط كمُراجَع"}</Button>} />
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {[{ i: Bot, t: "توصية ذكاء اصطناعي", d: "مخرجات آلية غير مراجعة", c: "border-primary/20" }, { i: UserCheck, t: "مراجعة مختص", d: "رأي مهني موثق من مهندس مرخص", c: "border-ok/40" }, { i: Landmark, t: "اعتماد رسمي", d: "يصدر فقط من الجهات الحكومية — خارج بنيان", c: "border-dashed" }].map((x) => (
          <div key={x.t} className={cn("panel flex gap-3 p-4", x.c)}><x.i className="h-6 w-6 text-olive" /><div><div className="font-semibold">{x.t}</div><div className="text-xs text-muted-foreground">{x.d}</div></div></div>))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">{items.map((i) => (
          <button key={i.id} onClick={() => setCur(i.id)} className={cn("panel w-full p-3 text-right", cur === i.id && "border-primary")}>
            <div className="text-[11px] text-olive">{i.kind}</div><div className="text-sm font-medium">{i.t}</div><Pill tone={stTone[i.st]} className="mt-2">{stLabel[i.st]}</Pill></button>))}</div>
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between"><div><div className="text-xs text-olive">{it.kind}</div><h2 className="text-lg font-semibold">{it.t}</h2><div className="text-xs text-muted-foreground">المرجع: {it.src}</div></div><Pill tone={stTone[it.st]}>{stLabel[it.st]}</Pill></div>
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-3"><FloorPlan variant={it.id === "i5" ? "concept-b" : it.id === "i4" ? "original" : "corrected"} highlight={it.id === "i4" ? "front" : null} /></div>
            <div className="space-y-2 text-sm">
              <div className="rounded-lg bg-secondary/50 p-3"><div className="mb-1 flex items-center gap-1 font-medium"><Bot className="h-4 w-4" /> تحليل الذكاء الاصطناعي</div><p className="text-muted-foreground">{it.id === "i1" ? "مصدران بقيم مختلفة. لا يمكن تحديد الأسبقية دون التحقق من تاريخ اعتماد المخطط وأي قرارات استثنائية." : "المقترح يعالج المخالفة وفق البند المذكور مع أثر محدود على المساحات."}</p></div>
              {it.notes.map((n, k) => <div key={k} className="flex gap-2 rounded-lg border border-ok/30 bg-ok-soft p-3"><MessageSquare className="h-4 w-4 shrink-0 text-ok" />{n}</div>)}
            </div>
          </div>
          <Textarea placeholder={it.id === "i1" ? "وثّق قرار حسم التعارض ومبرره…" : "أضف تعليقاً مهنياً…"} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => set("accepted", "تم التأكيد")}><Check className="h-4 w-4" /> {it.id === "i1" ? "توثيق الحسم" : "تأكيد"}</Button>
            <Button variant="outline" onClick={() => set("rejected", "تم الرفض")}><X className="h-4 w-4" /> رفض</Button>
            <Button variant="outline" onClick={() => set("info", "طُلبت معلومات إضافية")}><HelpCircle className="h-4 w-4" /> طلب معلومات إضافية</Button>
            <Button variant="ghost" disabled={!note} onClick={() => set(it.st, "أُضيف التعليق")}><MessageSquare className="h-4 w-4" /> إضافة تعليق</Button>
          </div>
        </div>
      </div>
      <DemoBanner className="mt-6" />
    </AppShell>
  );
}
