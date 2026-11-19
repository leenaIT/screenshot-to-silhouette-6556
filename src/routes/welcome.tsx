import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, ScrollText, Box, FileCheck2, Clock3, Wallet, ShieldAlert, ArrowLeft } from 'lucide-react';
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

const steps = [
  { icon: MapPin, title: 'اختر أرضك', description: 'حدّد قطعتك من الخريطة بالحي أو رقم المخطط أو رقم القطعة.' },
  { icon: ScrollText, title: 'اعرف اشتراطاتها', description: 'الارتدادات والارتفاع ونسبة التغطية ومعامل البناء مع مصدر كل بند.' },
  { icon: Box, title: 'شاهد الحجم المسموح', description: 'نموذج ثلاثي الأبعاد يوضح أقصى ما يمكنك بناؤه على أرضك عند توفر القيم الموثقة.' },
  { icon: FileCheck2, title: 'صمّم وراجِع', description: 'ارفع مخططك للتدقيق أو ولّد مخططًا مبدئيًا، ثم أرسله للمراجعة الهندسية.' },
];
const benefits = [
  { icon: Clock3, title: 'وقت أقل في إعادة التصميم', description: 'تبدأ من الاشتراطات الصحيحة بدل اكتشافها بعد رفض المخطط.' },
  { icon: Wallet, title: 'تكلفة أقل', description: 'تجنّب تعديلات المكاتب الهندسية المتكررة وغرامات المخالفات.' },
  { icon: ShieldAlert, title: 'اكتشاف مبكر للمخالفات', description: 'تقرير مطابقة يوضح كل مخالفة ومصدرها والتعديل المقترح.' },
];

function WelcomePage() {
  const reduced = useReducedMotion();
  const enter = { hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }, visible: { opacity: 1, y: 0 } };
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
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} transition={{ staggerChildren: reduced ? 0 : .12 }} className="welcome-steps relative mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <motion.div aria-hidden="true" className="welcome-connector" initial={{ scaleX: reduced ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1.2 }} />
          {steps.map((step, index) => <motion.article key={step.title} variants={enter} transition={{ duration: reduced ? 0 : .3, delay: reduced ? 0 : index * .12 }} className="welcome-card group relative rounded-lg border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between"><span className="welcome-icon flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-primary"><step.icon className="h-6 w-6" /></span><span className="welcome-number text-4xl font-bold text-primary/15">{index + 1}</span></div>
            <h3 className="mt-7 text-lg font-semibold text-primary">{step.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
          </motion.article>)}
        </motion.div>
      </section>
      <section aria-labelledby="benefits-heading" className="border-t bg-secondary/35">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
          <p className="text-sm font-semibold text-olive">لماذا بنيان</p><h2 id="benefits-heading" className="mt-3 max-w-2xl text-2xl font-bold leading-relaxed text-primary md:text-3xl">قرار البناء الصحيح يبدأ قبل أول خط في المخطط</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{benefits.map((benefit, index) => <motion.article key={benefit.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={enter} transition={{ duration: reduced ? 0 : .3, delay: reduced ? 0 : index * .12 }} className="welcome-card group rounded-lg border bg-card p-7 shadow-soft"><span className="welcome-icon flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-primary"><benefit.icon className="h-6 w-6" /></span><h3 className="mt-6 text-lg font-semibold text-primary">{benefit.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{benefit.description}</p></motion.article>)}</div>
        </div>
      </section>
    </main>
    <footer className="border-t px-5 py-6 text-center text-xs leading-6 text-muted-foreground">بنيان — تصور معماري توضيحي غير معتمد هندسيًا، ولا يُعد تصريحًا للبناء.</footer>
  </div>;
}