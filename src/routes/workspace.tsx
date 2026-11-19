import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useRef, useState } from "react";
import { Maximize2, Send, Upload, FileText, Loader2, CheckCircle2, AlertTriangle, Eye, Sparkles, ArrowLeft, Layers, MapPin, Home } from "lucide-react";
import { Scene3D } from "@/components/Scene3D";
import type { View, Layer } from "@/components/Envelope3D";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Logo } from "@/components/brand";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const ParcelMap = lazy(() => import("@/components/workspace/ParcelMap"));

export const Route = createFileRoute("/workspace")({
  head: () => seo("مساحة العمل الخرائطية", "خريطة تفاعلية للقطعة مع الاشتراطات والغلاف ثلاثي الأبعاد والمساعد الذكي وتحليل المخطط."),
  component: Workspace,
});

const land: [string, string][] = [
  ["رقم القطعة", "2451-RA"], ["الأبعاد", "20 × 30 م"], ["المساحة", "600 م²"], ["الاستخدام", "سكني"],
  ["عرض الشارع", "20 م"], ["الشوارع المحيطة", "1"], ["الارتداد الأمامي", "4 م"], ["الارتداد الخلفي", "2 م"],
  ["الارتداد الجانبي", "2 م"], ["أقصى ارتفاع", "12 م"], ["الأدوار المسموحة", "3"], ["نسبة البناء", "60%"],
  ["معامل البناء (FAR)", "1.8"], ["المواقف", "2 موقف / وحدة"],
];
type LayerKey = "setbacks" | "height" | "envelope" | "restricted" | "conflicts" | "sources";
const layerLabels: [LayerKey, string][] = [
  ["setbacks", "إظهار الارتدادات"], ["height", "إظهار حدود الارتفاع"], ["envelope", "إظهار غلاف البناء"],
  ["restricted", "إظهار المناطق المقيدة"], ["conflicts", "إظهار التعارضات"], ["sources", "إظهار المراجع"],
];
type Mode = "perspective" | "top" | "side" | "envelope" | "building" | "overlay";
const modes: [Mode, string][] = [["perspective", "منظور"], ["top", "علوي"], ["side", "جانبي"], ["envelope", "الغلاف فقط"], ["building", "غلاف + مبنى"], ["overlay", "طبقة الاشتراطات"]];

const BUILDING = { width: 15, depth: 20, floors: 3, floorHeight: 3.6, frontGap: 5, sideGap: 2.5, tone: "neutral" as const };

function Glass({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("glass rounded-2xl", className)}>{children}</section>;
}

