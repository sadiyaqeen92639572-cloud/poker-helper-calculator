import type { Metadata } from "next";
import Link from "next/link";
import { MATCHUPS } from "@/lib/data/matchups";
import { getCollectionPageSchema, SITE_URL, absoluteUrl } from "@/lib/seo";

const URL = absoluteUrl("matchups");

export const metadata: Metadata = {
  title: "Poker Hand Matchup Odds",
  description:
    "Preflop odds for common poker hand matchups — AA vs KK, AKs vs QQ, and more. Exact Monte Carlo win/tie/lose percentages for each spot.",
  alternates: { canonical: URL },
};

export default function MatchupsIndexPage() {
  const schema = getCollectionPageSchema(
    "Poker Hand Matchup Odds",
    "Preflop equity for common poker hand-vs-hand matchups.",
    URL,
    MATCHUPS.map((m) => ({
      name: m.title,
      url: absoluteUrl(`matchups/${m.slug}`),
      description: `${m.heroLabel} vs ${m.villainLabel} preflop odds.`,
    })),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Poker Hand Matchup Odds
      </h1>
      <p className="mt-3 text-slate-600">
        Preflop win/tie/lose percentages for common poker hand matchups, computed by Monte
        Carlo simulation.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MATCHUPS.map((m) => (
          <Link
            key={m.slug}
            href={`/matchups/${m.slug}`}
            className="rounded-lg border border-slate-200 bg-white p-3 text-center text-sm font-semibold text-slate-800 shadow-sm hover:border-emerald-400 hover:text-emerald-600"
          >
            {m.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
