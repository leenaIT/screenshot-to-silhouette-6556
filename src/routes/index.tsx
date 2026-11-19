import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { Maximize2, MapPin, Home, Info, ChevronUp, ChevronDown, RotateCcw, Plus, Minus } from "lucide-react";
import { Scene3D } from "@/components/Scene3D";
import type { View } from "@/components/Envelope3D";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { Assistant } from "@/components/workspace/Assistant";
import { UploadPanel } from "@/components/workspace/UploadPanel";
import { PdfViewer } from "@/components/workspace/PdfViewer";
import { parcel, regulations, canActivateWorkspace, type SourceReference } from "@/lib/workspace-data";
import { projectParcel } from "@/lib/geometry";
import { cn } from "@/lib/utils";
import type { Comparison } from '@/components/workspace/ParcelIllustration';
const ParcelMap = lazy(() => import("@/components/workspace/ParcelMap"));
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بنيان | مساحة العمل الخرائطية — اشتراطات أرضك في خريطة ونموذج ثلاثي الأبعاد" },
      { name: "description", content: "عرض تجريبي لاختيار أرض في حي النرجس ومراجعة المصادر التنظيمية مع محادثة موثقة وتصور فيلا توضيحي." },
      { property: "og:title", content: "بنيان | BUNYAN — مساحة العمل الخرائطية" },
      { property: "og:description", content: "اختيار الأرض، مصادر الاشتراطات وتصور معماري توضيحي في مساحة عمل خرائطية واحدة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});


const polygon = projectParcel(parcel.coordinates, parcel.center);
const xs = polygon.map(p => p[0]), zs = polygon.map(p => p[1]);
const bounds = { width: Math.max(...xs) - Math.min(...xs), depth: Math.max(...zs) - Math.min(...zs) };
const land: [string, string][] = [
  ["المدينة", parcel.city], ["الحي", parcel.district], ["رقم المخطط", parcel.planNumber],
  ["رقم البلوك", parcel.blockNumber], ["رقم القطعة", parcel.number], ["المساحة", `${parcel.area} م²`],
  ["نظام البناء", parcel.buildingSystem], ["حالة القطعة", parcel.status],
];
const views: [View, string][] = [["perspective", "منظور ثلاثي الأبعاد"], ["top", "عرض علوي"]];
const comparisons: [Comparison, string][] = [['first', 'المصدر الأول'], ['second', 'المصدر الثاني'], ['both', 'مقارنة المصدرين']];
function Workspace() {
  const [stage, setStage] = useState<"map" | "land" | "project" | "active">("map");
  const [retrieved, setRetrieved] = useState(false), [open, setOpen] = useState(false), [view, setView] = useState<View>("perspective");
  const [source, setSource] = useState<SourceReference | null>(null);
  const [collapsed, setCollapsed] = useState(false), [comparison, setComparison] = useState<Comparison>('first');
  const [planEvent, setPlanEvent] = useState<{ id: number; supported: boolean } | null>(null);
  const [cameraCommand, setCameraCommand] = useState<{ id: number; kind: 'reset' | 'in' | 'out' }>({ id: 0, kind: 'reset' });
  const [notice, setNotice] = useState<string | null>(null);
  const active = stage === "active";
  const [firstCoverage, secondCoverage] = regulations.verifiedDisplayParameters.coverageScenarios;
  const props = { parcel: bounds, parcelPolygon: polygon, setbacks: { front: 0, rear: 0, side: 0 }, maxHeight: 0, layers: { envelope: false, restricted: false, unresolved: retrieved && comparison === 'both', building: retrieved, context: false, dims: false }, view, building: null,
    illustration: { coverage: [firstCoverage?.ratio ?? 0, secondCoverage?.ratio ?? 0] as [number, number], floors: regulations.verifiedDisplayParameters.floors.count, comparison, footprint: retrieved, floorsVisible: retrieved, references: false } };
  const completeReview = () => setRetrieved(true);
  const command = (kind: 'reset' | 'in' | 'out') => setCameraCommand(c => ({ id: c.id + 1, kind }));
  const comparisonControls = <div className="flex flex-wrap gap-1">{comparisons.map(([key, label]) => <Button key={key} variant="ghost" size="sm" disabled={!retrieved} onClick={() => setComparison(key)} className={cn('h-auto px-2 py-1 text-[11px]', comparison === key ? 'bg-olive text-ivory' : 'bg-ivory/10')}>{label}</Button>)}</div>;
  const sourceCaption = comparison === 'first' ? 'نظام القطعة · 70% · PDF 1' : comparison === 'second' ? 'اشتراطات المباني السكنية · 75% · PDF 18' : 'نظام القطعة 70% · PDF 1 ↔ الاشتراطات السكنية 75% · PDF 18';
  return <div dir="rtl" className="workspace relative h-dvh w-full overflow-hidden bg-forest text-ivory">
    <ClientOnly fallback={<div className="blueprint absolute inset-0" />}><Suspense fallback={<div className="blueprint absolute inset-0" />}><ParcelMap onSelect={() => { setNotice(null); setStage(s => s === "map" ? "land" : s); }} onUnsupported={() => setNotice("يدعم العرض التجريبي حاليًا قطعة أرض محددة في حي النرجس.")} /></Suspense></ClientOnly>
    <div className="glass pointer-events-auto absolute left-1/2 top-4 z-10 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-4 rounded-full px-5 py-2 text-sm">
      <Logo light /><span className="hidden whitespace-nowrap text-ivory/70 md:inline"><MapPin className="ml-1 inline h-3.5 w-3.5" />الرياض — حي النرجس</span>
      <span className="whitespace-nowrap rounded-full bg-warn/25 px-2 py-0.5 text-[11px] text-warn">عرض تجريبي</span>
      <Link to="/about" className="hidden text-ivory/70 hover:text-sand sm:inline" title="عن بنيان"><Info className="h-4 w-4" /></Link><Link to="/dashboard" className="text-ivory/70 hover:text-sand" title="لوحة التحكم"><Home className="h-4 w-4" /></Link>
    </div>
    <section className={cn("glass absolute bottom-4 left-4 top-20 z-10 flex w-64 flex-col overflow-hidden rounded-2xl lg:w-80", "max-[699px]:bottom-auto max-[699px]:top-[34%] max-[699px]:max-h-[30%] max-[699px]:w-[calc(100%-2rem)]")}>
      <div className="border-b border-ivory/10 p-4"><div className="text-[11px] tracking-wide text-olive">بيانات الأرض</div><h2 className="text-lg font-semibold">{stage === "map" ? "اختيار الأرض" : `قطعة ${parcel.number} — حي ${parcel.district}`}</h2></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {stage === "map" ? <p className="text-sm leading-relaxed text-ivory/65">حدد موقع أرضك على الخريطة</p> : <>
          <dl className="grid grid-cols-2 gap-2">{land.map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-ivory/5 px-3 py-2"><dt className="text-[11px] text-ivory/55">{label}</dt><dd className="break-words text-sm font-semibold">{value}</dd></div>)}</dl>
          <div className="mt-3 text-xs leading-relaxed text-ivory/60">المصدر: {parcel.source}</div>
          {stage === "land" && <Button className="mt-4 w-full bg-olive hover:bg-olive/80" onClick={() => setStage("project")}>اختيار هذه الأرض</Button>}
          {stage === "project" && <div className="mt-4 space-y-3 border-t border-ivory/10 pt-3"><h3 className="text-sm font-semibold">نوع المشروع</h3><label className="flex items-center gap-2 rounded-lg bg-ivory/5 p-3 text-sm"><input type="radio" name="projectType" checked readOnly />فيلا سكنية</label><Button className="w-full bg-olive hover:bg-olive/80" onClick={() => { if (canActivateWorkspace(stage, "فيلا سكنية")) setStage("active"); }}>تأكيد المشروع</Button></div>}
          {active && <>
            <div className="mt-4 text-xs text-sand">المشروع: فيلا سكنية</div>
            <div className="mt-5 border-t border-ivory/10 pt-3"><h3 className="mb-3 text-sm font-semibold text-olive">الاشتراطات المطبقة</h3>{retrieved ? <dl className="space-y-3">{regulations.requirements.filter(req => ['use', 'floors', 'coverage', 'far', 'setbacks'].includes(req.id)).map(req => <div key={req.id} className="text-xs"><dt className="text-ivory/55">{req.title}</dt><dd className="mt-1 font-semibold">{req.value}</dd></div>)}</dl> : <p className="text-xs text-ivory/60">جاري مراجعة المصادر التنظيمية…</p>}</div>
          </>}
        </>}
        {notice && <p role="status" className="mt-4 text-xs leading-relaxed text-sand">{notice}</p>}
        <p className="mt-4 text-[10px] text-ivory/45">صور جغرافية وليست بثًا مباشرًا أو ضمانًا لحالة البناء الحالية.</p>
      </div>
    </section>
    <div className="workspace-column absolute bottom-4 right-4 top-20 z-10 flex min-h-0 w-[min(380px,calc(100%-2rem))] flex-col gap-3 max-[699px]:top-[66%]">
      <section data-collapsed={collapsed} className="workspace-preview glass relative min-h-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-1 p-2"><span className="rounded-full bg-forest/70 px-2.5 py-1 text-xs font-semibold">المعاينة ثلاثية الأبعاد</span><div className="flex gap-1">{!collapsed && <Button variant="ghost" disabled={!retrieved} onClick={() => setOpen(true)} title="تكبير النموذج" aria-label="تكبير النموذج" className="h-auto bg-forest/70 p-1.5 hover:bg-olive"><Maximize2 /></Button>}<Button variant="ghost" onClick={() => setCollapsed(v => !v)} title={collapsed ? 'استعادة المعاينة' : 'طي المعاينة'} aria-label={collapsed ? 'استعادة المعاينة' : 'طي المعاينة'} className="h-auto bg-forest/70 p-1.5">{collapsed ? <ChevronDown /> : <ChevronUp />}</Button></div></div>
        {!collapsed && <>{active && retrieved ? <Scene3D {...props} view="perspective" interactive /> : <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ivory/50">بانتظار اختيار الأرض وتأكيد المشروع</div>}{active && <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-forest/85 px-2 py-1 text-center text-[10px]">تصور معماري توضيحي — غير معتمد هندسيًا{retrieved && <span> · أرضي + أول</span>}</div>}</>}
      </section>
      <Assistant planEvent={planEvent} active={active} selectionId={active ? `${parcel.number}:فيلا سكنية` : null} onOpen3D={() => setOpen(true)} onRetrieve={completeReview} onSource={setSource} />
      <UploadPanel active={active && retrieved} onAnalysis={supported => setPlanEvent(e => ({ id: (e?.id ?? 0) + 1, supported }))} />
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="glass flex h-[88dvh] max-w-[94vw] flex-col gap-0 overflow-hidden border-ivory/10 bg-transparent p-0 text-ivory sm:max-w-[94vw]">
      <DialogTitle className="sr-only">النموذج ثلاثي الأبعاد للقطعة 725</DialogTitle><DialogDescription className="sr-only">تصور معماري توضيحي — غير معتمد هندسيًا</DialogDescription>
      <div className="flex flex-wrap items-center gap-2 border-b border-ivory/10 p-3 pr-12">{views.map(([key, label]) => <Button variant="ghost" size="sm" key={key} onClick={() => setView(key)} className={cn("text-xs", view === key ? "bg-olive text-ivory" : "bg-ivory/10")}>{label}</Button>)}<Button variant="ghost" size="icon" aria-label="إعادة ضبط العرض" title="إعادة ضبط العرض" onClick={() => { setView('perspective'); command('reset'); }}><RotateCcw /></Button><Button variant="ghost" size="icon" aria-label="تكبير" title="تكبير" onClick={() => command('in')}><Plus /></Button><Button variant="ghost" size="icon" aria-label="تصغير" title="تصغير" onClick={() => command('out')}><Minus /></Button>{retrieved && comparisonControls}</div>
      <div className="relative min-h-0 w-full flex-1"><Scene3D {...props} layers={{ ...props.layers, dims: true }} cameraCommand={cameraCommand} /></div>
      <div className="shrink-0 border-t border-ivory/10 p-2 text-center text-xs text-warn">تصور معماري توضيحي — غير معتمد هندسيًا · أرضي + أول{retrieved && <p className="text-sand">{sourceCaption}</p>}</div>
    </DialogContent></Dialog>
    <PdfViewer reference={source} onClose={() => setSource(null)} />
  </div>;
}
