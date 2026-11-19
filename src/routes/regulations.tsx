import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner, statusMeta } from "@/components/brand";
import { SourceButton } from "@/components/SourceDialog";
import { Button } from "@/components/ui/button";
import { requirements, groups } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Box, FileCheck2, PencilRuler, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/regulations")({ head: () => seo("الاشتراطات العمرانية", "الاشتراطات المطبقة على المشروع مع مصادرها الرسمية ورقم المادة والصفحة."), component: Regs });

function Regs() {
  const [g, setG] = useState<string | null>(null);
  const list = requirements.filter((r) => !g || r.group === g);
  return (
    <AppShell>
      <PageHeader eyebrow="فيلا سكنية — حي الملقا" title="الاشتراطات العمرانية المطبقة" desc="ملخص منظم لكل متطلب مع مصدره والجهة المصدرة ورقم البند وحالة التحقق."
        actions={<Button variant="outline" asChild><Link to="/envelope"><Box className="h-4 w-4" /> عرض الغلاف ثلاثي الأبعاد</Link></Button>} />
      <DemoBanner className="mb-5" />
      <div className="mb-5 flex flex-wrap gap-2">
        <Button size="sm" variant={!g ? "default" : "outline"} onClick={() => setG(null)}>الكل ({requirements.length})</Button>
        {groups.map((x) => <Button key={x} size="sm" variant={g === x ? "default" : "outline"} onClick={() => setG(x)}>{x}</Button>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((r) => (
          <article key={r.id} className={cn("panel p-5", r.status === "conflict" && "border-bad/40")}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div><div className="text-xs text-olive">{r.group}</div><h3 className="text-lg font-semibold">{r.title}</h3></div>
              <div className="text-left"><div className="text-2xl font-bold text-primary">{r.value}</div></div>
            </div>
            <p className="mb-4 text-sm leading-6 text-muted-foreground">{r.explanation}</p>
            <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-secondary/50 p-3 text-xs">
              <M k="الجهة المصدرة" v={r.authority} /><M k="الوثيقة" v={r.doc} /><M k="البند / المادة" v={r.clause} /><M k="الصفحة" v={String(r.page)} />
              <M k="الإصدار" v={r.version} /><M k="تاريخ السريان" v={r.effective} />
            </dl>
            <div className="flex items-center justify-between gap-2">
              <Pill tone={statusMeta[r.status].tone}>{statusMeta[r.status].label}</Pill>
              <div className="flex gap-2">
                {r.status === "conflict" && <Button size="sm" variant="ghost" asChild><Link to="/conflicts">عرض التعارض</Link></Button>}
                <SourceButton req={r} />
              </div>
            </div>
          </article>
        ))}
      </div>
      <h2 className="mb-4 mt-12 text-xl font-bold text-primary">ما الخطوة التالية؟</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/plan-analysis" className="panel group flex items-center gap-5 p-6 hover:border-primary">
          <FileCheck2 className="h-10 w-10 text-olive" /><div className="flex-1"><div className="text-lg font-semibold">لدي مخطط هندسي وأرغب في التحقق من مطابقته</div><div className="text-sm text-muted-foreground">ارفع مخططك وسنقارنه بالاشتراطات أعلاه.</div></div><ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </Link>
        <Link to="/design-generator" className="panel group flex items-center gap-5 p-6 hover:border-primary">
          <PencilRuler className="h-10 w-10 text-olive" /><div className="flex-1"><div className="text-lg font-semibold">أرغب في إنشاء مخطط مبدئي لمشروعي</div><div className="text-sm text-muted-foreground">مفاهيم تصميمية أولية داخل الغلاف المسموح.</div></div><ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </AppShell>
  );
}
function M({ k, v }: { k: string; v: string }) { return <div><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>; }
