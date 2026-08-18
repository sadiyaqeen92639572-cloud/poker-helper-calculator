import { describe, expect, it } from "vitest";
import { bankrollRequirement } from "../lib/poker/bankroll";

describe("bankrollRequirement", () => {
  it("returns Infinity for a non-positive win rate", () => {
    const r = bankrollRequirement({ winRateBbPer100: 0, stdDevBbPer100: 90, desiredRiskOfRuin: 0.05 });
    expect(r.bankrollBb).toBe(Infinity);
  });

  it("requires a smaller bankroll for a higher win rate, holding risk fixed", () => {
    const low = bankrollRequirement({ winRateBbPer100: 2, stdDevBbPer100: 90, desiredRiskOfRuin: 0.05 });
    const high = bankrollRequirement({ winRateBbPer100: 8, stdDevBbPer100: 90, desiredRiskOfRuin: 0.05 });
    expect(high.bankrollBb).toBeLessThan(low.bankrollBb);
  });

  it("requires a larger bankroll for a lower tolerated risk of ruin", () => {
    const loose = bankrollRequirement({ winRateBbPer100: 5, stdDevBbPer100: 90, desiredRiskOfRuin: 0.2 });
    const strict = bankrollRequirement({ winRateBbPer100: 5, stdDevBbPer100: 90, desiredRiskOfRuin: 0.01 });
    expect(strict.bankrollBb).toBeGreaterThan(loose.bankrollBb);
  });

  it("rejects out-of-range risk of ruin", () => {
    expect(() =>
      bankrollRequirement({ winRateBbPer100: 5, stdDevBbPer100: 90, desiredRiskOfRuin: 0 }),
    ).toThrow();
    expect(() =>
      bankrollRequirement({ winRateBbPer100: 5, stdDevBbPer100: 90, desiredRiskOfRuin: 1 }),
    ).toThrow();
  });
});
