import type { Metadata } from "next";
import { ImpliedOddsCalculator } from "@/components/pot-odds/ImpliedOddsCalculator";
import { FormulaBlock } from "@/components/seo/FormulaBlock";
import {
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getHowToSchema,
  SITE_URL,
} from "@/lib/seo";

const URL = `${SITE_URL}/implied-odds-calculator/`;

export const metadata: Metadata = {
  title: "Implied Odds Calculator",
  description:
    "Free implied odds calculator. Enter pot size, amount to call, your equity, and effective stack to see your stack-to-pot ratio (SPR) and whether implied odds justify a call.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "What are implied odds in poker?",
    answer:
      "Implied odds extend basic pot odds by accounting for money you expect to win later in the hand if your draw completes. Raw pot odds only look at the current bet; implied odds add the extra bets you project winning on future streets, which can make a call correct even when it's not profitable on pot odds alone.",
  },
  {
    question: "How is SPR (stack-to-pot ratio) used here?",
    answer:
      "SPR = effective stack / pot size. It's a fast proxy for how much implied-odds upside is even possible. An SPR below 1 means there isn't enough money behind to make up a pot-odds shortfall — the calculator flags this as leaning fold. An SPR of 1 or higher means there's room for a future bet to swing the decision toward a call.",
  },
  {
    question: "Is this the same as pot odds?",
    answer:
      "No. Pot odds alone answer 'do I have enough equity to call right now, given only the current bet?' Implied odds go further and ask 'even if I don't have enough equity now, is there enough behind in the stacks to make up the difference later?' This calculator reports both.",
  },
  {
    question: "Does this calculator connect to any online poker site?",
    answer:
      "No. This is a standalone, manual-entry calculator. You type in the numbers from a hand you're studying or reviewing — there's no live-table connection, screen-scraping, or automation of any kind.",
  },
  {
    question: "What inputs do I need?",
    answer:
      "Pot size, the amount you need to call, your estimated win equity as a percentage (from an equity calculator or a rough read), and the effective stack (the smaller of your stack and your opponent's, since that's the most either player can actually win or lose).",
  },
  {
    question: "Why might my equity estimate be wrong?",
    answer:
      "Implied odds are only as good as your equity estimate. If you're not sure of your exact equity, use the full equity calculator to get a Monte Carlo-based number against a specific hand or range before plugging it in here.",
  },
];

export default function ImpliedOddsCalculatorPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Implied Odds Calculator",
    "Standalone implied odds and stack-to-pot ratio (SPR) calculator for poker.",
    URL,
  );
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Implied Odds Calculator", url: URL },
  ]);
  const howToSchema = getHowToSchema(
    "How to calculate implied odds in poker",
    "Turn pot size, the amount to call, your equity, and effective stack into a call/fold verdict that accounts for future betting.",
    [
      { name: "Enter pot size", text: "Type the current pot size before your call." },
      { name: "Enter amount to call", text: "Type the bet you're facing." },
      { name: "Enter your equity", text: "Estimate your win probability as a percent, from an equity calculator or a hand-range read." },
      { name: "Enter effective stack", text: "Use the smaller of your stack and your opponent's remaining stack." },
      { name: "Read the verdict", text: "The calculator shows required equity to break even, SPR, and whether the call is profitable on pot odds alone." },
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
        Implied Odds Calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Figure out whether a drawing hand is worth calling once you account for the money
        you expect to win later, not just the current bet. Enter your numbers below.
      </p>

      <div className="mt-8">
        <ImpliedOddsCalculator />
      </div>

      <section className="mt-12 space-y-4 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">Why raw pot odds aren&apos;t the whole story</h2>
        <p>
          Pot odds tell you the bare-minimum equity you need to profitably call a single bet.
          But poker hands don&apos;t end after one bet — if you hit your draw, you&apos;ll often
          get paid on later streets too. Implied odds fold that expected future value into the
          decision, which is why a call that looks -EV on pot odds alone can still be correct
          with deep stacks behind it.
        </p>
        <h2 className="text-xl font-bold text-slate-900">Reading the stack-to-pot ratio</h2>
        <p>
          SPR (stack-to-pot ratio) is the standard shorthand for how much implied-odds room
          exists. Low SPR (under 1) means there&apos;s barely any money left to win even if
          your draw comes in — the calculator will flag this and lean toward fold when you&apos;re
          also behind on raw pot odds. High SPR means a missed pot-odds threshold isn&apos;t
          necessarily the end of the story.
        </p>
      </section>

      <FormulaBlock
        sourceLine="Method: standard poker pot-odds / implied-odds derivation · deterministic arithmetic — no AI, no estimation"
        constants={[
          { name: "pot", value: "current pot before your call", source: "user input" },
          { name: "call", value: "amount you must call", source: "user input" },
          { name: "equity", value: "your estimated win probability", source: "user input / equity calculator" },
          { name: "stack", value: "effective (smaller) remaining stack", source: "user input" },
        ]}
        lines={[
          { text: "— Pot odds —", heading: true },
          { text: "required_equity = call / (pot + call)" },
          { text: "profitable_now  = equity >= required_equity" },
          { text: " " },
          { text: "— Stack-to-pot ratio —", heading: true },
          { text: "SPR = stack / pot" },
          { text: "// SPR < 1: little room for implied odds to save a losing call", comment: true },
          { text: " " },
          { text: "— Implied-odds verdict —", heading: true },
          { text: "if profitable_now: call, implied odds add upside" },
          { text: "else if SPR >= 1: implied odds may still justify a call" },
          { text: "else: lean fold, not enough behind to make up the gap" },
        ]}
        footerNote="Deterministic arithmetic — same inputs always produce the same output. Equity is the one input you supply from elsewhere; use the equity calculator for a Monte Carlo-based number instead of guessing."
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
