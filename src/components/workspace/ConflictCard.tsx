import { useState } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sources, type RegulatoryConflict, type SourceReference } from '@/lib/workspace-data';
export function ConflictCard({ conflict, onSource }: { conflict: RegulatoryConflict; onSource: (source: SourceReference) => void }) {
  const [referred, setReferred] = useState(false);
  return <article className="rounded-lg border border-warn/35 bg-warn/10 p-3 text-xs leading-relaxed">
    <h3 className="mb-2 flex gap-2 font-semibold text-warn"><AlertTriangle className="h-4 w-4 shrink-0" />{conflict.title}</h3>
    {[conflict.first, conflict.second].map((item, index) => { const document = sources.find(s => s.id === item.source.documentId); return <div key={index} className="border-b border-ivory/10 py-2">
      <div className="font-semibold">{item.value}</div><div className="text-ivory/60">{document?.title} · صفحة PDF {item.source.page}</div>
      <Button variant="ghost" size="sm" className="mt-1 h-auto p-1 text-sand" onClick={() => onSource(item.source)}><FileText />{index === 0 ? 'عرض المصدر الأول' : 'عرض المصدر الثاني'}</Button>
    </div>; })}
    <p className="mt-2">{conflict.explanation}</p><p className="mt-2 text-ivory/65">أثره على المشروع: {conflict.impact}</p>
    <p className="mt-2 font-semibold text-warn">{conflict.status}</p>
    <Button size="sm" className="mt-2 h-auto w-full whitespace-normal bg-olive py-2" disabled={referred} onClick={() => setReferred(true)}>{referred ? 'تم تسجيل طلب الإحالة (محاكاة)' : 'إحالة التعارض إلى مختص'}</Button>
  </article>;
}