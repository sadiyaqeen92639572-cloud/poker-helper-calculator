import type { Metadata } from "next";
import Link from "next/link";
import { HandStrengthTable } from "@/components/reference/HandStrengthTable";
import { getFAQPageSchema, getBreadcrumbSchema, SITE_URL, absoluteUrl } from "@/lib/seo";

const URL = absoluteUrl("hand-strength-guide");

export const metadata: Metadata = {
  title: "Poker Hand Strength Guide",
  description:
    "The 9 poker hand categories ranked from high card to straight flush, with examples and what makes each one strong or weak in practice.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "What beats what in poker?",
    answer:
      "From best to worst: straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, one pair, high card. Suits never break ties — a flush in spades and a flush in hearts of the same rank tie.",
  },
  {
    question: "Is a flush better than a straight?",
    answer:
      "Yes. A flush (five cards of one suit) beats a straight (five cards in sequence) in standard hand rankings.",
  },
  {
    question: "How rare is a full house compared to a flush?",
    answer:
      "A full house is rarer and ranks higher than a flush in standard 5-card hand rankings — the combinatorics work out that way even though a flush 'feels' harder to make.",
  },
];

export default function HandStrengthGuidePage() {
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Hand Strength Guide", url: URL },
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
        Poker Hand Strength Guide
      </h1>
      <p className="mt-3 text-slate-600">
        The 9 hand categories in Texas Hold&apos;em, from strongest to weakest, with what
        actually makes each one good or vulnerable at the table.
      </p>

      <div className="mt-8">
        <HandStrengthTable />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Want to know your exact win probability with a hand, not just its category?{" "}
        <Link href="/equity-calculator" className="font-semibold text-emerald-600 hover:underline">
          Use the equity calculator
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
