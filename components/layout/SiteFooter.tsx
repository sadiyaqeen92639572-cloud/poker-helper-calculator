import Link from "next/link";

const FOOTER_GROUPS = [
  {
    heading: "Calculators",
    links: [
      { href: "/implied-odds-calculator/", label: "Implied Odds Calculator" },
      { href: "/equity-calculator/", label: "Equity Calculator" },
      { href: "/range-vs-range-equity-calculator/", label: "Range vs Range Calculator" },
      { href: "/poker-range-calculator/", label: "Poker Range Calculator" },
      { href: "/matchups/", label: "Hand Matchup Odds" },
      { href: "/toolkit/bankroll-calculator/", label: "Bankroll Calculator" },
    ],
  },
  {
    heading: "Reference guides",
    links: [
      { href: "/hand-strength-guide/", label: "Hand Strength Guide" },
      { href: "/position-and-starting-hands/", label: "Position & Starting Hands" },
      { href: "/bet-sizing-guide/", label: "Bet Sizing Guide" },
    ],
  },
  {
    heading: "Home-game toolkit",
    links: [
      { href: "/toolkit/opponent-notes/", label: "Opponent Notes" },
      { href: "/toolkit/table-selection/", label: "Table Selection" },
      { href: "/toolkit/session-guardian/", label: "Session Guardian" },
      { href: "/toolkit/hand-log/", label: "Hand & Volume Log" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 text-sm text-slate-400">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Poker Helper Calculator
            </p>
            <p className="mt-2 text-slate-400">
              Standalone, manual-entry equity and odds calculators. No live-table connection,
              no automation.
            </p>
            <Link href="/about/" className="mt-2 inline-block text-emerald-400 hover:underline">
              About &amp; methodology
            </Link>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.heading}
              </p>
              <ul className="mt-2 space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Poker Helper Calculator. Operated by Gesmine-Invest
          Limited (UK Company No. 14120136).
        </p>
      </div>
    </footer>
  );
}
