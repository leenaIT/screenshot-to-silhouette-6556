import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Pill, statusMeta } from "@/components/brand";
import { Scene3D } from "@/components/Scene3D";
import { SourceButton } from "@/components/SourceDialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Layer, Spatial, View } from "@/components/Envelope3D";
import { requirements, demoProject as P } from "@/lib/mock-data";
import { computeEnvelope } from "@/lib/geometry";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/envelope")({ head: () => seo("الغلاف البنائي ثلاثي الأبعاد", "تصور تفاعلي للارتدادات والارتفاع والحجم المسموح للبناء."), component: EnvelopePage });

const layerNames: [Layer, string, string][] = [["envelope", "الغلاف المسموح", "bg-ok"], ["restricted", "مناطق مقيدة", "bg-bad"], ["unresolved", "قيود غير محسومة", "bg-warn"], ["building", "النموذج المقترح", "bg-sand"], ["dims", "الأبعاد", "bg-primary"], ["context", "المباني المجاورة", "bg-muted-foreground"]];
const views: [View, string][] = [["perspective", "منظوري"], ["top", "علوي"], ["front", "أمامي"], ["side", "جانبي"]];

function EnvelopePage() {
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ envelope: true, restricted: true, unresolved: true, building: false, dims: true, context: true });
  const [view, setView] = useState<View>("perspective");
  const [sel, setSel] = useState<string | null>(null);
  const [alt, setAlt] = useState<"12" | "15">("12");
  const spatialReqs = requirements.filter((r) => r.spatial);
  const selReq = requirements.find((r) => r.id === sel);
  const h = alt === "12" ? 12 : 15;
  const e = computeEnvelope(P.parcel, P.setbacks, h, P.floorHeight, P.coverage, P.far);

  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]" style={{ minHeight: "calc(100vh - 8rem)" }}>
        <aside className="panel flex flex-col overflow-hidden">
          <div className="border-b p-4"><div className="eyebrow">مساحة العمل ثلاثية الأبعاد</div><h1 className="text-lg font-bold text-primary">الغلاف البنائي المسموح</h1>
            <p className="mt-1 text-xs text-muted-foreground">يمثل الحيز المسموح للبناء — وليس تصميماً هندسياً نهائياً.</p></div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {spatialReqs.map((r) => (
              <button key={r.id} onClick={() => setSel(sel === r.id ? null : r.id)} className={cn("w-full rounded-lg border p-3 text-right transition-all", sel === r.id ? "border-primary bg-secondary" : "hover:border-olive")}>
                <div className="flex items-center justify-between"><span className="text-sm font-medium">{r.title}</span><span className="font-bold text-primary">{r.value}</span></div>
                <div className="mt-1 text-[11px] text-muted-foreground">{r.clause} · {r.doc.split("—")[0]}</div>
              </button>))}
          </div>
          {selReq && (
            <div className="space-y-2 border-t bg-secondary/40 p-4 text-xs">
              <div className="font-semibold">المصدر الرسمي</div><div>{selReq.authority}</div><div className="text-muted-foreground">{selReq.doc} · {selReq.clause} · ص {selReq.page}</div>
              <div className="flex items-center justify-between"><Pill tone={statusMeta[selReq.status].tone}>{statusMeta[selReq.status].label}</Pill><SourceButton req={selReq} /></div>
            </div>)}
        </aside>
        <div className="flex flex-col gap-4">
          <div className="panel relative flex-1 overflow-hidden" style={{ minHeight: 520 }}>
            <Scene3D className="absolute inset-0" parcel={P.parcel} setbacks={P.setbacks} maxHeight={h} altHeight={alt === "12" ? 15 : undefined} layers={layers} view={view}
              selected={(selReq?.spatial ?? null) as Spatial} building={{ width: 19, depth: 20, floors: 3, floorHeight: 3.5, frontGap: 7, sideGap: 3 }} />
            <div className="absolute right-3 top-3 flex gap-1 rounded-lg bg-card/95 p-1 shadow">
              {views.map(([v, t]) => <Button key={v} size="sm" variant={view === v ? "default" : "ghost"} onClick={() => setView(v)}>{t}</Button>)}
            </div>
            <div className="absolute left-3 top-3 flex gap-1 rounded-lg bg-card/95 p-1 text-xs shadow">
              <span className="px-2 py-1.5 text-muted-foreground">مقارنة الأغلفة:</span>
              <Button size="sm" variant={alt === "12" ? "default" : "ghost"} onClick={() => setAlt("12")}>12 م (ب)</Button>
              <Button size="sm" variant={alt === "15" ? "default" : "ghost"} onClick={() => setAlt("15")}>15 م (أ)</Button>
            </div>
            <div className="absolute bottom-3 right-3 rounded-md bg-card/90 px-3 py-1.5 text-xs text-muted-foreground">اسحب للتدوير · عجلة الفأرة للتكبير · زر أيمن للتحريك</div>
          </div>
          <div className="grid gap-4">
            <div className="panel grid grid-cols-2 gap-3 p-4 text-center text-xs sm:grid-cols-5">
              <S v={`${e.buildWidth} × ${e.buildDepth} م`} k="منطقة البناء" /><S v={`${e.allowedFootprint} م²`} k="أقصى تغطية" /><S v={`${e.maxHeight} م`} k="أقصى ارتفاع" />
              <S v={`${e.maxFloors}`} k="أدوار نظرية" /><S v={`${e.maxGFA} م²`} k="أقصى مسطحات" />
            </div>
            <div className="panel flex flex-wrap items-center gap-3 p-4">
              {layerNames.map(([k, t, c]) => (
                <label key={k} className="flex items-center gap-2 text-xs"><span className={cn("h-2.5 w-2.5 rounded-sm", c)} />{t}
                  <Switch checked={layers[k]} onCheckedChange={(v) => setLayers({ ...layers, [k]: v })} /></label>))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
function S({ v, k }: { v: string; k: string }) { return <div><div className="text-base font-bold text-primary">{v}</div><div className="text-muted-foreground">{k}</div></div>; }
