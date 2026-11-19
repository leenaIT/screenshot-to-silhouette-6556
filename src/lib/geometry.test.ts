import { describe, expect, it } from "vitest";
import { computeEnvelope, checkProposal, illustrativeCoveragePolygon, coverageAreas } from "./geometry";

describe('illustrative coverage comparisons', () => {
  it('shows the documented 200.1 m² parcel coverage comparison without rounding intermediate values', () => {
    const result = coverageAreas(200.1, .7, .75);
    expect(result.common).toBeCloseTo(140.07, 8);
    expect(result.larger).toBeCloseTo(150.075, 8);
    expect(result.difference).toBeCloseTo(10.005, 8);
  });
  const polygon: [number, number][] = [[0, 0], [20, 0], [20, 10], [0, 10]];
  const area = (points: [number, number][]) => Math.abs(points.reduce((sum, [x, z], i) => { const next = points[(i + 1) % points.length]; return sum + (next ? x * next[1] - next[0] * z : 0); }, 0)) / 2;
  it('scales first-source illustrative area to 70%, not an exact legal shape', () => {
    expect(area(illustrativeCoveragePolygon(polygon, .7))).toBeCloseTo(140);
  });
  it('scales second-source illustrative area to 75% and preserves the input', () => {
    expect(area(illustrativeCoveragePolygon(polygon, .75))).toBeCloseTo(150);
    expect(polygon).toEqual([[0, 0], [20, 0], [20, 10], [0, 10]]);
  });
});

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
