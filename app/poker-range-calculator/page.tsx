import type { Metadata } from "next";
import Link from "next/link";
import { RangeSizeCalculator } from "@/components/equity/RangeSizeCalculator";
import { parseRange } from "@/lib/poker/range";
import { FormulaBlock } from "@/components/seo/FormulaBlock";
import {
  getFAQPageSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getHowToSchema,
  SITE_URL,
} from "@/lib/seo";

const URL = `${SITE_URL}/poker-range-calculator/`;
const TOTAL_COMBOS = 1326; // C(52,2)

const EXAMPLE_RANGES = [
  { label: "Premium pairs + AK", range: "QQ+,AKs,AKo" },
  { label: "Standard early-position open", range: "TT+,AQs+,AKo" },
  {
    label: "Standard button open",
    range: "22+,A2s+,K7s+,Q9s+,J9s+,T8s+,97s+,86s+,75s+,64s+,ATo+,KTo+,QTo+,JTo",
  },
  {
    label: "Wide big-blind defend",
    range: "22+,A2s+,K2s+,Q4s+,J6s+,T7s+,97s+,87s,76s,65s,54s,A2o+,K8o+,Q9o+,J9o+,T9o",
  },
];

export const metadata: Metadata = {
  title: "Poker Range Calculator",
  description:
    "Build a poker starting-hand range on a 13x13 grid and see exactly what percentage of all starting hands it represents, with combo counts computed from the actual range notation.",
  alternates: { canonical: URL },
};

const faqs = [
  {
    question: "How is 'percentage of hands' calculated?",
    answer:
      "There are 1,326 possible 2-card starting hands in Hold'em (52 choose 2). Whatever range you build maps to an exact combo count via the same range-notation parser used throughout this site, and that count divided by 1,326 is the percentage.",
  },
  {
    question: "Why do the example ranges below use notation like 'A2s+' or 'JTo'?",
    answer:
      "Standard poker range shorthand: a pair like '22+' means 22 and every pair above it; a suited hand like 'A2s+' means every suited ace from A2s up to AKs; an offsuit hand like 'JTo' is a single specific combo. It's the same grammar the calculator's range grid produces when you click cells.",
  },
  {
    question: "Is this the same as the range vs range equity calculator?",
    answer:
      "It uses the same underlying grid and engine, but the question is different: range vs range answers 'who wins more between these two ranges', while this page is about defining and sizing a single range — how wide is it, and what does it actually contain.",
  },
];

export default function PokerRangeCalculatorPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Poker Range Calculator",
    "Build a poker starting-hand range and see its exact combo count and percentage of all possible starting hands.",
    URL,
  );
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Poker Range Calculator", url: URL },
  ]);
  const howToSchema = getHowToSchema(
    "How to build and size a poker range",
    "Build a starting-hand range on the 13x13 grid and see exactly what percentage of all 1,326 starting hands it covers.",
    [
      { name: "Click cells on the grid", text: "Diagonal cells are pocket pairs, cells above the diagonal are suited combos, cells below are offsuit combos." },
      { name: "Read the combo count", text: "Each selected cell contributes its combo count — 6 for a pair, 4 for suited, 12 for offsuit." },
      { name: "Read the percentage", text: "Total combos selected divided by 1,326 (52 choose 2) gives the percentage of all starting hands." },
    ],
  );

  const exampleRows = EXAMPLE_RANGES.map((r) => {
    const combos = parseRange(r.range).length;
    return { ...r, combos, pct: (combos / TOTAL_COMBOS) * 100 };
  });

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
        Poker Range Calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Build a starting-hand range by clicking cells on the grid, and see exactly what
        percentage of all 1,326 possible starting hands it covers — useful for sanity-checking
        whether an opening or defending range is actually as wide (or narrow) as it feels.
      </p>

      <section className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Example range</th>
              <th className="px-4 py-3">Combos</th>
              <th className="px-4 py-3">% of all hands</th>
            </tr>
          </thead>
          <tbody>
            {exampleRows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-700">{row.label}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{row.combos}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">{row.pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-8">
        <RangeSizeCalculator />
      </div>

      <FormulaBlock
        sourceLine="Method: combinatorial counting over standard range notation · deterministic — no AI"
        constants={[
          { name: "totalCombos", value: "1,326", source: "C(52,2) — every possible 2-card starting hand" },
        ]}
        lines={[
          { text: "— Combos per hand type —", heading: true },
          { text: "pocket pair    → 6 combos   (e.g. QQ = QsQh, QsQd, QsQc, QhQd, QhQc, QdQc)" },
          { text: "suited hand    → 4 combos   (e.g. AKs = AsKs, AhKh, AdKd, AcKc)" },
          { text: "offsuit hand   → 12 combos  (e.g. AKo = every rank-A/rank-K pair minus the 4 suited ones)" },
          { text: " " },
          { text: "— Range percentage —", heading: true },
          { text: "combos  = sum of combo counts for every hand token in the range" },
          { text: "percent = combos / 1326 × 100" },
        ]}
        footerNote="Notation grammar: 'AA' single pair, '22+' a pair and everything above it, 'AKs'/'ATs+' suited (with +), 'AKo' offsuit, 'AsKd' one exact combo. Combo counts are exact, not estimated."
      />

      <p className="mt-8 text-sm text-slate-600">
        Want to know who&apos;s actually ahead between two ranges, not just how wide one is?{" "}
        <Link
          href="/range-vs-range-equity-calculator/"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Use the range vs range equity calculator
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
