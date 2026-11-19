import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parcel } from '@/lib/workspace-data';
import { verifiedLocation, type MapLocation } from '@/lib/map-locations';

// Exact supplied Al Narjis parcel; the selection is a scripted demonstration.
const PARCEL_CENTER: [number, number] = [parcel.center[0] ?? 0, parcel.center[1] ?? 0];
const polygon: [number, number][] = parcel.coordinates.map(([lng = 0, lat = 0]) => [lat, lng]);

export default function ParcelMap({ onSelect, onUnsupported, target }: { onSelect: (location: MapLocation) => void; onUnsupported: () => void; target: { location: MapLocation; id: number } | null }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const select = useRef(onSelect);
  const unsupported = useRef(onUnsupported);
  const navigate = useRef<((location: MapLocation) => void) | null>(null);
  select.current = onSelect;
  unsupported.current = onUnsupported;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, attributionControl: true }).setView(PARCEL_CENTER, parcel.zoom);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19, attribution: "Esri" }).addTo(m);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19, opacity: 0.7 }).addTo(m);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", { maxZoom: 20, maxNativeZoom: 19 }).addTo(m);
    L.control.zoom({ position: "bottomleft" }).addTo(m);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(m);
    const styles = getComputedStyle(document.documentElement);
    const red = styles.getPropertyValue('--parcel-highlight').trim();
    const shape = L.polygon(polygon, { color: red, weight: 4, opacity: 0, fillColor: red, fillOpacity: 0, bubblingMouseEvents: false }).addTo(m);
    const focus = () => {
      m.invalidateSize();
      const width = m.getSize().x, height = m.getSize().y;
      const left = width >= 1024 ? 352 : width >= 700 ? 280 : 16;
      const right = width >= 700 ? 412 : 16;
      m.flyToBounds(shape.getBounds(), { paddingTopLeft: [left + 12, 110], paddingBottomRight: [right + 12, width < 700 ? height * 0.66 : 24], maxZoom: 19, duration: 1.1 });
    };
    const chooseLocation = (location: MapLocation) => {
      shape.setLatLngs(location.coordinates.map(([lng = 0, lat = 0]) => [lat, lng] as [number, number]));
      shape.setStyle({ opacity: 1, fillOpacity: .18 });
      shape.unbindTooltip();
      shape.bindTooltip(`قطعة رقم ${location.number} — ${location.area} م²${location.verified ? '' : ' · حدود توضيحية'}`, { permanent: true, direction: 'center', className: 'parcel-tip', interactive: true });
      shape.getElement()?.setAttribute('aria-label', `عرض بيانات القطعة ${location.number}`);
      focus();
    };
    navigate.current = chooseLocation;
    let shownLocation = verifiedLocation;
    navigate.current = location => { shownLocation = location; chooseLocation(location); };
    const choose = () => { chooseLocation(shownLocation); select.current(shownLocation); };
    shape.on('click', choose);
    m.on('click', () => unsupported.current());
    const observer = new ResizeObserver(() => m.invalidateSize({ pan: false }));
    observer.observe(el.current);
    const node = shape.getElement();
    if (node) {
      node.setAttribute('role', 'button'); node.setAttribute('tabindex', '0'); node.setAttribute('aria-label', 'عرض بيانات القطعة 725');
      node.addEventListener('keydown', (event: Event) => { if ((event as KeyboardEvent).key === 'Enter') choose(); });
    }
    map.current = m;
    return () => { observer.disconnect(); m.remove(); map.current = null; navigate.current = null; };
  }, []);

  useEffect(() => { if (target) navigate.current?.(target.location); }, [target]);

  return <div ref={el} className="absolute inset-0 z-0" />;
}
