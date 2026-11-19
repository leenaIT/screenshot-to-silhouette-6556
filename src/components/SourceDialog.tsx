import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Requirement } from "@/lib/mock-data";
import { DemoBanner, Pill, statusMeta } from "./brand";

export function SourceButton({ req, size = "sm" }: { req: Requirement; size?: "sm" | "default" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size={size} onClick={() => setOpen(true)}><FileText className="h-4 w-4" /> عرض المصدر</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">{req.doc}</DialogTitle>
            <DialogDescription className="text-right">{req.authority} · {req.version} · سريان {req.effective}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="blueprint max-h-[60vh] overflow-auto rounded-lg border bg-card p-6 text-sm leading-7">
              <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground"><span>صفحة {req.page}</span><span>{req.clause}</span></div>
              <p className="text-muted-foreground">… تُطبق أحكام هذا الفصل على قطع الأراضي السكنية الواقعة ضمن النطاق العمراني المعتمد، مع مراعاة ما يصدر من تعاميم لاحقة …</p>
              <p className="my-3 rounded-md border-r-4 border-warn bg-warn-soft px-3 py-2 font-medium text-foreground">
                <span className="ml-2 text-xs text-warn">{req.clause}</span>{req.excerpt}
              </p>
              <p className="text-muted-foreground">… وفي حال تعارض هذا البند مع اشتراطات المخطط المعتمد تُحال المسألة إلى الجهة المختصة للبت فيها …</p>
              <div className="mt-6 h-2 w-2/3 rounded bg-muted" /><div className="mt-2 h-2 w-1/2 rounded bg-muted" /><div className="mt-2 h-2 w-3/4 rounded bg-muted" />
            </div>
            <div className="space-y-3 text-sm">
              <Meta k="المتطلب" v={req.title} /><Meta k="القيمة المستخرجة" v={req.value} /><Meta k="الجهة المصدرة" v={req.authority} />
              <Meta k="البند / المادة" v={req.clause} /><Meta k="الصفحة" v={String(req.page)} />
              <Pill tone={statusMeta[req.status].tone}>{statusMeta[req.status].label}</Pill>
              <Button variant="ghost" size="sm" disabled className="w-full"><ExternalLink className="h-4 w-4" /> الرابط الأصلي غير متاح (تجريبي)</Button>
            </div>
          </div>
          <DemoBanner />
        </DialogContent>
      </Dialog>
    </>
  );
}
function Meta({ k, v }: { k: string; v: string }) {
  return <div><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>;
}
