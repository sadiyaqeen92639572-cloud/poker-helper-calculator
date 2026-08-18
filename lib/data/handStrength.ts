export interface HandStrengthTier {
  category: number;
  name: string;
  example: string;
  description: string;
}

export const HAND_STRENGTH_TIERS: HandStrengthTier[] = [
  {
    category: 9,
    name: "Straight Flush",
    example: "9h 8h 7h 6h 5h",
    description:
      "Five consecutive cards, all the same suit. The best possible hand short of a royal flush (which is just the ace-high straight flush). Rare enough that you can almost always play it for maximum value.",
  },
  {
    category: 8,
    name: "Four of a Kind",
    example: "9h 9d 9s 9c 2h",
    description:
      "All four cards of one rank, plus a kicker. Beats every hand except a straight flush. Comes up rarely — when it does, it's usually worth slow-playing on earlier streets to build the pot.",
  },
  {
    category: 7,
    name: "Full House",
    example: "9h 9d 9s 2c 2h",
    description:
      "Three of one rank plus a pair of another (a 'boat'). Very strong — the main danger is a bigger full house or quads, which is why full-house-vs-full-house is one of the classic big-pot coolers.",
  },
  {
    category: 6,
    name: "Flush",
    example: "Ah Jh 8h 5h 2h",
    description:
      "Five cards of the same suit, not in sequence. Strong on most boards, but vulnerable on paired or heavily suited boards where a full house or a higher flush is possible.",
  },
  {
    category: 5,
    name: "Straight",
    example: "9h 8d 7s 6c 5h",
    description:
      "Five consecutive ranks, mixed suits. Solid value, but the weakest of the 'made hand' categories above two pair — watch for flush and full-house possibilities on wet boards.",
  },
  {
    category: 4,
    name: "Three of a Kind",
    example: "9h 9d 9s 5c 2h",
    description:
      "Three cards of one rank (a set if the pair is in your hole cards, trips if one of the three is on the board). Sets are one of the best hands to have in No-Limit Hold'em since they're well-disguised and hard for opponents to put you on.",
  },
  {
    category: 3,
    name: "Two Pair",
    example: "9h 9d 5s 5c 2h",
    description:
      "Two different pairs plus a kicker. Common and often good, but easy to overvalue — a second pair on the board can leave you with the worse two pair against an opponent holding the top pair's rank.",
  },
  {
    category: 2,
    name: "One Pair",
    example: "9h 9d 5s 3c 2h",
    description:
      "The most common made hand. Quality varies enormously by kicker and by which pair it is — top pair with a strong kicker is very different from bottom pair, even though both are technically 'one pair'.",
  },
  {
    category: 1,
    name: "High Card",
    example: "Ah Jd 8s 5c 2h",
    description:
      "No pair, no straight, no flush — just the highest card plays. The weakest hand category, though a live overcard or two can still have meaningful equity as a draw against a made hand.",
  },
];
