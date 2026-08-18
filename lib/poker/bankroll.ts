/**
 * Kelly-criterion-based bankroll sizing. Standard poker application of the
 * risk-of-ruin formula (Chen/Ankenman): required bankroll (in big blinds)
 * = (stdDev^2 / (2 * winRate)) * ln(1 / desiredRiskOfRuin). This is the
 * poker-specific derivation of the Kelly criterion's "don't risk more than
 * your edge can support" — winRate is your edge, stdDev captures variance
 * (swinginess) of the game you're playing.
 *
 * Standalone arithmetic, no state, no automation — the one genuinely
 * reusable piece identified in the Pocker codebase audit (see plan).
 */
export interface BankrollInput {
  /** Win rate in bb/100 hands. Positive = winning player. */
  winRateBbPer100: number;
  /** Standard deviation in bb/100 hands. Typical full-ring NLHE cash ~80-100. */
  stdDevBbPer100: number;
  /** Desired probability of going broke, e.g. 0.05 for 5%. */
  desiredRiskOfRuin: number;
  /** Buy-in size in big blinds (100 = standard 100bb cash game buy-in). */
  buyInBb?: number;
  /** Extra cushion multiplier on top of the raw Kelly-derived number. */
  safetyMargin?: number;
}

export interface BankrollResult {
  bankrollBb: number;
  bankrollBuyIns: number;
  /** null when winRate <= 0 — risk-of-ruin math only applies to a
   * player with a positive edge; a losing/break-even player has no
   * bankroll size that mathematically avoids eventual ruin. */
  note: string;
}

export function bankrollRequirement(input: BankrollInput): BankrollResult {
  const { winRateBbPer100, stdDevBbPer100, desiredRiskOfRuin, buyInBb = 100, safetyMargin = 1.25 } = input;

  if (desiredRiskOfRuin <= 0 || desiredRiskOfRuin >= 1) {
    throw new Error("desiredRiskOfRuin must be between 0 and 1 (exclusive)");
  }
  if (stdDevBbPer100 <= 0) {
    throw new Error("stdDevBbPer100 must be positive");
  }

  if (winRateBbPer100 <= 0) {
    return {
      bankrollBb: Infinity,
      bankrollBuyIns: Infinity,
      note: "No positive edge (win rate <= 0) — no bankroll size mathematically avoids eventual ruin at this win rate. Fix the win rate before sizing a bankroll.",
    };
  }

  // Per-100-hands variance, converted to per-hand terms for the formula.
  const winRatePerHand = winRateBbPer100 / 100;
  const varPerHand = (stdDevBbPer100 * stdDevBbPer100) / 100;

  const bankrollBbRaw = (varPerHand / (2 * winRatePerHand)) * Math.log(1 / desiredRiskOfRuin);
  const bankrollBb = bankrollBbRaw * safetyMargin;
  const bankrollBuyIns = bankrollBb / buyInBb;

  return {
    bankrollBb,
    bankrollBuyIns,
    note: `At a ${winRateBbPer100}bb/100 win rate with ${stdDevBbPer100}bb/100 std dev, you need roughly ${bankrollBuyIns.toFixed(1)} buy-ins (${Math.round(bankrollBb)}bb) to keep risk of ruin under ${(desiredRiskOfRuin * 100).toFixed(0)}%, including a ${Math.round((safetyMargin - 1) * 100)}% safety cushion.`,
  };
}
