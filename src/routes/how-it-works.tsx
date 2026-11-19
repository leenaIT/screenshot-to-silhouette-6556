import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo, Pill } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { User, MapPin, Library, Filter, Brain, ListChecks, GitCompareArrows, Box, FileCheck2, UserCheck, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({ head: () => seo("كيف يعمل بنيان", "البنية التقنية: استرجاع معزز بالتوليد ومحرك هندسي حتمي ومراجعة مختصين."), component: How });

const flow = [
  { i: User, t: "مدخلات المستخدم", d: "نوع المشروع والمتطلبات", k: "in" },
  { i: MapPin, t: "بيانات الموقع والقطعة", d: "الإحداثيات، الأبعاد، عرض الشارع", k: "in" },
  { i: Library, t: "قاعدة المعرفة التنظيمية", d: "وثائق مفهرسة مع بيانات وصفية", k: "ai" },
  { i: Filter, t: "ترشيح وصفي + بحث دلالي", d: "المدينة، التصنيف، النوع → أقرب المقاطع", k: "ai" },
  { i: Brain, t: "RAG والاستدلال الذكي", d: "تفسير البنود مع الاستشهاد بالمصدر", k: "ai" },
  { i: ListChecks, t: "متطلبات تنظيمية منظمة", d: "قيم رقمية + مرجع + حالة تحقق", k: "ai" },
  { i: GitCompareArrows, t: "كشف التعارضات", d: "مقارنة المصادر دون حسم آلي", k: "ai" },
  { i: Box, t: "المحرك الهندسي ثلاثي الأبعاد", d: "حسابات حتمية للارتدادات والارتفاع والحجم", k: "geo" },
  { i: FileCheck2, t: "تحليل المخطط أو توليد المفهوم", d: "مقارنة أبعاد أو اقتراح بدائل", k: "geo" },
  { i: UserCheck, t: "مراجعة المختص", d: "القرار المهني الموثق", k: "hu" },
];
const tone = { in: "border-sand bg-sand/15", ai: "border-primary/30 bg-primary/5", geo: "border-ok/40 bg-ok-soft/60", hu: "border-warn/40 bg-warn-soft" };

function How() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6"><Logo /><Button asChild><Link to="/new-project">ابدأ مشروعك</Link></Button></header>
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="eyebrow mb-2">البنية التقنية</div>
        <h1 className="text-4xl font-bold text-primary">كيف يعمل بنيان</h1>
        <p className="mt-3 max-w-2xl leading-8 text-muted-foreground">الذكاء الاصطناعي يفسّر الوثائق التنظيمية ويساعد في التحليل، بينما تتولى حسابات هندسية حتمية توليد الحدود المكانية والقيود البعدية. والقرار النهائي للمختص.</p>
        <div className="mt-6 flex flex-wrap gap-2"><Pill className="border-sand bg-sand/15">مدخلات</Pill><Pill tone="ai">ذكاء اصطناعي (تفسير)</Pill><Pill tone="ok">حساب هندسي حتمي</Pill><Pill tone="warn">قرار بشري</Pill></div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ol className="space-y-1">{flow.map((f, i) => (
            <li key={f.t} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={cn("flex items-center gap-4 rounded-xl border p-4", tone[f.k as keyof typeof tone])}>
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span><f.i className="h-5 w-5 text-primary" />
                <div><div className="font-semibold">{f.t}</div><div className="text-xs text-muted-foreground">{f.d}</div></div></div>
              {i < flow.length - 1 && <ArrowDown className="mx-auto my-1 h-4 w-4 text-olive" />}
            </li>))}</ol>
          <aside className="space-y-4">
            <div className="panel p-5"><h3 className="mb-2 font-semibold text-primary">لماذا الفصل بين الذكاء والهندسة؟</h3><p className="text-sm leading-7 text-muted-foreground">النموذج اللغوي ممتاز في قراءة النصوص، لكنه غير مناسب لحساب الأبعاد. لذلك يُخرج قيماً منظمة (ارتداد = 6 م) يستهلكها محرك هندسي حتمي يرسم الغلاف بدقة قابلة للتكرار والاختبار.</p></div>
            <div className="panel p-5 font-mono text-xs leading-6" dir="ltr">{`{ "setback_front": 6.0,\n  "source": "doc:d1#4.2 p17",\n  "status": "extracted" }\n→ computeEnvelope(parcel, setbacks)\n→ 21 × 24 m · 12 m · 6,048 m³`}</div>
            <div className="panel p-5 text-sm text-muted-foreground">في هذا النموذج الأولي، خدمات الاسترجاع والتحليل محاكاة بواجهات قابلة للاستبدال بخدمات حقيقية.</div>
          </aside>
        </div>
      </section>
    </div>
  );
}
