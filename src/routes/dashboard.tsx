import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { projects, conflicts, violations } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { Plus, ArrowLeft, FileText, AlertTriangle, UserCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ head: () => seo("لوحة التحكم", "نظرة عامة على مشاريعك ونتائج الامتثال والتعارضات."), component: Dashboard });

function Dashboard() {
  const stats = [
    { k: "مشاريع نشطة", v: projects.length, icon: MapPin },
    { k: "متوسط الامتثال", v: `${Math.round(projects.reduce((a, p) => a + p.compliance, 0) / projects.length)}%`, icon: FileText },
    { k: "تعارضات مكتشفة", v: projects.reduce((a, p) => a + p.conflicts, 0), icon: AlertTriangle },
    { k: "بانتظار مختص", v: 2, icon: UserCheck },
  ];
  return (
    <AppShell>
      <PageHeader eyebrow="صباح الخير، م. عبدالله" title="لوحة المشاريع" desc="تابع حالة الامتثال والتعارضات لكل مشاريعك في مكان واحد."
        actions={<Button asChild><Link to="/new-project"><Plus className="h-4 w-4" /> مشروع جديد</Link></Button>} />
      <DemoBanner className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="panel p-5"><s.icon className="mb-3 h-5 w-5 text-olive" /><div className="text-3xl font-bold text-primary">{s.v}</div><div className="text-sm text-muted-foreground">{s.k}</div></div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b p-5"><h2 className="font-semibold">المشاريع النشطة</h2><Link to="/projects" className="text-sm text-olive">عرض الكل</Link></div>
          {projects.map((p) => (
            <Link key={p.id} to="/regulations" className="grid grid-cols-[1fr_auto] items-center gap-4 border-b p-5 last:border-0 hover:bg-secondary/50 md:grid-cols-[1fr_140px_auto]">
              <div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.id} · {p.city} · {p.type}</div></div>
              <div className="hidden md:block"><div className="mb-1 flex justify-between text-xs"><span>الامتثال</span><span>{p.compliance}%</span></div>
                <div className="h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${p.tone === "ok" ? "bg-ok" : p.tone === "bad" ? "bg-bad" : "bg-warn"}`} style={{ width: `${p.compliance}%` }} /></div></div>
              <Pill tone={p.tone}>{p.status}</Pill>
            </Link>
          ))}
        </div>
        <div className="panel overflow-hidden">
          <div className="border-b p-5 font-semibold">مواقع المشاريع</div>
          <div className="blueprint relative aspect-[4/3] bg-secondary/40">
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full"><path d="M8 30 Q20 10 45 12 T85 20 Q95 40 80 60 T30 68 Q5 55 8 30Z" className="fill-sand/30 stroke-sand" strokeWidth="0.4" /></svg>
            {projects.map((p) => (
              <div key={p.id} className="group absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <span className={`block h-3.5 w-3.5 rounded-full ring-4 ring-card ${p.tone === "ok" ? "bg-ok" : p.tone === "bad" ? "bg-bad" : "bg-warn"}`} />
                <span className="absolute top-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-1 text-xs shadow group-hover:block">{p.name}</span>
              </div>
            ))}
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">خريطة تخطيطية — تجريبية</span>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">تعارضات تنظيمية مكتشفة</h2><Link to="/conflicts" className="text-sm text-olive">التفاصيل</Link></div>
          {conflicts.map((c) => (
            <div key={c.id} className="mb-3 flex items-center justify-between rounded-lg border p-3 text-sm">
              <div><div className="font-medium">{c.requirement}</div><div className="text-xs text-muted-foreground">{c.a.value} مقابل {c.b.value}</div></div>
              <Pill tone={c.status === "open" ? "bad" : "warn"}>{c.status === "open" ? "مفتوح" : "لدى المختص"}</Pill>
            </div>
          ))}
        </div>
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">آخر المخططات المحللة</h2><Link to="/plan-analysis" className="text-sm text-olive">التحليل</Link></div>
          {["مخطط_فيلا_الملقا_v3.pdf", "عمارة_النرجس_الدور_المتكرر.png", "تجاري_الروضة_A1.pdf"].map((f, i) => (
            <div key={f} className="mb-3 flex items-center justify-between rounded-lg border p-3 text-sm">
              <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-olive" /><span>{f}</span></div>
              <Pill tone={i === 1 ? "ok" : "bad"}>{i === 1 ? "متوافق مبدئياً" : `${i === 0 ? violations.length : 5} مخالفات`}</Pill>
            </div>
          ))}
          <Button variant="ghost" size="sm" asChild><Link to="/envelope">فتح الغلاف ثلاثي الأبعاد <ArrowLeft className="h-4 w-4" /></Link></Button>
        </div>
      </div>
    </AppShell>
  );
}
