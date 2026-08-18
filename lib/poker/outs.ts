import { DECK } from "./cards";
import { bestHand, compareScores } from "./evaluator";

/**
 * Count outs: remaining cards that make hero's hand beat villain's hand.
 *
 * "Outs" is meaningless in a vacuum — pairing your Ace "improves your
 * category" but still loses to a set. A real out has to be defined against
 * a specific hand you're trying to beat, so `villain` is a required
 * concrete 2-card hand (your best read/assumption of what they hold), not
 * an abstract range. Counts a single next community card arriving (the
 * standard convention Rule-of-4/Rule-of-2 already assume — Rule of 4
 * doubles this count to account for BOTH remaining cards on the flop).
 * Only valid with a known board of 3 or 4 cards (flop or turn).
 */
export function countOuts(hero: string[], board: string[], villain: string[]): number {
  if (board.length !== 3 && board.length !== 4) {
    throw new Error("Outs are only meaningful on the flop (3) or turn (4)");
  }

  const used = new Set([...hero, ...board, ...villain]);
  const unseen = DECK.filter((c) => !used.has(c));

  let outs = 0;
  for (const card of unseen) {
    const newBoard = [...board, card];
    const heroScore = bestHand([...hero, ...newBoard]);
    const villainScore = bestHand([...villain, ...newBoard]);
    if (compareScores(heroScore, villainScore) > 0) outs++;
  }
  return outs;
}

/**
 * Quick mental-math approximation: Rule of 4 (two cards to come, i.e. on
 * the flop) or Rule of 2 (one card to come, i.e. on the turn). Returns an
 * approximate equity fraction (0-1). Only meant as a fast at-table
 * estimate, not a substitute for the exact Monte Carlo equity.
 */
export function outsToEquityRule(outs: number, cardsToCome: 1 | 2): number {
  if (cardsToCome === 2) return Math.min(outs * 4, 100) / 100;
  if (cardsToCome === 1) return Math.min(outs * 2, 100) / 100;
  throw new Error("Rule of 4/2 only applies with 1 or 2 cards left to come");
}
