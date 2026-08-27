import type { Metadata } from "next";
import Link from "next/link";
import { TableSelectionChecklist } from "@/components/toolkit/TableSelectionChecklist";
import { getSoftwareApplicationSchema, getBreadcrumbSchema, SITE_URL, absoluteUrl } from "@/lib/seo";

const URL = absoluteUrl("toolkit/table-selection");

export const metadata: Metadata = {
  title: "Table Selection Checklist",
  description: "Score a table before you sit — pot sizes, player quality, stack depths. Stored locally on your device.",
  alternates: { canonical: URL },
};

export default function TableSelectionPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Table Selection Checklist",
    "Scorecard tool for evaluating a poker table before sitting down.",
    URL,
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Table Selection", url: URL },
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Table Selection Checklist
      </h1>
      <p className="mt-3 text-slate-600">
        A quick scorecard for deciding whether a table is worth sitting at — good table
        selection is one of the highest-leverage decisions in poker, and it happens before
        a single hand is dealt.
      </p>
      <div className="mt-8">
        <TableSelectionChecklist />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Found a good table — now sizing how much to bring to it?{" "}
        <Link href="/toolkit/bankroll-calculator" className="font-semibold text-emerald-600 hover:underline">
          Use the bankroll calculator
        </Link>
        .
      </p>
    </div>
  );
}
