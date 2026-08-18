"use client";

import { useState } from "react";
import { RangeMatrix } from "./RangeMatrix";
import { parseRange } from "@/lib/poker/range";

const TOTAL_COMBOS = 1326; // C(52,2)

export function RangeSizeCalculator() {
  const [range, setRange] = useState("");

  const combos = range.trim() === "" ? 0 : parseRange(range).length;
  const pct = (combos / TOTAL_COMBOS) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="block text-sm font-medium text-slate-700">
          Range {range && <span className="font-normal text-slate-400">({range})</span>}
        </span>
        {range && (
          <button
            type="button"
            onClick={() => setRange("")}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <RangeMatrix value={range} onChange={setRange} />

      <div className="mt-6 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-2xl font-black text-slate-700">{combos}</div>
          <div className="mt-1 text-xs text-slate-500">combos</div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4">
          <div className="text-2xl font-black text-emerald-600">{pct.toFixed(1)}%</div>
          <div className="mt-1 text-xs text-slate-500">of all 1,326 starting hands</div>
        </div>
      </div>
    </div>
  );
}
