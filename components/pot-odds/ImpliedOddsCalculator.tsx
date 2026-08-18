"use client";

import { useMemo, useState } from "react";
import { impliedOdds } from "@/lib/poker/oddsAndSpr";

export function ImpliedOddsCalculator() {
  const [potSize, setPotSize] = useState("100");
  const [toCall, setToCall] = useState("20");
  const [yourEquity, setYourEquity] = useState("25");
  const [effectiveStack, setEffectiveStack] = useState("400");

  const result = useMemo(() => {
    const pot = parseFloat(potSize);
    const call = parseFloat(toCall);
    const equity = parseFloat(yourEquity) / 100;
    const stack = parseFloat(effectiveStack);
    if ([pot, call, equity, stack].some((n) => Number.isNaN(n) || n < 0)) return null;
    if (equity > 1) return null;
    try {
      return impliedOdds(pot, call, equity, stack);
    } catch {
      return null;
    }
  }, [potSize, toCall, yourEquity, effectiveStack]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Pot size" value={potSize} onChange={setPotSize} />
        <Field label="Amount to call" value={toCall} onChange={setToCall} />
        <Field label="Your equity (%)" value={yourEquity} onChange={setYourEquity} />
        <Field label="Effective stack" value={effectiveStack} onChange={setEffectiveStack} />
      </div>

      {result ? (
        <div className="mt-6 space-y-3 rounded-lg bg-slate-50 p-4">
          <Row label="Required equity to break even">
            {(result.potOddsRequiredEquity * 100).toFixed(1)}%
          </Row>
          <Row label="Stack-to-pot ratio (SPR)">
            {Number.isFinite(result.spr) ? result.spr.toFixed(2) : "∞"}
          </Row>
          <Row label="Profitable on pot odds alone right now?">
            <span
              className={result.breakevenCallNow ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}
            >
              {result.breakevenCallNow ? "YES" : "NO"}
            </span>
          </Row>
          <p className="pt-2 text-sm text-slate-600">{result.note}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter valid, non-negative numbers above (equity must be 0-100%).
        </p>
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
        min={0}
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