function Workspace() {
  const [lay, setLay] = useState<Record<LayerKey, boolean>>({ setbacks: true, height: true, envelope: true, restricted: true, conflicts: true, sources: true });
  const [mode, setMode] = useState<Mode>("perspective");
  const [open, setOpen] = useState(false);

  const view: View = mode === "top" ? "top" : mode === "side" ? "side" : "perspective";
  const layers: Partial<Record<Layer, boolean>> = {
    envelope: lay.envelope, restricted: lay.setbacks || mode === "overlay", unresolved: lay.conflicts && lay.height,
    dims: lay.sources || mode === "overlay", building: mode !== "envelope", context: mode !== "envelope",
  };
  const props = { parcel: { width: 20, depth: 30 }, setbacks: { front: 4, rear: 2, side: 2 }, maxHeight: 12, altHeight: lay.conflicts ? 15 : undefined, layers, view, building: mode === "envelope" ? null : BUILDING };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-forest text-ivory">
      <ClientOnly fallback={<div className="blueprint absolute inset-0" />}>
        <Suspense fallback={<div className="blueprint absolute inset-0" />}>
          <ParcelMap showSetbacks={lay.setbacks} showRestricted={lay.restricted} showEnvelope={lay.envelope} />
        </Suspense>
      </ClientOnly>

      {/* top bar */}
      <div className="glass pointer-events-auto absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full px-5 py-2 text-sm">
        <Logo light />
        <span className="hidden text-ivory/70 md:inline"><MapPin className="ml-1 inline h-3.5 w-3.5" />الرياض · حي الملقا</span>
        <span className="rounded-full bg-warn/25 px-2 py-0.5 text-[11px] text-warn">بيانات تجريبية</span>
        <Link to="/dashboard" className="text-ivory/70 hover:text-sand"><Home className="h-4 w-4" /></Link>
      </div>

      {/* LEFT panel: land + layers */}
      <Glass className="absolute bottom-4 left-4 top-20 z-10 hidden w-80 flex-col overflow-hidden lg:flex">
        <div className="border-b border-ivory/10 p-4">
          <div className="text-[11px] tracking-wide text-olive">بيانات الأرض</div>
          <h2 className="text-lg font-semibold">فيلا سكنية — 2451-RA</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <dl className="grid grid-cols-2 gap-2">
            {land.map(([k, v]) => (
              <div key={k} className="rounded-lg bg-ivory/5 px-3 py-2"><dt className="text-[11px] text-ivory/55">{k}</dt><dd className="text-sm font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 mb-2 flex items-center gap-2 text-[11px] tracking-wide text-olive"><Layers className="h-3.5 w-3.5" />الطبقات</div>
          <div className="space-y-2">
            {layerLabels.map(([k, l]) => (
              <label key={k} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-ivory/5">
                {l}<Switch className="data-[state=checked]:bg-olive data-[state=unchecked]:bg-ivory/20" checked={lay[k]} onCheckedChange={(c) => setLay((s) => ({ ...s, [k]: c }))} />
              </label>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-ivory/10 p-3 text-sm">
            <div className="mb-2 text-[11px] text-olive">ملخص النتيجة</div>
            {[["حالة التوافق", "متوافق مبدئيًا", "text-ok"], ["الاشتراطات المطبقة", "11", ""], ["التعارضات", "1", "text-warn"], ["مراجعة المختص", "بانتظار الإحالة", "text-sand"]].map(([k, v, c]) => (
              <div key={k} className="flex justify-between py-1"><span className="text-ivory/60">{k}</span><span className={cn("font-semibold", c)}>{v}</span></div>
            ))}
            {lay.conflicts && (
              <Link to="/conflicts" className="mt-2 block rounded-lg bg-warn/15 p-2 text-xs text-warn hover:bg-warn/25">
                <AlertTriangle className="ml-1 inline h-3.5 w-3.5" />مصدر 1: 15 م مقابل مصدر 2: 12 م — يتطلب مراجعة مختص
              </Link>
            )}
          </div>
        </div>
      </Glass>

      {/* RIGHT column */}
      <div className="absolute bottom-4 right-4 top-20 z-10 flex w-[min(380px,calc(100%-2rem))] flex-col gap-3">
        <Glass className="relative h-56 shrink-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
            <span className="rounded-full bg-forest/70 px-2.5 py-1 text-xs font-semibold">المعاينة ثلاثية الأبعاد</span>
            <button onClick={() => setOpen(true)} aria-label="تكبير النموذج" className="rounded-lg bg-forest/70 p-1.5 hover:bg-olive"><Maximize2 className="h-4 w-4" /></button>
          </div>
          <Scene3D {...props} layers={{ ...layers, dims: false }} autoRotate interactive={false} />
        </Glass>
        <Assistant onOpen3D={() => setOpen(true)} />
        <UploadPanel />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass flex h-[88vh] max-w-[94vw] flex-col gap-0 overflow-hidden border-ivory/10 bg-transparent p-0 text-ivory sm:max-w-[94vw]">
          <DialogTitle className="sr-only">النموذج ثلاثي الأبعاد</DialogTitle>
          <div className="flex flex-wrap gap-2 border-b border-ivory/10 p-3 pr-12">
            {modes.map(([m, l]) => (
              <button key={m} onClick={() => setMode(m)} className={cn("rounded-full px-3 py-1 text-xs transition-colors", mode === m ? "bg-olive text-ivory" : "bg-ivory/10 hover:bg-ivory/20")}>{l}</button>
            ))}
            <span className="ms-auto self-center text-[11px] text-ivory/50">اسحب للتدوير · مرّر للتكبير · زر يمين للتحريك</span>
          </div>
          <Scene3D {...props} className="min-h-0 w-full flex-1" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

type Msg = { from: "user" | "ai"; text: string };
const answers: Record<string, string> = {
  "ما الارتدادات المطلوبة؟": "الارتداد الأمامي 4 م، الخلفي 2 م، والجانبي 2 م من كل جهة (المصدر: دليل اشتراطات البناء — بيانات تجريبية).",
  "اعرض التعارضات": "تعارض واحد: مصدر 1 يسمح بارتفاع 15 م، ومصدر 2 يحدده بـ 12 م. لا يُحسم آليًا — يتطلب مراجعة مختص.",
  "حلل المخطط": "ارفع المخطط من اللوحة أدناه، وسأطابقه مع الاشتراطات وأعرض المخالفات.",
};
function Assistant({ onOpen3D }: { onOpen3D: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "user", text: "اعرض لي الاشتراطات العمرانية المطبقة على هذه الأرض، ووضح إن كان هناك تعارض بينها." },
    { from: "ai", text: "يُطبَّق 11 اشتراطًا: ارتدادات 4/2/2 م، ارتفاع أقصى 12 م (3 أدوار)، نسبة بناء 60%، ومواقف 2 لكل وحدة.\nرصدت تعارضًا واحدًا في الارتفاع (15 م مقابل 12 م) ويُحال لمختص.\nالمراجع: دليل البناء م.12 ص.34 · لائحة الحي م.7 (تجريبي)." },
  ]);
  const [q, setQ] = useState("");
  const send = (text: string) => {
    if (!text.trim()) return;
    if (text === "افتح نموذج 3D") onOpen3D();
    setMsgs((m) => [...m, { from: "user", text }, { from: "ai", text: text === "افتح نموذج 3D" ? "فتحت النموذج ثلاثي الأبعاد بالحجم الكامل." : answers[text] ?? "هذه استجابة تجريبية؛ سيتم ربط المساعد بنموذج ذكاء اصطناعي ومصادر رسمية لاحقًا." }]);
    setQ("");
  };
  return (
    <Glass className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-ivory/10 px-4 py-2.5 text-sm font-semibold"><Sparkles className="h-4 w-4 text-sand" />المساعد الذكي</div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3 text-[13px] leading-relaxed">
        {msgs.map((m, i) => (
          <div key={i} className={cn("max-w-[90%] whitespace-pre-line rounded-xl px-3 py-2", m.from === "user" ? "ms-auto bg-olive/35" : "bg-ivory/8 border border-ivory/10")}>{m.text}</div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pb-2">
        {["ما الارتدادات المطلوبة؟", "اعرض التعارضات", "افتح نموذج 3D", "حلل المخطط"].map((c) => (
          <button key={c} onClick={() => send(c)} className="rounded-full border border-ivory/15 px-2.5 py-0.5 text-[11px] hover:border-sand hover:text-sand">{c}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="flex gap-2 border-t border-ivory/10 p-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="اسأل عن الاشتراطات…" className="flex-1 rounded-lg bg-ivory/10 px-3 py-1.5 text-sm placeholder:text-ivory/40 focus:outline-none focus:ring-1 focus:ring-olive" />
        <button className="rounded-lg bg-olive px-3 hover:bg-olive/80" aria-label="إرسال"><Send className="h-4 w-4" /></button>
      </form>
    </Glass>
  );
}

function UploadPanel() {
  const [file, setFile] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const input = useRef<HTMLInputElement>(null);
  const start = (name: string) => { setFile(name); setState("busy"); setTimeout(() => setState("done"), 2200); };
  return (
    <Glass className="shrink-0 p-3">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold"><span>تحليل المخطط الهندسي</span><span className="text-[10px] font-normal text-ivory/50">PDF · PNG · JPG · DWG (قريبًا)</span></div>
      <input ref={input} type="file" accept=".pdf,.png,.jpg,.jpeg,.dwg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) start(f.name); }} />
      {state === "idle" && (
        <div onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) start(f.name); }}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ivory/25 p-3 text-xs text-ivory/70 hover:border-sand">
          <Upload className="h-5 w-5 text-sand" /><div className="flex-1">اسحب الملف هنا أو اضغط للرفع</div>
          <button type="button" onClick={(e) => { e.stopPropagation(); start("مخطط-تجريبي-فيلا.pdf"); }} className="rounded-md bg-ivory/10 px-2 py-1 hover:bg-ivory/20">مخطط تجريبي</button>
        </div>
      )}
      {state !== "idle" && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-ivory/5 p-2"><FileText className="h-4 w-4 text-sand" /><span className="flex-1 truncate">{file}</span>
            <button onClick={() => setState("idle")} className="text-ivory/50 hover:text-ivory">تغيير</button></div>
          {state === "busy" ? (
            <div className="flex items-center gap-2 text-sand"><Loader2 className="h-4 w-4 animate-spin" />جاري تحليل المخطط…</div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-bad/20 p-1.5"><div className="text-base font-bold text-bad">2</div>مخالفات</div>
                <div className="rounded-lg bg-ok/20 p-1.5"><div className="text-base font-bold text-ok">8</div><CheckCircle2 className="inline h-3 w-3" /> متوافق</div>
                <div className="rounded-lg bg-warn/20 p-1.5"><div className="text-base font-bold text-warn">1</div><Eye className="inline h-3 w-3" /> مراجعة</div>
              </div>
              <div className="text-ivory/60">تجاوز الارتداد الأمامي · ارتفاع مقترح أعلى من المسموح</div>
              <Link to="/plan-analysis" className="flex items-center justify-center gap-1 rounded-lg bg-olive py-1.5 font-semibold hover:bg-olive/80">عرض تفاصيل التحليل <ArrowLeft className="h-3.5 w-3.5" /></Link>
            </>
          )}
        </div>
      )}
    </Glass>
  );
}
