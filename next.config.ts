import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URL form is NO trailing slash. Keep this explicit so the
  // framework actively normalises `/x/` -> `/x` and never regenerates the
  // slash/no-slash split that broke indexation (see SEO-BASELINE-2026-08-27.md).
  trailingSlash: false,

  async redirects() {
    // Reversed-hand duplicate matchups removed from MATCHUPS — the two
    // orderings are the same simulation with swapped labels. Redirect the
    // dropped (zero-impression) slug to the one that already had GSC data.
    return [
      { source: "/matchups/kk-vs-qq", destination: "/matchups/qq-vs-kk", permanent: true },
      { source: "/matchups/qq-vs-aks", destination: "/matchups/aks-vs-qq", permanent: true },
    ];
  },
};

export default nextConfig;
