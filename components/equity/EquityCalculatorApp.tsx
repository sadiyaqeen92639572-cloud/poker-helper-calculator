"use client";

import { useEffect, useRef, useState } from "react";
import { BoardInput } from "./BoardInput";
import { HandSpecInput } from "./HandSpecInput";
import { EquityResultPanel } from "./EquityResultPanel";
import { OutsCounter } from "@/components/outs/OutsCounter";
import { usePokerWorker } from "@/hooks/usePokerWorker";
import type { ComputeEquityResult } from "@/lib/poker/equity";
import type { HandSpec } from "@/lib/poker/types";

const MAX_VILLAINS = 5;

function specCards(spec: HandSpec | undefined): string[] {
  return Array.isArray(spec) ? spec : [];
}

export function EquityCalculatorApp() {
  const apiRef = usePokerWorker();

  const [heroSpec, setHeroSpec] = useState<HandSpec | undefined>(undefined);
  const [boardSpec, setBoardSpec] = useState<string[] | undefined>([]);
  const [villainSpecs, setVillainSpecs] = useState<(HandSpec | undefined)[]>([null]);

  const [liveResult, setLiveResult] = useState<ComputeEquityResult | null>(null);
  const [settledResult, setSettledResult] = useState<ComputeEquityResult | null>(null);
  const [pending, setPending] = useState(false);

  const requestIdRef = useRef(0);

  const usedCards = new Set<string>([
    ...specCards(heroSpec),
    ...(boardSpec ?? []),
    ...villainSpecs.flatMap(specCards),
  ]);

  const isReady =
    heroSpec !== undefined && boardSpec !== undefined && villainSpecs.every((v) => v !== undefined);

  const isRangeHeavy =
    typeof heroSpec === "string" || villainSpecs.some((v) => typeof v === "string");

  const heroKey = JSON.stringify(heroSpec);
  const boardKey = JSON.stringify(boardSpec);
  const villainsKey = JSON.stringify(villainSpecs);

  useEffect(() => {
    // Not ready (incomplete input): don't reset liveResult/settledResult
    // here — that would be an unconditional own-state write with no async
    // work attached to it. Instead the render below simply ignores stale
    // results while !isReady (see displayResult).
    if (!isReady) return;
    const api = apiRef.current;
    if (!api) return;

    const id = ++requestIdRef.current;
    setSettledResult(null);
    setPending(true);

    api
      .computeEquity(heroSpec as HandSpec, boardSpec as string[], villainSpecs as HandSpec[], {
        tier: "live",
        isRangeHeavy,
      })
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setLiveResult(res);
      })
      .catch(() => {});

    const settleTimer = setTimeout(() => {
      api
        .computeEquity(heroSpec as HandSpec, boardSpec as string[], villainSpecs as HandSpec[], {
          tier: "settled",
          isRangeHeavy,
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
  }, [heroKey, boardKey, villainsKey, isReady, isRangeHeavy]);

  const displayResult = isReady ? (settledResult ?? liveResult) : null;
  const isPending = pending && isReady;

  // Outs are only meaningful with a concrete hero, a flop/turn board, and a
  // concrete villain hand to beat (see lib/poker/outs.ts) — first concrete
  // villain found, not every villain, since outs vs a range/random hand
  // isn't a well-defined question.
  const firstConcreteVillainIndex = villainSpecs.findIndex((v): v is string[] => Array.isArray(v));
  const firstConcreteVillain =
    firstConcreteVillainIndex === -1 ? undefined : (villainSpecs[firstConcreteVillainIndex] as string[]);
  const outsReady =
    Array.isArray(heroSpec) &&
    Array.isArray(boardSpec) &&
    (boardSpec.length === 3 || boardSpec.length === 4) &&
    firstConcreteVillain !== undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <HandSpecInput label="Hero" usedCards={usedCards} onChange={setHeroSpec} defaultMode="concrete" />

      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium text-slate-700">Board</span>
        <BoardInput usedCards={usedCards} onChange={setBoardSpec} />
      </div>

      <div className="mt-6 space-y-6">
        {villainSpecs.map((_, i) => (
          <div key={i} className="relative">
            <HandSpecInput
              label={`Villain ${i + 1}`}
              usedCards={usedCards}
              onChange={(spec) =>
                setVillainSpecs((specs) => specs.map((s, idx) => (idx === i ? spec : s)))
              }
              defaultMode="random"
            />
            {villainSpecs.length > 1 && (
              <button
                type="button"
                onClick={() => setVillainSpecs((specs) => specs.filter((_, idx) => idx !== i))}
                className="absolute right-0 top-0 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {villainSpecs.length < MAX_VILLAINS && (
          <button
            type="button"
            onClick={() => setVillainSpecs((specs) => [...specs, null])}
            className="min-h-11 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
          >
            + Add villain
          </button>
        )}
      </div>

      <div className="mt-8">
        <EquityResultPanel result={displayResult} pending={isPending} />
      </div>

      {outsReady && (
        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Outs vs Villain {firstConcreteVillainIndex + 1}
          </span>
          <OutsCounter
            hero={heroSpec as [string, string]}
            board={boardSpec as string[]}
            villain={firstConcreteVillain as [string, string]}
          />
        </div>
      )}
    </div>
  );
}
