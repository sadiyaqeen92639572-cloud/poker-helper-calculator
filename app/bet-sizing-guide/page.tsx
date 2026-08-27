import type { Metadata } from "next";
import Link from "next/link";
import { BetSizingGuide } from "@/components/reference/BetSizingGuide";
import { getFAQPageSchema, getBreadcrumbSchema, SITE_URL, absoluteUrl } from "@/lib/seo";

const URL = absoluteUrl("bet-sizing-guide");

export const metadata: Metadata = {
  title: "Poker Bet Sizing Guide",
  description:
    "Standard poker bet sizing by street — preflop opens and 3-bets, flop/turn/river continuation bets, and value vs bluff sizing.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "What's a standard preflop raise size?",
    answer:
      "2 to 2.5 big blinds online, often 2.5 to 3x live where players call wider. Sizing up further from early position or against loose limpers is common to discourage multi-way pots.",
  },
  {
    question: "Should bluffs and value bets be sized the same?",
    answer:
      "Yes, in a balanced strategy. Using a bigger size only for value and a smaller size only for bluffs is easy for observant opponents to exploit — call the small bets, fold to the big ones.",
  },
  {
    question: "Why do c-bet sizes vary so much by board texture?",
    answer:
      "On dry boards where few hands improve, a small bet already puts the same pressure a big one would, and risks less. On wet, draw-heavy boards, a bigger bet is needed to charge draws their correct price and deny equity.",
  },
];

export default function BetSizingGuidePage() {
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Bet Sizing Guide", url: URL },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Poker Bet Sizing Guide
      </h1>
      <p className="mt-3 text-slate-600">
        Standard sizing conventions by street, and why they vary the way they do.
      </p>

      <div className="mt-8">
        <BetSizingGuide />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Deciding whether to call a bet sized like these?{" "}
        <Link href="/implied-odds-calculator" className="font-semibold text-emerald-600 hover:underline">
          Use the implied odds calculator
        </Link>{" "}
        to check the math.
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
