import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Pill, DemoBanner } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { libraryDocs, requirements } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Search, FileText } from "lucide-react";

export const Route = createFileRoute("/library")({ head: () => seo("المكتبة التنظيمية", "ابحث في الوثائق التنظيمية والبنود المستخرجة منها."), component: Library });

function Library() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("الكل");
  const [cur, setCur] = useState("d1");
  const typesList = ["الكل", ...Array.from(new Set(libraryDocs.map((d) => d.type)))];
  const docs = libraryDocs.filter((d) => (type === "الكل" || d.type === type) && (d.title.includes(q) || d.authority.includes(q)));
  const doc = libraryDocs.find((d) => d.id === cur)!;
  const clauses = requirements.filter((r) => r.docId === cur);
  return (
    <AppShell>
      <PageHeader eyebrow="قاعدة المعرفة" title="المكتبة التنظيمية" desc="الوثائق المفهرسة التي يعتمد عليها محرك الاسترجاع، مع البنود المستخرجة منها." />
      <DemoBanner className="mb-5" />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative w-72"><Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="bg-card pr-9" placeholder="ابحث في الوثائق…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {typesList.map((t) => <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)}>{t}</Button>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2">{docs.map((d) => (
          <button key={d.id} onClick={() => setCur(d.id)} className={cn("panel flex w-full gap-3 p-4 text-right", cur === d.id && "border-primary")}>
            <FileText className="h-5 w-5 shrink-0 text-olive" /><div className="flex-1"><div className="font-medium">{d.title} <span className="text-xs text-muted-foreground">(نموذج)</span></div>
              <div className="text-xs text-muted-foreground">{d.authority} · {d.region}</div>
              <div className="mt-2 flex gap-2"><Pill>{d.type}</Pill><Pill tone="ai">{d.clauses} بنداً</Pill></div></div></button>))}</div>
        <div className="panel sticky top-20 h-fit p-5">
          <h2 className="text-lg font-semibold">{doc.title}</h2>
          <div className="mb-4 text-xs text-muted-foreground">{doc.authority} · الإصدار {doc.version} · {doc.date} · {doc.pages} صفحة</div>
          <div className="blueprint mb-4 h-40 rounded-lg border bg-secondary/30 p-4"><div className="space-y-2">{[80, 60, 90, 45, 70].map((w, i) => <div key={i} className="h-2 rounded bg-muted-foreground/15" style={{ width: `${w}%` }} />)}</div></div>
          <h3 className="mb-2 text-sm font-semibold">البنود المستخرجة ({clauses.length})</h3>
          {clauses.length === 0 && <p className="text-sm text-muted-foreground">لم تُستخدم بنود هذه الوثيقة في المشروع الحالي.</p>}
          {clauses.map((c) => <div key={c.id} className="mb-2 rounded-lg border p-3 text-sm"><div className="flex justify-between"><span className="font-medium">{c.clause} — {c.title}</span><span className="text-xs text-muted-foreground">ص {c.page}</span></div><p className="mt-1 text-xs text-muted-foreground">{c.excerpt}</p></div>)}
        </div>
      </div>
    </AppShell>
  );
}
