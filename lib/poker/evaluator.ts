import { HAND_CATEGORY, cardRank, cardSuit } from "./cards";

/**
 * A hand score: `[category, ...tiebreakers]`, category 9 (straight flush)
 * down to 1 (high card). Length varies by category — mirrors the Python
 * `poker_math.py` `evaluate_5()` return shape exactly (plain flat tuple,
 * no padding, no encoding). Compare with `compareScores` — lexicographic
 * left-to-right, same as Python's native tuple comparison. Category always
 * comes first and dominates; same-category scores are always the same
 * length by construction, so no padding logic is needed.
 */
export type Score = number[];

function combinations5(cards: string[]): string[][] {
  const result: string[][] = [];
  const n = cards.length;
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      for (let c = b + 1; c < n; c++) {
        for (let d = c + 1; d < n; d++) {
          for (let e = d + 1; e < n; e++) {
            result.push([cards[a], cards[b], cards[c], cards[d], cards[e]]);
          }
        }
      }
    }
  }
  return result;
}

export function compareScores(a: Score, b: Score): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? -1;
    const bv = b[i] ?? -1;
    if (av !== bv) return av - bv;
  }
  return 0;
}

/** Return a comparable score for exactly 5 cards. Higher score = better hand. */
export function evaluate5(cards: string[]): Score {
  const ranks = cards.map(cardRank).sort((x, y) => y - x);
  const suits = cards.map(cardSuit);
  const isFlush = new Set(suits).size === 1;

  const uniqueRanks = Array.from(new Set(ranks)).sort((x, y) => y - x);
  let isStraight = false;
  let straightHigh = 0;
  if (uniqueRanks.length === 5) {
    if (uniqueRanks[0] - uniqueRanks[4] === 4) {
      isStraight = true;
      straightHigh = uniqueRanks[0];
    } else if (
      uniqueRanks[0] === 14 &&
      uniqueRanks[1] === 5 &&
      uniqueRanks[2] === 4 &&
      uniqueRanks[3] === 3 &&
      uniqueRanks[4] === 2
    ) {
      isStraight = true;
      straightHigh = 5; // wheel plays as 5-high
    }
  }

  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  // groups: [rank, count] sorted by count desc then rank desc
  const groups = Array.from(counts.entries()).sort((x, y) =>
    y[1] - x[1] !== 0 ? y[1] - x[1] : y[0] - x[0],
  );
  const groupRanks = groups.map(([r]) => r);
  const groupCounts = groups.map(([, c]) => c);

  if (isStraight && isFlush) return [9, straightHigh];
  if (groupCounts[0] === 4) return [8, groupRanks[0], groupRanks[1]];
  if (groupCounts[0] === 3 && groupCounts[1] === 2)
    return [7, groupRanks[0], groupRanks[1]];
  if (isFlush) return [6, ...ranks];
  if (isStraight) return [5, straightHigh];
  if (groupCounts[0] === 3) {
    const kickers = ranks.filter((r) => r !== groupRanks[0]);
    return [4, groupRanks[0], ...kickers];
  }
  if (groupCounts[0] === 2 && groupCounts[1] === 2) {
    const pairRanks = [groupRanks[0], groupRanks[1]].sort((x, y) => y - x);
    const kicker = ranks.find((r) => !pairRanks.includes(r))!;
    return [3, ...pairRanks, kicker];
  }
  if (groupCounts[0] === 2) {
    const kickers = ranks.filter((r) => r !== groupRanks[0]);
    return [2, groupRanks[0], ...kickers];
  }
  return [1, ...ranks];
}

/** Best 5-card hand out of 5, 6, or 7 cards. */
export function bestHand(cards: string[]): Score {
  if (cards.length === 5) return evaluate5(cards);
  let best: Score | null = null;
  for (const combo of combinations5(cards)) {
    const score = evaluate5(combo);
    if (best === null || compareScores(score, best) > 0) best = score;
  }
  return best!;
}

export function handCategoryName(score: Score): string {
  return HAND_CATEGORY[score[0]];
}
