// Modular service interfaces. In this prototype each returns SIMULATED responses.
// Swap implementations for a real RAG backend, GIS API or CAD parser later.
import { requirements, violations, compliance, type Requirement } from "./mock-data";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface RegulatoryQuery { district: string; city: string; projectType: string; area: number; streetWidth: number; streets: number }
export interface RegulatoryService { retrieve(q: RegulatoryQuery): Promise<Requirement[]> }
export interface PlanAnalysisService { analyze(file: string): Promise<{ violations: typeof violations; compliance: typeof compliance }> }

export const regulatoryService: RegulatoryService = {
  async retrieve() { await wait(300); return requirements; }, // simulated: metadata filter + semantic retrieval
};
export const planAnalysisService: PlanAnalysisService = {
  async analyze() { await wait(300); return { violations, compliance }; },
};

export const retrievalSteps = [
  "فهم موقع الأرض وخصائص المشروع",
  "تحديد النطاق الإداري والجهة المختصة",
  "استرجاع الوثائق التنظيمية ذات العلاقة",
  "استخراج البنود القابلة للتطبيق",
  "مقارنة المتطلبات المتداخلة",
  "كشف التعارضات التنظيمية المحتملة",
  "إعداد ملخص تنظيمي منظم",
];
export const analysisSteps = [
  "قراءة المخطط المرفوع",
  "استخراج الأبعاد والتوزيع الإنشائي",
  "مقارنة القيم بالاشتراطات المطبقة",
  "كشف المخالفات المحتملة",
  "تحديد المعلومات غير القابلة للاستخراج بدقة",
  "إعداد تقييم المطابقة",
];
