"use client";

import { useState } from "react";
import { usePokerToolkitStore } from "@/store/poker-toolkit-store";

const SUGGESTED_TAGS = ["aggressive", "passive", "calling station", "tight", "loose", "bluffs a lot", "folds to 3-bets"];

export function OpponentNotes() {
  const notes = usePokerToolkitStore((s) => s.opponentNotes);
  const hasHydrated = usePokerToolkitStore((s) => s.hasHydrated);
  const addOpponentNote = usePokerToolkitStore((s) => s.addOpponentNote);
  const updateOpponentNote = usePokerToolkitStore((s) => s.updateOpponentNote);
  const deleteOpponentNote = usePokerToolkitStore((s) => s.deleteOpponentNote);

  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setSelectedTags((tags) => (tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]));
  }

  function resetForm() {
    setName("");
    setSelectedTags([]);
    setText("");
    setEditingId(null);
  }

  function handleSave() {
    if (!name.trim()) return;
    if (editingId) {
      updateOpponentNote(editingId, { name: name.trim(), tags: selectedTags, notes: text.trim() });
    } else {
      addOpponentNote(name.trim(), selectedTags, text.trim());
    }
    resetForm();
  }

  function startEdit(note: { id: string; name: string; tags: string[]; notes: string }) {
    setEditingId(note.id);
    setName(note.name);
    setSelectedTags(note.tags);
    setText(note.notes);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this opponent note? This can't be undone.")) return;
    if (editingId === id) resetForm();
    deleteOpponentNote(id);
  }

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {editingId && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">Editing note</p>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Name / seat</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Seat 4, 'the guy in the hat'"
            className="w-full min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>

        <div className="mt-3">
          <span className="mb-1 block text-sm font-medium text-slate-700">Tags</span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`min-h-8 rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedTags.includes(tag) ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="What have you seen them do?"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="min-h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {editingId ? "Save changes" : "Add note"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {!hasHydrated && <p className="text-sm text-slate-400">Loading your notes…</p>}
        {hasHydrated && notes.length === 0 && (
          <p className="text-sm text-slate-500">No opponent notes yet — add one above.</p>
        )}
        {hasHydrated &&
          notes
            .slice()
            .reverse()
            .map((note) => (
              <div key={note.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{note.name}</h3>
                    {note.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(note)}
                      className="text-xs font-semibold text-emerald-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {note.notes && <p className="mt-2 text-sm text-slate-600">{note.notes}</p>}
              </div>
            ))}
      </div>
    </div>
  );
}
