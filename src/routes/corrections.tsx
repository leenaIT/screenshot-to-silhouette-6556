import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { FloorPlan } from "@/components/FloorPlan";
import { Scene3D } from "@/components/Scene3D";
import { Compare } from "@/components/Compare";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoProject as P } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { RefreshCw, Send, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/corrections")({ head: () => seo("التعديلات المقترحة", "مقارنة المخطط الأصلي بالمقترح المعدل مع التبرير النظامي لكل تعديل."), component: Corrections });

const mods = [
  { id: "m1", zone: "front", t: "إزاحة كتلة المجلس للداخل 1.4 م", why: "الارتداد الأمامي ≥ 6 م — المادة 4.2، ص 17 (تجريبي)", trade: "يقل عمق الصالة الخلفية 1.4 م (≈ 17 م²)." },
  { id: "m2", zone: "coverage", t: "إزالة الملحق الخارجي وتحويله إلى فناء", why: "نسبة التغطية ≤ 60% — المادة 6.1، ص 24 (تجريبي)", trade: "يُنقل المخزن إلى القبو أو السطح." },
  { id: "m3", zone: "roof", t: "خفض ارتفاع الملحق العلوي إلى 2.9 م", why: "مرتبط بتعارض الارتفاع 12/15 م — لم يُحسم بعد", trade: "مشروط بقرار المختص؛ قد لا يلزم إذا اعتُمد 15 م." },
];

function Corrections() {
  const [sel, setSel] = useState("m1");
  const z = mods.find((m) => m.id === sel)?.zone;
  return (
    <AppShell>
      <PageHeader eyebrow="مساحة التعديلات" title="المخطط الأصلي مقابل المقترح المعدل" desc="مقترحات مولدة آلياً للمساعدة فقط — ليست مستندات هندسية معتمدة."
        actions={<>
          <Button variant="outline" onClick={() => toast("تم طلب نسخة محدثة من المخطط (محاكاة)")}><RefreshCw className="h-4 w-4" /> طلب نسخة محدثة من المخطط</Button>
          <Button asChild><Link to="/review"><Send className="h-4 w-4" /> إرسال المخطط للمراجعة الهندسية</Link></Button></>} />
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-bad/30 bg-bad-soft px-3 py-2 text-xs"><ShieldAlert className="h-4 w-4 text-bad" />مقترح ذكاء اصطناعي غير معتمد — يجب أن يراجعه مهندس مرخص قبل أي استخدام.</div>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Tabs defaultValue="2d">
          <TabsList><TabsTrigger value="2d">مخطط ثنائي الأبعاد</TabsTrigger><TabsTrigger value="3d">نموذج ثلاثي الأبعاد</TabsTrigger><TabsTrigger value="slider">مقارنة المخططات</TabsTrigger></TabsList>
          <TabsContent value="2d" className="grid gap-4 md:grid-cols-2">
            <div className="panel p-4"><Pill tone="bad" className="mb-2">الأصلي</Pill><FloorPlan highlight={z} /></div>
            <div className="panel p-4"><Pill tone="ok" className="mb-2">المقترح</Pill><FloorPlan variant="corrected" /></div>
          </TabsContent>
          <TabsContent value="3d" className="grid gap-4 md:grid-cols-2">
            <div className="panel overflow-hidden"><div className="p-3"><Pill tone="bad">الأصلي — 3 أدوار + ملحق</Pill></div><div className="h-96"><Scene3D parcel={P.parcel} setbacks={P.setbacks} maxHeight={12} layers={{ dims: false, context: false }} selected={z === "front" ? "front" : z === "roof" ? "height" : "coverage"} building={{ width: 21, depth: 22.8, floors: 3, floorHeight: 3.5, frontGap: 4.8, sideGap: 2, annex: true, tone: "bad" }} /></div></div>
            <div className="panel overflow-hidden"><div className="p-3"><Pill tone="ok">المقترح المعدل</Pill></div><div className="h-96"><Scene3D parcel={P.parcel} setbacks={P.setbacks} maxHeight={12} layers={{ dims: false, context: false }} building={{ width: 20, depth: 22, floors: 3, floorHeight: 3.5, frontGap: 6.2, sideGap: 2.5, tone: "ok" }} /></div></div>
          </TabsContent>
          <TabsContent value="slider"><div className="mx-auto max-w-xl"><Compare before={<div className="bg-card p-6"><FloorPlan highlight={z} /></div>} after={<div className="bg-card p-6"><FloorPlan variant="corrected" /></div>} labels={["الأصلي", "المقترح"]} /></div></TabsContent>
        </Tabs>
        <div className="space-y-3">
          <h3 className="font-semibold">التعديلات المقترحة ({mods.length})</h3>
          {mods.map((m) => (
            <button key={m.id} onClick={() => setSel(m.id)} className={cn("panel w-full p-4 text-right transition-all", sel === m.id && "border-ok ring-2 ring-ok/20")}>
              <div className="font-medium">{m.t}</div>
              <div className="mt-2 text-xs text-ok">المبرر: {m.why}</div>
              {sel === m.id && <div className="mt-2 text-xs text-muted-foreground">المفاضلة: {m.trade}</div>}
            </button>))}
          <DemoBanner />
        </div>
      </div>
    </AppShell>
  );
}
