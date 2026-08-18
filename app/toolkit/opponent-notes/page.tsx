import type { Metadata } from "next";
import Link from "next/link";
import { OpponentNotes } from "@/components/toolkit/OpponentNotes";
import { getSoftwareApplicationSchema, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

const URL = `${SITE_URL}/toolkit/opponent-notes/`;

export const metadata: Metadata = {
  title: "Opponent Notes",
  description: "Log tendencies on players you've faced — home-game companion tool, stored locally on your device.",
  alternates: { canonical: URL },
};

export default function OpponentNotesPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Opponent Notes",
    "Manual opponent-tendency logging tool for home-game poker, stored locally on your device.",
    URL,
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Opponent Notes", url: URL },
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
        Opponent Notes
      </h1>
      <p className="mt-3 text-slate-600">
        Manually log what you&apos;ve noticed about players at your table. Saved locally on
        this device only — nothing here connects to any live table.
      </p>
      <div className="mt-8">
        <OpponentNotes />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Weighing whether the whole table is worth sitting at, not just one player?{" "}
        <Link href="/toolkit/table-selection/" className="font-semibold text-emerald-600 hover:underline">
          Use the table selection checklist
        </Link>
        .
      </p>
    </div>
  );
}
