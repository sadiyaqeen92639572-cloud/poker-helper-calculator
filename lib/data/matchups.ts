export interface Matchup {
  slug: string;
  heroCards: [string, string];
  villainCards: [string, string];
  heroLabel: string;
  villainLabel: string;
  title: string;
  /** Genuine per-spot explanation — why THIS matchup plays differently
   * than a superficially similar one, not a templated paragraph with the
   * card names swapped. See plan Route Structure note on /matchups/. */
  whyDifferent: string;
}

export const MATCHUPS: Matchup[] = [
  {
    slug: "aa-vs-kk",
    heroCards: ["Ah", "As"],
    villainCards: ["Kh", "Ks"],
    heroLabel: "AA",
    villainLabel: "KK",
    title: "AA vs KK",
    whyDifferent:
      "The classic cooler: both players have a premium pair and neither is folding preflop, so essentially all of KK's equity comes from spiking a king on the flop — about 1 in 8 times. Postflop, KK's only real out disappears the moment an ace-free board still lets AA continue betting for value on nearly every texture.",
  },
  {
    slug: "aa-vs-qq",
    heroCards: ["Ah", "As"],
    villainCards: ["Qh", "Qs"],
    heroLabel: "AA",
    villainLabel: "QQ",
    title: "AA vs QQ",
    whyDifferent:
      "Slightly worse for AA than AA vs KK: AA's equity edge shrinks a bit further down the pocket-pair ladder (AA vs KK, QQ, JJ trends downward in that order), since a lower pocket pair leaves more overcards and connecting ranks live on the board for run-outs that don't directly help QQ but do open more texture variety overall.",
  },
  {
    slug: "aa-vs-aks",
    heroCards: ["Ac", "Ad"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "AA",
    villainLabel: "AKs",
    title: "AA vs AKs",
    whyDifferent:
      "AKs blocks one of hero's outs to trips (only two aces left instead of three combos worth) but gains a real backdoor flush and a much wider set of connecting boards than a pocket pair villain — this is a bigger favorite for AA than AA vs KK/QQ, but not as dominant as raw 'two overcards' math would suggest.",
  },
  {
    slug: "aa-vs-72o",
    heroCards: ["Ah", "As"],
    villainCards: ["7c", "2d"],
    heroLabel: "AA",
    villainLabel: "72o",
    title: "AA vs 72o",
    whyDifferent:
      "The textbook worst-starting-hand matchup — 72o has no pair, no real straight or flush shape, and no overcard to AA. It survives purely on the small chance it flops two pair, trips, or a miracle straight; there's no 'live overcard' equity like AK or KQ would have.",
  },
  {
    slug: "kk-vs-aks",
    heroCards: ["Kc", "Kd"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "KK",
    villainLabel: "AKs",
    title: "KK vs AKs",
    whyDifferent:
      "KK blocks two of AKs's outs to a set-beating trip-aces scenario (only two aces remain), but AKs still has a live ace to pair for top pair plus a backdoor flush draw — meaningfully better for the underdog than a pure lower pocket pair would be.",
  },
  {
    slug: "kk-vs-qq",
    heroCards: ["Kc", "Kd"],
    villainCards: ["Qh", "Qs"],
    heroLabel: "KK",
    villainLabel: "QQ",
    title: "KK vs QQ",
    whyDifferent:
      "A near-mirror of AA vs KK one tier down — QQ's only clean out is a queen, and it also has to dodge any ace, since an ace over the top doesn't help QQ but does nothing to KK's hand either, unlike a king which pairs KK's set.",
  },
  {
    slug: "qq-vs-aks",
    heroCards: ["Qc", "Qd"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "QQ",
    villainLabel: "AKs",
    title: "QQ vs AKs",
    whyDifferent:
      "The closest thing to a coinflip in this list — QQ is ahead of a made hand but behind two live overcards with a flush draw backup, so this is usually within a few points of 50/50 depending on suit blockers, unlike QQ vs a single overcard hand like AJ which favors QQ more clearly.",
  },
  {
    slug: "jj-vs-aks",
    heroCards: ["Jc", "Jd"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "JJ",
    villainLabel: "AKs",
    title: "JJ vs AKs",
    whyDifferent:
      "JJ is still the favorite here, but only barely — the gap over AKs keeps shrinking as the pair gets smaller, which is why 'always get it in with JJ preflop' is close to correct against a single AK-type hand but stops being a comfortable edge the way AA or KK's would be.",
  },
  {
    slug: "tt-vs-aks",
    heroCards: ["Tc", "Td"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "TT",
    villainLabel: "AKs",
    title: "TT vs AKs",
    whyDifferent:
      "Similar shape to JJ vs AKs but slightly worse for the pair, since AKs picks up more backdoor straight possibilities running through a ten than it does running through a jack.",
  },
  {
    slug: "aks-vs-qq",
    heroCards: ["Ah", "Kh"],
    villainCards: ["Qc", "Qd"],
    heroLabel: "AKs",
    villainLabel: "QQ",
    title: "AKs vs QQ",
    whyDifferent:
      "Mirror framing of QQ vs AKs above — worth its own page because 'AK vs QQ' and 'QQ vs AK' are both common searches, and this framing is what an AK-holder actually wants to know before shoving over a 3-bet.",
  },
  {
    slug: "aks-vs-ako",
    heroCards: ["Ah", "Kh"],
    villainCards: ["Ac", "Kd"],
    heroLabel: "AKs",
    villainLabel: "AKo",
    title: "AKs vs AKo",
    whyDifferent:
      "The suitedness gap in isolation — both hands are otherwise identical, so the entire equity edge comes from AKs's backdoor flush outs. It's a real but small edge (a few points), the reference number for how much 'suited' is actually worth on its own.",
  },
  {
    slug: "aa-vs-kqs",
    heroCards: ["Ah", "As"],
    villainCards: ["Kh", "Qh"],
    heroLabel: "AA",
    villainLabel: "KQs",
    title: "AA vs KQs",
    whyDifferent:
      "KQs adds a second overcard and a real straight shape (any broadway run-out) on top of the flush draw AK-type hands get, so it runs a bit better against AA than a single-overcard suited hand would, even though it's still a big underdog preflop.",
  },
  {
    slug: "99-vs-aks",
    heroCards: ["9c", "9d"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "99",
    villainLabel: "AKs",
    title: "99 vs AKs",
    whyDifferent:
      "99 is still a small favorite over AKs, but the margin has narrowed to nearly a coinflip by this point in the pair ladder — this is the matchup that shows how close 'a pair is ahead of two overcards' gets to breaking even once the pair is this far below the AK/AQ threshold, even though it hasn't flipped yet.",
  },
  {
    slug: "22-vs-aks",
    heroCards: ["2c", "2d"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "22",
    villainLabel: "AKs",
    title: "22 vs AKs",
    whyDifferent:
      "The smallest possible pocket pair against the strongest possible non-pair hand — 22 needs to flop a set or better almost every time to win, since it has zero overcard equity and AKs has two live overcards plus a flush draw.",
  },
  {
    slug: "aqs-vs-aks",
    heroCards: ["Ac", "Qc"],
    villainCards: ["Ah", "Kh"],
    heroLabel: "AQs",
    villainLabel: "AKs",
    title: "AQs vs AKs",
    whyDifferent:
      "Both hands share the ace, which removes two of the four aces from the deck and sharply reduces how often either side pairs up — this is a domination spot (AK 'has AQ's kicker beat') more than a coinflip, and the shared ace is exactly why it plays so differently from AQs vs KQs.",
  },
  {
    slug: "ajs-vs-kqs",
    heroCards: ["Ac", "Jc"],
    villainCards: ["Kh", "Qh"],
    heroLabel: "AJs",
    villainLabel: "KQs",
    title: "AJs vs KQs",
    whyDifferent:
      "No shared or blocked ranks between the two hands, so both sides have fully live overcard, straight, and flush equity — but this isn't a coinflip. AJs holds a real edge from the ace, which outranks either of KQ's two cards; a good reference point for how two unpaired broadway-ish hands run when nothing blocks or dominates the other, but higher-card value still matters.",
  },
  {
    slug: "aa-vs-22",
    heroCards: ["Ah", "As"],
    villainCards: ["2c", "2d"],
    heroLabel: "AA",
    villainLabel: "22",
    title: "AA vs 22",
    whyDifferent:
      "A dominant preflop favorite for AA — 22 has no overcard equity at all and needs to flop a set (about 1 in 8) or better to have any real chance. Counterintuitively, AA actually runs slightly better against bigger pocket pairs like KK or QQ than against 22: with no overcards live at all, 22's remaining outs come entirely from connecting boards, which keeps its equity a bit higher than 'zero live cards' alone would suggest.",
  },
  {
    slug: "kqs-vs-jts",
    heroCards: ["Kh", "Qh"],
    villainCards: ["Jc", "Tc"],
    heroLabel: "KQs",
    villainLabel: "JTs",
    title: "KQs vs JTs",
    whyDifferent:
      "Not as close as it looks on paper — KQs is actually a clear favorite here, mainly because K and Q block two of the four straights (9-high and ace-high) that would complete JT's most likely draw, on top of already having the two higher cards. The overlapping straight cards (a 9 or a jack helps both) narrow the gap versus a fully live overcard hand, but don't erase KQs's real edge.",
  },
  {
    slug: "ako-vs-qq",
    heroCards: ["Ah", "Kd"],
    villainCards: ["Qc", "Qs"],
    heroLabel: "AKo",
    villainLabel: "QQ",
    title: "AKo vs QQ",
    whyDifferent:
      "The offsuit version of AKs vs QQ — a few points worse for AK since it loses the backdoor flush draw, which matters more here than in most matchups because AK vs QQ is already close to a coinflip, so losing a small equity source is more noticeable than in a spot where one side already dominates.",
  },
  {
    slug: "qq-vs-kk",
    heroCards: ["Qh", "Qs"],
    villainCards: ["Kc", "Kd"],
    heroLabel: "QQ",
    villainLabel: "KK",
    title: "QQ vs KK",
    whyDifferent:
      "The flip framing of KK vs QQ — worth its own page for the player who three-bet with QQ and is now facing a shove, since 'am I ahead of a random 4-bet range' and 'what's my equity specifically against KK' are different questions with different answers.",
  },
];
