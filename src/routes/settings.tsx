import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/brand";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({ head: () => seo("الإعدادات", "تفضيلات الحساب واللغة والإشعارات."), component: Settings });

function Settings() {
  const { lang, setLang } = useI18n();
  return (
    <AppShell>
      <PageHeader title="الإعدادات" />
      <div className="panel max-w-2xl divide-y">
        <div className="flex items-center justify-between p-5"><div><div className="font-medium">لغة الواجهة</div><div className="text-sm text-muted-foreground">العربية افتراضياً مع دعم الإنجليزية</div></div>
          <div className="flex gap-2"><Button size="sm" variant={lang === "ar" ? "default" : "outline"} onClick={() => setLang("ar")}>العربية</Button><Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>English</Button></div></div>
        {["إشعارات ردود المختصين", "تنبيهات تحديث الوثائق التنظيمية", "ملخص أسبوعي بالبريد"].map((t, i) => <div key={t} className="flex items-center justify-between p-5"><span>{t}</span><Switch defaultChecked={i < 2} /></div>)}
        <div className="p-5 text-sm text-muted-foreground">التكاملات المستقبلية: قواعد البيانات التنظيمية الرسمية · واجهات GIS · معالجة ملفات DWG.</div>
      </div>
    </AppShell>
  );
}
