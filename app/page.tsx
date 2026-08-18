import Link from "next/link";
import type { Metadata } from "next";
import { getSoftwareApplicationSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Poker Helper Calculator — Equity, Pot Odds & Bankroll Tools",
  description:
    "Free standalone poker equity calculator, implied odds calculator, and bankroll sizing tool. Manual card entry, no live-table connection.",
  alternates: { canonical: SITE_URL },
};

const tools = [
  {
    href: "/implied-odds-calculator/",
    title: "Implied Odds Calculator",
    description: "Pot odds + stack-to-pot ratio, to see whether a draw is worth calling.",
    live: true,
  },
  {
    href: "/toolkit/bankroll-calculator/",
    title: "Bankroll Calculator",
    description: "Kelly-criterion risk-of-ruin math — how many buy-ins you need at a stake.",
    live: true,
  },
  {
    href: "/equity-calculator/",
    title: "Equity Calculator",
    description: "Hand vs hand, hand vs range, range vs range, 3+ way pots.",
    live: true,
  },
  {
    href: "/range-vs-range-equity-calculator/",
    title: "Range vs Range Calculator",
    description: "Build both players' ranges on a 13x13 grid and get live equity.",
    live: true,
  },
  {
    href: "/matchups/",
    title: "Hand Matchup Odds",
    description: "AA vs KK, AKs vs QQ, and 18 more common preflop matchups.",
    live: true,
  },
  {
    href: "/poker-range-calculator/",
    title: "Poker Range Calculator",
    description: "Build a range and see its exact percentage of all starting hands.",
    live: true,
  },
];

const guides = [
  {
    href: "/hand-strength-guide/",
    title: "Hand Strength Guide",
    description: "The 9 hand categories, ranked, with what makes each strong or vulnerable.",
  },
  {
    href: "/position-and-starting-hands/",
    title: "Position & Starting Hands",
    description: "Every seat at the table, in order, with opening-range guidance.",
  },
  {
    href: "/bet-sizing-guide/",
    title: "Bet Sizing Guide",
    description: "Standard sizing by street — preflop, c-bets, and value vs bluff.",
  },
];

const toolkit = [
  { href: "/toolkit/opponent-notes/", title: "Opponent Notes", description: "Log tendencies on players you've faced." },
  { href: "/toolkit/table-selection/", title: "Table Selection", description: "Score a table before you sit down." },
  { href: "/toolkit/session-guardian/", title: "Session Guardian", description: "Stop-loss, stop-win, and a session timer." },
  { href: "/toolkit/hand-log/", title: "Hand & Volume Log", description: "Track results over time — bb/100, automatically." },
];

export default function Home() {
  const schema = getSoftwareApplicationSchema(
    "Poker Helper Calculator",
    "Standalone poker equity, pot odds, implied odds, and bankroll calculators.",
    SITE_URL,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Poker Helper Calculator
      </h1>
      <p className="mt-3 max-w-xl text-slate-600">
        Standalone, manual-entry poker math tools — equity, pot odds, implied odds, and
        bankroll sizing. You enter your own cards and numbers; there&apos;s no live-table
        connection or automation of any kind.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) =>
          tool.live ? (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
            >
              <h2 className="font-bold text-slate-900">{tool.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
            </Link>
          ) : (
            <div
              key={tool.href}
              className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 opacity-70"
            >
              <h2 className="font-bold text-slate-500">{tool.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
              <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Coming soon
              </span>
            </div>
          ),
        )}
      </div>

      <h2 className="mt-14 text-xl font-bold text-slate-900">Reference guides</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
          >
            <h3 className="font-bold text-slate-900">{guide.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{guide.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold text-slate-900">Home-game toolkit</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {toolkit.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
          >
            <h3 className="font-bold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
