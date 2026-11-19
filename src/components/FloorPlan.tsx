import { cn } from "@/lib/utils";

// Schematic SVG floor plan (demo). Units: 1 = 1 metre, parcel 25 × 32, street at bottom.
type Variant = "original" | "corrected" | "concept-a" | "concept-b";
export function FloorPlan({ variant = "original", highlight, onZone, className }: { variant?: Variant; highlight?: string | null | undefined; onZone?: (z: string) => void; className?: string }) {
  const corrected = variant === "corrected";
  const frontGap = corrected ? 6.2 : 4.8;
  const top = 2, bottom = 32 - frontGap;
  const rooms = variant.startsWith("concept")
    ? variant === "concept-a"
      ? [{ n: "صالة المعيشة", x: 3, y: 3, w: 11, h: 9 }, { n: "المطبخ", x: 14, y: 3, w: 8, h: 6 }, { n: "غرفة نوم 1", x: 14, y: 9, w: 8, h: 7 }, { n: "المجلس", x: 3, y: 12, w: 11, h: 8 }, { n: "دورة مياه", x: 14, y: 16, w: 4, h: 4 }, { n: "مدخل", x: 18, y: 16, w: 4, h: 4 }, { n: "فناء", x: 3, y: 20, w: 19, h: 5, open: true }]
      : [{ n: "المجلس", x: 3, y: 15, w: 9, h: 10 }, { n: "الفناء الداخلي", x: 12, y: 10, w: 7, h: 7, open: true }, { n: "المعيشة", x: 3, y: 3, w: 9, h: 12 }, { n: "المطبخ", x: 19, y: 3, w: 3, h: 7 }, { n: "طعام", x: 12, y: 3, w: 7, h: 7 }, { n: "نوم ضيوف", x: 19, y: 10, w: 3, h: 15 }, { n: "مدخل", x: 12, y: 17, w: 7, h: 8 }]
    : [{ n: "المجلس", x: 3, y: bottom - 8, w: 10, h: 8, zone: "front" }, { n: "المدخل", x: 13, y: bottom - 5, w: 5, h: 5 }, { n: "صالة", x: 3, y: top + 1, w: 12, h: bottom - 9 - top }, { n: "المطبخ", x: 15, y: top + 1, w: 7, h: 8 }, { n: "طعام", x: 15, y: top + 9, w: 7, h: bottom - top - 14 }, { n: "ملحق خارجي", x: 18, y: bottom - 5, w: corrected ? 0 : 4, h: 5, zone: "coverage" }];
  const hl = (z?: string) => z && highlight === z;
  return (
    <svg viewBox="-2 -2 29 38" className={cn("w-full", className)} style={{ direction: "ltr" }}>
      <defs>
        <pattern id="hatch" width="1" height="1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="1" className="stroke-bad" strokeWidth="0.25" /></pattern>
      </defs>
      <rect x="0" y="0" width="25" height="32" className="fill-card stroke-primary" strokeWidth="0.15" strokeDasharray="0.6 0.3" />
      {/* required setback line */}
      <rect x="2" y="2" width="21" height="24" className="fill-ok/5 stroke-ok" strokeWidth="0.12" strokeDasharray="0.4 0.3" />
      <text x="12.5" y="27.4" fontSize="0.9" textAnchor="middle" className="fill-ok">حد الارتداد الأمامي المطلوب 6 م</text>
      {rooms.map((r) => r.w > 0 && (
        <g key={r.n} onClick={() => "zone" in r && r.zone && onZone?.(r.zone)} className={cn("zone" in r && r.zone && onZone && "cursor-pointer")}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h}
            className={cn("stroke-foreground transition-all", "open" in r && r.open ? "fill-olive/20" : "fill-ivory",
              "zone" in r && hl(r.zone) && "fill-bad/25 stroke-bad",
              corrected && "zone" in r && r.zone === "front" && "fill-ok/20 stroke-ok")}
            strokeWidth="0.2" />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 0.35} fontSize="1" textAnchor="middle" className="fill-foreground">{r.n}</text>
        </g>
      ))}
      {!corrected && !variant.startsWith("concept") && (
        <rect x="2" y="26" width="16" height={bottom - 26 > 0 ? bottom - 26 : 1.2} className={cn("fill-[url(#hatch)]", hl("front") && "stroke-bad")} strokeWidth="0.2" />
      )}
      {!corrected && !variant.startsWith("concept") && <rect x="3" y={bottom - 8} width="10" height="8" fill="url(#hatch)" opacity={hl("front") ? 1 : 0} />}
      {hl("roof") && <rect x="3" y="3" width="10" height="10" className="fill-warn/30 stroke-warn" strokeWidth="0.2" />}
      {hl("coverage") && <rect x="2.6" y="2.6" width="19.8" height={bottom - 2.6} className="fill-none stroke-bad" strokeWidth="0.3" />}
      <rect x="-2" y="33" width="29" height="3" className="fill-muted" />
      <text x="12.5" y="35" fontSize="1" textAnchor="middle" className="fill-muted-foreground">الشارع — 20 م</text>
      <text x="12.5" y="-0.6" fontSize="0.8" textAnchor="middle" className="fill-muted-foreground">25 م</text>
    </svg>
  );
}
