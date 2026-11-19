import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/projects")({ head: () => seo("مشاريعي", "جميع مشاريعك العمرانية وحالة امتثالها."), component: Projects });

function Projects() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("الكل");
  const list = projects.filter((p) => p.name.includes(q) && (f === "الكل" || p.city === f));
  return (
    <AppShell>
      <PageHeader title="مشاريعي" desc="كل المشاريع مع نتائج التقييم التنظيمي." actions={<Button asChild><Link to="/new-project"><Plus className="h-4 w-4" /> مشروع جديد</Link></Button>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="ابحث باسم المشروع…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs bg-card" />
        {["الكل", "الرياض", "جدة", "الدمام"].map((c) => <Button key={c} size="sm" variant={f === c ? "default" : "outline"} onClick={() => setF(c)}>{c}</Button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} to="/regulations" className="panel group p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <div className="blueprint mb-4 flex h-28 items-end gap-1 rounded-lg bg-secondary/50 p-3">
              {[40, 70, 55, 85, 60].map((h, i) => <div key={i} className="flex-1 rounded-t bg-sand/70 transition-all group-hover:bg-olive/60" style={{ height: `${h}%` }} />)}
            </div>
            <div className="flex items-start justify-between gap-2"><div><div className="font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.id} · {p.type}</div></div><Pill tone={p.tone}>{p.compliance}%</Pill></div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{p.status}</span><span>{p.conflicts} تعارض</span></div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
