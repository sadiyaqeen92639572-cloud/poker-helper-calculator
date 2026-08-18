export interface PotOddsResult {
  potOdds: number; // required equity to break even on a call
  requiredEquityPct: string;
  verdict: "CALL" | "FOLD" | "N/A";
}

/** Standard pot odds: required equity = toCall / (pot + toCall). */
export function potOdds(potSize: number, toCall: number, yourEquity?: number): PotOddsResult {
  const required = potSize + toCall > 0 ? toCall / (potSize + toCall) : 0;
  let verdict: PotOddsResult["verdict"] = "N/A";
  if (yourEquity !== undefined) {
    verdict = yourEquity >= required ? "CALL" : "FOLD";
  }
  return {
    potOdds: required,
    requiredEquityPct: `${(required * 100).toFixed(1)}%`,
    verdict,
  };
}

export interface ImpliedOddsResult {
  potOddsRequiredEquity: number;
  spr: number; // stack-to-pot ratio
  breakevenCallNow: boolean;
  note: string;
}

/**
 * Extends plain pot odds with stack-to-pot ratio context. Raw pot odds
 * only look at the current bet; with a draw and money still behind, a call
 * can be profitable even below the raw pot-odds threshold IF there's
 * enough effective stack left to extract extra value when the draw hits —
 * SPR is the standard proxy for how much of that "implied" upside is even
 * possible.
 */
export function impliedOdds(
  potSize: number,
  toCall: number,
  yourEquity: number,
  effectiveStack: number,
): ImpliedOddsResult {
  const required = potSize + toCall > 0 ? toCall / (potSize + toCall) : 0;
  const spr = potSize > 0 ? effectiveStack / potSize : Infinity;
  const breakevenNow = yourEquity >= required;

  let note: string;
  if (breakevenNow) {
    note = "Already profitable on pot odds alone — implied odds just add extra upside.";
  } else if (spr < 1) {
    note =
      "Behind on pot odds AND stacks are too shallow for implied odds to bail you out — fold leans correct.";
  } else {
    const sprLabel = Number.isFinite(spr) ? spr.toFixed(1) : "∞";
    note = `Behind on raw pot odds (need ${(required * 100).toFixed(1)}%, have ${(yourEquity * 100).toFixed(1)}%) — SPR=${sprLabel} means there IS room for implied odds to close the gap if villain pays you off when you hit.`;
  }

  return {
    potOddsRequiredEquity: required,
    spr,
    breakevenCallNow: breakevenNow,
    note,
  };
}
