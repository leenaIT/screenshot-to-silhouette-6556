import { describe, expect, it } from 'vitest';
import { parcel, regulations, sources, matchScenario, canActivateWorkspace } from './workspace-data';
import { projectParcel } from './geometry';
describe('Al Narjis demonstration rules', () => {
  it('uses the exact supplied real parcel and closed longitude-latitude polygon', () => {
    expect(parcel.number).toBe('725'); expect(parcel.area).toBe(200.1);
    expect(parcel.coordinates).toEqual([[46.650856172851952,24.885792555740007],[46.650649143800102,24.885706221141227],[46.650613343001005,24.885777654799242],[46.650820371163626,24.885863989453004],[46.650856172851952,24.885792555740007]]);
    expect(parcel.center).toEqual([24.88578,46.65073]); expect(parcel.zoom).toBe(19);
  });
  it('requires parcel selection and only accepts a villa project', () => {
    expect(canActivateWorkspace('map', 'فيلا سكنية')).toBe(false);
    expect(canActivateWorkspace('land', 'فيلا سكنية')).toBe(false);
    expect(canActivateWorkspace('project', 'فيلا سكنية')).toBe(true);
    expect(canActivateWorkspace('project', 'عمارة')).toBe(false);
  });
  it('preserves actual polygon orientation and metre-scale geometry', () => {
    const points = projectParcel(parcel.coordinates, parcel.center);
    expect(points).toHaveLength(4);
    expect(points[0]?.[0]).toBeCloseTo(12.740, 1);
    expect(points[0]?.[1]).toBeCloseTo(-1.398, 1);
  });
  it('does not provide invented geometric limits', () => { expect(regulations.geometryParameters).toBeNull(); });
  it('keeps documented differences unresolved and cites real PDF pages', () => {
    const conflict = regulations.conflicts[0];
    expect(conflict?.first.value).toBe('70% كحد أقصى');
    expect(conflict?.second.value).toBe('75% كحد أقصى');
    expect(conflict?.first.source.page).toBe(1); expect(conflict?.second.source.page).toBe(18);
    expect(conflict?.status).toBe('يتطلب مراجعة مختص');
    for (const requirement of regulations.requirements) {
      const document = sources.find(s => s.id === requirement.source.documentId);
      expect(document).toBeDefined(); expect(requirement.source.page).toBeGreaterThan(0);
      expect(requirement.source.page).toBeLessThanOrEqual(document?.pages ?? 0);
    }
  });
  it('matches suggested questions and falls back for unrelated messages', () => {
    expect(matchScenario('ما الاشتراطات العمرانية المطبقة على أرضي؟')?.id).toBe('regulations');
    expect(matchScenario('هل يوجد تعارض بين الاشتراطات؟')?.id).toBe('conflicts');
    expect(matchScenario('اعرض حدود البناء ثلاثية الأبعاد')?.id).toBe('3d');
    expect(matchScenario('ما حالة الطقس؟')).toBeUndefined();
  });
});