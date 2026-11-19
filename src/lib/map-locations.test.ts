import { describe, expect, it } from 'vitest';
import { previousProjects, searchLocations, verifiedLocation } from './map-locations';

describe('Map navigation examples', () => {
  it('finds the four requested Riyadh districts', () => {
    for (const district of ['النرجس', 'الملقا', 'الياسمين', 'العارض']) expect(searchLocations(district)).toHaveLength(1);
  });
  it('searches by plan and plot number, including Arabic digits', () => {
    expect(searchLocations('١٠٩٨')[0]?.district).toBe('الياسمين');
    expect(searchLocations('1358')[0]?.number).toBe('412');
    expect(searchLocations('قطعة 725')[0]?.id).toBe(verifiedLocation.id);
    expect(searchLocations('999999')).toEqual([]);
  });
  it('keeps the previous project areas and statuses requested in the brief', () => {
    expect(previousProjects.map(({ number, area, status }) => ({ number, area, status }))).toEqual([
      { number: '412', area: 375, status: 'مكتمل' },
      { number: '1098', area: 450, status: 'قيد المراجعة' },
      { number: '233', area: 300, status: 'مسودة' },
    ]);
  });
  it('does not allow mock locations to masquerade as verified findings', () => {
    expect(previousProjects.every(location => !location.verified)).toBe(true);
    expect(verifiedLocation.verified).toBe(true);
  });
});