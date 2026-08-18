import type { Metadata } from "next";
import Link from "next/link";
import { GESMINE_ORG, SITE_URL } from "@/lib/seo";

const URL = `${SITE_URL}/about/`;

export const metadata: Metadata = {
  title: "About Poker Helper Calculator",
  description:
    "Who runs Poker Helper Calculator, how its math is built and tested, and why every calculator here is deterministic arithmetic — no AI, no live-table connection.",
  alternates: { canonical: URL },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: URL,
    name: "About Poker Helper Calculator",
    publisher: GESMINE_ORG,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        About Poker Helper Calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Standalone, manual-entry poker math tools — what they are, how the math is built and
        checked, and what this site deliberately doesn&apos;t do.
      </p>

      <section className="mt-10 space-y-4 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">What this site is</h2>
        <p>
          Poker Helper Calculator is a set of calculators for hand equity, pot/implied odds,
          outs, ranges, and bankroll sizing, plus a small home-game companion toolkit
          (opponent notes, table selection, session tracking, hand log). You enter your own
          cards and numbers; the calculator does the arithmetic. There is no live-table
          connection, no screen-scraping, no automation, and no real-time assistance of any
          kind — every result requires you to type in the inputs yourself.
        </p>

        <h2 className="text-xl font-bold text-slate-900">How the math is built and checked</h2>
        <p>
          The hand evaluator, Monte Carlo equity engine, range-notation parser, and odds
          formulas are ported from a reference implementation and verified with three layers
          of automated tests before any calculator ships: exact-match assertions against known
          poker facts (e.g. a pair of aces beats a pair of kings), an exhaustive parity check
          running 100,000 random hands through the evaluator to catch subtle tie-break bugs,
          and statistical parity checks confirming Monte Carlo results converge within
          tolerance of the reference numbers. Every formula on this site is deterministic
          arithmetic given its inputs — not a model, not an estimate dressed up as one.
        </p>

        <h2 className="text-xl font-bold text-slate-900">What this site deliberately avoids</h2>
        <p>
          No &quot;AI&quot; framing anywhere on this site, because that language implies live or
          automated table assistance, which this is not. No real-money-site connection of any
          kind. On real-money sites, using any tool mid-hand — including this one — can violate
          the site&apos;s terms of service regardless of automation; this site is positioned as a
          pre-session study tool and post-session review tool for that context, and a fully
          live-usable companion for home games where no such terms apply.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Who runs this site</h2>
        <p>
          Poker Helper Calculator is operated by Gesmine-Invest Limited (UK Company No.
          14120136), registered at Hardy House, 269 Poynders Gardens, London, SW4 8PQ.
        </p>
      </section>

      <p className="mt-10 text-sm text-slate-600">
        Want to see the math in action?{" "}
        <Link href="/equity-calculator/" className="font-semibold text-emerald-600 hover:underline">
          Try the equity calculator
        </Link>
        .
      </p>
    </div>
  );
}
