// All data below is DEMONSTRATION data. It does not reproduce real official regulatory text.
export const DEMO_NOTICE = "بيانات تجريبية لأغراض العرض — لا تمثل نصوصاً نظامية معتمدة ولا تحل محل الجهات الرسمية.";

export const demoProject = {
  id: "BNY-RUH-0142",
  name: "فيلا سكنية — حي الملقا",
  city: "الرياض",
  district: "حي الملقا",
  parcelNo: "قطعة 318 / مخطط 2471 (تجريبي)",
  coords: "24.8121° N, 46.6097° E",
  parcel: { width: 25, depth: 32 },
  area: 800,
  use: "سكني — فيلا",
  streetWidth: 20,
  streets: 1,
  setbacks: { front: 6, rear: 2, side: 2 },
  heightA: 15,
  heightB: 12,
  floorHeight: 3.5,
  coverage: 0.6,
  far: 1.2,
};

export type Status = "verified-demo" | "needs-review" | "conflict";
export interface Requirement {
  id: string; group: string; title: string; value: string; explanation: string;
  authority: string; doc: string; docId: string; clause: string; page: number;
  version: string; effective: string; link?: string; status: Status; spatial?: "front" | "rear" | "side" | "height" | "coverage" | "envelope";
  excerpt: string;
}

export const requirements: Requirement[] = [
  { id: "r1", group: "الارتدادات", title: "الارتداد الأمامي", value: "6.0 م", spatial: "front",
    explanation: "يجب أن يبتعد المبنى عن حد القطعة المطل على الشارع مسافة لا تقل عن 6 أمتار.",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 4.2", page: 17, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "verified-demo",
    excerpt: "يلتزم المالك بارتداد أمامي لا يقل عن خُمس عرض الشارع وبحد أدنى ستة أمتار للشوارع التي يزيد عرضها على 15 متراً." },
  { id: "r2", group: "الارتدادات", title: "الارتداد الجانبي", value: "2.0 م", spatial: "side",
    explanation: "يُترك ممر بعرض مترين على الأقل من كل جانب مجاور للجيران.",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 4.3", page: 18, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "verified-demo",
    excerpt: "لا يقل الارتداد الجانبي عن مترين من حدود الجار، ويجوز البناء على الحد في الملاحق بشروط." },
  { id: "r3", group: "الارتدادات", title: "الارتداد الخلفي", value: "2.0 م", spatial: "rear",
    explanation: "يجب ترك مسافة مترين على الأقل من الحد الخلفي للقطعة.",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 4.4", page: 18, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "verified-demo",
    excerpt: "يكون الارتداد الخلفي مترين كحد أدنى ما لم تنص اشتراطات المخطط على خلاف ذلك." },
  { id: "r4", group: "الارتفاع", title: "أقصى ارتفاع للمبنى", value: "12 م أو 15 م", spatial: "height",
    explanation: "يوجد مصدران يحددان ارتفاعين مختلفين لهذه المنطقة؛ تمت إحالة الأمر للمراجعة.",
    authority: "وزارة البلديات والإسكان (نموذج)", doc: "لائحة الارتفاعات للأحياء السكنية — نسخة تجريبية", docId: "d2",
    clause: "البند 3.1", page: 9, version: "v1.4 (تجريبي)", effective: "2024-11-15", status: "conflict",
    excerpt: "لا يتجاوز الارتفاع الكلي للمباني السكنية في الأحياء المصنفة (س-2) خمسة عشر متراً شاملاً الملحق العلوي." },
  { id: "r5", group: "الارتفاع", title: "أقصى عدد للأدوار", value: "دوران + ملحق علوي", spatial: "height",
    explanation: "يسمح بدورين كاملين وملحق علوي لا تتجاوز مساحته 50% من الدور الأرضي.",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 5.1", page: 21, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "verified-demo",
    excerpt: "عدد الأدوار المسموح به دوران وملحق علوي بنسبة لا تتجاوز خمسين في المئة من مساحة الدور الأرضي." },
  { id: "r6", group: "نسب البناء", title: "نسبة التغطية", value: "60%", spatial: "coverage",
    explanation: "المساحة التي يغطيها المبنى على الأرض لا تتجاوز 60% من مساحة القطعة (480 م²).",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 6.1", page: 24, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "verified-demo",
    excerpt: "لا تزيد نسبة التغطية للدور الأرضي على ستين في المئة من مساحة الأرض." },
  { id: "r7", group: "نسب البناء", title: "معامل البناء (FAR)", value: "1.2", spatial: "envelope",
    explanation: "مجموع مساحات الأدوار لا يتجاوز 1.2 ضعف مساحة الأرض (960 م²).",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 6.2", page: 24, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "needs-review",
    excerpt: "يحدد معامل البناء الأقصى بـ 1.2 ما لم يصدر قرار تخطيطي خاص بالمنطقة." },
  { id: "r8", group: "المواقف", title: "مواقف السيارات", value: "موقفان داخل القطعة",
    explanation: "يجب توفير موقفين على الأقل داخل حدود الأرض للفيلا الواحدة.",
    authority: "أمانة منطقة الرياض (نموذج)", doc: "دليل اشتراطات البناء السكني — نسخة تجريبية", docId: "d1",
    clause: "المادة 8.1", page: 31, version: "v2.1 (تجريبي)", effective: "2025-03-01", status: "verified-demo",
    excerpt: "توفر الوحدة السكنية المستقلة موقفين على الأقل داخل حدود الملكية." },
  { id: "r9", group: "استعمالات الأراضي", title: "الاستعمال المسموح", value: "سكني منفصل",
    explanation: "لا يُسمح بأنشطة تجارية في الدور الأرضي ضمن هذا التصنيف.",
    authority: "وزارة البلديات والإسكان (نموذج)", doc: "تصنيف استعمالات الأراضي — نسخة تجريبية", docId: "d3",
    clause: "الجدول 2", page: 6, version: "v3.0 (تجريبي)", effective: "2024-06-01", status: "verified-demo",
    excerpt: "الأحياء ذات التصنيف (س-2) مخصصة للاستعمال السكني المنفصل ولا يسمح بالاستعمال التجاري." },
  { id: "r10", group: "الواجهات", title: "اشتراطات الواجهة", value: "طابع سلماني / نجدي معاصر",
    explanation: "يُفضّل استخدام الألوان الترابية والفتحات العميقة بما يتوافق مع الطابع العمراني للرياض.",
    authority: "برنامج جودة الحياة العمرانية (نموذج)", doc: "موجهات التصميم العمراني — نسخة تجريبية", docId: "d4",
    clause: "القسم 2.3", page: 12, version: "v1.0 (تجريبي)", effective: "2025-01-10", status: "needs-review",
    excerpt: "تلتزم الواجهات المطلة على الشوارع الرئيسية بالمواد والألوان المحددة في لوحة الطابع العمراني." },
  { id: "r11", group: "اشتراطات خاصة", title: "اشتراطات الحماية من الحريق", value: "مخرجان للأدوار العليا",
    explanation: "يشترط كود البناء توفير وسائل هروب كافية — يلزم التحقق من مختص.",
    authority: "كود البناء السعودي (مرجع — بند تجريبي)", doc: "كود البناء السعودي SBC 801 — مقتطف تجريبي", docId: "d5",
    clause: "§1006 (تجريبي)", page: 44, version: "2018 (مرجعي)", effective: "—", status: "needs-review",
    excerpt: "يُراجع عدد المخارج بحسب الإشغال ومساحة الدور وفقاً للمتطلبات الواردة في الكود." },
];

