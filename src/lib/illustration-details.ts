import { regulations, type SourceReference } from './workspace-data';

export type ParcelElement = 'shared' | 'difference' | 'ground' | 'first' | 'boundary';
export type ElementDetail = { name: string; value: string; area: null; status: string; unresolved: boolean; sources: SourceReference[] };
export const COMPARISON_MODE = 'both' as const;

// Only regulatory JSON supplies detail values. Missing floor areas/boundary values stay unknown.
export function elementDetail(element: ParcelElement): ElementDetail {
  const conflict = regulations.conflicts.find(c => c.id === 'ground-coverage');
  const coverage = regulations.requirements.find(r => r.id === 'coverage');
  const floors = regulations.requirements.find(r => r.id === 'floors');
  const scenarios = regulations.verifiedDisplayParameters.coverageScenarios;
  const shared = Math.min(...scenarios.map(s => s.ratio));
  const bothSources = scenarios.map(s => s.source);
  switch (element) {
    case 'shared': return { name: 'المساحة المشتركة', value: `${shared * 100}%`, area: null, status: 'متوافق مع نسبتي المصدرين — لا يمثل اعتمادًا هندسيًا', unresolved: false, sources: bothSources };
    case 'difference': return { name: 'شريط اختلاف التغطية', value: `${conflict?.first.value ?? ''} ↔ ${conflict?.second.value ?? ''}`, area: null, status: conflict?.status ?? 'يتطلب مراجعة مختص', unresolved: true, sources: conflict ? [conflict.first.source, conflict.second.source] : bothSources };
    case 'ground': return { name: 'الدور الأرضي', value: coverage?.value ?? 'غير متاح في الوثائق', area: null, status: conflict?.status ?? 'يتطلب مراجعة مختص', unresolved: true, sources: conflict ? [conflict.first.source, conflict.second.source] : coverage ? [coverage.source] : [] };
    case 'first': return { name: 'الدور الأول', value: floors?.value ?? 'غير متاح في الوثائق', area: null, status: 'متوافق مع عدد الأدوار الموثق فقط — النسبة والمساحة غير متاحتين', unresolved: false, sources: floors ? [floors.source] : [] };
    case 'boundary': return { name: 'حدود القطعة', value: 'النسبة والمساحة غير متاحتين في ملف الاشتراطات', area: null, status: 'غير محسوم — يتطلب مراجعة مختص؛ الحدود ليست حدود بناء معتمدة', unresolved: true, sources: [] };
  }
}