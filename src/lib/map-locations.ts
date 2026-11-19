import { parcel } from '@/lib/workspace-data';

export type MapLocation = {
  id: string;
  district: string;
  number: string;
  planNumber: string;
  area: number;
  status: string;
  center: [number, number];
  coordinates: number[][];
  verified: boolean;
};

// Illustrative mock footprints are navigation examples, never legal parcel boundaries.
function example(id: string, district: string, number: string, planNumber: string, area: number, status: string, center: [number, number]): MapLocation {
  const [lat, lng] = center;
  const coordinates = [[lng - .0001, lat - .00009], [lng + .0001, lat - .00009], [lng + .0001, lat + .00009], [lng - .0001, lat + .00009], [lng - .0001, lat - .00009]];
  return { id, district, number, planNumber, area, status, center, coordinates, verified: false };
}

export const verifiedLocation: MapLocation = {
  id: 'narjis-725', district: parcel.district, number: parcel.number,
  planNumber: parcel.planNumber, area: parcel.area, status: parcel.status,
  center: [parcel.center[0] ?? 0, parcel.center[1] ?? 0], coordinates: parcel.coordinates, verified: true,
};
export const previousProjects = [
  example('malqa-412', 'الملقا', '412', '1358', 375, 'مكتمل', [24.8072, 46.6125]),
  example('yasmin-1098', 'الياسمين', '1098', '1637', 450, 'قيد المراجعة', [24.8238, 46.6419]),
  example('arid-233', 'العارض', '233', '2078', 300, 'مسودة', [24.8703, 46.6193]),
];
export const mapLocations: MapLocation[] = [verifiedLocation, ...previousProjects];

function normalize(value: string) {
  return value.replace(/[أإآ]/g, 'ا').replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).trim().toLowerCase();
}
export function searchLocations(query: string): MapLocation[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  return mapLocations.filter(location => tokens.every(token => normalize(`الرياض حي ${location.district} مخطط ${location.planNumber} قطعة ${location.number}`).includes(token)));
}