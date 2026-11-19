import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { Scene3D } from "@/components/Scene3D";
import { Button } from "@/components/ui/button";
import { conflicts, demoProject as P } from "@/lib/mock-data";
import { computeEnvelope } from "@/lib/geometry";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Send, AlertOctagon, Check, Clock } from "lucide-react";

export const Route = createFileRoute("/conflicts")({ head: () => seo("كشف التعارضات", "مقارنة المصادر التنظيمية المتعارضة جنباً إلى جنب وإحالتها لمختص."), component: Conflicts });

function Conflicts() {
  const [referred, setReferred] = useState<Record<string, boolean>>({ c1: true });
  const eA = computeEnvelope(P.parcel, P.setbacks, 15, P.floorHeight, P.coverage, P.far);
  const eB = computeEnvelope(P.parcel, P.setbacks, 12, P.floorHeight, P.coverage, P.far);
  return (
    <AppShell>
      <PageHeader eyebrow="التعارضات التنظيمية" title="مصادر تحدد قيماً مختلفة لنفس المتطلب" desc="لا يحسم بنيان التعارضات آلياً ولا يفترض أن القاعدة الأشد هي المطبقة دائماً. القرار يعود إلى مختص أو الجهة المختصة." />
      <DemoBanner className="mb-6" />
      {conflicts.map((c) => (
        <section key={c.id} className="panel mb-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-bad-soft/50 p-5">
            <div className="flex items-center gap-3"><AlertOctagon className="h-5 w-5 text-bad" /><h2 className="text-lg font-semibold">{c.requirement}</h2></div>
            <div className="flex gap-2"><Pill tone="warn">يتطلب مراجعة مختص</Pill><Pill tone={referred[c.id] ? "ai" : "bad"}>{referred[c.id] ? "محال — قيد المراجعة" : "مفتوح"}</Pill></div>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr]">
            {[c.a, c.b].map((s, i) => (
              <div key={i} className="p-5">
                <div className="eyebrow mb-2">المصدر {i === 0 ? "أ" : "ب"}</div>
                <div className="mb-1 text-4xl font-bold text-primary">{s.value}</div>
                <div className="font-medium">{s.source}</div>
                <div className="text-sm text-muted-foreground">{s.authority}</div>
                <div className="mt-3 inline-block rounded bg-secondary px-2 py-1 text-xs">{s.clause}</div>
              </div>
            ))}
          </div>
          <div className="border-t p-5 text-sm"><span className="font-semibold">الأثر المحتمل على التصميم: </span>{c.impact}</div>
          {c.id === "c1" && (
            <div className="grid gap-4 border-t p-5 md:grid-cols-2">
              {[{ h: 15, e: eA, t: "سيناريو المصدر أ" }, { h: 12, e: eB, t: "سيناريو المصدر ب" }].map((s) => (
                <div key={s.h} className="overflow-hidden rounded-lg border">
                  <div className="h-64"><Scene3D parcel={P.parcel} setbacks={P.setbacks} maxHeight={s.h} layers={{ dims: false, context: false }} /></div>
                  <div className="grid grid-cols-3 gap-2 border-t bg-secondary/40 p-3 text-center text-xs">
                    <div><div className="font-bold text-primary">{s.h} م</div>{s.t}</div>
                    <div><div className="font-bold text-primary">{s.e.maxFloors}</div>أدوار نظرية</div>
                    <div><div className="font-bold text-primary">{s.e.volume.toLocaleString("ar-SA")} م³</div>حجم الغلاف</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t p-5">
            <Track active={!!referred[c.id]} />
            <Button disabled={referred[c.id]} onClick={() => { setReferred({ ...referred, [c.id]: true }); toast.success("تمت إحالة التعارض إلى م. سارة العتيبي (تجريبي)"); }}>
              <Send className="h-4 w-4" /> إحالة التعارض إلى مختص
            </Button>
          </div>
        </section>
      ))}
    </AppShell>
  );
}
function Track({ active }: { active: boolean }) {
  const steps = [{ t: "اكتُشف التعارض", d: true }, { t: "أُحيل إلى مختص", d: active }, { t: "رد المختص: طلب صك الأرض", d: active, p: true }, { t: "قرار موثق", d: false }];
  return (
    <ol className="flex flex-wrap gap-4 text-xs">
      {steps.map((s) => (
        <li key={s.t} className={cn("flex items-center gap-1.5", !s.d && "text-muted-foreground")}>
          {s.d ? (s.p ? <Clock className="h-4 w-4 text-warn" /> : <Check className="h-4 w-4 text-ok" />) : <span className="h-3 w-3 rounded-full border" />}{s.t}
        </li>))}
    </ol>
  );
}
