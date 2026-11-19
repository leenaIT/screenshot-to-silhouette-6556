import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, MapPin, TriangleAlert, Clock3, Wallet, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const steps = [
  { title: 'اختر أرضك', description: 'حدّد قطعتك من الخريطة بالحي أو رقم المخطط أو رقم القطعة.' },
  { title: 'اعرف اشتراطاتها', description: 'الارتدادات والارتفاع ونسبة التغطية ومعامل البناء مع مصدر كل بند.' },
  { title: 'شاهد الحجم المسموح', description: 'نموذج ثلاثي الأبعاد يوضح أقصى ما يمكنك بناؤه على أرضك عند توفر القيم الموثقة.' },
  { title: 'صمّم وراجِع', description: 'ارفع مخططك للتدقيق أو ولّد مخططًا مبدئيًا، ثم أرسله للمراجعة الهندسية.' },
];
const benefits = [
  { icon: Clock3, title: 'وقت أقل في إعادة التصميم', before: 'أسابيع من التعديلات', after: 'دقائق', description: 'تبدأ من الاشتراطات الصحيحة بدل اكتشافها بعد رفض المخطط.' },
  { icon: Wallet, title: 'تكلفة أقل', before: 'تعديلات متكررة وغرامات', after: 'تكلفة أقل من البداية', description: 'تجنّب تعديلات المكاتب الهندسية المتكررة وغرامات المخالفات.' },
  { icon: ShieldAlert, title: 'اكتشاف مبكر للمخالفات', before: 'تُكتشف بعد رفض المخطط', after: 'تُكتشف قبل التقديم', description: 'تقرير مطابقة يوضح كل مخالفة ومصدرها والتعديل المقترح.' },
];

function StepVisual({ step }: { step: number }) {
  if (step === 0) return <div className="explorer-map h-full w-full" aria-label="خريطة توضيحية مع حدود قطعة أرض">
    <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs><pattern id="aerial-blocks" width="100" height="100" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse"><rect width="100" height="100" className="map-road" /><rect x="10" y="10" width="80" height="80" className="map-block" /><path d="M17 18h29v28H17z M53 19h28v31H53z M20 55h24v28H20z M53 59h27v23H53z" className="map-roof" /><path d="M14 49h70M48 14v72" className="map-path" /></pattern></defs>
      <rect width="600" height="420" fill="url(#aerial-blocks)" />
      <path d="M0 318L600 108" className="map-avenue" />
      <path d="M239 166L338 134L365 213L266 246Z" className="map-plot" pathLength="1" />
    </svg>
    <MapPin className="explorer-pin absolute left-[calc(50%-24px)] top-[calc(45%-48px)] h-12 w-12 text-primary" />
    <span className="absolute bottom-6 right-6 rounded-md bg-background/95 px-3 py-2 text-xs text-primary">قطعة الأرض · عرض توضيحي</span>
  </div>;
  if (step === 1) return <div className="flex h-full flex-col justify-center px-6 sm:px-10">
    <p className="mb-6 text-xs text-muted-foreground">اشتراطات الأرض · عرض توضيحي</p>
    {['الارتدادات', 'الارتفاع', 'نسبة التغطية', 'معامل البناء'].map((label, i) => <div key={label} className="regulation-preview flex items-center gap-3 border-b border-border py-4" style={{ animationDelay: `${i * 220}ms` }}><Check className="h-4 w-4 shrink-0 text-primary" /><span className="flex-1 text-sm font-semibold">{label}</span><span className="text-xs text-muted-foreground">{i === 2 ? '70% / 75%' : 'غير متاح'}</span></div>)}
    <p className="mt-5 text-[11px] leading-6 text-muted-foreground">نسبة التغطية تختلف بين المصدرين وتحتاج مراجعة مختص؛ باقي القيم غير موثقة في العرض.</p>
  </div>;
  if (step === 2) return <div className="flex h-full items-center justify-center overflow-hidden" aria-label="كتلة بناء مجسمة توضيحية">
    <div className="mass-orbit"><div className="mass-plot"><div className="mass-building"><div className="mass-top" /><div className="mass-front" /><div className="mass-side" /></div></div></div>
    <p className="absolute inset-x-4 bottom-6 text-center text-xs text-muted-foreground">تصور معماري توضيحي — غير معتمد هندسيًا</p>
  </div>;
  return <div className="relative flex h-full flex-col items-center justify-center px-8" aria-label="مخطط توضيحي يجري مسحه للتدقيق">
    <div className="floor-preview relative w-full max-w-80"><svg viewBox="0 0 320 240" className="w-full text-primary" aria-hidden="true"><path d="M20 20H300V220H20Z M135 20V110H300 M20 150H135V220 M135 110V150 M210 110V220 M135 150H170" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M135 110a40 40 0 0 0 40-40M210 165a30 30 0 0 1 30 30 M50 50h55v60H50zM240 35h40v55h-40zM40 175h65v25H40z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg><div className="floor-scan" /></div>
    <span className="audit-badge mt-5 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"><Check className="h-4 w-4" />تم التدقيق</span>
    <p className="absolute bottom-5 text-[11px] text-muted-foreground">عرض توضيحي — يتطلب مراجعة هندسية</p>
  </div>;
}

