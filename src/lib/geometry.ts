// Deterministic geometry engine: converts structured regulatory parameters into spatial limits.
// AI never computes these numbers — it only supplies the parameters.
export interface Parcel { width: number; depth: number }
export interface Setbacks { front: number; rear: number; side: number }

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
