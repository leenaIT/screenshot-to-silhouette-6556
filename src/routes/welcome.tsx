import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { StepExplorer, BenefitComparison } from '@/components/workspace/WelcomeExplorers';
import { Logo } from '@/components/brand';
import { Button } from '@/components/ui/button';
import villa from '@/assets/bunyan-najdi-villa.png.asset.json';

export const Route = createFileRoute('/welcome')({
  head: () => ({ meta: [
    { title: 'بنيان | من أرضك إلى مشروع متوافق' },
    { name: 'description', content: 'ابدأ مشروعك في الرياض بفهم اشتراطات أرضك ومصادرها، وتصور البناء ومراجعة المخطط مع بنيان.' },
    { property: 'og:title', content: 'بنيان | من أرضك إلى مشروع متوافق' },
    { property: 'og:description', content: 'أربع خطوات لاختيار الأرض وفهم الاشتراطات وتصور البناء ومراجعة التصميم.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    ...(villa.url.startsWith('https://') ? [{ property: 'og:image', content: villa.url }, { name: 'twitter:image', content: villa.url }] : []),
  ] }),
  component: WelcomePage,
});

function WelcomePage() {
  return <div dir="rtl" className="welcome-page bg-background text-foreground">
    <header className="mx-auto flex max-w-7xl items-center px-5 py-6 md:px-10"><Logo /></header>
    <main>
      <section className="welcome-hero relative isolate overflow-hidden">
        <img src={villa.url} alt="فيلا سعودية حديثة بطابع نجدي، تحيط بها أشجار النخيل وأفق الرياض عند الغروب" className="absolute inset-0 -z-20 h-full w-full object-cover object-left" />
        <div className="welcome-hero-shade absolute inset-0 -z-10" />
        <div className="mx-auto flex h-full max-w-7xl items-center px-5 py-12 md:px-10">
          <div className="max-w-xl text-ivory">
            <span className="inline-flex rounded-full border border-ivory/30 bg-forest/60 px-4 py-1.5 text-xs">الاشتراطات العمرانية لمدينة الرياض</span>
            <h1 className="mt-6 text-3xl font-bold leading-[1.55] md:text-5xl">صمّم مشروعك متوافقًا مع <span className="welcome-highlight text-sand">الاشتراطات العمرانية</span> من أول خطوة</h1>
            <p className="mt-6 max-w-lg text-sm leading-8 text-ivory/85 md:text-base">بنيان يقرأ أرضك ويستخرج الاشتراطات المنطبقة عليها، ويرسم لك الحجم المسموح بالبناء، ثم يدقق مخططك أو يقترح مخططًا مبدئيًا متوافقًا.</p>
            <Button asChild size="lg" className="mt-8 gap-3 bg-olive px-7 text-ivory hover:bg-olive/85"><Link to="/">ابدأ الآن<ArrowLeft className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>
      <section aria-labelledby="steps-heading" className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <p className="text-sm font-semibold text-olive">كيف يعمل بنيان</p>
        <h2 id="steps-heading" className="mt-3 text-2xl font-bold leading-relaxed text-primary md:text-3xl">أربع خطوات من الأرض إلى المخطط المعتمد</h2>
        <p className="mt-3 text-xs text-muted-foreground">عرض تجريبي — الاعتماد لدى الجهات المختصة، والمخططات تتطلب مراجعة هندسية.</p>
        <StepExplorer />
      </section>
      <section aria-labelledby="benefits-heading" className="border-t bg-secondary/35">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
          <p className="text-sm font-semibold text-olive">لماذا بنيان</p><h2 id="benefits-heading" className="mt-3 max-w-2xl text-2xl font-bold leading-relaxed text-primary md:text-3xl">قرار البناء الصحيح يبدأ قبل أول خط في المخطط</h2>
          <BenefitComparison />
        </div>
      </section>
    </main>
    <footer className="border-t px-5 py-6 text-center text-xs leading-6 text-muted-foreground">بنيان — تصور معماري توضيحي غير معتمد هندسيًا، ولا يُعد تصريحًا للبناء.</footer>
  </div>;
}