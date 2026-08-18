"use client";

import { useMemo, useState } from "react";
import { bankrollRequirement } from "@/lib/poker/bankroll";

export function BankrollCalculator() {
  const [winRate, setWinRate] = useState("5");
  const [stdDev, setStdDev] = useState("90");
  const [riskOfRuin, setRiskOfRuin] = useState("5");
  const [buyIn, setBuyIn] = useState("100");

  const result = useMemo(() => {
    const winRateBbPer100 = parseFloat(winRate);
    const stdDevBbPer100 = parseFloat(stdDev);
    const desiredRiskOfRuin = parseFloat(riskOfRuin) / 100;
    const buyInBb = parseFloat(buyIn);
    if (
      [winRateBbPer100, stdDevBbPer100, desiredRiskOfRuin, buyInBb].some((n) => Number.isNaN(n)) ||
      stdDevBbPer100 <= 0 ||
      buyInBb <= 0
    ) {
      return null;
    }
    try {
      return bankrollRequirement({ winRateBbPer100, stdDevBbPer100, desiredRiskOfRuin, buyInBb });
    } catch {
      return null;
    }
  }, [winRate, stdDev, riskOfRuin, buyIn]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Win rate (bb/100)" value={winRate} onChange={setWinRate} />
        <Field label="Std dev (bb/100)" value={stdDev} onChange={setStdDev} />
        <Field label="Desired risk of ruin (%)" value={riskOfRuin} onChange={setRiskOfRuin} />
        <Field label="Buy-in size (bb)" value={buyIn} onChange={setBuyIn} />
      </div>

      {result ? (
        <div className="mt-6 space-y-3 rounded-lg bg-slate-50 p-4">
          {Number.isFinite(result.bankrollBuyIns) ? (
            <>
              <Row label="Recommended bankroll">{result.bankrollBuyIns.toFixed(1)} buy-ins</Row>
              <Row label="In big blinds">{Math.round(result.bankrollBb).toLocaleString()}bb</Row>
            </>
          ) : (
            <Row label="Recommended bankroll">No finite answer — see note</Row>
          )}
          <p className="pt-2 text-sm text-slate-600">{result.note}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">Enter valid numbers above (std dev &gt; 0, buy-in &gt; 0).</p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </label>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{children}</span>
    </div>
  );
}
