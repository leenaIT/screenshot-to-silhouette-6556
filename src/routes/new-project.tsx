import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { retrievalSteps } from "@/lib/services";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Search, Check, Loader2, Home, Building2, Store, Layers, Shapes, Database, Filter, Brain } from "lucide-react";

export const Route = createFileRoute("/new-project")({ head: () => seo("مشروع جديد", "حدد موقع أرضك وخصائص مشروعك لاسترجاع الاشتراطات المطبقة."), component: Wizard });

const parcels = Array.from({ length: 18 }, (_, i) => ({ id: 300 + i * 3 + (i > 5 ? 0 : 0), x: (i % 6) * 15 + 6, y: Math.floor(i / 6) * 22 + 8 }));
const types = [{ k: "villa", t: "فيلا سكنية", i: Home }, { k: "apt", t: "عمارة شقق", i: Building2 }, { k: "com", t: "مبنى تجاري", i: Store }, { k: "mixed", t: "متعدد الاستخدامات", i: Layers }, { k: "other", t: "أخرى", i: Shapes }];

function Wizard() {
  const [step, setStep] = useState(1);
  const [parcel, setParcel] = useState(318);
  const [type, setType] = useState("villa");
  const [done, setDone] = useState(0);
  const nav = useNavigate();
  useEffect(() => {
    if (step !== 3) return;
    setDone(0);
    const id = setInterval(() => setDone((d) => (d >= retrievalSteps.length ? d : d + 1)), 650);
    return () => clearInterval(id);
  }, [step]);

  return (
    <AppShell>
      <PageHeader eyebrow="مشروع جديد" title="من الأرض إلى الاشتراطات" desc="ثلاث خطوات لتحديد الاشتراطات العمرانية المطبقة على أرضك." />
      <div className="mb-6 flex gap-2">
        {["موقع الأرض", "خصائص المشروع", "استرجاع الاشتراطات"].map((s, i) => (
          <button key={s} onClick={() => i + 1 < step && setStep(i + 1)} className={cn("flex flex-1 items-center gap-3 rounded-lg border p-3 text-sm", step === i + 1 ? "border-primary bg-card" : "bg-secondary/40", step > i + 1 && "text-ok")}>
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted")}>{step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}</span>{s}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="panel overflow-hidden">
            <div className="flex gap-2 border-b p-3"><div className="relative flex-1"><Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input defaultValue="حي الملقا، الرياض" className="pr-9" /></div><Button variant="outline">بحث</Button></div>
            <div className="blueprint relative aspect-[16/10] bg-secondary/40">
              <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
                <rect x="0" y="29" width="100" height="5" className="fill-muted" /><rect x="0" y="51" width="100" height="5" className="fill-muted" /><rect x="48" y="0" width="4" height="75" className="fill-muted" />
                <text x="25" y="32.4" fontSize="2" className="fill-muted-foreground">شارع 20 م</text>
                {parcels.map((p) => (
                  <g key={p.id} onClick={() => setParcel(p.id)} className="cursor-pointer">
                    <rect x={p.x > 48 ? p.x + 4 : p.x} y={p.y > 29 ? (p.y > 51 ? p.y + 10 : p.y + 5) : p.y} width="12" height="16" rx="0.5"
                      className={cn("transition-all", parcel === p.id ? "fill-olive/50 stroke-primary" : "fill-card stroke-sand hover:fill-sand/40")} strokeWidth={parcel === p.id ? 0.6 : 0.3} />
                    <text x={(p.x > 48 ? p.x + 4 : p.x) + 6} y={(p.y > 29 ? (p.y > 51 ? p.y + 10 : p.y + 5) : p.y) + 9} fontSize="2.2" textAnchor="middle" className="fill-foreground">{p.id}</text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-3 right-3 rounded-md bg-card/90 px-3 py-1.5 text-xs">خريطة تخطيطية تجريبية — تكامل GIS لاحقاً</div>
            </div>
          </div>
          <div className="panel space-y-4 p-5">
            <h3 className="font-semibold">بيانات القطعة <Pill tone="ai" className="mr-2">قطعة {parcel}</Pill></h3>
            <div className="grid grid-cols-2 gap-3">
              <F l="خط العرض" v="24.8121" /><F l="خط الطول" v="46.6097" /><F l="العرض (م)" v="25" /><F l="العمق (م)" v="32" />
            </div>
            <F l="المساحة الإجمالية (م²)" v="800" />
            <F l="رقم المخطط" v="2471" />
            <Button className="w-full" onClick={() => setStep(2)}>تأكيد الأرض والمتابعة</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="panel space-y-6 p-6">
          <div><Label className="mb-3 block">نوع المشروع</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{types.map((t) => (
              <button key={t.k} onClick={() => setType(t.k)} className={cn("rounded-xl border p-4 text-sm transition-all", type === t.k ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-olive")}>
                <t.i className="mx-auto mb-2 h-6 w-6" />{t.t}</button>))}</div></div>
          <div className="grid gap-4 md:grid-cols-4">
            <F l="مساحة الأرض (م²)" v="800" /><F l="الاستعمال المقصود" v="سكني" /><F l="عرض الشارع (م)" v="20" /><F l="عدد الشوارع المجاورة" v="1" />
          </div>
          <div><Label className="mb-2 block">متطلبات المشروع</Label><Textarea defaultValue="فيلا لعائلة من 6 أفراد، مجلس رجال منفصل، ملحق علوي، موقفان للسيارات." /></div>
          <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>رجوع</Button><Button onClick={() => setStep(3)}>استرجاع الاشتراطات المطبقة</Button></div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="panel p-6">
            <h3 className="mb-5 font-semibold">مسار الاسترجاع الذكي</h3>
            <ol className="space-y-1">
              {retrievalSteps.map((s, i) => (
                <li key={s} className={cn("flex items-center gap-3 rounded-lg p-3 text-sm transition-all", i < done ? "text-foreground" : i === done ? "bg-secondary font-medium" : "text-muted-foreground/60")}>
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", i < done && "border-ok bg-ok text-primary-foreground")}>
                    {i < done ? <Check className="h-4 w-4" /> : i === done ? <Loader2 className="h-4 w-4 animate-spin" /> : i + 1}</span>{s}
                </li>))}
            </ol>
            {done >= retrievalSteps.length && <Button className="mt-5 w-full" onClick={() => nav({ to: "/regulations" })}>عرض النتائج — 11 متطلباً، 2 تعارض</Button>}
          </div>
          <div className="panel space-y-4 p-6 text-sm">
            <h3 className="font-semibold">ما يحدث خلف الكواليس</h3>
            <Row icon={Filter} t="ترشيح بالبيانات الوصفية" d="المدينة = الرياض · الحي = الملقا · التصنيف = س-2 · النوع = فيلا" on={done > 1} />
            <Row icon={Database} t="بحث دلالي في المكتبة التنظيمية" d="7 وثائق · 676 بنداً مفهرساً · أعلى 24 مقطعاً" on={done > 2} />
            <Row icon={Brain} t="استدلال RAG مع الاستشهاد" d="كل قيمة مستخرجة مرتبطة بوثيقة ومادة وصفحة" on={done > 4} />
            <DemoBanner />
          </div>
        </div>
      )}
    </AppShell>
  );
}
function F({ l, v }: { l: string; v: string }) { return <div><Label className="mb-1.5 block text-xs text-muted-foreground">{l}</Label><Input defaultValue={v} /></div>; }
function Row({ icon: I, t, d, on }: { icon: typeof Filter; t: string; d: string; on: boolean }) {
  return <div className={cn("flex gap-3 rounded-lg border p-3 transition-opacity", !on && "opacity-40")}><I className="h-5 w-5 shrink-0 text-olive" /><div><div className="font-medium">{t}</div><div className="text-xs text-muted-foreground">{d}</div></div></div>;
}
