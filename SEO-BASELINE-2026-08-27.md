# SEO baseline — 2026-08-27 (before trailing-slash canonical fix)

Snapshot taken before the Step 1 canonicalization fix. Use this to tell
"recrawl oscillation" apart from "I broke something" over the next 2-4 weeks.

## GSC indexation sample (10 URLs, `inspect`)

| URL | Verdict |
|---|---|
| /matchups/aa-vs-kk | URL is unknown to Google |
| /matchups/aa-vs-72o | URL is unknown to Google |
| /matchups/99-vs-aks | URL is unknown to Google |
| /matchups/kqs-vs-jts | Submitted and indexed |
| /matchups/ako-vs-qq | Page with redirect |
| /poker-range-calculator | URL is unknown to Google |
| /range-vs-range-equity-calculator | Submitted and indexed |
| /position-and-starting-hands | URL is unknown to Google |
| /bet-sizing-guide | URL is unknown to Google |
| /toolkit/opponent-notes | Page with redirect |

Re-inspect these EXACT 10 URLs at ~T+3 weeks for a comparable read.

## Totals (90d, = 28d — all traffic is recent)

clicks=1  impressions=377  ctr=0.27%  avg_pos=39.6
non-branded: impr=127  avg_pos=44.5

## Tier A query positions (28d, GSC `queries`)

| query | impr | pos |
|---|---|---|
| poker helper | 57 | 29.3 |
| ako vs qq | 7 | 7.4 |
| qq vs ako | 2 | 7.5 |
| ako vs qq odds | 1 | 5.0 |
| aks vs qq | 3 | 8.3 |
| aks vs qq odds | 2 | 11.5 |
| 22 vs aks | 3 | 8.0 |
| aks vs 22 | 2 | 8.5 |
| aks vs tt | 2 | 6.5 |
| ako vs tt | 1 | 9.0 |
| qq vs kk | 1 | 5.0 |
| k qq | 1 | 7.0 |
| kk vs qq odds | 1 | 10.0 |
| kk vs qq preflop | 1 | 25.0 |

## Root cause being fixed

Server 308-redirects `/x/` -> `/x` (no trailing slash is canonical), but
`alternates.canonical`, JSON-LD urls, `sitemap.xml`, and internal `<Link>`
hrefs all hardcode the `/x/` form. Canonical points at a redirect -> Google
distrusts and under-indexes. Fix: one `absoluteUrl()` helper, all four
sources call it, no trailing slash anywhere.
