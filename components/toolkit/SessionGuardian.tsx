"use client";

import { useEffect, useState } from "react";
import { usePokerToolkitStore } from "@/store/poker-toolkit-store";

function formatElapsed(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function SessionGuardian() {
  const activeSession = usePokerToolkitStore((s) => s.activeSession);
  const sessionHistory = usePokerToolkitStore((s) => s.sessionHistory);
  const hasHydrated = usePokerToolkitStore((s) => s.hasHydrated);
  const startSession = usePokerToolkitStore((s) => s.startSession);
  const endSession = usePokerToolkitStore((s) => s.endSession);
  const cancelSession = usePokerToolkitStore((s) => s.cancelSession);

  const [stake, setStake] = useState("1/2 NLHE");
  const [buyIn, setBuyIn] = useState("200");
  const [stopLoss, setStopLoss] = useState("200");
  const [stopWin, setStopWin] = useState("400");
  const [cashOut, setCashOut] = useState("");
  const [currentResult, setCurrentResult] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeSession) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [activeSession]);

  if (activeSession) {
    // `now` can be stale from before this session started (e.g. captured
    // at page load, well before startedAt) until the first 1s interval
    // tick corrects it — clamp instead of showing a negative elapsed time.
    const elapsed = Math.max(0, now - activeSession.startedAt);
    const result = parseFloat(currentResult);
    const hasResult = !Number.isNaN(result) && currentResult.trim() !== "";
    const hitStopLoss = hasResult && activeSession.stopLoss !== null && result <= -activeSession.stopLoss;
    const hitStopWin = hasResult && activeSession.stopWin !== null && result >= activeSession.stopWin;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-slate-900">Session in progress — {activeSession.stake}</h2>
          <span className="font-mono text-sm text-slate-500">{formatElapsed(elapsed)}</span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Buy-in: {activeSession.buyIn}
          {activeSession.stopLoss !== null && ` · Stop-loss: -${activeSession.stopLoss}`}
          {activeSession.stopWin !== null && ` · Stop-win: +${activeSession.stopWin}`}
        </p>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Quick check: current result (optional, not saved)
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={currentResult}
            onChange={(e) => setCurrentResult(e.target.value)}
            placeholder="e.g. -150 or 300"
            className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>

        {hitStopLoss && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
            Stop-loss reached. This is the point you decided in advance to stop — that decision
            was made with a clear head, unlike right now.
          </p>
        )}
        {hitStopWin && (
          <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            Stop-win reached. Consider locking in the win.
          </p>
        )}

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Cash out amount</span>
          <input
            type="number"
            inputMode="decimal"
            value={cashOut}
            onChange={(e) => setCashOut(e.target.value)}
            className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => {
              const amount = parseFloat(cashOut);
              if (Number.isNaN(amount) || amount < 0) return;
              endSession(amount);
              setCashOut("");
              setCurrentResult("");
            }}
            disabled={cashOut.trim() === ""}
            className="min-h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            End session
          </button>
          <button
            type="button"
            onClick={cancelSession}
            className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel (discard)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Start a session</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <span className="mb-1 block text-sm font-medium text-slate-700">Buy-in</span>
            <input
              type="number"
              inputMode="decimal"
              value={buyIn}
              onChange={(e) => setBuyIn(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Stop-loss (leave blank for none)</span>
            <input
              type="number"
              inputMode="decimal"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Stop-win (leave blank for none)</span>
            <input
              type="number"
              inputMode="decimal"
              value={stopWin}
              onChange={(e) => setStopWin(e.target.value)}
              className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => {
            const buyInNum = parseFloat(buyIn);
            if (Number.isNaN(buyInNum) || buyInNum < 0) return;
            const sl = parseFloat(stopLoss);
            const sw = parseFloat(stopWin);
            startSession(
              stake.trim() || "Session",
              buyInNum,
              Number.isNaN(sl) ? null : sl,
              Number.isNaN(sw) ? null : sw,
            );
          }}
          className="mt-4 min-h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Start session
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-semibold text-slate-700">Recent sessions</h3>
        {!hasHydrated && <p className="text-sm text-slate-400">Loading your sessions…</p>}
        {hasHydrated && sessionHistory.length === 0 && (
          <p className="text-sm text-slate-500">No sessions logged yet.</p>
        )}
        {hasHydrated &&
          sessionHistory
          .slice()
          .reverse()
          .slice(0, 10)
          .map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <span className="text-slate-600">
                {s.stake} · {new Date(s.startedAt).toLocaleDateString()}
              </span>
              <span className={`font-semibold ${s.netResult >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {s.netResult >= 0 ? "+" : ""}
                {s.netResult}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
