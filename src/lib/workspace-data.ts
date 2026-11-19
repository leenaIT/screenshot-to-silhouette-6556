import parcel from '@/data/parcel.json';
import regulations from '@/data/regulations.json';
import conversation from '@/data/conversation.json';
import sources from '@/data/sources.json';
export { parcel, regulations, conversation, sources };
export type SourceReference = { documentId: string; page: number; clause?: string; excerpt?: string };
export type RegulatoryConflict = typeof regulations.conflicts[number];
export function matchScenario(text: string) {
  const normalized = text.trim().replace(/[؟?]/g, '').toLowerCase();
  return conversation.scenarios.find(s => s.question.replace(/[؟?]/g, '').toLowerCase() === normalized)
    ?? [...conversation.scenarios].sort((a, b) => (a.id === 'regulations' ? 1 : 0) - (b.id === 'regulations' ? 1 : 0)).find(s => s.aliases.some(alias => normalized.includes(alias.toLowerCase())));
}
export function canActivateWorkspace(stage: string, projectType: string) {
  return stage === 'project' && parcel.projectTypes.includes(projectType);
}