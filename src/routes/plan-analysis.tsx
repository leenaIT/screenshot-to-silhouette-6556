import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { FloorPlan } from "@/components/FloorPlan";
import { SourceButton } from "@/components/SourceDialog";
import { Button } from "@/components/ui/button";
import { violations, compliance, conflicts, requirements } from "@/lib/mock-data";
import { analysisSteps } from "@/lib/services";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Upload, FileText, Check, Loader2, Wand2, CheckCircle2, XCircle, HelpCircle, GitCompareArrows } from "lucide-react";

export const Route = createFileRoute("/plan-analysis")({ head: () => seo("تحليل المخططات", "ارفع مخططك الهندسي لمقارنته بالاشتراطات وتحديد المخالفات."), component: PlanAnalysis });

function PlanAnalysis() {
  const [file, setFile] = useState<string | null>(null);
  const [done, setDone] = useState(0);
  const [sel, setSel] = useState<string | null>("v1");
  useEffect(() => {
    if (!file) return;
    setDone(0);
    const id = setInterval(() => setDone((d) => Math.min(d + 1, analysisSteps.length)), 600);
    return () => clearInterval(id);
  }, [file]);
  const finished = done >= analysisSteps.length;
  const v = violations.find((x) => x.id === sel);

  return (
    <AppShell>
      <PageHeader eyebrow="المسار أ" title="التحقق من مطابقة المخطط الهندسي" desc="نقارن ما يمكن استخراجه من مخططك بالاشتراطات المطبقة، ونوضح ما لم نتمكن من استخراجه بدقة." />
      {!file && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <label className="panel flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-14 text-center hover:border-olive">
            <Upload className="h-10 w-10 text-olive" /><div className="text-lg font-semibold">اسحب المخطط هنا أو اختر ملفاً</div>
            <div className="text-sm text-muted-foreground">PDF · PNG · JPG — حتى 50 ميجابايت</div>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0].name)} />
          </label>
          <div className="panel space-y-3 p-5">
            <h3 className="font-semibold">الصيغ المدعومة</h3>
            {[["PDF", "مدعوم"], ["PNG / JPG", "مدعوم"], ["DWG", "تكامل مستقبلي"]].map(([f, s]) => (
              <div key={f} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span className="flex items-center gap-2"><FileText className="h-4 w-4 text-olive" />{f}</span><Pill tone={s === "مدعوم" ? "ok" : "neutral"}>{s}</Pill></div>))}
            <Button className="w-full" variant="outline" onClick={() => setFile("مخطط_فيلا_الملقا_v3.pdf")}>استخدم المخطط التجريبي</Button>
          </div>
        </div>
      )}
      {file && !finished && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel relative overflow-hidden p-6"><div className="mb-3 text-sm font-medium">{file}</div>
            <div className="relative"><FloorPlan /><div className="scanline pointer-events-none absolute inset-x-0 top-0 h-1/2 border-b-2 border-olive bg-gradient-to-b from-transparent to-olive/15" /></div></div>
          <div className="panel p-6"><h3 className="mb-4 font-semibold">جارٍ التحليل (محاكاة)</h3>
            {analysisSteps.map((s, i) => (
              <div key={s} className={cn("flex items-center gap-3 py-2.5 text-sm", i > done && "text-muted-foreground/50")}>
                {i < done ? <Check className="h-4 w-4 text-ok" /> : i === done ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="h-4 w-4 rounded-full border" />}{s}</div>))}
          </div>
        </div>
      )}
      {finished && (
        <>
          <DemoBanner className="mb-5" />
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card icon={CheckCircle2} tone="text-ok" n={compliance.ok.length} t="متطلبات متوافقة" />
            <Card icon={XCircle} tone="text-bad" n={violations.length} t="مخالفات مكتشفة" />
            <Card icon={HelpCircle} tone="text-warn" n={compliance.manual.length} t="بحاجة لتحقق يدوي" />
            <Card icon={GitCompareArrows} tone="text-primary" n={conflicts.length} t="تعارضات غير محسومة" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="panel p-5"><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{file}</span><span className="text-muted-foreground">انقر مخالفة لتحديد موقعها</span></div>
              <FloorPlan highlight={v?.zone} onZone={(z) => setSel(violations.find((x) => x.zone === z)?.id ?? null)} /></div>
            <div className="space-y-3">
              {violations.map((x) => {
                const req = requirements.find((r) => r.id === x.reqId)!;
                return (
                  <div key={x.id} onClick={() => setSel(x.id)} className={cn("panel cursor-pointer p-4 transition-all", sel === x.id && "border-bad ring-2 ring-bad/20")}>
                    <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">{x.title}</h3><Pill tone={x.severity}>{x.severity === "bad" ? "مخالفة" : "مرتبط بتعارض"}</Pill></div>
                    <div className="mb-2 text-xs text-muted-foreground">الموقع: {x.where}</div>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 p-2 text-center text-xs">
                      <div><div className="text-muted-foreground">التصميم الحالي</div><div className="font-bold text-bad">{x.current}</div></div>
                      <div><div className="text-muted-foreground">المتطلب</div><div className="font-bold">{x.required}</div></div>
                      <div><div className="text-muted-foreground">الفرق</div><div className="font-bold">{x.diff}</div></div>
                    </div>
                    {sel === x.id && (
                      <div className="mt-3 space-y-2 text-sm">
                        <div><span className="font-medium">الإجراء المقترح: </span>{x.fix}</div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{req.doc} · {req.clause} · ص {req.page}</span><SourceButton req={req} /></div>
                      </div>)}
                  </div>);
              })}
              <div className="panel p-4 text-sm"><div className="mb-2 font-semibold">بحاجة لتحقق يدوي</div>{compliance.manual.map((m) => <div key={m} className="flex gap-2 py-1 text-muted-foreground"><HelpCircle className="h-4 w-4 text-warn" />{m}</div>)}</div>
              <div className="flex gap-2"><Button asChild><Link to="/corrections"><Wand2 className="h-4 w-4" /> عرض التعديلات المقترحة</Link></Button><Button variant="outline" onClick={() => setFile(null)}>رفع مخطط آخر</Button></div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
function Card({ icon: I, tone, n, t }: { icon: typeof Check; tone: string; n: number; t: string }) {
  return <div className="panel flex items-center gap-4 p-4"><I className={cn("h-8 w-8", tone)} /><div><div className="text-2xl font-bold">{n}</div><div className="text-xs text-muted-foreground">{t}</div></div></div>;
}
