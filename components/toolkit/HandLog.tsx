"use client";

import { useMemo, useState } from "react";
import { computeVolumeStats, usePokerToolkitStore } from "@/store/poker-toolkit-store";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function HandLog() {
  const entries = usePokerToolkitStore((s) => s.handLogEntries);
  const hasHydrated = usePokerToolkitStore((s) => s.hasHydrated);
  const logVersion = usePokerToolkitStore((s) => s.logVersion);
  const addHandLogEntry = usePokerToolkitStore((s) => s.addHandLogEntry);
  const deleteHandLogEntry = usePokerToolkitStore((s) => s.deleteHandLogEntry);

  const [date, setDate] = useState(todayISO);
  const [stake, setStake] = useState("1/2 NLHE");
  const [hands, setHands] = useState("");
  const [bbWon, setBbWon] = useState("");
  const [note, setNote] = useState("");

  // Memoized on logVersion (a mutation counter), not on the entries array
  // reference — see plan: at scale, a naive useMemo([handLogEntries]) still
  // re-triggers full recompute on every single write.
  const stats = useMemo(() => computeVolumeStats(entries), [logVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAdd() {
    const handsNum = parseInt(hands, 10);
    const bbNum = parseFloat(bbWon);
    if (Number.isNaN(handsNum) || handsNum <= 0 || Number.isNaN(bbNum)) return;
    addHandLogEntry({ date, stake: stake.trim() || "Session", hands: handsNum, bbWon: bbNum, note: note.trim() });
    setHands("");
    setBbWon("");
    setNote("");
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total hands" value={stats.totalHands.toLocaleString()} />
        <Stat label="Net bb" value={`${stats.totalBbWon >= 0 ? "+" : ""}${stats.totalBbWon.toFixed(0)}`} />
        <Stat label="bb/100" value={stats.bb100.toFixed(1)} highlight={stats.bb100 >= 0} />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Stake</span>
            <input
              type="text"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Hands played</span>
            <input
              type="number"
              inputMode="numeric"
              value={hands}
              onChange={(e) => setHands(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Net result (bb)</span>
            <input
              type="number"
              inputMode="decimal"
              value={bbWon}
              onChange={(e) => setBbWon(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Note (optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={hands.trim() === "" || bbWon.trim() === ""}
          className="mt-3 min-h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Add entry
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {!hasHydrated && <p className="text-sm text-slate-400">Loading your log…</p>}
        {hasHydrated && entries.length === 0 && (
          <p className="text-sm text-slate-500">No hand log entries yet.</p>
        )}
        {hasHydrated &&
          entries
            .slice()
            .reverse()
            .slice(0, 30)
            .map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <span className="text-slate-600">
                  {e.date} · {e.stake} · {e.hands} hands
                  {e.note && <span className="text-slate-400"> — {e.note}</span>}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${e.bbWon >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {e.bbWon >= 0 ? "+" : ""}
                    {e.bbWon}bb
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this hand log entry? This can't be undone.")) {
                        deleteHandLogEntry(e.id);
                      }
                    }}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className={`text-xl font-black ${highlight === undefined ? "text-slate-800" : highlight ? "text-emerald-600" : "text-red-600"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}
