import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { MATCHUPS } from "@/lib/data/matchups";

export const runtime = "edge";

const STATIC_ROUTES = [
  "",
  "implied-odds-calculator/",
  "toolkit/bankroll-calculator/",
  "equity-calculator/",
  "range-vs-range-equity-calculator/",
  "matchups/",
  "hand-strength-guide/",
  "position-and-starting-hands/",
  "bet-sizing-guide/",
  "toolkit/opponent-notes/",
  "toolkit/table-selection/",
  "toolkit/session-guardian/",
  "toolkit/hand-log/",
  "poker-range-calculator/",
  "about/",
];

export function GET() {
  const matchupRoutes = MATCHUPS.map((m) => `matchups/${m.slug}/`);
  const allRoutes = [...STATIC_ROUTES, ...matchupRoutes];

  const urls = allRoutes.map(
    (route) =>
      `<url><loc>${SITE_URL}/${route}</loc><changefreq>monthly</changefreq><priority>${
        route === "" ? "1.0" : "0.8"
      }</priority></url>`,
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
