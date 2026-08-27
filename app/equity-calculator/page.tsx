import type { Metadata } from "next";
import { EquityCalculatorApp } from "@/components/equity/EquityCalculatorApp";
import { FormulaBlock } from "@/components/seo/FormulaBlock";
import {
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getHowToSchema,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

const URL = absoluteUrl("equity-calculator");

export const metadata: Metadata = {
  title: "Poker Equity Calculator",
  description:
    "Free poker equity calculator — hero vs known hand, vs a range, or vs multiple villains. Monte Carlo equity with live preflop/postflop updates as you pick cards.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "What's the difference between this and a simple two-hand calculator?",
    answer:
      "This engine handles hero and every villain independently as a concrete hand, a range (e.g. 'QQ+,AKs'), or a fully random opponent, and supports 3 or more villains at once — not just heads-up known-vs-known.",
  },
  {
    question: "Why does the number change while I'm still picking cards?",
    answer:
      "Equity is estimated with Monte Carlo simulation. While you're actively changing inputs, the calculator runs a fast, lower-precision pass (shown with a '~' prefix) for instant feedback, then automatically refines to a higher-trial-count, more precise result shortly after you stop.",
  },
  {
    question: "Does this connect to any online poker site?",
    answer:
      "No. Standalone, manual-entry only — you pick the cards, there's no live-table connection or automation.",
  },
];

export default function EquityCalculatorPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Poker Equity Calculator",
    "Standalone Monte Carlo poker equity calculator supporting known hands, ranges, and 3+ way pots.",
    URL,
  );
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Equity Calculator", url: URL },
  ]);
  const howToSchema = getHowToSchema(
    "How to calculate poker equity",
    "Set hero's cards, an optional board, and one or more villains as a known hand, a range, or random, then read a Monte Carlo win/tie/lose estimate.",
    [
      { name: "Pick hero's cards", text: "Select hero's two hole cards from the card picker." },
      { name: "Add a board (optional)", text: "Leave empty for preflop, or fill in flop/turn/river for postflop equity." },
      { name: "Add villains", text: "Add one or more opponents as an exact hand, a range like 'QQ+,AKs', or random." },
      { name: "Read the result", text: "Win/tie/lose percentages update live — a '~' prefix and lower precision while inputs are still changing, sharpening to a full-precision result once you stop." },
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
        Poker Equity Calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Pick hero&apos;s cards, add a board and any villains you want, and get a live Monte
        Carlo equity estimate. Works heads-up or with multiple opponents, and any hand can be
        exact, a range, or left random.
      </p>

      <div className="mt-8">
        <EquityCalculatorApp />
      </div>

      <FormulaBlock
        sourceLine="Method: Monte Carlo simulation over a validated 7-card hand evaluator · deterministic per seed — no AI"
        constants={[
          { name: "trials (live)", value: "2,000-5,000", source: "internal tiering, updates while inputs change" },
          { name: "trials (settled)", value: "10,000-20,000", source: "internal tiering, ~400ms after inputs stop changing" },
          { name: "trials (river)", value: "1 (deterministic)", source: "board fully dealt — no randomness left to simulate" },
        ]}
        lines={[
          { text: "— Per trial —", heading: true },
          { text: "deal random cards for unknown hero/villain/board slots" },
          { text: "reject deal if any card collides with a known card" },
          { text: "score = bestHand(holeCards + board)   // best 5 of 7" },
          { text: "compare all players' scores → win/tie/lose for this trial" },
          { text: " " },
          { text: "— Aggregate —", heading: true },
          { text: "equity = (wins + ties/numTiedPlayers) / totalTrials" },
        ]}
        footerNote="Standard error at 2,000 trials is roughly ±1.1pp on a 50% equity — the live-tier result is shown rounded with a '~' prefix rather than false decimal precision, and sharpens once the settled-tier pass completes."
      />

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
