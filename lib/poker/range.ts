import { RANKS, SUITS } from "./cards";

export type Combo = [string, string];

function pairSorted(c1: string, c2: string): Combo {
  return c1 <= c2 ? [c1, c2] : [c2, c1];
}

/**
 * All concrete 2-card combos for a hand class.
 * rank1/rank2: e.g. 'A','K'. suited: 's', 'o', or null (pair).
 */
function allCombos(rank1: string, rank2: string, suited: string | null): Combo[] {
  const combos: Combo[] = [];
  if (rank1 === rank2) {
    // pocket pair
    for (let i = 0; i < SUITS.length; i++) {
      for (let j = i + 1; j < SUITS.length; j++) {
        combos.push([rank1 + SUITS[i], rank2 + SUITS[j]]);
      }
    }
    return combos;
  }
  if (suited === "s") {
    for (const s of SUITS) combos.push([rank1 + s, rank2 + s]);
    return combos;
  }
  // offsuit
  for (const s1 of SUITS) {
    for (const s2 of SUITS) {
      if (s1 !== s2) combos.push([rank1 + s1, rank2 + s2]);
    }
  }
  return combos;
}

/**
 * Parse standard range notation into a flat, de-duplicated, sorted list of
 * concrete card-pair combos. Supports comma-separated tokens: pocket pairs
 * ('AA', '22+'), suited ('AKs', 'ATs+'), offsuit ('AKo', 'AJo+'), and exact
 * combos ('AsKd'). Keep this grammar exact — validated against the Python
 * reference, do not change the syntax.
 */
const parseRangeCache = new Map<string, Combo[]>();

export function parseRange(rangeStr: string): Combo[] {
  const cached = parseRangeCache.get(rangeStr);
  if (cached) return cached;

  const combos = new Map<string, Combo>();
  const add = (c1: string, c2: string) => {
    const pair = pairSorted(c1, c2);
    combos.set(pair.join(","), pair);
  };

  for (const rawToken of rangeStr.split(",")) {
    const token = rawToken.trim();
    if (!token) continue;

    // Exact combo, e.g. "AsKd"
    if (token.length === 4 && SUITS.includes(token[1]) && SUITS.includes(token[3])) {
      add(token.slice(0, 2), token.slice(2, 4));
      continue;
    }

    const plus = token.endsWith("+");
    const body = plus ? token.slice(0, -1) : token;

    if (body.length === 2) {
      // pocket pair, e.g. "88" or "22+"
      const rank = body[0];
      if (!plus) {
        for (const [c1, c2] of allCombos(rank, rank, null)) add(c1, c2);
        continue;
      }
      const startIdx = RANKS.indexOf(rank);
      for (const r of RANKS.slice(startIdx)) {
        for (const [c1, c2] of allCombos(r, r, null)) add(c1, c2);
      }
      continue;
    }

    if (body.length === 3) {
      // e.g. "AKs", "ATs+", "KQo", "AJo+"
      let hi = body[0];
      let lo = body[1];
      const suited = body[2];
      let hiIdx = RANKS.indexOf(hi);
      let loIdx = RANKS.indexOf(lo);
      if (hiIdx < loIdx) {
        [hi, lo] = [lo, hi];
        [hiIdx, loIdx] = [loIdx, hiIdx];
      }
      if (!plus) {
        for (const [c1, c2] of allCombos(hi, lo, suited)) add(c1, c2);
        continue;
      }
      // "+" widens the *low* card upward, keeping the high card fixed
      // (e.g. ATs+ = ATs, AJs, AQs, AKs)
      for (let rIdx = loIdx; rIdx < hiIdx; rIdx++) {
        for (const [c1, c2] of allCombos(hi, RANKS[rIdx], suited)) add(c1, c2);
      }
      continue;
    }

    throw new Error(`Unrecognized range token: ${JSON.stringify(token)}`);
  }

  const result = Array.from(combos.values()).sort((a, b) =>
    a[0] === b[0] ? (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0) : a[0] < b[0] ? -1 : 1,
  );
  parseRangeCache.set(rangeStr, result);
  return result;
}
