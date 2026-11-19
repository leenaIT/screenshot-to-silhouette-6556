import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Logo, Pill, statusMeta } from "@/components/brand";
import { Scene3D } from "@/components/Scene3D";
import { Button } from "@/components/ui/button";
import { demoProject as P, requirements, conflicts, violations, DEMO_NOTICE } from "@/lib/mock-data";
import { computeEnvelope } from "@/lib/geometry";
import { seo } from "@/lib/seo";
import { Download } from "lucide-react";

export const Route = createFileRoute("/report")({ head: () => seo("تقرير المشروع", "تقرير شامل للاشتراطات والتعارضات والامتثال قابل للتصدير PDF."), component: Report });

function Report() {
  const e = computeEnvelope(P.parcel, P.setbacks, 12, P.floorHeight, P.coverage, P.far);
  return (
    <AppShell>
      <div className="no-print mb-4 flex justify-between"><h1 className="text-2xl font-bold text-primary">معاينة التقرير</h1><Button onClick={() => window.print()}><Download className="h-4 w-4" /> تصدير PDF</Button></div>
      <article className="mx-auto max-w-4xl space-y-8 bg-card p-10 shadow-[var(--shadow-lift)] print:shadow-none">
        <header className="flex items-start justify-between border-b pb-6"><Logo /><div className="text-left text-xs text-muted-foreground"><div>تقرير رقم {P.id}-R1</div><div>2026-11-19</div><Pill tone="warn" className="mt-1">نسخة تجريبية</Pill></div></header>
        <Sec t="1. بيانات الأرض والمشروع"><div className="grid grid-cols-3 gap-3 text-sm">{[["المشروع", P.name], ["الموقع", `${P.city} · ${P.district}`], ["القطعة", P.parcelNo], ["الإحداثيات", P.coords], ["الأبعاد", "25 × 32 م (800 م²)"], ["عرض الشارع", "20 م"]].map(([k, v]) => <div key={k}><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>)}</div></Sec>
        <Sec t="2. الاشتراطات المطبقة والمراجع"><table className="w-full text-sm"><thead><tr className="border-b text-xs text-muted-foreground"><th className="py-2 text-right">المتطلب</th><th className="text-right">القيمة</th><th className="text-right">المرجع</th><th className="text-right">الحالة</th></tr></thead>
          <tbody>{requirements.map((r) => <tr key={r.id} className="border-b"><td className="py-2">{r.title}</td><td className="font-semibold">{r.value}</td><td className="text-xs">{r.doc.split("—")[0]} · {r.clause} · ص {r.page}</td><td><Pill tone={statusMeta[r.status].tone}>{statusMeta[r.status].label}</Pill></td></tr>)}</tbody></table></Sec>
        <Sec t="3. الغلاف البنائي"><div className="grid grid-cols-[1fr_200px] gap-4"><div className="h-64 overflow-hidden rounded border"><Scene3D parcel={P.parcel} setbacks={P.setbacks} maxHeight={12} altHeight={15} interactive={false} /></div>
          <div className="space-y-2 text-sm"><div>منطقة البناء: <b>{e.buildWidth} × {e.buildDepth} م</b></div><div>أقصى تغطية: <b>{e.allowedFootprint} م²</b></div><div>أقصى مسطحات: <b>{e.maxGFA} م²</b></div><div>الأدوار النظرية: <b>{e.maxFloors}</b></div></div></div></Sec>
        <Sec t="4. التعارضات وحالتها">{conflicts.map((c) => <div key={c.id} className="mb-2 rounded border p-3 text-sm"><b>{c.requirement}</b>: {c.a.value} ({c.a.source}) مقابل {c.b.value} ({c.b.source}) — <span className="text-warn">{c.status === "open" ? "مفتوح" : "قيد مراجعة المختص"}</span></div>)}</Sec>
        <Sec t="5. تقييم المطابقة والمخالفات">{violations.map((v) => <div key={v.id} className="mb-2 grid grid-cols-4 gap-2 rounded border p-3 text-sm"><b>{v.title}</b><span>الحالي: {v.current}</span><span>المطلوب: {v.required}</span><span className="text-muted-foreground">{v.fix}</span></div>)}</Sec>
        <Sec t="6. حالة المراجعة المتخصصة"><p className="text-sm">قيد المراجعة لدى م. سارة العتيبي (تجريبي). لم يصدر قرار نهائي بشأن تعارض الارتفاع.</p></Sec>
        <footer className="border-t pt-4 text-xs text-muted-foreground">{DEMO_NOTICE} بنيان لا يصدر رخص بناء رسمية، والمقترحات الآلية ليست مستندات هندسية معتمدة.</footer>
      </article>
    </AppShell>
  );
}
function Sec({ t, children }: { t: string; children: React.ReactNode }) { return <section><h2 className="mb-3 text-lg font-bold text-primary">{t}</h2>{children}</section>; }
