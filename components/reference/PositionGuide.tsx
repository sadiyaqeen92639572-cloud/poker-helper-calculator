import { POSITIONS_9MAX } from "@/lib/data/positions";

export function PositionGuide() {
  return (
    <div className="space-y-3">
      {POSITIONS_9MAX.map((pos) => (
        <div key={pos.abbr} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-baseline gap-2">
            <h3 className="font-bold text-slate-900">{pos.name}</h3>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
              {pos.abbr}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{pos.description}</p>
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-semibold">Opening range: </span>
            {pos.startingHandGuidance}
          </p>
        </div>
      ))}
    </div>
  );
}
