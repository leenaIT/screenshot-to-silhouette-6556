// Deterministic geometry engine: converts structured regulatory parameters into spatial limits.
// AI never computes these numbers — it only supplies the parameters.
export interface Parcel { width: number; depth: number }
export interface Setbacks { front: number; rear: number; side: number }

// Local tangent-plane coordinates in metres, preserving the supplied polygon.
export function projectParcel(coordinates: readonly number[][], center: readonly number[]) {
  const lat = center[0] ?? 0, lng = center[1] ?? 0;
  return coordinates.slice(0, -1).map(([longitude = 0, latitude = 0]) => [
    (longitude - lng) * 111320 * Math.cos(lat * Math.PI / 180),
    -(latitude - lat) * 111320,
  ] as [number, number]);
}

// An illustrative, centroid-scaled polygon is NOT a setback-derived legal footprint.
export function illustrativeCoveragePolygon(points: [number, number][], ratio: number) {
  const center = polygonCenter(points);
  const scale = Math.sqrt(Math.max(0, Math.min(1, ratio)));
  return points.map(([x, z]) => [center[0] + (x - center[0]) * scale, center[1] + (z - center[1]) * scale] as [number, number]);
}

export function polygonCenter(points: [number, number][]): [number, number] {
  const count = points.length || 1;
  return [points.reduce((sum, p) => sum + p[0], 0) / count, points.reduce((sum, p) => sum + p[1], 0) / count];
}

export function parcelFrame(points: [number, number][]) {
  const center = polygonCenter(points);
  const first = points[0], second = points[1];
  const angle = first && second ? Math.atan2(second[1] - first[1], second[0] - first[0]) : 0;
  const local = points.map(([x, z]) => [(x - center[0]) * Math.cos(angle) + (z - center[1]) * Math.sin(angle), -(x - center[0]) * Math.sin(angle) + (z - center[1]) * Math.cos(angle)]);
  const xs = local.map(p => p[0] ?? 0), zs = local.map(p => p[1] ?? 0);
  return { center, angle, width: Math.max(...xs) - Math.min(...xs), depth: Math.max(...zs) - Math.min(...zs) };
}

export interface Envelope {
  buildWidth: number;
  buildDepth: number;
  setbackFootprint: number;
  allowedFootprint: number;
  parcelArea: number;
  maxHeight: number;
  maxFloors: number;
  maxGFA: number;
  volume: number;
}

export function computeEnvelope(
  parcel: Parcel,
  setbacks: Setbacks,
  maxHeight: number,
  floorHeight: number,
  coverageRatio: number,
  far: number,
): Envelope {
  const buildWidth = Math.max(0, parcel.width - 2 * setbacks.side);
  const buildDepth = Math.max(0, parcel.depth - setbacks.front - setbacks.rear);
  const parcelArea = parcel.width * parcel.depth;
  const setbackFootprint = buildWidth * buildDepth;
  const allowedFootprint = Math.min(setbackFootprint, parcelArea * coverageRatio);
  const maxFloors = Math.floor(maxHeight / floorHeight);
  const maxGFA = Math.min(allowedFootprint * maxFloors, parcelArea * far);
  return {
    buildWidth, buildDepth, setbackFootprint, allowedFootprint, parcelArea,
    maxHeight, maxFloors, maxGFA, volume: setbackFootprint * maxHeight,
  };
}

export interface BuildingProposal { width: number; depth: number; floors: number; floorHeight: number; frontGap: number; sideGap: number; rearGap: number }

export function checkProposal(p: BuildingProposal, parcel: Parcel, s: Setbacks, maxHeight: number, coverage: number) {
  const height = p.floors * p.floorHeight;
  const cov = (p.width * p.depth) / (parcel.width * parcel.depth);
  return {
    height,
    coverage: cov,
    front: { ok: p.frontGap >= s.front, value: p.frontGap, diff: p.frontGap - s.front },
    side: { ok: p.sideGap >= s.side, value: p.sideGap, diff: p.sideGap - s.side },
    rear: { ok: p.rearGap >= s.rear, value: p.rearGap, diff: p.rearGap - s.rear },
    heightOk: height <= maxHeight,
    coverageOk: cov <= coverage,
  };
}
