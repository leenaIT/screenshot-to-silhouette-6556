import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { conversation, regulations, sources, matchScenario, shouldStartReview, type SourceReference } from '@/lib/workspace-data';
import { ConflictCard } from './ConflictCard';
type Message = { from: 'user' | 'ai'; text: string; scenario?: string | undefined };
export function Assistant({ active, selectionId, onOpen3D, onRetrieve, onSource }: { active: boolean; selectionId: string | null; onOpen3D: () => void; onRetrieve: () => void; onSource: (s: SourceReference) => void }) {
  const [messages, setMessages] = useState<Message[]>([{ from: 'ai', text: conversation.welcome }]);
  const [query, setQuery] = useState(''), [busy, setBusy] = useState(false), [step, setStep] = useState<string | null>(null);
  const scroll = useRef<HTMLDivElement>(null), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reviewed = useRef<string | null>(null), retrieve = useRef(onRetrieve);
  retrieve.current = onRetrieve;
  useEffect(() => {
    if (!active || !shouldStartReview(selectionId, reviewed.current)) return;
    reviewed.current = selectionId;
    setBusy(true);
    let index = 0;
    const advance = () => {
      const current = conversation.steps[index++];
      if (current) {
        setMessages(m => [...m, { from: 'ai', text: current }]);
        setStep(current);
        timer.current = setTimeout(advance, 500);
      } else {
        setBusy(false); setStep(null);
        setMessages(m => [...m,
          { from: 'ai', text: conversation.scenarios.find(s => s.id === 'regulations')?.response ?? '', scenario: 'regulations' },
          { from: 'ai', text: 'الارتفاع بالمتر والارتدادات الرقمية غير متاحين. يلزم استكمال أبعاد الشوارع وتفسير نطاق المصادر لدى مختص. نموذج توضيحي — غير معتمد هندسيًا.' },
          { from: 'ai', text: conversation.scenarios.find(s => s.id === 'conflicts')?.response ?? '', scenario: 'conflicts' },
        ]);
        retrieve.current();
      }
    };
    advance();
  }, [active, selectionId]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; }, [messages, busy, step]);
  const send = (text: string) => {
    if (!text.trim() || busy || !active) return;
    const scenario = matchScenario(text);
    setMessages(m => [...m, { from: 'user', text: text.trim() }]); setQuery(''); setBusy(true);
    const finish = () => {
      setBusy(false); setStep(null);
      setMessages(m => [...m, { from: 'ai', text: scenario?.response ?? conversation.fallback, scenario: scenario?.id }]);
      if (scenario?.id === 'regulations') onRetrieve();
      if (scenario?.id === '3d') onOpen3D();
    };
    if (scenario?.id === 'regulations') {
      let index = 0;
      const advance = () => { const current = conversation.steps[index++]; if (!current) { finish(); return; } setStep(current); timer.current = setTimeout(advance, 450); };
      advance();
    } else timer.current = setTimeout(finish, 650);
  };
  return <section className="glass flex min-h-0 flex-1 flex-col rounded-2xl" aria-label="المساعد الذكي">
    <div className="flex shrink-0 items-center gap-2 border-b border-ivory/10 px-4 py-2.5 text-sm font-semibold"><Sparkles className="h-4 w-4 text-sand" />المساعد الذكي<span className="ms-auto text-[10px] font-normal text-ivory/50">محاكاة</span></div>
    <div ref={scroll} role="log" aria-live="polite" className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 text-[13px] leading-relaxed">
      {messages.map((message, index) => <div key={index} className={cn('max-w-[95%] whitespace-pre-line break-words rounded-xl px-3 py-2', message.from === 'user' ? 'ms-auto bg-olive/35' : 'border border-ivory/10 bg-ivory/8')}>
        {message.text}
        {message.scenario === 'regulations' && <dl className="mt-2 space-y-2">{regulations.requirements.map(req => <div key={req.id} className="border-t border-ivory/10 pt-2"><dt className="text-ivory/55">{req.title}</dt><dd className="font-semibold">{req.value}</dd><SourceLink reference={req.source} onSource={onSource} /></div>)}</dl>}
        {message.scenario === 'conflicts' && <div className="mt-3 space-y-3">{regulations.conflicts.map(c => <ConflictCard key={c.id} conflict={c} onSource={onSource} />)}</div>}
        {message.scenario === 'sources' && sources.map(source => <div key={source.id} className="mt-2"><div className="text-xs">{source.title}</div><SourceLink reference={{ documentId: source.id, page: source.id === 'residential' ? 18 : 1 }} onSource={onSource} /></div>)}
        {message.scenario === 'setbacks' && <SourceLink reference={{ documentId: 'residential', page: 18, clause: '4-1، البندان 4 و5' }} onSource={onSource} />}
      </div>)}
      {busy && <div role="status" className="flex items-center gap-2 p-2 text-xs text-sand"><Loader2 className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" />{step ?? conversation.typing}</div>}
    </div>
    <details className="shrink-0 px-3 pb-2 text-[11px] text-ivory/65"><summary className="cursor-pointer">أسئلة متابعة</summary><div className="flex flex-wrap gap-1.5 pt-2">{conversation.scenarios.map(s => <Button key={s.id} variant="ghost" disabled={!active || busy} onClick={() => send(s.question)} className="h-auto max-w-full whitespace-normal rounded-full border border-ivory/15 px-2.5 py-0.5 text-[11px] hover:border-sand hover:bg-transparent hover:text-sand">{s.question}</Button>)}</div></details>
    <form onSubmit={event => { event.preventDefault(); send(query); }} className="flex shrink-0 gap-2 border-t border-ivory/10 p-2">
      <input aria-label="رسالتك للمساعد" disabled={!active || busy} value={query} onChange={e => setQuery(e.target.value)} placeholder={active ? 'اسأل عن الاشتراطات…' : 'اختر الأرض أولًا…'} className="min-w-0 flex-1 rounded-lg bg-ivory/10 px-3 py-1.5 text-sm placeholder:text-ivory/40 focus:outline-none focus:ring-1 focus:ring-olive" />
      <Button type="submit" disabled={!active || busy || !query.trim()} className="h-auto bg-olive px-3 hover:bg-olive/80" aria-label="إرسال"><Send /></Button>
    </form>
  </section>;
}
function SourceLink({ reference, onSource }: { reference: SourceReference; onSource: (s: SourceReference) => void }) {
  return <Button variant="ghost" size="sm" className="mt-1 h-auto p-0 text-xs text-sand hover:bg-transparent" onClick={() => onSource(reference)}><FileText />عرض المصدر · PDF {reference.page}</Button>;
}