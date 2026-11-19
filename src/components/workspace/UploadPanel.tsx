import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Upload, FileText, Loader2, Eye, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FloorPlan } from '@/components/FloorPlan';
export function UploadPanel({ active }: { active: boolean }) {
  const [name, setName] = useState<string | null>(null), [file, setFile] = useState<File | null>(null), [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle'), [viewing, setViewing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!file) { setUrl(null); return; } const objectUrl = URL.createObjectURL(file); setUrl(objectUrl); return () => URL.revokeObjectURL(objectUrl); }, [file]);
  useEffect(() => { if (state !== 'busy') return; const timer = setTimeout(() => setState('done'), 2200); return () => clearTimeout(timer); }, [state]);
  const start = (selected: File | null) => { if (!active) return; setFile(selected); setName(selected?.name ?? 'مخطط-تجريبي-فيلا.pdf'); setState('busy'); };
  return <section className="glass shrink-0 rounded-2xl p-3">
    <div className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold"><span>تحليل المخطط الهندسي</span><span className="text-[10px] font-normal text-ivory/50">PDF · PNG · JPG · DWG (قريبًا)</span></div>
    <input ref={input} type="file" aria-label="رفع المخطط" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={e => { const selected = e.target.files?.[0]; if (selected) start(selected); }} />
    {state === 'idle' ? <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const selected = e.dataTransfer.files[0]; if (selected) start(selected); }} className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-ivory/25 p-3 text-xs text-ivory/70">
      <Button variant="ghost" disabled={!active} className="h-auto flex-1 whitespace-normal p-0 text-xs hover:bg-transparent hover:text-sand" onClick={() => input.current?.click()}><Upload className="text-sand" />اسحب الملف هنا أو اضغط للرفع</Button>
      <Button size="sm" variant="ghost" disabled={!active} onClick={() => start(null)} className="h-auto bg-ivory/10 px-2 py-1 text-xs hover:bg-ivory/20">مخطط تجريبي</Button>
    </div> : <div className="space-y-2 text-xs">
      <div className="flex gap-2 rounded-lg bg-ivory/5 p-2"><FileText className="h-4 w-4 shrink-0 text-sand" /><span className="min-w-0 flex-1 truncate">{name}</span><Button variant="ghost" className="h-auto p-0 text-xs text-ivory/50" onClick={() => { setState('idle'); setFile(null); if (input.current) input.current.value = ''; }}>تغيير</Button></div>
      {state === 'busy' ? <div role="status" className="flex gap-2 text-sand"><Loader2 className="h-4 w-4 animate-spin" />جاري عرض التحليل التجريبي…</div> : <>
        <div className="text-ivory/60">سيناريو مستقل للتوضيح، وليس تقييمًا للقطعة 725 أو للملف المرفوع.</div>
        <div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-bad/20 p-1.5"><div className="text-base font-bold text-bad">2</div>مخالفات تجريبية</div><div className="rounded-lg bg-ok/20 p-1.5"><div className="text-base font-bold text-ok">8</div><CheckCircle2 className="inline h-3 w-3" /> متوافق</div><div className="rounded-lg bg-warn/20 p-1.5"><div className="text-base font-bold text-warn">1</div>مراجعة</div></div>
        <Button variant="ghost" size="sm" className="h-auto w-full text-sand" onClick={() => setViewing(true)}><Eye />{file ? 'عرض الملف المرفوع' : 'عرض المخطط التجريبي'}</Button>
        <Button asChild className="h-auto w-full bg-olive py-1.5 text-xs"><Link to="/plan-analysis">عرض تفاصيل التحليل التجريبي<ArrowLeft /></Link></Button>
        <div className="flex justify-between gap-2 text-[11px]"><Link to="/corrections" className="text-sand">التعديلات والمقارنة</Link><Link to="/design-generator" className="text-sand">توليد مخطط مبدئي</Link></div>
      </>}
    </div>}
    <Dialog open={viewing} onOpenChange={setViewing}><DialogContent className="glass flex h-[85dvh] max-w-[94vw] flex-col overflow-hidden bg-forest p-4 text-ivory sm:max-w-[94vw]"><DialogTitle className="pr-8 text-sm">{name}</DialogTitle><div className="min-h-0 flex-1 overflow-auto">
      {file && url ? file.type.startsWith('image/') ? <img src={url} alt={name ?? 'المخطط المرفوع'} className="h-full w-full object-contain" /> : file.type === 'application/pdf' ? <iframe src={url} title="المخطط المرفوع" className="h-full w-full" /> : <p className="p-4 text-warn">معاينة هذا النوع غير متاحة؛ DWG تكامل مستقبلي.</p> : <FloorPlan highlight="front" />}
    </div></DialogContent></Dialog>
  </section>;
}