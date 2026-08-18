export interface PositionInfo {
  name: string;
  abbr: string;
  table: "9-max" | "6-max";
  order: number;
  description: string;
  startingHandGuidance: string;
}

export const POSITIONS_9MAX: PositionInfo[] = [
  {
    name: "Under the Gun",
    abbr: "UTG",
    table: "9-max",
    order: 1,
    description: "First to act preflop, furthest from the button — acts with the least information.",
    startingHandGuidance:
      "Tightest range at the table: premium pairs (TT+), strong broadways (AQ+), and AKo/AKs. Speculative hands like suited connectors are generally too loose this early.",
  },
  {
    name: "UTG+1",
    abbr: "UTG+1",
    table: "9-max",
    order: 2,
    description: "One seat after UTG — still early position, still acting with very little information.",
    startingHandGuidance: "Similar to UTG, perhaps a touch wider — add a few more suited broadways.",
  },
  {
    name: "Middle Position",
    abbr: "MP",
    table: "9-max",
    order: 3,
    description: "The first of the 'middle' seats — more players still to act than in the cutoff/button.",
    startingHandGuidance: "Can open a moderately wider range than early position: add suited connectors and smaller pairs.",
  },
  {
    name: "Lojack",
    abbr: "LJ",
    table: "9-max",
    order: 4,
    description: "Two seats before the cutoff — fewer players left to act behind you than earlier positions.",
    startingHandGuidance: "Range widens further — most suited aces and more offsuit broadways become playable.",
  },
  {
    name: "Hijack",
    abbr: "HJ",
    table: "9-max",
    order: 5,
    description: "One seat before the cutoff — good position with only two players left to act before the blinds.",
    startingHandGuidance: "A meaningfully wider opening range — many suited connectors and one-gappers are standard opens here.",
  },
  {
    name: "Cutoff",
    abbr: "CO",
    table: "9-max",
    order: 6,
    description: "One seat before the button — second-best position at the table.",
    startingHandGuidance: "Wide opening range, close to (but usually still a bit tighter than) the button's.",
  },
  {
    name: "Button",
    abbr: "BTN",
    table: "9-max",
    order: 7,
    description: "Last to act on every postflop street — the single best seat at the table.",
    startingHandGuidance: "The widest opening range by far — the positional advantage on every future street justifies playing many more hands.",
  },
  {
    name: "Small Blind",
    abbr: "SB",
    table: "9-max",
    order: 8,
    description: "Posts a forced bet, acts first on every postflop street against the big blind — the worst position at the table.",
    startingHandGuidance:
      "Range depends heavily on whether the pot's been raised. Unopened, some players limp or raise a wide range; facing a raise, tightens up significantly due to the positional disadvantage.",
  },
  {
    name: "Big Blind",
    abbr: "BB",
    table: "9-max",
    order: 9,
    description: "Posts the largest forced bet, acts last preflop (a 'free' option to check if unraised).",
    startingHandGuidance:
      "Gets the best preflop price of anyone at the table, so defends (calls) a wide range against a single raise, even with hands that wouldn't be opened from other seats.",
  },
];
