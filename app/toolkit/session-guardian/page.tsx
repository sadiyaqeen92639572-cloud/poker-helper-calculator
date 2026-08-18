import type { Metadata } from "next";
import Link from "next/link";
import { SessionGuardian } from "@/components/toolkit/SessionGuardian";
import { getSoftwareApplicationSchema, getBreadcrumbSchema, SITE_URL } from "@/lib/seo";

const URL = `${SITE_URL}/toolkit/session-guardian/`;

export const metadata: Metadata = {
  title: "Session Guardian",
  description: "Set a stop-loss and stop-win before you sit down, track session time, and log results. Stored locally on your device.",
  alternates: { canonical: URL },
};

export default function SessionGuardianPage() {
  const softwareSchema = getSoftwareApplicationSchema(
    "Session Guardian",
    "Stop-loss, stop-win, and session-timer tool for poker sessions.",
    URL,
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Session Guardian", url: URL },
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
        Session Guardian
      </h1>
      <p className="mt-3 text-slate-600">
        Decide your stop-loss and stop-win before you sit down, while you&apos;re thinking
        clearly — not mid-session when tilt is doing the deciding for you.
      </p>
      <div className="mt-8">
        <SessionGuardian />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Want the full picture over many sessions, not just this one?{" "}
        <Link href="/toolkit/hand-log/" className="font-semibold text-emerald-600 hover:underline">
          Use the hand &amp; volume log
        </Link>
        .
      </p>
    </div>
  );
}
