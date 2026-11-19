import { describe, expect, it } from "vitest";
import { computeEnvelope, checkProposal } from "./geometry";

describe("building envelope", () => {
  const parcel = { width: 25, depth: 32 };
  const sb = { front: 6, rear: 2, side: 2 };
  it("subtracts setbacks from parcel", () => {
    const e = computeEnvelope(parcel, sb, 12, 3.5, 0.6, 1.2);
    expect(e.buildWidth).toBe(21);
    expect(e.buildDepth).toBe(24);
    expect(e.parcelArea).toBe(800);
  });
  it("caps footprint by coverage ratio and floors by height", () => {
    const e = computeEnvelope(parcel, sb, 12, 3.5, 0.6, 1.2);
    expect(e.allowedFootprint).toBe(480);
    expect(e.maxFloors).toBe(3);
    expect(e.maxGFA).toBe(960);
  });
  it("a 15m height scenario allows 4 floors", () => {
    expect(computeEnvelope(parcel, sb, 15, 3.5, 0.6, 1.2).maxFloors).toBe(4);
  });
  it("flags a front setback violation", () => {
    const r = checkProposal({ width: 20, depth: 22, floors: 3, floorHeight: 3.5, frontGap: 4.8, sideGap: 2.5, rearGap: 2 }, parcel, sb, 12, 0.6);
    expect(r.front.ok).toBe(false);
    expect(r.front.diff).toBeCloseTo(-1.2);
  });
});
