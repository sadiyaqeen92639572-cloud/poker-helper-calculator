"use client";

import { useEffect, useRef, useState } from "react";
import { RangeMatrix } from "./RangeMatrix";
import { BoardInput } from "./BoardInput";
import { EquityResultPanel } from "./EquityResultPanel";
import { usePokerWorker } from "@/hooks/usePokerWorker";
import type { ComputeEquityResult } from "@/lib/poker/equity";

/** Range-vs-range calculator: the multiway engine pre-configured for two
 * range specs instead of concrete hands — always range-heavy trial tiering.
 * Board is optional (defaults to preflop, [] — a 0-length board is a valid
 * ready state, unlike the 1/2-card partial states BoardInput itself guards
 * against). */
export function RangeVsRangeCalculator() {
  const apiRef = usePokerWorker();

  const [heroRange, setHeroRange] = useState("");
  const [villainRange, setVillainRange] = useState("");
  const [board, setBoard] = useState<string[] | undefined>([]);

  const [liveResult, setLiveResult] = useState<ComputeEquityResult | null>(null);
  const [settledResult, setSettledResult] = useState<ComputeEquityResult | null>(null);
  const [pending, setPending] = useState(false);
  const requestIdRef = useRef(0);

  const isReady = heroRange.trim() !== "" && villainRange.trim() !== "" && board !== undefined;
  const heroKey = heroRange;
  const villainKey = villainRange;
  const boardKey = JSON.stringify(board);

  useEffect(() => {
    if (!isReady) return;
    const api = apiRef.current;
    if (!api) return;

    const id = ++requestIdRef.current;
    setSettledResult(null);
    setPending(true);

    api
      .computeEquity(heroRange, board as string[], [villainRange], { tier: "live", isRangeHeavy: true })
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setLiveResult(res);
      })
      .catch(() => {});

    const settleTimer = setTimeout(() => {
      api
        .computeEquity(heroRange, board as string[], [villainRange], {
          tier: "settled",
          isRangeHeavy: true,
        })
        .then((res) => {
          if (id !== requestIdRef.current) return;
          setSettledResult(res);
          setPending(false);
        })
        .catch(() => {
          if (id === requestIdRef.current) setPending(false);
        });
    }, 400);

    return () => clearTimeout(settleTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroKey, villainKey, boardKey, isReady]);

  const displayResult = isReady ? (settledResult ?? liveResult) : null;
  const isPending = pending && isReady;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="block text-sm font-medium text-slate-700">
            Hero range {heroRange && <span className="font-normal text-slate-400">({heroRange})</span>}
          </span>
          {heroRange && (
            <button
              type="button"
              onClick={() => setHeroRange("")}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <RangeMatrix value={heroRange} onChange={setHeroRange} />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="block text-sm font-medium text-slate-700">
            Villain range{" "}
            {villainRange && <span className="font-normal text-slate-400">({villainRange})</span>}
          </span>
          {villainRange && (
            <button
              type="button"
              onClick={() => setVillainRange("")}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <RangeMatrix value={villainRange} onChange={setVillainRange} />
      </div>

      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium text-slate-700">Board (optional)</span>
        <BoardInput usedCards={new Set()} onChange={setBoard} />
      </div>

      <div className="mt-8">
        <EquityResultPanel result={displayResult} pending={isPending} />
      </div>
    </div>
  );
}
