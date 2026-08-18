import { HAND_STRENGTH_TIERS } from "@/lib/data/handStrength";

export function HandStrengthTable() {
  return (
    <div className="space-y-3">
      {HAND_STRENGTH_TIERS.map((tier) => (
        <div key={tier.category} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-bold text-slate-900">
              {tier.category}. {tier.name}
            </h3>
            <span className="font-mono text-xs text-slate-400">{tier.example}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{tier.description}</p>
        </div>
      ))}
    </div>
  );
}
