import { SUITS } from "@/lib/poker/cards";

const SUIT_SYMBOL: Record<string, string> = { c: "♣", d: "♦", h: "♥", s: "♠" };

// Display order only (Ace-high, matches how players scan a hand) — RANKS
// itself stays low-to-high since RANK_VALUE derives numeric value from its index.
const DISPLAY_RANKS = "AKQJT98765432";

function suitTextClass(suit: string) {
  return suit === "h" || suit === "d" ? "text-red-600" : "text-slate-900";
}

/**
 * Rank-rows x suit-columns layout (13 rows x 4 cols), not the more obvious
 * 4x13 grid — a 13-wide row overflows narrow mobile viewports (this and
 * RangeMatrix are the two components flagged in the plan as most likely to
 * break on mobile). 4 columns of >=44px touch targets fit comfortably.
 */
export function CardPicker({
  usedCards,
  onPick,
  onClose,
}: {
  usedCards: Set<string>;
  onPick: (card: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Click-outside-to-close backdrop, not onMouseLeave — hover doesn't
          exist on touch devices, and this is one of the two components the
          plan flags as most likely to break on mobile. */}
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute z-20 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-slate-300 bg-white p-2 shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {DISPLAY_RANKS.split("").flatMap((r) =>
            SUITS.split("").map((s) => {
              const card = r + s;
              const used = usedCards.has(card);
              return (
                <button
                  key={card}
                  type="button"
                  disabled={used}
                  onClick={() => onPick(card)}
                  className={`flex h-11 items-center justify-center rounded text-sm font-bold ${
                    used
                      ? "cursor-not-allowed bg-slate-50 text-slate-300"
                      : `${suitTextClass(s)} hover:bg-slate-100`
                  }`}
                >
                  {r}
                  {SUIT_SYMBOL[s]}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </>
  );
}
