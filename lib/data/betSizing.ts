export interface BetSizingSpot {
  street: string;
  sizing: string;
  description: string;
}

export const BET_SIZING_GUIDE: BetSizingSpot[] = [
  {
    street: "Preflop open-raise",
    sizing: "2-2.5x the big blind (2.5-3x in live games)",
    description:
      "The standard opening size in most modern games. Sizing up slightly (to 3-4x) is common from early position or against known loose limpers, since a bigger raise discourages cheap multi-way pots.",
  },
  {
    street: "Preflop 3-bet",
    sizing: "~3x the original raise in position, ~4x out of position",
    description:
      "3-betting bigger out of position compensates for the positional disadvantage by making it less profitable for the original raiser to continue with speculative hands.",
  },
  {
    street: "Flop continuation bet",
    sizing: "33-75% of the pot, board-texture dependent",
    description:
      "Smaller sizes (25-40%) work well on dry, disconnected boards where few hands improve; larger sizes (60-75%+) are more common on wet, draw-heavy boards where charging draws their correct price matters more.",
  },
  {
    street: "Turn bet",
    sizing: "50-75% of the pot",
    description:
      "Turn bets tend to run a bit bigger than flop c-bets on average — by the turn, ranges are narrower and a bigger bet extracts more value from hands that have already committed on the flop.",
  },
  {
    street: "River bet (value)",
    sizing: "50-100%+ of the pot",
    description:
      "River sizing with a value hand should be built around what a realistic bluff-catching portion of the opponent's range would call — too small leaves value on the table, too large gets calls only by hands that already beat you.",
  },
  {
    street: "River bet (bluff)",
    sizing: "Similar to your value-betting size for the same line",
    description:
      "Using a different size for bluffs than for value bets is one of the most exploitable habits in poker — balanced players size bluffs and value bets the same way so opponents can't simply fold to big bets and call small ones.",
  },
];
