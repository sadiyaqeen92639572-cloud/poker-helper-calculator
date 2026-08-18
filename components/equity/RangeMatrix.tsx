"use client";

const RANK_ORDER = "AKQJT98765432".split("");

function cellLabel(i: number, j: number): string {
  const a = RANK_ORDER[i];
  const b = RANK_ORDER[j];
  if (i === j) return a + b;
  if (i < j) return a + b + "s";
  return b + a + "o";
}

/**
 * The standard 13x13 preflop range grid — pairs on the diagonal, suited
 * combos above it, offsuit below. Built once, reused across the
 * range-vs-range calculator, the preflop range page, and the position
 * reference (see plan). 169 cells don't fit a narrow viewport at real touch
 *-target size, so the grid sits in a horizontal-scroll container and cells
 * stay at the 44px mobile-tap guideline — the scroll is the tradeoff, not
 * shrunken cells.
 */
export function RangeMatrix({
  value,
  onChange,
}: {
  /** Comma-separated range string, e.g. "AA,AKs,AKo" — one token per selected cell. */
  value: string;
  onChange: (range: string) => void;
}) {
  const selected = new Set(
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

  function toggle(label: string) {
    const next = new Set(selected);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    onChange(Array.from(next).join(","));
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid grid-cols-[repeat(13,2.75rem)] gap-px rounded border border-slate-300 bg-slate-300 p-px">
        {RANK_ORDER.flatMap((_, i) =>
          RANK_ORDER.map((__, j) => {
            const label = cellLabel(i, j);
            const active = selected.has(label);
            const kind = i === j ? "pair" : i < j ? "suited" : "offsuit";
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggle(label)}
                title={label}
                className={`flex h-11 w-11 items-center justify-center text-xs font-semibold ${
                  active
                    ? "bg-emerald-500 text-white"
                    : kind === "pair"
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : kind === "suited"
                        ? "bg-white text-slate-600 hover:bg-slate-100"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {label.replace(/[so]$/, "")}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
