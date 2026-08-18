import type { Metadata } from "next";
import Link from "next/link";
import { HandLog } from "@/components/toolkit/HandLog";
import { FormulaBlock } from "@/components/seo/FormulaBlock";
import { getSoftwareApplicationSchema, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

const URL = `${SITE_URL}/toolkit/hand-log/`;

export const metadata: Metadata = {
  title: "Hand & Volume Log",
  description: "Track hands played and net result over time, with bb/100 computed automatically. Stored locally on your device.",
  alternates: { canonical: URL },
};

export default function HandLogPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Hand & Volume Log",
    "Session and hand-volume tracker computing bb/100 win rate over time.",
    URL,
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Hand & Volume Log", url: URL },
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
        Hand &amp; Volume Log
      </h1>
      <p className="mt-3 text-slate-600">
        Log your results after each session and watch your bb/100 win rate build up over
        time — the number that actually matters more than any single session.
      </p>
      <div className="mt-8">
        <HandLog />
      </div>

      <FormulaBlock
        sourceLine="Method: standard bb/100 win-rate formula · deterministic arithmetic — no AI"
        constants={[
          { name: "netBb", value: "sum of session results, in big blinds", source: "your logged entries" },
          { name: "handsPlayed", value: "sum of hands played across entries", source: "your logged entries" },
        ]}
        lines={[
          { text: "bb100 = (netBb / handsPlayed) × 100" },
          { text: "// the standard cross-stake win-rate unit — normalizes for volume", comment: true },
        ]}
        footerNote="bb/100 only becomes a meaningful signal after enough volume — a few thousand hands still carries wide variance. All entries stay local to this device."
      />

      <p className="mt-8 text-sm text-slate-600">
        Want a hard stop-loss/stop-win before your next session, not just tracking after?{" "}
        <Link href="/toolkit/session-guardian/" className="font-semibold text-emerald-600 hover:underline">
          Use Session Guardian
        </Link>
        .
      </p>
    </div>
  );
}
