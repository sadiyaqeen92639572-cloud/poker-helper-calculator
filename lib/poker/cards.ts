export const RANKS = "23456789TJQKA";
export const SUITS = "cdhs";

export const RANK_VALUE: Record<string, number> = Object.fromEntries(
  RANKS.split("").map((r, i) => [r, i + 2]),
);

export const DECK: string[] = RANKS.split("").flatMap((r) =>
  SUITS.split("").map((s) => r + s),
);

export const HAND_CATEGORY: Record<number, string> = {
  9: "Straight Flush",
  8: "Four of a Kind",
  7: "Full House",
  6: "Flush",
  5: "Straight",
  4: "Three of a Kind",
  3: "Two Pair",
  2: "One Pair",
  1: "High Card",
};

export function cardRank(card: string): number {
  return RANK_VALUE[card[0]];
}

export function cardSuit(card: string): string {
  return card[1];
}
