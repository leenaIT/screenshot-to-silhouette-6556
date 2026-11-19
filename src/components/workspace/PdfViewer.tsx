import { lazy, Suspense, useState, useRef, useEffect } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { sources, type SourceReference } from '@/lib/workspace-data';
const PdfCanvas = lazy(() => import('./PdfCanvas'));
export function PdfViewer({ reference, onClose }: { reference: SourceReference | null; onClose: () => void }) {
  const source = sources.find(s => s.id === reference?.documentId);
  return <Dialog open={!!source} onOpenChange={open => { if (!open) onClose(); }}>
    {source && reference && <ViewerContent key={`${source.id}-${reference.page}`} source={source} reference={reference} />}
  </Dialog>;
}
function ViewerContent({ source, reference }: { source: typeof sources[number]; reference: SourceReference }) {
  const [page, setPage] = useState(reference.page), [pages, setPages] = useState(source.pages), [zoom, setZoom] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const sync = () => {
      if (document.fullscreenElement === element) {
        element.style.setProperty('translate', 'none', 'important');
        element.style.setProperty('inset', '0', 'important');
        element.style.setProperty('height', '100dvh', 'important');
        element.style.setProperty('max-width', 'none', 'important');
      } else {
        for (const property of ['translate', 'inset', 'height', 'max-width']) element.style.removeProperty(property);
      }
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const fullscreen = async () => { if (!ref.current) return; if (document.fullscreenElement) await document.exitFullscreen(); else await ref.current.requestFullscreen(); };
  return <DialogContent ref={ref} dir="rtl" className="glass flex h-[90dvh] max-w-[94vw] flex-col gap-0 overflow-hidden border-ivory/10 bg-forest p-0 text-ivory sm:max-w-[94vw] fullscreen:top-0 fullscreen:left-0 fullscreen:h-dvh fullscreen:max-w-none fullscreen:translate-x-0 fullscreen:translate-y-0 fullscreen:rounded-none">
    <header className="border-b border-ivory/10 p-4 pr-12"><DialogTitle className="text-sm leading-relaxed">{source.title}</DialogTitle><DialogDescription className="text-xs text-ivory/60">{source.authority} · صفحة PDF {page}{reference.clause ? ` · ${reference.clause}` : ''}</DialogDescription></header>
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-ivory/10 p-2">
      <Button variant="ghost" size="icon" title="الصفحة السابقة" aria-label="الصفحة السابقة" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronRight /></Button>
      <span className="text-xs" dir="ltr">{page} / {pages}</span>
      <Button variant="ghost" size="icon" title="الصفحة التالية" aria-label="الصفحة التالية" disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronLeft /></Button>
      <Button variant="ghost" size="icon" title="تصغير" aria-label="تصغير PDF" disabled={zoom <= .5} onClick={() => setZoom(z => z - .25)}><ZoomOut /></Button>
      <span className="w-12 text-center text-xs">{Math.round(zoom * 100)}%</span>
      <Button variant="ghost" size="icon" title="تكبير" aria-label="تكبير PDF" disabled={zoom >= 2.5} onClick={() => setZoom(z => z + .25)}><ZoomIn /></Button>
      <Button variant="ghost" size="icon" title="ملء الشاشة" aria-label="ملء شاشة PDF" onClick={() => { void fullscreen().catch(() => {}); }}><Maximize2 /></Button>
      <Button variant="ghost" size="icon" asChild><a href={`${source.url}#page=${page}`} target="_blank" rel="noreferrer" title="فتح الملف الأصلي" aria-label="فتح الملف الأصلي"><ExternalLink /></a></Button>
    </div>
    <div className="min-h-0 flex-1 overflow-auto p-3" dir="ltr"><div className="flex min-w-fit justify-center"><ClientOnly fallback={<p>جارٍ تحميل المستند…</p>}><Suspense fallback={<p>جارٍ تحميل المستند…</p>}><PdfCanvas url={source.url} page={page} zoom={zoom} onLoad={setPages} /></Suspense></ClientOnly></div></div>
    {reference.excerpt && <p className="max-h-24 overflow-auto border-t border-ivory/10 p-3 text-xs leading-relaxed">{reference.excerpt}</p>}
  </DialogContent>;
}