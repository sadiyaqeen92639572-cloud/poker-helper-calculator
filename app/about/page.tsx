import type { Metadata } from "next";
import Link from "next/link";
import { GESMINE_ORG, absoluteUrl } from "@/lib/seo";

const URL = absoluteUrl("about");

export const metadata: Metadata = {
  title: "Methodology — How This Site Verifies Its Poker Math",
  description:
    "The exact test protocol behind these calculators: verbatim reference assertions, a 100,000-hand fixed-seed evaluator parity check, and 50,000-trial Monte Carlo statistical parity. Deterministic arithmetic, no AI, no live-table connection.",
  alternates: { canonical: URL },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: URL,
    name: "How this site's math is built and verified",
    publisher: GESMINE_ORG,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        How this site&apos;s math is built and verified
      </h1>
      <p className="mt-3 text-slate-600">
        The engine behind these calculators — hand evaluator, Monte Carlo equity, range
        parser, odds formulas — is ported from a reference implementation and gated by a
        three-layer test suite that runs before anything ships. Here is exactly what each
        layer checks.
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

        <h2 className="text-xl font-bold text-slate-900">Layer 1 — verbatim reference assertions</h2>
        <p>
          Fixed poker facts, ported one-for-one from the reference implementation and asserted
          exactly: a pair of aces beats a pair of kings, a fully-decided river hand returns the
          same equity on every trial, the rule-of-4-and-2 outs shortcuts land where they
          should. No tolerance — these either match or the build fails.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Layer 2 — 100,000-hand evaluator parity</h2>
        <p>
          The 5-card hand evaluator is run against 100,000 random hands generated from a
          fixed seed in the reference (Python) implementation, and every rank and every
          tie-break must agree. This is the layer that catches the subtle bugs — kicker
          ordering, wheel straights, flush-over-full-house edge cases — that a handful of
          spot-check assertions would miss. The fixture is committed to the repo, so the
          same 100,000 hands are checked on every run.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Layer 3 — 50,000-trial Monte Carlo statistical parity</h2>
        <p>
          Equity numbers are produced by seeded Monte Carlo simulation — 50,000 trials per
          spot in the test suite. Because two language runtimes don&apos;t produce identical
          random streams from the same seed, this layer is a tolerance check, not a
          bit-exact one: heads-up, hand-vs-range, range-vs-range, and draw-equity spots must
          all converge within a small margin of the reference figures (standard error on a
          ~50% edge is about ±1 percentage point at these trial counts). The matchup pages
          are precomputed at build time with a fixed per-matchup seed, so the number you see
          is stable between visits.
        </p>

        <h2 className="text-xl font-bold text-slate-900">Why it&apos;s arithmetic, not a model</h2>
        <p>
          Every formula on this site is deterministic given its inputs. The equity engine is
          a simulation with a known method and a fixed seed; the odds, SPR, outs, and
          bankroll formulas are closed-form. Nothing here is a learned estimate or a
          prediction — run the same inputs twice and you get the same answer, and the method
          for each result is written out on its own page.
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
        <Link href="/equity-calculator" className="font-semibold text-emerald-600 hover:underline">
          Try the equity calculator
        </Link>
        .
      </p>
    </div>
  );
}
