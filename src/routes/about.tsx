import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, GitCompareArrows, Box, ScanLine, Wand2, PencilRuler, ArrowLeft, Languages, ShieldCheck, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, Pill } from "@/components/brand";
import { Scene3D } from "@/components/Scene3D";
import { Compare } from "@/components/Compare";
import { FloorPlan } from "@/components/FloorPlan";
import { useI18n } from "@/lib/i18n";
import { demoProject as P } from "@/lib/mock-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن بنيان | من أرضك إلى مشروع متوافق مع الاشتراطات العمرانية" },
      { name: "description", content: "بنيان منصة ذكية لفهم الاشتراطات العمرانية في السعودية، وكشف التعارضات، وتحليل المخططات، وتصور الغلاف البنائي ثلاثي الأبعاد." },
      { property: "og:title", content: "عن بنيان | BUNYAN — الامتثال العمراني الذكي" },
      { property: "og:description", content: "من أرضك إلى مشروع متوافق مع الاشتراطات العمرانية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const caps = [
  { icon: Scale, t: "تحديد الاشتراطات العمرانية", d: "استرجاع البنود المطبقة على أرضك مع مصدرها ورقم المادة والصفحة." },
  { icon: GitCompareArrows, t: "كشف التعارضات التنظيمية", d: "عرض المصادر المتعارضة جنباً إلى جنب دون حسمها آلياً." },
  { icon: Box, t: "التصور العمراني ثلاثي الأبعاد", d: "تحويل الارتدادات والارتفاعات إلى غلاف بنائي تفاعلي." },
  { icon: ScanLine, t: "تحليل المخططات الهندسية", d: "مقارنة مخططك بالاشتراطات وتحديد موضع كل مخالفة." },
  { icon: Wand2, t: "اقتراح التعديلات", d: "حلول تصحيحية مبررة نظامياً مع توضيح المفاضلات." },
  { icon: PencilRuler, t: "إنشاء المخططات المبدئية", d: "مفاهيم تصميمية أولية داخل الغلاف المسموح لمراجعة المختص." },
];

