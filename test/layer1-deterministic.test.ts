import { describe, expect, it } from "vitest";
import { evaluate5, handCategoryName } from "../lib/poker/evaluator";
import { parseRange } from "../lib/poker/range";
import { calculateEquityMultiway, validateNoDuplicateKnownCards } from "../lib/poker/equity";

// Layer 1 — deterministic parity: every assertion here is ported verbatim
// from poker_math.py's __main__ block.

describe("evaluator sanity checks", () => {
  it("royal flush", () => {
    const royal = evaluate5(["Ah", "Kh", "Qh", "Jh", "Th"]);
    expect(handCategoryName(royal)).toBe("Straight Flush");
    expect(royal).toEqual([9, 14]);
  });

  it("quads", () => {
    const quad = evaluate5(["9h", "9d", "9s", "9c", "2h"]);
    expect(handCategoryName(quad)).toBe("Four of a Kind");
    expect(quad).toEqual([8, 9, 2]);
  });

  it("wheel straight (A-2-3-4-5 plays as 5-high)", () => {
    const wheel = evaluate5(["Ah", "2d", "3s", "4c", "5h"]);
    expect(handCategoryName(wheel)).toBe("Straight");
    expect(wheel).toEqual([5, 5]);
  });
});

describe("parseRange combo counts", () => {
  it.each([
    ["AA", 6],
    ["22+", 78],
    ["AKs", 4],
    ["AKo", 12],
    ["ATs+", 16],
    ["QQ+,AKs,AKo", 34],
    ["AA+", 6],
  ] as const)("%s -> %d combos", (range, expected) => {
    expect(parseRange(range).length).toBe(expected);
  });
});

describe("duplicate-card rejection", () => {
  it("rejects a card duplicated between hero and board", () => {
    expect(() =>
      validateNoDuplicateKnownCards(["Ah", "Ks"], ["Ah", "2c", "3d"], [null]),
    ).toThrow(/Duplicate card/);
  });

  it("rejects a card duplicated between hero and villain", () => {
    expect(() =>
      validateNoDuplicateKnownCards(["Ah", "Ks"], [], [["Ah", "2c"]]),
    ).toThrow(/Duplicate card/);
  });
});

describe("river determinism", () => {
  it("fully-decided river hand is 100% deterministic across all trials", () => {
    const riverBoard = ["Ah", "Kd", "9c", "4h", "2s"];
    const river = calculateEquityMultiway(["As", "Ks"], riverBoard, [["Qd", "Qc"]], 500, 1);
    expect(river.win).toBe(1.0);
  });
});

describe("exact chop / board-plays tie", () => {
  it("identical board-plays hand ties 100% of the time", () => {
    const chopBoard = ["As", "Ks", "Qs", "Jd", "Th"];
    const chop = calculateEquityMultiway(["2c", "3d"], chopBoard, [["4h", "5c"]], 500, 1);
    expect(chop.tie).toBe(1.0);
  });
});

describe("fully-blocked-range rejection", () => {
  it("throws when no valid combos remain in a fully-blocked range", () => {
    expect(() =>
      calculateEquityMultiway(["Ah", "Ks"], ["Ad", "Ac", "2h"], ["AA"], 100),
    ).toThrow(/no valid combos/);
  });
});
