"use client";

import { useEffect, useMemo, useState } from "react";
import { CardSlot } from "./CardSlot";
import { parseRange } from "@/lib/poker/range";
import type { HandSpec } from "@/lib/poker/types";

type Mode = "concrete" | "range" | "random";

const MODE_LABEL: Record<Mode, string> = {
  concrete: "Exact",
  range: "Range",
  random: "Random",
};

function computeSpec(
  mode: Mode,
  slots: (string | null)[],
  rangeText: string,
): { spec: HandSpec | undefined; error: string | null } {
  if (mode === "random") return { spec: null, error: null };
  if (mode === "concrete") {
    const [a, b] = slots;
    return { spec: a && b ? [a, b] : undefined, error: null };
  }
  if (!rangeText.trim()) return { spec: undefined, error: null };
  try {
    const combos = parseRange(rangeText);
    if (combos.length === 0) throw new Error("Range matches no combos");
    return { spec: rangeText, error: null };
  } catch (e) {
    return { spec: undefined, error: e instanceof Error ? e.message : "Invalid range" };
  }
}

/**
 * Internal scratch state for in-progress entry (a single picked card out
 * of two, half-typed range text) is genuine local UI state, but the
 * derived HandSpec + validation error are pure functions of that state —
 * computed via useMemo, not useEffect+setState, so this component never
 * synchronously resets its own state on every render for no reason.
 * onChange (a parent callback, not this component's own state) still
 * propagates via a small effect keyed on the derived value itself.
 *
 * HandSpec | undefined: undefined means "not ready yet" (distinct from
 * null = random), so the parent never silently computes equity against an
 * incomplete or invalid input.
 */
export function HandSpecInput({
  label,
  usedCards,
  onChange,
  defaultMode = "concrete",
}: {
  label: string;
  usedCards: Set<string>;
  onChange: (spec: HandSpec | undefined) => void;
  defaultMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [rangeText, setRangeText] = useState("");

  const { spec, error: rangeError } = useMemo(
    () => computeSpec(mode, slots, rangeText),
    [mode, slots, rangeText],
  );
  const specKey = JSON.stringify(spec);

  useEffect(() => {
    onChange(spec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex gap-1 text-xs">
          {(["concrete", "range", "random"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`min-h-8 rounded px-2 py-1 font-semibold ${
                mode === m ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      {mode === "concrete" && (
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <CardSlot
              key={i}
              card={slots[i]}
              usedCards={usedCards}
              onPick={(c) => setSlots((s) => s.map((x, idx) => (idx === i ? c : x)))}
              onClear={() => setSlots((s) => s.map((x, idx) => (idx === i ? null : x)))}
            />
          ))}
        </div>
      )}

      {mode === "range" && (
        <div>
          <input
            type="text"
            value={rangeText}
            onChange={(e) => setRangeText(e.target.value)}
            placeholder="e.g. QQ+,AKs,AKo"
            className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {rangeError && <p className="mt-1 text-xs text-red-600">{rangeError}</p>}
        </div>
      )}

      {mode === "random" && (
        <p className="text-sm text-slate-500">Any two cards (unknown opponent).</p>
      )}
    </div>
  );
}
