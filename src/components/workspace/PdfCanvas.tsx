import { Document, Page, pdfjs } from 'react-pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
export default function PdfCanvas({ url, page, zoom, onLoad }: { url: string; page: number; zoom: number; onLoad: (pages: number) => void }) {
  return <Document file={url} onLoadSuccess={({ numPages }) => onLoad(numPages)} loading={<p className="p-6 text-ivory">جارٍ تحميل المستند…</p>} error={<p className="p-6 text-warn">تعذر تحميل المستند. حاول فتح الملف الأصلي.</p>}>
    <Page pageNumber={page} width={650 * zoom} renderTextLayer={false} renderAnnotationLayer={false} loading={<p className="p-6">جارٍ تحميل الصفحة…</p>} />
  </Document>;
}