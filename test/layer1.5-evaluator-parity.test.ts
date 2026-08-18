import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate5 } from "../lib/poker/evaluator";

// Layer 1.5 — exhaustive deterministic evaluator parity. Fills the blind
// spot a ±2-3pp Monte Carlo tolerance (Layer 2) would leave: a fine-grained
// kicker/tiebreaker ordering bug wouldn't show up in a statistical
// tolerance check. 100,000 random 5-card hands, fixed Python seed, full
// tuple equality (not just category) against the Python evaluate_5() —
// each fixture entry preserves the raw variable-length tuple shape as a
// plain array, unmodified by the wrapper.

interface FixtureCase {
  hand: string[];
  score: number[];
}

const fixturePath = join(__dirname, "fixtures", "evaluator_100k.json");
const cases: FixtureCase[] = JSON.parse(readFileSync(fixturePath, "utf-8"));

describe("evaluate5 exhaustive parity vs Python (100k hands)", () => {
  it("fixture loaded", () => {
    expect(cases.length).toBe(100000);
  });

  it("every hand's full score tuple matches Python exactly", () => {
    const mismatches: string[] = [];
    for (const { hand, score } of cases) {
      const tsScore = evaluate5(hand);
      if (
        tsScore.length !== score.length ||
        tsScore.some((v, i) => v !== score[i])
      ) {
        mismatches.push(`${hand.join(",")}: python=${JSON.stringify(score)} ts=${JSON.stringify(tsScore)}`);
        if (mismatches.length >= 20) break; // enough to diagnose without flooding output
      }
    }
    expect(mismatches, mismatches.join("\n")).toEqual([]);
  });
});
