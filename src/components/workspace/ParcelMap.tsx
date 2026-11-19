import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Demo parcel near Al-Malqa, Riyadh. 20 m x 30 m = 600 m².
export const PARCEL_CENTER: [number, number] = [24.8112, 46.6153];
const M_LAT = 1 / 111320;
const M_LNG = 1 / (111320 * Math.cos((PARCEL_CENTER[0] * Math.PI) / 180));
const rect = (w: number, d: number, dy = 0): [number, number][] => {
  const [la, ln] = PARCEL_CENTER;
  const hw = (w / 2) * M_LNG, hd = (d / 2) * M_LAT, o = dy * M_LAT;
  return [[la - hd + o, ln - hw], [la - hd + o, ln + hw], [la + hd + o, ln + hw], [la + hd + o, ln - hw]];
};

export default function ParcelMap({ showSetbacks, showRestricted, showEnvelope }: { showSetbacks: boolean; showRestricted: boolean; showEnvelope: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layers = useRef<Record<string, L.Layer>>({});

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, attributionControl: true }).setView(PARCEL_CENTER, 19);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19, attribution: "Esri" }).addTo(m);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19, opacity: 0.7 }).addTo(m);
    L.control.zoom({ position: "bottomleft" }).addTo(m);
    L.polygon(rect(20, 30), { color: "#e3d3b0", weight: 3, fillColor: "#e3d3b0", fillOpacity: 0.12 }).addTo(m)
      .bindTooltip("2451-RA · 600 م²", { permanent: true, direction: "center", className: "parcel-tip" });
    layers.current["setback"] = L.polygon(rect(20, 30), { color: "#c2513c", weight: 1, dashArray: "4 4", fillColor: "#c2513c", fillOpacity: 0.28 });
    layers.current["envelope"] = L.polygon(rect(16, 24, -1), { color: "#7fbf8e", weight: 2, fillColor: "#7fbf8e", fillOpacity: 0.3 });
    layers.current["restricted"] = L.polygon(rect(30, 10, 22), { color: "#d79a32", weight: 1, dashArray: "6 4", fillColor: "#d79a32", fillOpacity: 0.2 })
      .bindTooltip("منطقة ارتفاق مقيدة (تجريبي)");
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const m = map.current; if (!m) return;
    const set = (k: string, on: boolean) => { const l = layers.current[k]; if (!l) return; on ? l.addTo(m) : l.remove(); };
    set("setback", showSetbacks); set("envelope", showEnvelope); set("restricted", showRestricted);
  }, [showSetbacks, showRestricted, showEnvelope]);

  return <div ref={el} className="absolute inset-0 z-0" />;
}
