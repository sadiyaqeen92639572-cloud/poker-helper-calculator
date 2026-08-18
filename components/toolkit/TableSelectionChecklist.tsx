"use client";

import { useState } from "react";
import { usePokerToolkitStore } from "@/store/poker-toolkit-store";

const DEFAULT_CRITERIA = [
  "Average pot size is large relative to stakes",
  "Multiple players seeing the flop (loose table)",
  "At least one clearly weak/recreational player",
  "No one is playing noticeably tighter/better than you",
  "Stack sizes are deep enough for postflop play",
  "You're not visibly the shortest stack",
];

function verdictFor(score: number, total: number): { label: string; className: string } {
  if (score >= total - 1) return { label: "Good table", className: "text-emerald-600" };
  if (score >= total / 2) return { label: "Marginal", className: "text-amber-600" };
  return { label: "Avoid", className: "text-red-600" };
}

export function TableSelectionChecklist() {
  const checklists = usePokerToolkitStore((s) => s.tableChecklists);
  const hasHydrated = usePokerToolkitStore((s) => s.hasHydrated);
  const addTableChecklist = usePokerToolkitStore((s) => s.addTableChecklist);
  const deleteTableChecklist = usePokerToolkitStore((s) => s.deleteTableChecklist);

  const [tableName, setTableName] = useState("");
  const [checked, setChecked] = useState<boolean[]>(DEFAULT_CRITERIA.map(() => false));

  function toggle(i: number) {
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  }

  function handleSave() {
    if (!tableName.trim()) return;
    addTableChecklist(
      tableName.trim(),
      DEFAULT_CRITERIA.map((label, i) => ({ label, met: checked[i] })),
    );
    setTableName("");
    setChecked(DEFAULT_CRITERIA.map(() => false));
  }

  const score = checked.filter(Boolean).length;

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Table / site name</span>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="e.g. Table 3, or a home-game name"
            className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>

        <div className="mt-4 space-y-2">
          {DEFAULT_CRITERIA.map((label, i) => (
            <label key={label} className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="h-5 w-5 accent-emerald-600"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Score: {score} / {DEFAULT_CRITERIA.length} —{" "}
            <span className={verdictFor(score, DEFAULT_CRITERIA.length).className}>
              {verdictFor(score, DEFAULT_CRITERIA.length).label}
            </span>
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!tableName.trim()}
            className="min-h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {!hasHydrated && <p className="text-sm text-slate-400">Loading your saved tables…</p>}
        {hasHydrated && checklists.length === 0 && (
          <p className="text-sm text-slate-500">No saved tables yet.</p>
        )}
        {hasHydrated &&
          checklists
            .slice()
            .reverse()
            .map((c) => {
              const s = c.criteria.filter((crit) => crit.met).length;
              const verdict = verdictFor(s, c.criteria.length);
              return (
                <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{c.tableName}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold ${verdict.className}`}>
                        {s} / {c.criteria.length} — {verdict.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Delete this saved table? This can't be undone.")) {
                            deleteTableChecklist(c.id);
                          }
                        }}
                        className="text-xs font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
