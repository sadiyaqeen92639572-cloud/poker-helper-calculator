import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/seo";
import { MATCHUPS } from "@/lib/data/matchups";

export const runtime = "edge";

// Bump on meaningful content/URL changes. Kept as a fixed date (not
// `new Date()`) so lastmod is stable between requests — 2026-08-27:
// trailing-slash canonical fix + reversed-duplicate matchup removal.
const LASTMOD = "2026-08-27";

// No trailing slashes — must match the canonical form the host serves 200 for.
const STATIC_ROUTES = [
  "",
  "implied-odds-calculator",
  "toolkit/bankroll-calculator",
  "equity-calculator",
  "range-vs-range-equity-calculator",
  "matchups",
  "hand-strength-guide",
  "position-and-starting-hands",
  "bet-sizing-guide",
  "toolkit/opponent-notes",
  "toolkit/table-selection",
  "toolkit/session-guardian",
  "toolkit/hand-log",
  "poker-range-calculator",
  "about",
];

export function GET() {
  const matchupRoutes = MATCHUPS.map((m) => `matchups/${m.slug}`);
  const allRoutes = [...STATIC_ROUTES, ...matchupRoutes];

  const urls = allRoutes.map(
    (route) =>
      `<url><loc>${absoluteUrl(route)}</loc><lastmod>${LASTMOD}</lastmod><changefreq>monthly</changefreq><priority>${
        route === "" ? "1.0" : "0.8"
      }</priority></url>`,
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
