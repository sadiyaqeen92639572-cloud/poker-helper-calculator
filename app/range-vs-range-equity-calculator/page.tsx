import type { Metadata } from "next";
import Link from "next/link";
import { RangeVsRangeCalculator } from "@/components/equity/RangeVsRangeCalculator";
import { FormulaBlock } from "@/components/seo/FormulaBlock";
import {
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getHowToSchema,
  SITE_URL,
} from "@/lib/seo";

const URL = `${SITE_URL}/range-vs-range-equity-calculator/`;

export const metadata: Metadata = {
  title: "Range vs Range Equity Calculator",
  description:
    "Free range vs range poker equity calculator. Build both ranges on a 13x13 grid and get Monte Carlo equity — most tools only handle a single hand vs random.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "What is range vs range equity?",
    answer:
      "Instead of comparing one exact hand against another, range vs range weighs every combo in each player's range equally and reports the average equity across all of them. This is the more realistic question in most real hands — you rarely know your opponent's exact two cards, only a plausible range.",
  },
  {
    question: "How do I build a range on the grid?",
    answer:
      "Click cells to toggle them in or out of a range. The diagonal is pocket pairs, the cells above it are suited combos, and the cells below it are offsuit combos — the standard layout used by most poker training tools.",
  },
  {
    question: "Can I add a board?",
    answer:
      "Yes — leave the board empty for a preflop range vs range spot, or fill in the flop, turn, and river for a postflop range vs range calculation (e.g. how a continuation-betting range performs against a calling range on a specific board texture).",
  },
  {
    question: "Why is this range-heavy and slower than the single-hand calculator?",
    answer:
      "Every trial has to sample a fresh combo from each range before dealing out the rest of the board, which is more work than a fixed known hand. The calculator automatically uses a lower trial count while you're still building your ranges, then a higher one once you stop.",
  },
];

export default function RangeVsRangeCalculatorPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Range vs Range Equity Calculator",
    "Standalone Monte Carlo range vs range poker equity calculator with a 13x13 range-builder grid.",
    URL,
  );
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Range vs Range Equity Calculator", url: URL },
  ]);
  const howToSchema = getHowToSchema(
    "How to calculate range vs range equity",
    "Build both players' ranges on the 13x13 grid, add an optional board, and read a Monte Carlo equity estimate weighted evenly across every combo in each range.",
    [
      { name: "Build hero's range", text: "Click cells on hero's grid — diagonal for pairs, above for suited, below for offsuit." },
      { name: "Build villain's range", text: "Repeat for villain's range." },
      { name: "Add a board (optional)", text: "Leave empty for preflop, or fill in flop/turn/river for a postflop spot." },
      { name: "Read the result", text: "Equity is averaged across every valid combo pairing from both ranges, weighted equally." },
    ],
  );

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Range vs Range Equity Calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Build both players&apos; ranges on the grid below and get a live Monte Carlo equity
        estimate — most free calculators only handle one exact hand against another or a fully
        random opponent.
      </p>

      <div className="mt-8">
        <RangeVsRangeCalculator />
      </div>

      <FormulaBlock
        sourceLine="Method: Monte Carlo simulation, one random combo sampled per range per trial · deterministic per seed — no AI"
        constants={[
          { name: "trials (live)", value: "5,000", source: "internal tiering, capped lower — range sampling is more expensive per trial" },
          { name: "trials (settled)", value: "10,000", source: "internal tiering, after inputs stop changing" },
        ]}
        lines={[
          { text: "— Per trial —", heading: true },
          { text: "heroHand    = sample one combo uniformly from hero's range" },
          { text: "villainHand = sample one combo uniformly from villain's range" },
          { text: "reject trial if heroHand and villainHand share a card" },
          { text: "deal remaining board, score both hands, record win/tie/lose" },
          { text: " " },
          { text: "— Aggregate —", heading: true },
          { text: "equity = (wins + ties/2) / totalTrials" },
          { text: "// every combo in each range is weighted equally, not by hand strength", comment: true },
        ]}
        footerNote="Uniform sampling means a range's equity reflects every combo it contains, not just its strongest hands — this is what makes range vs range different from just picking the 'best' hand in each range."
      />

      <p className="mt-8 text-sm text-slate-600">
        Just want to size and sanity-check a single range instead of comparing two?{" "}
        <Link href="/poker-range-calculator/" className="font-semibold text-emerald-600 hover:underline">
          Use the poker range calculator
        </Link>{" "}
        to see exactly what percentage of all starting hands a range covers.
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
