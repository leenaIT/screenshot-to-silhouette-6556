import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parcel } from '@/lib/workspace-data';

// Exact supplied Al Narjis parcel; the selection is a scripted demonstration.
const PARCEL_CENTER: [number, number] = [parcel.center[0] ?? 0, parcel.center[1] ?? 0];
const polygon: [number, number][] = parcel.coordinates.map(([lng = 0, lat = 0]) => [lat, lng]);

export default function ParcelMap({ onSelect }: { onSelect: () => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const select = useRef(onSelect);
  select.current = onSelect;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, attributionControl: true }).setView(PARCEL_CENTER, parcel.zoom);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19, attribution: "Esri" }).addTo(m);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19, opacity: 0.7 }).addTo(m);
    L.control.zoom({ position: "bottomleft" }).addTo(m);
    const styles = getComputedStyle(document.documentElement);
    const red = styles.getPropertyValue('--parcel-highlight').trim();
    L.polygon(polygon, { color: styles.getPropertyValue('--ivory').trim(), weight: 7, fill: false, interactive: false }).addTo(m);
    const shape = L.polygon(polygon, { color: red, weight: 4, opacity: 1, fillColor: red, fillOpacity: 0.20 }).addTo(m)
      .bindTooltip('قطعة رقم 725 — 200.1 م²', { permanent: true, direction: 'center', className: 'parcel-tip', interactive: true });
    shape.on('click', () => select.current());
    shape.getTooltip()?.on('click', () => select.current());
    polygon.slice(0, -1).forEach(point => L.circleMarker(point, { radius: 3, color: styles.getPropertyValue('--ivory').trim(), weight: 1, fillColor: red, fillOpacity: 1, interactive: false }).addTo(m));
    const focus = () => {
      m.invalidateSize();
      const width = m.getSize().x, height = m.getSize().y;
      const left = width >= 1024 ? 352 : width >= 700 ? 280 : 16;
      const right = width >= 700 ? 412 : 16;
      m.fitBounds(shape.getBounds(), { paddingTopLeft: [left + 12, 110], paddingBottomRight: [right + 12, width < 700 ? height * 0.66 : 24], maxZoom: 19, animate: false });
    };
    focus();
    const observer = new ResizeObserver(focus);
    observer.observe(el.current);
    const node = shape.getElement();
    if (node) {
      node.setAttribute('role', 'button'); node.setAttribute('tabindex', '0'); node.setAttribute('aria-label', 'عرض بيانات القطعة 725');
      node.addEventListener('keydown', (event: Event) => { if ((event as KeyboardEvent).key === 'Enter') select.current(); });
    }
    map.current = m;
    return () => { observer.disconnect(); m.remove(); map.current = null; };
  }, []);

  return <div ref={el} className="absolute inset-0 z-0" />;
}
