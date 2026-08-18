import { DECK } from "./cards";
import { bestHand, compareScores } from "./evaluator";
import { parseRange } from "./range";
import { Rng } from "./rng";
import type { EquityResult, HandSpec } from "./types";

/** Sample one concrete 2-card hand from a spec, avoiding blocked cards. */
export function sampleFromSpec(spec: HandSpec, blocked: Set<string>, rng: Rng): string[] {
  if (spec === null) {
    const pool = DECK.filter((c) => !blocked.has(c));
    return rng.sample(pool, 2);
  }
  if (Array.isArray(spec)) {
    if (blocked.has(spec[0]) || blocked.has(spec[1])) {
      throw new Error(`Concrete hand ${JSON.stringify(spec)} conflicts with already-used cards`);
    }
    return spec.slice();
  }
  const combos = parseRange(spec);
  const valid = combos.filter((c) => !blocked.has(c[0]) && !blocked.has(c[1]));
  if (valid.length === 0) {
    throw new Error(`Range ${JSON.stringify(spec)} has no valid combos left given blocked cards`);
  }
  return Array.from(rng.choice(valid));
}

/**
 * Catch the single most likely real-world input mistake: a user typo-ing
 * the same physical card into two places (e.g. board AND hero, or two
 * villains). Silent duplicates don't crash — bestHand() just quietly
 * treats a card as if two copies exist — they produce confidently wrong
 * numbers instead, the worst kind of bug for a tool giving money advice.
 */
export function validateNoDuplicateKnownCards(
  hero: HandSpec,
  board: string[],
  villains: HandSpec[],
): void {
  const seen = new Map<string, string>();
  const check = (cards: string[], source: string) => {
    for (const c of cards) {
      if (seen.has(c)) {
        throw new Error(`Duplicate card ${JSON.stringify(c)}: appears in both ${seen.get(c)} and ${source}`);
      }
      seen.set(c, source);
    }
  };
  check(board, "board");
  if (Array.isArray(hero)) check(hero, "hero");
  villains.forEach((v, i) => {
    if (Array.isArray(v)) check(v, `villain[${i}]`);
  });
}

/**
 * General N-way equity: hero and each villain can be a concrete hand, a
 * range string, or null (fully random hand) — same engine covers heads-up
 * known-vs-known, hand-vs-range, range-vs-range, and 3+-way pots.
 *
 * Equity counts hero as a "win" only if hero's hand is the strict best
 * among hero + all villains; a "tie" if hero shares the best score with at
 * least one villain (split-pot share isn't modeled here — this reports tie
 * *frequency*, not exact $ share for 3-plus-way chops).
 */
export function calculateEquityMultiway(
  hero: HandSpec,
  board: string[],
  villains: HandSpec[],
  trials = 20000,
  seed?: number,
): EquityResult {
  validateNoDuplicateKnownCards(hero, board, villains);
  const rng = new Rng(seed);
  const boardUsed = new Set(board);
  let wins = 0;
  let ties = 0;
  let losses = 0;
  const cardsNeededBoard = 5 - board.length;

  for (let t = 0; t < trials; t++) {
    const used = new Set(boardUsed);
    const heroHand = sampleFromSpec(hero, used, rng);
    heroHand.forEach((c) => used.add(c));

    const villainHands: string[][] = [];
    for (const spec of villains) {
      const vh = sampleFromSpec(spec, used, rng);
      vh.forEach((c) => used.add(c));
      villainHands.push(vh);
    }

    const remainingDeck = DECK.filter((c) => !used.has(c));
    rng.shuffle(remainingDeck);
    const simBoard = board.concat(remainingDeck.slice(0, cardsNeededBoard));

    const heroScore = bestHand(heroHand.concat(simBoard));
    let bestVillain: ReturnType<typeof bestHand> | null = null;
    for (const v of villainHands) {
      const s = bestHand(v.concat(simBoard));
      if (bestVillain === null || compareScores(s, bestVillain) > 0) bestVillain = s;
    }

    if (bestVillain === null || compareScores(heroScore, bestVillain) > 0) {
      wins++;
    } else if (compareScores(heroScore, bestVillain) === 0) {
      ties++;
    } else {
      losses++;
    }
  }

  return { win: wins / trials, tie: ties / trials, lose: losses / trials, trials };
}

export type Tier = "live" | "settled" | "river";

export interface ComputeEquityOptions {
  tier: Tier;
  /** Wide range-vs-range spots cap trial counts lower — pass true when hero
   * or any villain is a range spec (not a concrete hand or null). */
  isRangeHeavy?: boolean;
  seed?: number;
}

export interface ComputeEquityResult {
  result: EquityResult;
  equity: number;
  /** Display string with tier-appropriate precision — never show more
   * precision than the trial count's standard error actually supports. */
  displayEquity: string;
}

function trialsForTier(tier: Tier, isRangeHeavy: boolean): number {
  if (tier === "river") return 1;
  if (tier === "live") return isRangeHeavy ? 5000 : 2500;
  return isRangeHeavy ? 10000 : 17500;
}

/**
 * Wraps `calculateEquityMultiway` with client-perf trial-count tiering and
 * a matching display-precision decision baked in at the same call site —
 * see plan: at 2,000 trials, standard error on ~50% equity is ≈±1.1pp, so
 * showing a decimal while the user is still typing is false precision.
 */
export function computeEquity(
  hero: HandSpec,
  board: string[],
  villains: HandSpec[],
  options: ComputeEquityOptions,
): ComputeEquityResult {
  const isRangeHeavy = options.isRangeHeavy ?? false;
  const isRiver = board.length === 5;
  const tier: Tier = isRiver ? "river" : options.tier;
  const trials = trialsForTier(tier, isRangeHeavy);

  const result = calculateEquityMultiway(hero, board, villains, trials, options.seed);
  const equity = result.win + result.tie * 0.5;
  const displayEquity =
    tier === "live" ? `~${Math.round(equity * 100)}%` : `${(equity * 100).toFixed(1)}%`;

  return { result, equity, displayEquity };
}
