"use client";

import { useEffect, useRef, useState } from "react";
import { usePokerWorker } from "@/hooks/usePokerWorker";

/**
 * Villain-aware outs panel — only rendered when hero is a concrete hand,
 * board is exactly 3 or 4 cards (flop/turn), and at least one villain is a
 * concrete hand (outs are meaningless against a range or random opponent,
 * see lib/poker/outs.ts). Embedded inside the equity calculator, not a
 * standalone route — SEO research found "poker outs calculator" isn't a
 * winnable target on its own (see plan).
 */
export function OutsCounter({
  hero,
  board,
  villain,
}: {
  hero: [string, string];
  board: string[];
  villain: [string, string];
}) {
  const apiRef = usePokerWorker();
  const [outs, setOuts] = useState<number | null>(null);
  const requestIdRef = useRef(0);

  const cardsToCome = board.length === 3 ? 2 : 1;
  const heroKey = hero.join(",");
  const boardKey = board.join(",");
  const villainKey = villain.join(",");

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    const id = ++requestIdRef.current;
    api
      .countOuts(hero, board, villain)
      .then((n) => {
        if (id === requestIdRef.current) setOuts(n);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroKey, boardKey, villainKey]);

  if (outs === null) {
    return <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Counting outs…</div>;
  }

  const ruleEstimate = cardsToCome === 2 ? Math.min(outs * 4, 100) : Math.min(outs * 2, 100);

  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="text-2xl font-black text-emerald-600">{outs} outs</div>
      <p className="mt-1 text-xs text-slate-500">
        cards that make your hand beat this specific villain hand
      </p>
      <p className="mt-3 text-sm text-slate-600">
        Rule of {cardsToCome === 2 ? 4 : 2} estimate: ~{ruleEstimate}% equity with{" "}
        {cardsToCome} card{cardsToCome === 2 ? "s" : ""} to come. Use the exact equity number
        above for a precise figure — this is the fast at-table approximation.
      </p>
    </div>
  );
}
