import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/brand";
import { notifications } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({ head: () => seo("الإشعارات", "آخر التحديثات على مشاريعك ومراجعات المختصين."), component: () => (
  <AppShell>
    <PageHeader title="الإشعارات" />
    <div className="panel max-w-3xl divide-y">{notifications.map((n) => (
      <div key={n.title} className="flex gap-4 p-5"><span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", n.tone === "ok" ? "bg-ok" : n.tone === "bad" ? "bg-bad" : "bg-warn")} />
        <div className="flex-1"><div className="font-medium">{n.title}</div><div className="text-sm text-muted-foreground">{n.body}</div></div><div className="text-xs text-muted-foreground">{n.t}</div></div>))}</div>
  </AppShell>
) });
