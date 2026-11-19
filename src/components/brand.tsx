import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { DEMO_NOTICE } from "@/lib/mock-data";
import { FlaskConical } from "lucide-react";
import type { ReactNode } from "react";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect x="2" y="18" width="8" height="12" rx="1" className={light ? "fill-sand" : "fill-olive"} />
        <rect x="12" y="10" width="8" height="20" rx="1" className={light ? "fill-ivory" : "fill-primary"} />
        <rect x="22" y="4" width="8" height="26" rx="1" className={light ? "fill-sand" : "fill-sand"} />
      </svg>
      <span className={cn("text-xl font-bold tracking-tight", light ? "text-sidebar-foreground" : "text-primary")}>
        بنيان <span className="font-medium opacity-60 text-sm">BUNYAN</span>
      </span>
    </Link>
  );
}

const tones = {
  ok: "bg-ok-soft text-ok border-ok/25",
  bad: "bg-bad-soft text-bad border-bad/25",
  warn: "bg-warn-soft text-[color:oklch(0.5_0.11_65)] border-warn/30",
  neutral: "bg-secondary text-secondary-foreground border-border",
  ai: "bg-primary/8 text-primary border-primary/20",
};
export type Tone = keyof typeof tones;
export function Pill({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[tone], className)}>{children}</span>;
}

export function DemoBanner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-xs text-foreground/80", className)}>
      <FlaskConical className="h-4 w-4 shrink-0 text-warn" />
      {DEMO_NOTICE}
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc, actions }: { eyebrow?: string; title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rise">
      <div>
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h1 className="text-2xl font-bold text-primary md:text-3xl">{title}</h1>
        {desc && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export const statusMeta = {
  "verified-demo": { label: "مستخرج — بيانات تجريبية", tone: "ok" as Tone },
  "needs-review": { label: "يحتاج تحقق مختص", tone: "warn" as Tone },
  conflict: { label: "تعارض بين مصادر", tone: "bad" as Tone },
};
