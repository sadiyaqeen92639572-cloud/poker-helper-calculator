import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MATCHUPS } from "@/lib/data/matchups";
import { calculateEquityMultiway } from "@/lib/poker/equity";
import { equityOf } from "@/lib/poker/types";
import { CardLabel } from "@/components/equity/CardSlot";
import { getFAQPageSchema, getSoftwareApplicationSchema, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return MATCHUPS.map((m) => ({ slug: m.slug }));
}

function findMatchup(slug: string) {
  return MATCHUPS.find((m) => m.slug === slug);
}

// Build-time precomputed equity (not live client computation) for instant
// LCP — matches the plan's requirement for /matchups/ pages. Fixed seed
// per page keeps the number stable across rebuilds.
function computeMatchupEquity(matchup: NonNullable<ReturnType<typeof findMatchup>>) {
  const seed = matchup.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return calculateEquityMultiway(matchup.heroCards, [], [matchup.villainCards], 50000, seed);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const matchup = findMatchup(slug);
  if (!matchup) return {};
  const url = `${SITE_URL}/matchups/${matchup.slug}/`;
  return {
    title: `${matchup.title} Odds`,
    description: `${matchup.heroLabel} vs ${matchup.villainLabel} preflop equity, computed by Monte Carlo simulation. See exact win/tie/lose percentages and why this matchup plays the way it does.`,
    alternates: { canonical: url },
  };
}

export default async function MatchupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const matchup = findMatchup(slug);
  if (!matchup) notFound();

  const result = computeMatchupEquity(matchup);
  const url = `${SITE_URL}/matchups/${matchup.slug}/`;

  const faqs = [
    {
      question: `What are the odds of ${matchup.heroLabel} vs ${matchup.villainLabel}?`,
      answer: `${matchup.heroLabel} wins ${(result.win * 100).toFixed(1)}% of the time, ties ${(result.tie * 100).toFixed(1)}%, and loses ${(result.lose * 100).toFixed(1)}% against ${matchup.villainLabel}, based on a ${result.trials.toLocaleString()}-trial Monte Carlo simulation dealt out to the river.`,
    },
    {
      question: "Is this preflop or postflop equity?",
      answer:
        "This is preflop all-in equity — both hands are dealt out to a random river with no further betting decisions. It's the standard number quoted for 'X vs Y odds' searches.",
    },
    {
      question: "Why might my actual result differ?",
      answer:
        "This number assumes both hands go to showdown with no more folding. In a real hand with betting on each street, the player with worse preflop equity can still win more often than this number suggests by folding when behind, or less often by continuing when they shouldn't.",
    },
  ];

  const softwareSchema = getSoftwareApplicationSchema(
    `${matchup.title} Odds Calculator`,
    `${matchup.heroLabel} vs ${matchup.villainLabel} preflop poker equity.`,
    url,
  );
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Matchups", url: `${SITE_URL}/matchups/` },
    { name: matchup.title, url },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {matchup.title} Odds
      </h1>

      <div className="mt-6 flex items-center justify-center gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <HandBlock label={matchup.heroLabel} cards={matchup.heroCards} />
        <span className="text-lg font-black text-slate-400">vs</span>
        <HandBlock label={matchup.villainLabel} cards={matchup.villainCards} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label={`${matchup.heroLabel} wins`} value={result.win} highlight />
        <Stat label="Tie" value={result.tie} />
        <Stat label={`${matchup.villainLabel} wins`} value={result.lose} />
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        {result.trials.toLocaleString()}-trial Monte Carlo simulation, preflop all-in equity
      </p>

      <section className="mt-10 space-y-3 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">Why this matchup plays the way it does</h2>
        <p>{matchup.whyDifferent}</p>
      </section>

      <p className="mt-8 text-sm text-slate-600">
        Want a different matchup, a range instead of an exact hand, or a specific board?{" "}
        <Link href="/equity-calculator/" className="font-semibold text-emerald-600 hover:underline">
          Use the full equity calculator
        </Link>
        .
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">FAQ</h2>
        <dl className="mt-4 space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-slate-900">{faq.question}</dt>
              <dd className="mt-1 text-slate-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function HandBlock({ label, cards }: { label: string; cards: [string, string] }) {
  return (
    <div className="text-center">
      <div className="flex gap-1">
        {cards.map((c) => (
          <span
            key={c}
            className={`flex h-12 w-9 items-center justify-center rounded border-2 text-base font-bold ${
              c[1] === "h" || c[1] === "d"
                ? "border-red-300 bg-red-50 text-red-600"
                : "border-slate-300 bg-slate-50 text-slate-900"
            }`}
          >
            <CardLabel card={c} />
          </span>
        ))}
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-4 ${highlight ? "bg-emerald-50" : "bg-slate-50"}`}>
      <div className={`text-2xl font-black ${highlight ? "text-emerald-600" : "text-slate-700"}`}>
        {(value * 100).toFixed(1)}%
      </div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}
