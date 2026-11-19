import { expect, it } from 'vitest';
import { COMPARISON_MODE, elementDetail } from './illustration-details';

it('keeps both sources as the permanent comparison mode', () => {
  expect(COMPARISON_MODE).toBe('both');
});
it('links shared coverage to 70% and original pages 1 and 18', () => {
  expect(elementDetail('shared').value).toBe('70%');
  expect(elementDetail('shared').sources.map(s => [s.documentId, s.page])).toEqual([['parcel', 1], ['residential', 18]]);
});
it('keeps the 70% vs 75% strip unresolved for specialist review', () => {
  expect(elementDetail('difference').value).toBe('70% كحد أقصى ↔ 75% كحد أقصى');
  expect(elementDetail('difference').unresolved).toBe(true);
});
it('does not invent missing m² areas or first-floor coverage', () => {
  for (const element of ['shared', 'difference', 'ground', 'first', 'boundary'] as const) expect(elementDetail(element).area).toBeNull();
  expect(elementDetail('first').value).toBe('أرضي + أول');
  expect(elementDetail('boundary').sources).toEqual([]);
});