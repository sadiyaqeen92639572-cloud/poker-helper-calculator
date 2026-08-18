import type { Metadata } from "next";
import { BankrollCalculator } from "@/components/toolkit/BankrollCalculator";
import { FormulaBlock } from "@/components/seo/FormulaBlock";
import {
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getHowToSchema,
  SITE_URL,
} from "@/lib/seo";

const URL = `${SITE_URL}/toolkit/bankroll-calculator/`;

export const metadata: Metadata = {
  title: "Poker Bankroll Calculator",
  description:
    "Free poker bankroll calculator using Kelly-criterion risk-of-ruin math. Enter your win rate and variance to see how many buy-ins you need for a given stake.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "How much bankroll do I need to play a given stake?",
    answer:
      "It depends on your win rate and your game's variance (standard deviation), plus how much risk of going broke you're willing to accept. This calculator uses the standard risk-of-ruin formula — the poker-specific application of the Kelly criterion — to turn those three inputs into a buy-in count.",
  },
  {
    question: "What is risk of ruin?",
    answer:
      "The probability that, over a long enough run of variance, you go broke before your win rate pulls you ahead — even though you have a genuine edge. A smaller bankroll relative to your edge and variance means a higher risk of ruin.",
  },
  {
    question: "What's a typical standard deviation for cash games?",
    answer:
      "Full-ring No-Limit Hold'em cash games are commonly cited around 80-100bb/100 hands; 6-max and looser games run higher. Tournament variance is much larger and this bb/100-based formula isn't the right tool for tournament bankroll sizing.",
  },
  {
    question: "Why does a losing win rate return 'no answer'?",
    answer:
      "The risk-of-ruin math only works for a player with a genuine positive edge. If your win rate is zero or negative, no bankroll size mathematically guarantees you avoid eventual ruin at that stake — the fix is to move down in stakes or work on your win rate, not to add more buy-ins.",
  },
  {
    question: "Does this calculator know my actual win rate?",
    answer:
      "No — it's a standalone arithmetic tool. You supply your own tracked win rate and standard deviation (from your own hand-history tracking software or a rough estimate), and it converts that into a buy-in recommendation.",
  },
];

export default function BankrollCalculatorPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Poker Bankroll Calculator",
    "Kelly-criterion risk-of-ruin bankroll sizing calculator for poker cash games.",
    URL,
  );
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Bankroll Calculator", url: URL },
  ]);
  const howToSchema = getHowToSchema(
    "How to calculate poker bankroll requirements",
    "Turn win rate, standard deviation, and desired risk of ruin into a required buy-in count using the Kelly-criterion risk-of-ruin formula.",
    [
      { name: "Enter win rate", text: "Your win rate in bb/100, from tracked results." },
      { name: "Enter standard deviation", text: "Your game's variance in bb/100 — typically 80-100 for full-ring cash." },
      { name: "Enter desired risk of ruin", text: "The probability of going broke you're willing to accept, e.g. 5%." },
      { name: "Read the buy-in count", text: "The calculator returns the bankroll in big blinds and buy-ins needed at that risk tolerance." },
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
        Poker Bankroll Calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Figure out how many buy-ins you need at a given stake, based on your win rate,
        variance, and how much risk of going broke you can tolerate.
      </p>

      <div className="mt-8">
        <BankrollCalculator />
      </div>

      <section className="mt-12 space-y-4 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">Why this matters more than a fixed buy-in rule</h2>
        <p>
          Generic advice like &quot;20 buy-ins for cash games&quot; ignores that a strong winning
          player and a marginal winning player need very different bankrolls at the same stake.
          This calculator ties the number directly to your actual edge and variance instead of a
          one-size-fits-all rule of thumb.
        </p>
      </section>

      <FormulaBlock
        sourceLine="Method: Kelly-criterion risk-of-ruin formula (standard poker derivation) · deterministic arithmetic — no AI"
        constants={[
          { name: "winRate", value: "your bb/100 win rate", source: "user input" },
          { name: "stdDev", value: "your game's bb/100 standard deviation", source: "user input, typically 80-100 for full-ring cash" },
          { name: "desiredRoR", value: "acceptable probability of going broke", source: "user input, e.g. 0.05" },
        ]}
        lines={[
          { text: "— Risk-of-ruin bankroll size —", heading: true },
          { text: "bankrollBb = (stdDev² / (2 × winRate)) × ln(1 / desiredRoR)" },
          { text: "bankrollBb *= safetyMargin", comment: false },
          { text: "buyIns = bankrollBb / 100", comment: false },
          { text: " " },
          { text: "// undefined when winRate <= 0 — no bankroll makes a losing", comment: true },
          { text: "// or break-even player immune to eventual ruin", comment: true },
        ]}
        footerNote="Deterministic arithmetic, standard Kelly-criterion derivation for poker bankroll sizing. Not investment or financial advice — a mathematical model of variance, not a guarantee."
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
