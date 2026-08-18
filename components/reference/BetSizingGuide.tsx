import { BET_SIZING_GUIDE } from "@/lib/data/betSizing";

export function BetSizingGuide() {
  return (
    <div className="space-y-3">
      {BET_SIZING_GUIDE.map((spot) => (
        <div key={spot.street} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-bold text-slate-900">{spot.street}</h3>
            <span className="font-mono text-xs text-emerald-600">{spot.sizing}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{spot.description}</p>
        </div>
      ))}
    </div>
  );
}
