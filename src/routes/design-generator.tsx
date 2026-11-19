import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { FloorPlan } from "@/components/FloorPlan";
import { Scene3D } from "@/components/Scene3D";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoProject as P } from "@/lib/mock-data";
import { computeEnvelope } from "@/lib/geometry";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Sparkles, RefreshCw, Loader2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/design-generator")({ head: () => seo("المخطط المبدئي", "مفاهيم تصميمية أولية داخل الغلاف البنائي المسموح."), component: Generator });

const styles = ["نجدي معاصر", "سلماني", "حديث بسيط", "حجازي"];

function Generator() {
  const [p, setP] = useState({ floors: 2, beds: 5, baths: 6, living: 2, parking: 2, garden: true, access: false, style: "نجدي معاصر" });
  const [state, setState] = useState<"form" | "loading" | "done">("form");
  const [opt, setOpt] = useState(0);
  const [seed, setSeed] = useState(0);
  const env = computeEnvelope(P.parcel, P.setbacks, 12, P.floorHeight, P.coverage, P.far);
  const options = [
    { n: "الخيار أ — كتلة خطية", plan: "concept-a" as const, w: 19, d: 21, cov: 0.5, frontGap: 7 },
    { n: "الخيار ب — فناء داخلي", plan: "concept-b" as const, w: 20, d: 22, cov: 0.53, frontGap: 6.5 },
    { n: "الخيار ج — كتلة مدرجة", plan: "concept-a" as const, w: 17, d: 22, cov: 0.47, frontGap: 8 },
  ].map((o) => ({ ...o, gfa: Math.round(o.w * o.d * p.floors + (p.floors < 3 ? o.w * o.d * 0.5 : 0) - seed * 3) }));
  const o = options[opt]!;
  const gen = () => { setState("loading"); setTimeout(() => { setState("done"); setSeed((s) => (s + 1) % 4); }, 1600); };

  return (
    <AppShell>
      <PageHeader eyebrow="المسار ب" title="إنشاء مخطط مبدئي لمشروعك" desc="نولّد مفاهيم أولية تحترم الغلاف المسموح وتفضيلاتك — جميعها تتطلب مراجعة هندسية مهنية." />
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="panel space-y-5 p-5">
          <h3 className="font-semibold">تفضيلات المشروع</h3>
          {([["floors", "عدد الأدوار", 1, env.maxFloors], ["beds", "غرف النوم", 1, 8], ["baths", "دورات المياه", 1, 8], ["living", "مساحات المعيشة", 1, 4], ["parking", "مواقف السيارات", 1, 4]] as const).map(([k, t, mn, mx]) => (
            <div key={k}><div className="mb-2 flex justify-between text-sm"><Label>{t}</Label><span className="font-bold text-primary">{p[k]}</span></div>
              <Slider min={mn} max={mx} step={1} value={[p[k]]} onValueChange={([v]) => setP({ ...p, [k]: v })} /></div>))}
          <div className="flex items-center justify-between text-sm"><Label>حديقة / مساحات خارجية</Label><Switch checked={p.garden} onCheckedChange={(v) => setP({ ...p, garden: v })} /></div>
          <div className="flex items-center justify-between text-sm"><Label>تفضيلات سهولة الوصول</Label><Switch checked={p.access} onCheckedChange={(v) => setP({ ...p, access: v })} /></div>
          <div><Label className="mb-2 block text-sm">الطراز المعماري</Label><div className="flex flex-wrap gap-2">{styles.map((s) => <Button key={s} size="sm" variant={p.style === s ? "default" : "outline"} onClick={() => setP({ ...p, style: s })}>{s}</Button>)}</div></div>
          <div><Label className="mb-2 block text-sm">متطلبات أخرى</Label><Textarea defaultValue="مجلس رجال بمدخل مستقل من الشارع." /></div>
          <Button className="w-full" onClick={gen} disabled={state === "loading"}>{state === "done" ? <><RefreshCw className="h-4 w-4" /> إعادة التوليد</> : <><Sparkles className="h-4 w-4" /> توليد المفاهيم</>}</Button>
        </div>
        <div>
          {state === "form" && <div className="panel blueprint flex h-full min-h-96 flex-col items-center justify-center gap-3 p-10 text-center text-muted-foreground"><Sparkles className="h-10 w-10 text-olive" />حدد تفضيلاتك ثم اضغط «توليد المفاهيم».<div className="text-xs">الغلاف المتاح: {env.buildWidth} × {env.buildDepth} م · حتى {env.maxFloors} أدوار · {env.maxGFA} م² كحد أقصى</div></div>}
          {state === "loading" && <div className="panel flex h-full min-h-96 items-center justify-center gap-3"><Loader2 className="h-6 w-6 animate-spin text-olive" />جارٍ توليد ثلاثة بدائل داخل الغلاف المسموح…</div>}
          {state === "done" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-xs"><ShieldAlert className="h-4 w-4 text-warn" />مفهوم تصميمي مبدئي — يتطلب مراجعة هندسية مهنية ولا يصلح للتنفيذ.</div>
              <div className="grid gap-3 md:grid-cols-3">{options.map((x, i) => (
                <button key={x.n} onClick={() => setOpt(i)} className={cn("panel p-4 text-right", opt === i && "border-primary ring-2 ring-primary/15")}>
                  <div className="font-semibold">{x.n}</div><div className="mt-1 text-xs text-muted-foreground">{x.gfa} م² · تغطية {Math.round(x.cov * 100)}%</div>
                  <Pill tone={x.gfa <= env.maxGFA ? "ok" : "warn"} className="mt-2">{x.gfa <= env.maxGFA ? "متوافق مبدئياً" : "يتجاوز المسطحات"}</Pill></button>))}</div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="panel p-4"><div className="mb-2 text-sm font-medium">المخطط المفاهيمي — الدور الأرضي</div><FloorPlan variant={o.plan} /></div>
                <div className="panel overflow-hidden"><div className="h-full min-h-80"><Scene3D parcel={P.parcel} setbacks={P.setbacks} maxHeight={12} altHeight={15} layers={{ dims: false }} building={{ width: o.w, depth: o.d, floors: p.floors, floorHeight: 3.5, frontGap: o.frontGap, sideGap: 3, annex: p.floors < 3, tone: "ok" }} /></div></div>
              </div>
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div className="panel p-4"><div className="mb-2 font-semibold">توزيع الفراغات</div>{[["غرف النوم", p.beds], ["دورات المياه", p.baths], ["المعيشة", p.living], ["المواقف", p.parking]].map(([k, v]) => <div key={k} className="flex justify-between py-0.5"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>)}<div className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>المسطحات التقديرية</span><span>{o.gfa} م²</span></div></div>
                <div className="panel p-4"><div className="mb-2 font-semibold">الافتراضات التصميمية</div><ul className="list-disc space-y-1 pr-4 text-muted-foreground"><li>ارتفاع الدور 3.5 م</li><li>اعتماد سيناريو الارتفاع 12 م (الأحوط) لحين حسم التعارض</li><li>الطراز: {p.style}</li></ul></div>
                <div className="panel p-4"><div className="mb-2 font-semibold">بحاجة لتحقق مختص</div><ul className="list-disc space-y-1 pr-4 text-muted-foreground"><li>تعارض الارتفاع 12 / 15 م</li><li>مخارج الطوارئ للملحق العلوي</li><li>مواد الواجهة والطابع العمراني</li></ul><Button size="sm" variant="outline" className="mt-3" asChild><Link to="/review">إرسال للمراجعة</Link></Button></div>
              </div>
              <DemoBanner />
            </div>)}
        </div>
      </div>
    </AppShell>
  );
}
