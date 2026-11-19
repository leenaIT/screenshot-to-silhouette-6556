import { useState, type ReactNode } from "react";

export function Compare({ before, after, labels = ["قبل", "بعد"] }: { before: ReactNode; after: ReactNode; labels?: [string, string] }) {
  const [v, setV] = useState(50);
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card select-none" style={{ direction: "ltr" }}>
      <div>{after}</div>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>{before}</div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${v}%` }}>
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">⟷</div>
      </div>
      <span className="absolute left-3 top-3 rounded bg-bad px-2 py-0.5 text-xs text-destructive-foreground">{labels[0]}</span>
      <span className="absolute right-3 top-3 rounded bg-ok px-2 py-0.5 text-xs text-primary-foreground">{labels[1]}</span>
      <input type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="مقارنة" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  );
}