export function StepExplorer() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => setActive(s => (s + 1) % steps.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);
  useEffect(() => {
    const parent = tabs.current;
    const selected = parent?.children[active];
    if (parent && selected instanceof HTMLElement && window.innerWidth < 768) parent.scrollTo({ left: selected.offsetLeft - parent.offsetLeft - (parent.clientWidth - selected.clientWidth) / 2, behavior: reduced ? 'instant' : 'smooth' });
  }, [active, reduced]);
  const choose = (i: number) => { setActive(i); setPaused(true); };
  return <motion.div initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : .35 }} className="step-explorer mt-10 grid items-center gap-8 md:grid-cols-2 md:gap-12">
    <div ref={tabs} role="tablist" aria-label="خطوات بنيان" className="explorer-tabs relative flex gap-5 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible">
      {steps.map((step, i) => <Button key={step.title} id={`step-tab-${i}`} role="tab" aria-selected={active === i} aria-controls="step-preview" variant="ghost" onMouseEnter={() => choose(i)} onFocus={() => choose(i)} onClick={() => choose(i)} onKeyDown={e => { if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const next = (i + (['ArrowDown', 'ArrowLeft'].includes(e.key) ? 1 : -1) + 4) % 4; choose(next); const node = tabs.current?.children[next]; if (node instanceof HTMLElement) node.focus(); } }} className={cn('explorer-step relative h-auto w-64 shrink-0 justify-start gap-5 rounded-none px-0 py-5 text-right whitespace-normal hover:bg-transparent md:w-full', active === i ? 'text-primary' : 'text-muted-foreground')}>
        <span className="step-track absolute inset-x-0 bottom-0 h-px bg-border md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-px">{active === i && <span key={`${active}:${paused}`} className={cn('step-progress absolute inset-0 bg-primary', !paused && !reduced && 'is-playing')} />}</span>
        <span className="w-12 shrink-0 text-4xl font-medium md:mr-5">{String(i + 1).padStart(2, '0')}</span><span className="min-w-0"><span className="block text-base font-semibold md:text-lg">{step.title}</span><span className={cn('mt-2 block text-xs font-normal leading-6 md:text-sm', active !== i && 'line-clamp-1 opacity-65')}>{step.description}</span></span>
      </Button>)}
    </div>
    <div id="step-preview" role="tabpanel" aria-labelledby={`step-tab-${active}`} className="explorer-stage relative order-first h-[350px] overflow-hidden rounded-xl border border-border bg-secondary/50 md:order-none md:h-[420px]">
      <AnimatePresence initial={false}><motion.div key={active} initial={{ opacity: 0, x: reduced ? 0 : 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -14 }} transition={{ duration: reduced ? 0 : .35 }} className="absolute inset-0"><StepVisual step={active} /></motion.div></AnimatePresence>
    </div>
  </motion.div>;
}

export function BenefitComparison() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const touched = useRef(false);
  return <motion.div initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduced ? 0 : .35 }} className="mt-10">
    <AutoCompare onSwitch={() => { if (!touched.current) setEnabled(true); }} />
    <div className="mb-7 inline-flex border-b border-border" role="group" aria-label="مقارنة بنيان">{[false, true].map(value => <Button key={String(value)} variant="ghost" aria-pressed={enabled === value} onClick={() => { touched.current = true; setEnabled(value); }} className={cn('h-12 rounded-none border-b-2 px-6 text-sm', enabled === value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground')}>{value ? 'مع بنيان' : 'بدون بنيان'}</Button>)}</div>
    <div data-comparison={enabled ? 'with' : 'without'}>{benefits.map(benefit => <article key={benefit.title} className={cn('comparison-row group relative grid items-center gap-4 border-b border-border px-4 py-7 sm:grid-cols-[48px_1fr_1fr] sm:gap-6 sm:py-9', enabled ? 'text-primary' : 'text-muted-foreground')}>
      <div className="flex items-center gap-3 sm:block"><benefit.icon className="comparison-icon h-7 w-7" /><span className="sm:hidden text-base font-semibold">{benefit.title}</span></div>
      <div><h3 className="hidden text-lg font-semibold sm:block">{benefit.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{benefit.description}</p></div>
      <div className="flex min-h-14 items-center gap-3 overflow-hidden"><span className="shrink-0">{enabled ? <Check className="h-5 w-5" /> : <TriangleAlert className="h-5 w-5" />}</span><AnimatePresence mode="wait" initial={false}><motion.p key={String(enabled)} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -12 }} transition={{ duration: reduced ? 0 : .18 }} className="text-lg font-semibold leading-8 md:text-xl">{enabled ? benefit.after : benefit.before}</motion.p></AnimatePresence></div>
    </article>)}</div>
  </motion.div>;
}

function AutoCompare({ onSwitch }: { onSwitch: () => void }) {
  const element = useRef<HTMLSpanElement>(null);
  const callback = useRef(onSwitch);
  callback.current = onSwitch;
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); timer = setTimeout(() => callback.current(), 1000); } }, { threshold: 1 });
    observer.observe(node);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);
  return <span ref={element} aria-hidden="true" className="block h-px" />;
}