import { Link, useLocation } from "@tanstack/react-router";
import { Map as MapIcon, Home, FolderKanban, PlusSquare, Scale, GitCompareArrows, Box, ScanLine, Wand2, Sparkles, Library, UserCheck, FileBarChart, Bell, Settings, Languages, Menu, Info } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "./brand";
import { useI18n, type Key } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const nav: { to: string; k: Key; icon: typeof Home; section?: string }[] = [
  { to: "/", k: "workspace", icon: MapIcon },
  { to: "/dashboard", k: "dashboard", icon: Home },
  { to: "/projects", k: "projects", icon: FolderKanban },
  { to: "/new-project", k: "newProject", icon: PlusSquare },
  { to: "/regulations", k: "regulations", icon: Scale, section: "مشروع: فيلا الملقا" },
  { to: "/conflicts", k: "conflicts", icon: GitCompareArrows },
  { to: "/envelope", k: "envelope", icon: Box },
  { to: "/plan-analysis", k: "planAnalysis", icon: ScanLine },
  { to: "/corrections", k: "corrections", icon: Wand2 },
  { to: "/design-generator", k: "generator", icon: Sparkles },
  { to: "/review", k: "review", icon: UserCheck },
  { to: "/report", k: "report", icon: FileBarChart },
  { to: "/library", k: "library", icon: Library, section: "عام" },
  { to: "/about", k: "about", icon: Info },
  { to: "/notifications", k: "notifications", icon: Bell },
  { to: "/settings", k: "settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <aside className={cn("no-print fixed inset-y-0 z-40 w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen", open ? "flex" : "hidden")}>
        <div className="flex h-16 items-center px-5"><Logo light /></div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {nav.map((n) => (
            <div key={n.to}>
              {n.section && <div className="mb-1 mt-5 px-3 text-[11px] font-semibold tracking-wide text-sidebar-primary/80">{n.section}</div>}
              <Link to={n.to} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                  pathname === n.to && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-[inset_-3px_0_0_var(--sand)]")}>
                <n.icon className="h-4 w-4 opacity-80" />{t(n.k)}
              </Link>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary font-bold text-sidebar-primary-foreground">ع</div>
            <div><div className="font-semibold">م. عبدالله القحطاني</div><div className="opacity-60">مكتب استشاري (تجريبي)</div></div>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="القائمة"><Menu className="h-5 w-5" /></button>
          <div className="hidden text-sm text-muted-foreground md:block">مشروع <span className="font-semibold text-foreground">BNY-RUH-0142</span> · الرياض · حي الملقا</div>
          <div className="flex items-center gap-2">
            <Link to="/how-it-works" className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-primary sm:block">{t("how")}</Link>
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-secondary">
              <Languages className="h-4 w-4" />{lang === "ar" ? "English" : "العربية"}
            </button>
            <Link to="/notifications" className="relative rounded-md border p-2 hover:bg-secondary" aria-label={t("notifications")}>
              <Bell className="h-4 w-4" /><span className="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-bad" />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