export const groups = ["الارتدادات", "الارتفاع", "نسب البناء", "المواقف", "استعمالات الأراضي", "الواجهات", "اشتراطات خاصة"];

export const conflicts = [
  { id: "c1", requirement: "أقصى ارتفاع للمبنى",
    a: { source: "لائحة الارتفاعات للأحياء السكنية (تجريبي)", authority: "وزارة البلديات والإسكان (نموذج)", value: "15 م", clause: "البند 3.1 — ص 9" },
    b: { source: "اشتراطات مخطط 2471 المعتمد (تجريبي)", authority: "أمانة منطقة الرياض (نموذج)", value: "12 م", clause: "الفقرة 7 — ص 3" },
    impact: "سيناريو 15 م يسمح بـ 4 أدوار نظرياً (غلاف 7,560 م³)، بينما 12 م يسمح بـ 3 أدوار (غلاف 6,048 م³). الفرق يؤثر على وجود الملحق العلوي.",
    status: "under-review" as const, specialist: true },
  { id: "c2", requirement: "الارتداد الأمامي على الشارع الفرعي",
    a: { source: "دليل اشتراطات البناء السكني (تجريبي)", authority: "أمانة منطقة الرياض (نموذج)", value: "خُمس عرض الشارع (4 م)", clause: "المادة 4.2 — ص 17" },
    b: { source: "اشتراطات مخطط 2471 المعتمد (تجريبي)", authority: "أمانة منطقة الرياض (نموذج)", value: "6 م ثابتة", clause: "الفقرة 4 — ص 2" },
    impact: "يقلل الارتداد الأكبر عمق منطقة البناء بمقدار 2 م (≈ 42 م² من مساحة الدور).",
    status: "open" as const, specialist: true },
];

