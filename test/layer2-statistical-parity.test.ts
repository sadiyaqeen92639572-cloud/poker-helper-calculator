import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { calculateEquityMultiway } from "../lib/poker/equity";
import { countOuts, outsToEquityRule } from "../lib/poker/outs";
import { parseRange } from "../lib/poker/range";
import { equityOf } from "../lib/poker/types";

// Layer 2 — statistical parity (tolerance-based). TS runs at 50,000 trials
// (matching the Python fixture's own trial count, above client tiers, to
// shrink test noise) and asserts within ±3pp of the Python fixture,
// matching poker_math.py's own <0.08 Rule-of-4 tolerance in spirit (this
// suite uses a tighter band since both sides run the same trial count).
const TOLERANCE = 0.03;

const fixturePath = join(__dirname, "fixtures", "statistical_fixture.json");
const fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));

function closeTo(actual: number, expected: number, label: string) {
  const diff = Math.abs(actual - expected);
  expect(diff, `${label}: expected ~${expected}, got ${actual} (diff ${diff})`).toBeLessThan(
    TOLERANCE,
  );
}

describe("heads-up known-vs-known equity parity", () => {
  it("AA vs KK", () => {
    const r = calculateEquityMultiway(["Ah", "As"], [], [["Kh", "Ks"]], 50000, 42);
    closeTo(equityOf(r), fixture.heads_up_known.aa_vs_kk.equity, "AA vs KK");
  });

  it("AKs vs QQ", () => {
    const r = calculateEquityMultiway(["Ah", "Kh"], [], [["Qs", "Qd"]], 50000, 42);
    closeTo(equityOf(r), fixture.heads_up_known.aks_vs_qq.equity, "AKs vs QQ");
  });

  it("72o vs AA", () => {
    const r = calculateEquityMultiway(["7h", "2c"], [], [["Ah", "As"]], 50000, 42);
    closeTo(equityOf(r), fixture.heads_up_known["72o_vs_aa"].equity, "72o vs AA");
  });

  it("AKs vs QJs", () => {
    const r = calculateEquityMultiway(["As", "Ks"], [], [["Qd", "Jd"]], 50000, 42);
    closeTo(equityOf(r), fixture.heads_up_known.aks_vs_qjs.equity, "AKs vs QJs");
  });
});

describe("range-vs-range / hand-vs-range equity parity", () => {
  it("AKo vs QQ+", () => {
    const r = calculateEquityMultiway(["Ah", "Ks"], [], ["QQ+"], 50000, 7);
    closeTo(equityOf(r), fixture.range_vs_range.ako_vs_qqplus, "AKo vs QQ+");
  });

  it("wide range > narrow range (relational, trial-noise-invariant)", () => {
    const wide = calculateEquityMultiway(
      ["Ah", "Ks"],
      [],
      ["22+,A2s+,K2s+,Q2s+,J2s+,A2o+,K9o+"],
      50000,
      7,
    );
    const narrow = calculateEquityMultiway(["Ah", "Ks"], [], ["QQ+"], 50000, 7);
    expect(equityOf(wide)).toBeGreaterThan(equityOf(narrow));
  });

  it("postflop top-pair-top-kicker vs range", () => {
    const r = calculateEquityMultiway(
      ["Ah", "Kd"],
      ["Ac", "7h", "2s"],
      ["22+,AJs+,AQo+"],
      50000,
      7,
    );
    closeTo(equityOf(r), fixture.range_vs_range.postflop_tptk, "postflop TPTK");
  });
});

describe("multiway dilution (relational, trial-noise-invariant)", () => {
  it("heads-up > three-way > four-way", () => {
    // Three sequential 50k-trial multiway runs (up to 4-way, 21 combo
    // evaluations per hand) — genuinely CPU-heavier than the default
    // timeout accounts for, not a stalled test.
    const headsUp = calculateEquityMultiway(["Ah", "As"], [], [["Kh", "Ks"]], 50000, 3);
    const threeWay = calculateEquityMultiway(
      ["Ah", "As"],
      [],
      [["Kh", "Ks"], ["Qd", "Qc"]],
      50000,
      3,
    );
    const fourWay = calculateEquityMultiway(
      ["Ah", "As"],
      [],
      [["Kh", "Ks"], ["Qd", "Qc"], ["Jd", "Jc"]],
      50000,
      3,
    );
    expect(equityOf(headsUp)).toBeGreaterThan(equityOf(threeWay));
    expect(equityOf(threeWay)).toBeGreaterThan(equityOf(fourWay));
  }, 40000);
});

describe("range-vs-range preflop (relational)", () => {
  it("tighter opening range beats wider calling range (>50%)", () => {
    const utgOpen = "TT+,AQs+,AKo";
    const bbCall = "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+";
    const r = calculateEquityMultiway(utgOpen, [], [bbCall], 50000, 11);
    expect(equityOf(r)).toBeGreaterThan(0.5);
  });
});

describe("outs + rule of 4/2 parity", () => {
  const heroFd = ["Ah", "Kh"];
  const flopFd = ["2h", "7h", "9c"];
  const villainAa = ["Ad", "Ac"];
  const villainKk = ["Ks", "Kd"];

  it("pure flush draw vs AA: exactly 9 outs", () => {
    expect(countOuts(heroFd, flopFd, villainAa)).toBe(fixture.outs.vs_aa);
    expect(countOuts(heroFd, flopFd, villainAa)).toBe(9);
  });

  it("same draw vs KK: 12 outs (9 flush + 3 ace-pairing)", () => {
    expect(countOuts(heroFd, flopFd, villainKk)).toBe(fixture.outs.vs_kk);
    expect(countOuts(heroFd, flopFd, villainKk)).toBe(12);
  });

  it("Rule of 4 tracks real Monte Carlo equity within tolerance", () => {
    const outs = countOuts(heroFd, flopFd, villainAa);
    const ruleFlop = outsToEquityRule(outs, 2);
    const mc = calculateEquityMultiway(heroFd, flopFd, [villainAa], 50000, 9);
    expect(Math.abs(ruleFlop - equityOf(mc))).toBeLessThan(0.08);
  });
});

describe("mixed-spec dilution (relational)", () => {
  it("adding a 3rd (random) villain reduces hero equity", () => {
    const mixed = calculateEquityMultiway(["Ah", "Ks"], [], ["QQ+", null], 50000, 5);
    const noExtra = calculateEquityMultiway(["Ah", "Ks"], [], ["QQ+"], 50000, 5);
    expect(equityOf(noExtra)).toBeGreaterThan(equityOf(mixed));
  });
});

describe("range boundary edge case", () => {
  it("AA+ has same combo count as AA (nothing above it)", () => {
    expect(parseRange("AA+").length).toBe(6);
    expect(fixture.range_combo_counts["AA+"]).toBe(6);
  });
});
