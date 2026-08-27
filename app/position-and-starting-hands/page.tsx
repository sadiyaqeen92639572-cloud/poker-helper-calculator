import type { Metadata } from "next";
import Link from "next/link";
import { PositionGuide } from "@/components/reference/PositionGuide";
import { getFAQPageSchema, getBreadcrumbSchema, SITE_URL, absoluteUrl } from "@/lib/seo";

const URL = absoluteUrl("position-and-starting-hands");

export const metadata: Metadata = {
  title: "Poker Position & Starting Hands Guide",
  description:
    "All 9 poker table positions explained, from Under the Gun to the Big Blind, with starting-hand range guidance for each seat.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "Why does position matter so much in poker?",
    answer:
      "Acting later gives you more information — you see what everyone before you does before deciding. That's why the same hand is playable from the button and unplayable from Under the Gun: the informational edge changes the math.",
  },
  {
    question: "What's the difference between 9-max and 6-max positions?",
    answer:
      "6-max removes the earliest positions (UTG+1, MP, LJ), so ranges across the board are generally wider than in a full 9-max game — there are simply fewer players left to act behind any given raise.",
  },
  {
    question: "Should I always play the same range from the same position?",
    answer:
      "No — this is baseline guidance, not a fixed rulebook. Stack depths, opponent tendencies, and table dynamics all shift what's actually correct in a given hand.",
  },
];

export default function PositionAndStartingHandsPage() {
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Position & Starting Hands", url: URL },
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
        Poker Position &amp; Starting Hands
      </h1>
      <p className="mt-3 text-slate-600">
        Every seat at a 9-max table, in acting order, with what generally justifies opening a
        hand from each one.
      </p>

      <div className="mt-8">
        <PositionGuide />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Want to build and size one of these opening ranges precisely?{" "}
        <Link href="/poker-range-calculator" className="font-semibold text-emerald-600 hover:underline">
          Use the poker range calculator
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
