import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-black tracking-tight">
          Poker Helper <span className="text-emerald-400">Calculator</span>
        </Link>
        <nav className="hidden gap-5 text-sm font-medium text-slate-300 sm:flex">
          <Link href="/implied-odds-calculator" className="hover:text-white">
            Implied Odds
          </Link>
          <Link href="/equity-calculator" className="hover:text-white">
            Equity Calculator
          </Link>
          <Link href="/range-vs-range-equity-calculator" className="hover:text-white">
            Range vs Range
          </Link>
          <Link href="/matchups" className="hover:text-white">
            Matchups
          </Link>
          <Link href="/toolkit/bankroll-calculator" className="hover:text-white">
            Bankroll
          </Link>
        </nav>
      </div>
    </header>
  );
}
