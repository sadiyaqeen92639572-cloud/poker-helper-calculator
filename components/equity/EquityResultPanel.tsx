import type { ComputeEquityResult } from "@/lib/poker/equity";

export function EquityResultPanel({
  result,
  pending,
}: {
  result: ComputeEquityResult | null;
  pending: boolean;
}) {
  if (!result) {
    return (
      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
        Fill in hero cards (and board/villains if known) to see equity.
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-slate-50 p-4 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <div className="text-3xl font-black text-emerald-600">{result.displayEquity}</div>
      <p className="text-xs text-slate-500">hero equity</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-700">
        <Stat label="Win" value={result.result.win} />
        <Stat label="Tie" value={result.result.tie} />
        <Stat label="Lose" value={result.result.lose} />
      </div>
      <p className="mt-3 text-xs text-slate-400">
        {result.result.trials.toLocaleString()} trials
        {pending ? " — refining…" : ""}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded bg-white p-2 text-center">
      <div className="font-semibold">{(value * 100).toFixed(1)}%</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
