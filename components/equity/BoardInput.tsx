"use client";

import { useEffect, useState } from "react";
import { CardSlot } from "./CardSlot";

/**
 * Board must be 0, 3, 4, or 5 known cards (preflop / flop / turn / river) —
 * matches the engine's `cardsNeededBoard = 5 - board.length` assumption.
 * A partial 1- or 2-card board is treated as "not ready" (onChange(undefined))
 * rather than silently computed against, same philosophy as the Python
 * reference: never guess, refuse instead.
 */
export function BoardInput({
  usedCards,
  onChange,
}: {
  usedCards: Set<string>;
  onChange: (board: string[] | undefined) => void;
}) {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);

  useEffect(() => {
    const filled = slots.filter((c): c is string => c !== null);
    const n = filled.length;
    const contiguous =
      slots.slice(0, n).every((c) => c !== null) && slots.slice(n).every((c) => c === null);
    if (!contiguous || (n !== 0 && n < 3)) {
      onChange(undefined);
      return;
    }
    onChange(filled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  return (
    <div>
      <div className="mb-2 flex gap-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Flop</span>
        <span className="ml-6">Turn</span>
        <span className="ml-6">River</span>
      </div>
      <div className="flex gap-2">
        {slots.map((card, i) => (
          <CardSlot
            key={i}
            card={card}
            usedCards={usedCards}
            onPick={(c) => setSlots((s) => s.map((x, idx) => (idx === i ? c : x)))}
            onClear={() =>
              // Clearing a slot clears everything after it too — keeps the
              // board contiguous (can't leave a gap where the turn is set
              // but the flop isn't).
              setSlots((s) => s.map((x, idx) => (idx >= i ? null : x)))
            }
          />
        ))}
      </div>
    </div>
  );
}