function Landing() {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <a href="#caps" className="hover:text-primary">القدرات</a>
          <Link to="/how-it-works" className="hover:text-primary">{t("how")}</Link>
          <Link to="/library" className="hover:text-primary">{t("library")}</Link>
          <Link to="/dashboard" className="hover:text-primary">{t("dashboard")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm"><Languages className="h-4 w-4" />{lang === "ar" ? "EN" : "ع"}</button>
          <Button asChild><Link to="/">{t("workspace")}</Link></Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="rise">
          <Pill tone="ai" className="mb-6">منصة امتثال عمراني مدعومة بالذكاء الاصطناعي · المملكة العربية السعودية</Pill>
          <h1 className="text-4xl font-bold leading-[1.25] text-primary md:text-5xl lg:text-[3.4rem]">{t("heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{t("heroSub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild><Link to="/">{t("workspace")} <ArrowLeft className="h-4 w-4" /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/how-it-works">{t("explore")}</Link></Button>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t pt-6 text-sm">
            <div><div className="text-2xl font-bold text-primary">11</div><div className="text-muted-foreground">متطلباً مستخرجاً</div></div>
            <div><div className="text-2xl font-bold text-warn">2</div><div className="text-muted-foreground">تعارضات مكتشفة</div></div>
            <div><div className="text-2xl font-bold text-primary">480 م²</div><div className="text-muted-foreground">مساحة تغطية مسموحة</div></div>
          </div>
        </div>
        <div className="panel relative h-[460px] overflow-hidden lg:h-[560px]">
          <Scene3D parcel={P.parcel} setbacks={P.setbacks} maxHeight={P.heightB} altHeight={P.heightA}
            building={{ width: 19, depth: 20, floors: 2, floorHeight: 3.5, frontGap: 7, sideGap: 3, annex: true }} autoRotate />
          <div className="pointer-events-none absolute bottom-4 right-4 left-4 flex flex-wrap gap-2 text-xs">
            <Pill tone="ok">الغلاف المسموح</Pill><Pill tone="bad">مناطق الارتداد</Pill><Pill tone="warn">قيد غير محسوم 12–15 م</Pill><Pill>النموذج المقترح</Pill>
          </div>
          <div className="pointer-events-none absolute top-4 right-4 rounded-lg bg-card/90 px-3 py-2 text-xs shadow-sm">
            <div className="font-semibold">فيلا سكنية — حي الملقا، الرياض</div><div className="text-muted-foreground">قطعة 25 × 32 م · 800 م² · تجريبي</div>
          </div>
        </div>
      </section>

      <section id="caps" className="border-y bg-card/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="eyebrow mb-2">القدرات</div>
          <h2 className="mb-10 text-3xl font-bold text-primary">ست قدرات في رحلة واحدة متصلة</h2>
          <div className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3">
            {caps.map((c, i) => (
              <div key={c.t} className="group bg-card p-7 transition-colors hover:bg-ivory">
                <div className="mb-5 flex items-center justify-between">
                  <c.icon className="h-6 w-6 text-olive transition-transform group-hover:-translate-y-0.5" />
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{c.t}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <div className="eyebrow mb-2">قبل وبعد</div>
          <h2 className="text-3xl font-bold text-primary">من مخطط مخالف إلى مقترح متوافق</h2>
          <p className="mt-4 leading-8 text-muted-foreground">اسحب المؤشر لترى كيف يعيد بنيان ترتيب كتلة المجلس خلف خط الارتداد الأمامي، ويزيل الملحق الذي يرفع نسبة التغطية فوق 60%.</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-bad" />الارتداد الأمامي الحالي 4.8 م مقابل 6 م مطلوبة</li>
            <li className="flex gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-ok" />المقترح: إزاحة المجلس 1.4 م للداخل</li>
            <li className="flex gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-warn" />مقترحات أولية تتطلب مراجعة مهندس مرخص</li>
          </ul>
          <Button variant="outline" className="mt-8" asChild><Link to="/corrections">استكشف مساحة التعديلات</Link></Button>
        </div>
        <Compare before={<div className="bg-card p-6"><FloorPlan variant="original" highlight="front" /></div>} after={<div className="bg-card p-6"><FloorPlan variant="corrected" /></div>} labels={["المخطط الأصلي", "المقترح المعدل"]} />
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-7 w-7 text-sand" />
            <div>
              <h3 className="text-xl font-semibold">شفافية قبل كل شيء</h3>
              <p className="mt-1 max-w-2xl text-sm opacity-80">بنيان أداة مساعدة لا تصدر رخص بناء رسمية. كل نتيجة مرتبطة بمصدرها، وكل تعارض يُحال لمختص، وكل مقترح يوسم بأنه أولي.</p>
            </div>
          </div>
          <Button size="lg" variant="secondary" asChild><Link to="/dashboard">جرّب المشروع التجريبي</Link></Button>
        </div>
      </section>

      <section className="border-t bg-forest py-16 text-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
          <div className="flex items-start gap-4">
            <MapIcon className="mt-1 h-7 w-7 text-sand" />
            <div>
              <h3 className="text-xl font-semibold">الخريطة هي مساحة عملك</h3>
              <p className="mt-1 max-w-2xl text-sm opacity-80">افتح مساحة العمل الخرائطية: قطعة الأرض على الخريطة، والاشتراطات طبقات قابلة للإظهار، والغلاف البنائي ثلاثي الأبعاد، والمساعد الذكي، ورفع المخطط — في شاشة واحدة.</p>
            </div>
          </div>
          <Button size="lg" asChild><Link to="/">ادخل مساحة العمل <ArrowLeft className="h-4 w-4" /></Link></Button>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl justify-between px-6 py-8 text-xs text-muted-foreground"><span>© 2026 بنيان — نموذج أولي</span><span>جميع البيانات المعروضة تجريبية</span></footer>
    </div>
  );
}
