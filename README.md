# Poker Helper Calculator

Live at **[pokerhelpercalculator.com](https://pokerhelpercalculator.com/)** — standalone, manual-entry poker math tools for equity, pot odds, implied odds, and bankroll sizing. No live-table connection, no automation, no scraping of any poker client: every number comes from cards and stakes you type in yourself, which keeps the tool inside the terms of service of every poker site and app store.

Built with Next.js 15 (App Router) + TypeScript + Tailwind v4, deployed to Cloudflare Pages via `@cloudflare/next-on-pages`. Equity math runs client-side in a Web Worker (`workers/poker.worker.ts`, wired through `comlink`) so heavy hand-vs-range simulations never block the UI thread or leave the browser.

## Tools

- **[Implied Odds Calculator](https://pokerhelpercalculator.com/implied-odds-calculator/)** — evaluates whether a draw justifies calling by weighing pot odds against stack-to-pot ratio and expected future action.
- **[Equity Calculator](https://pokerhelpercalculator.com/equity-calculator/)** — hand vs. hand, hand vs. range, and multi-way pot equity, computed via the worker-side evaluator (`lib/poker/evaluator.ts`, `lib/poker/equity.ts`).
- **[Range vs Range Calculator](https://pokerhelpercalculator.com/range-vs-range-equity-calculator/)** — visual 13x13 starting-hand grid for building both players' ranges with live equity as you click.
- **[Poker Range Calculator](https://pokerhelpercalculator.com/poker-range-calculator/)** — converts a selected grid into percentage-of-hands and combo counts.
- **[Bankroll Calculator](https://pokerhelpercalculator.com/toolkit/bankroll-calculator/)** — Kelly-criterion sizing for how many buy-ins a given stake actually requires.
- **[Hand Matchup Odds](https://pokerhelpercalculator.com/matchups/)** — pre-computed classic preflop confrontations (AA vs KK, AKs vs QQ, etc.), statically generated per matchup slug (`app/matchups/[slug]`).

## Reference guides

- [Hand Strength Guide](https://pokerhelpercalculator.com/hand-strength-guide/)
- [Position & Starting Hands](https://pokerhelpercalculator.com/position-and-starting-hands/)
- [Bet Sizing Guide](https://pokerhelpercalculator.com/bet-sizing-guide/)

## Home-game toolkit

Session-level utilities for tracking a live game rather than a single hand: [opponent notes](https://pokerhelpercalculator.com/toolkit/opponent-notes/), [table selection scoring](https://pokerhelpercalculator.com/toolkit/table-selection/), [session guardian](https://pokerhelpercalculator.com/toolkit/session-guardian/) (stop-loss/win-goal tracking), and a [hand log](https://pokerhelpercalculator.com/toolkit/hand-log/) with bb/100 win-rate metrics.

## Project structure

```
app/                    Next.js App Router routes — one folder per tool/guide
components/
  ├─ equity/            Equity calculator UI
  ├─ pot-odds/          Pot odds + implied odds UI
  ├─ outs/              Outs counter widgets
  ├─ toolkit/           Home-game toolkit screens
  ├─ reference/         Hand strength / position / bet sizing content components
  ├─ layout/            Shared shell (nav, footer)
  └─ seo/               Structured data (JSON-LD) helpers
lib/
  ├─ poker/             Core engine — evaluator, equity, RNG, ranges, bankroll math, outs, SPR
  └─ data/              Static reference datasets (matchups, positions, hand strength, bet sizing tables)
workers/
  └─ poker.worker.ts    Web Worker entry — runs equity simulations off the main thread
android/ ios/           Capacitor wrapper for a native app build
```

## Development

```bash
npm run dev      # local dev server
npm run test     # vitest
npm run lint     # eslint
```

## Deploy

```bash
npm run deploy    # build → next-on-pages → wrangler pages deploy
```

Deploys to Cloudflare Pages, project `poker-helper-calculator`.

## Free Companion Tools

- [Pot Odds Quick Check](https://sadiyaqeen92639572-cloud.github.io/pot-odds-quick-check/) — instant call-or-fold verdict from pot size, bet to call, and outs (rule of 4 and 2). Powered by [Poker Helper Calculator](https://pokerhelpercalculator.com/) — for implied odds, range-vs-range equity, and bankroll sizing, use the full toolkit.
