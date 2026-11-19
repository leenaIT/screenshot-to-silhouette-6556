import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
const dict = {
  home: ["الرئيسية", "Home"], workspace: ["مساحة العمل الخرائطية", "Map workspace"], projects: ["مشاريعي", "My projects"], newProject: ["مشروع جديد", "New project"],
  regulations: ["الاشتراطات العمرانية", "Regulations"], conflicts: ["التعارضات", "Conflicts"],
  envelope: ["الغلاف البنائي ثلاثي الأبعاد", "3D envelope"], planAnalysis: ["تحليل المخططات", "Plan analysis"],
  corrections: ["التعديلات المقترحة", "Corrections"], generator: ["المخطط المبدئي", "Concept generator"],
  library: ["المكتبة التنظيمية", "Regulatory library"], review: ["المراجعة المتخصصة", "Specialist review"],
  report: ["التقرير", "Report"], notifications: ["الإشعارات", "Notifications"], settings: ["الإعدادات", "Settings"],
  how: ["كيف يعمل بنيان", "How BUNYAN works"], start: ["ابدأ مشروعك", "Start your project"],
  explore: ["استكشف كيف يعمل بنيان", "Explore how BUNYAN works"],
  heroTitle: ["من أرضك إلى مشروع متوافق مع الاشتراطات العمرانية", "From your land to a regulation-compliant project"],
  heroSub: [
    "بنيان، منصتك الذكية لفهم الاشتراطات العمرانية، واكتشاف التعارضات، وتحليل المخططات الهندسية، وتصور مشروعك قبل التنفيذ.",
    "BUNYAN is your intelligent platform to understand urban regulations, detect conflicts, analyze architectural plans and visualize your project before construction.",
  ],
  demo: ["بيانات تجريبية", "Demo data"], dashboard: ["لوحة التحكم", "Dashboard"],
} as const;
export type Key = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "ar", setLang: () => {}, t: (k) => (dict[k]?.[0] ?? k),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  useEffect(() => {
    const s = localStorage.getItem("bunyan-lang");
    if (s === "en" || s === "ar") setLang(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("bunyan-lang", lang);
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: (k) => (dict[k]?.[lang === "ar" ? 0 : 1] ?? k) }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
