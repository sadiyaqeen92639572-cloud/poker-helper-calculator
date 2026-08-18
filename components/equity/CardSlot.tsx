"use client";

import { useState } from "react";
import { CardPicker } from "./CardPicker";

const SUIT_SYMBOL: Record<string, string> = { c: "♣", d: "♦", h: "♥", s: "♠" };

export function CardLabel({ card }: { card: string }) {
  return (
    <span>
      {card[0]}
      {SUIT_SYMBOL[card[1]]}
    </span>
  );
}

function suitStyle(card: string) {
  const suit = card[1];
  return suit === "h" || suit === "d"
    ? "border-red-300 text-red-600 bg-red-50"
    : "border-slate-300 text-slate-900 bg-slate-50";
}

export function CardSlot({
  card,
  usedCards,
  onPick,
  onClear,
}: {
  card: string | null;
  usedCards: Set<string>;
  onPick: (card: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-14 w-11 items-center justify-center rounded-lg border-2 text-lg font-bold ${
          card ? suitStyle(card) : "border-dashed border-slate-300 text-slate-400"
        }`}
      >
        {card ? <CardLabel card={card} /> : "+"}
      </button>
      {card && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear card"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] text-white"
        >
          ×
        </button>
      )}
      {open && (
        <CardPicker
          usedCards={usedCards}
          onPick={(c) => {
            onPick(c);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