export const projects = [
  { id: "BNY-RUH-0142", name: "فيلا سكنية — حي الملقا", city: "الرياض", type: "فيلا سكنية", compliance: 72, conflicts: 2, status: "بانتظار مراجعة مختص", tone: "warn" as const, x: 52, y: 30 },
  { id: "BNY-RUH-0139", name: "عمارة سكنية — حي النرجس", city: "الرياض", type: "عمارة شقق", compliance: 91, conflicts: 0, status: "متوافق مبدئياً", tone: "ok" as const, x: 58, y: 22 },
  { id: "BNY-JED-0087", name: "مبنى تجاري — حي الروضة", city: "جدة", type: "تجاري", compliance: 54, conflicts: 1, status: "مخالفات مكتشفة", tone: "bad" as const, x: 22, y: 58 },
  { id: "BNY-DMM-0051", name: "مبنى متعدد الاستخدامات — الشاطئ", city: "الدمام", type: "متعدد الاستخدامات", compliance: 80, conflicts: 1, status: "قيد التحليل", tone: "warn" as const, x: 80, y: 36 },
  { id: "BNY-RUH-0128", name: "فيلا — حي حطين", city: "الرياض", type: "فيلا سكنية", compliance: 96, conflicts: 0, status: "تمت المراجعة", tone: "ok" as const, x: 50, y: 34 },
];

export const violations = [
  { id: "v1", title: "تجاوز الارتداد الأمامي", where: "الواجهة الأمامية — المجلس", current: "4.8 م", required: "≥ 6.0 م", diff: "−1.2 م", reqId: "r1", zone: "front",
    fix: "إزاحة كتلة المجلس للداخل 1.2 م أو تقليص عمقه.", severity: "bad" as const },
  { id: "v2", title: "تجاوز الارتفاع (سيناريو 12 م)", where: "الملحق العلوي", current: "13.6 م", required: "≤ 12 م (تعارض قائم)", diff: "+1.6 م", reqId: "r4", zone: "roof",
    fix: "تقليص ارتفاع الملحق أو انتظار قرار المختص بشأن التعارض.", severity: "warn" as const },
  { id: "v3", title: "نسبة تغطية مرتفعة", where: "الدور الأرضي بالكامل", current: "63.5%", required: "≤ 60%", diff: "+3.5% (28 م²)", reqId: "r6", zone: "coverage",
    fix: "تحويل جزء من الملحق الخارجي إلى فناء مكشوف.", severity: "bad" as const },
];

export const compliance = {
  ok: ["الارتداد الجانبي", "الارتداد الخلفي", "مواقف السيارات", "الاستعمال المسموح", "عدد الأدوار"],
  manual: ["اشتراطات الواجهة (المواد غير واضحة في المخطط)", "مخارج الطوارئ", "ارتفاع الأسوار"],
};

export const libraryDocs = [
  { id: "d1", title: "دليل اشتراطات البناء السكني", authority: "أمانة منطقة الرياض (نموذج)", type: "اشتراطات بلدية", region: "الرياض", version: "v2.1", date: "2025-03-01", pages: 64, clauses: 142 },
  { id: "d2", title: "لائحة الارتفاعات للأحياء السكنية", authority: "وزارة البلديات والإسكان (نموذج)", type: "لائحة وزارية", region: "عام", version: "v1.4", date: "2024-11-15", pages: 22, clauses: 38 },
  { id: "d3", title: "تصنيف استعمالات الأراضي", authority: "وزارة البلديات والإسكان (نموذج)", type: "تخطيط عمراني", region: "عام", version: "v3.0", date: "2024-06-01", pages: 18, clauses: 27 },
  { id: "d4", title: "موجهات التصميم العمراني — الطابع السلماني", authority: "برنامج جودة الحياة العمرانية (نموذج)", type: "موجهات تصميم", region: "الرياض", version: "v1.0", date: "2025-01-10", pages: 48, clauses: 64 },
  { id: "d5", title: "كود البناء السعودي SBC 801 — مقتطفات", authority: "اللجنة الوطنية لكود البناء (مرجع)", type: "كود البناء", region: "عام", version: "2018", date: "—", pages: 120, clauses: 310 },
  { id: "d6", title: "اشتراطات مخطط 2471 المعتمد", authority: "أمانة منطقة الرياض (نموذج)", type: "اشتراطات مخطط", region: "الرياض — الملقا", version: "—", date: "2019-09-20", pages: 6, clauses: 14 },
  { id: "d7", title: "اشتراطات المباني التجارية", authority: "أمانة محافظة جدة (نموذج)", type: "اشتراطات بلدية", region: "جدة", version: "v1.2", date: "2024-02-12", pages: 40, clauses: 91 },
];

export const notifications = [
  { t: "منذ 12 دقيقة", title: "ردّ المختص م. سارة العتيبي على تعارض الارتفاع", body: "طلب تزويده بصك الأرض لتأكيد تاريخ اعتماد المخطط.", tone: "warn" },
  { t: "منذ ساعتين", title: "اكتمل تحليل المخطط الهندسي", body: "فيلا الملقا — 3 مخالفات، 5 متطلبات متوافقة، 3 بحاجة لتحقق يدوي.", tone: "bad" },
  { t: "أمس", title: "تحديث في المكتبة التنظيمية", body: "إضافة نسخة v2.1 من دليل اشتراطات البناء السكني (تجريبي).", tone: "ok" },
  { t: "منذ 3 أيام", title: "اكتملت مراجعة مشروع فيلا حطين", body: "تم وسم المخطط كـ «تمت مراجعته من مختص».", tone: "ok" },
];
