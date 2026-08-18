import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Home-game toolkit store (features 8-11 in the plan). Same
// persist/skipHydration/merge/prune pattern as
// diggydiggy-gold/store/game-store.ts — skipHydration so SSR and the
// pre-hydration client render match exactly (rehydration is triggered
// manually by HydrationGate after mount), and pruning is applied inside
// merge() (not just forward writes) so an existing bloated save gets fixed
// on next load, not just future ones.

export interface OpponentNote {
  id: string;
  name: string;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChecklistCriterion {
  label: string;
  met: boolean;
}

export interface TableChecklist {
  id: string;
  tableName: string;
  criteria: ChecklistCriterion[];
  createdAt: number;
}

export interface ActiveSession {
  id: string;
  startedAt: number;
  stake: string;
  buyIn: number;
  stopLoss: number | null;
  stopWin: number | null;
}

export interface SessionSummary {
  id: string;
  startedAt: number;
  endedAt: number;
  stake: string;
  buyIn: number;
  cashOut: number;
  netResult: number;
}

export interface HandLogEntry {
  id: string;
  date: string; // ISO date, manually entered
  stake: string;
  hands: number;
  bbWon: number;
  note: string;
}

const MAX_HAND_LOG_ENTRIES = 2000;
const MAX_SESSION_HISTORY = 200;

function pruneHandLog(entries: HandLogEntry[]): HandLogEntry[] {
  if (entries.length <= MAX_HAND_LOG_ENTRIES) return entries;
  return entries.slice(entries.length - MAX_HAND_LOG_ENTRIES);
}

function pruneSessionHistory(sessions: SessionSummary[]): SessionSummary[] {
  if (sessions.length <= MAX_SESSION_HISTORY) return sessions;
  return sessions.slice(sessions.length - MAX_SESSION_HISTORY);
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface ToolkitState {
  opponentNotes: OpponentNote[];
  tableChecklists: TableChecklist[];
  activeSession: ActiveSession | null;
  sessionHistory: SessionSummary[];
  handLogEntries: HandLogEntry[];
  /** Bumped on every handLogEntries/sessionHistory mutation so derived
   * volume stats can memoize on a version counter instead of the array
   * reference itself — see plan Zustand Store section. */
  logVersion: number;
  /** False until HydrationGate's rehydrate() resolves. Pages must gate
   * their "empty" states on this — otherwise every page flashes "no
   * notes yet" / "no sessions yet" for the ~1s rehydration window even
   * when real data is sitting in localStorage, which reads as data loss
   * to a real user glancing at their phone between hands. Not persisted
   * (deliberately absent from partialize below). */
  hasHydrated: boolean;
}

interface ToolkitActions {
  setHasHydrated: (v: boolean) => void;
  addOpponentNote: (name: string, tags: string[], notes: string) => void;
  updateOpponentNote: (id: string, updates: Partial<Pick<OpponentNote, "name" | "tags" | "notes">>) => void;
  deleteOpponentNote: (id: string) => void;

  addTableChecklist: (tableName: string, criteria: ChecklistCriterion[]) => void;
  deleteTableChecklist: (id: string) => void;

  startSession: (stake: string, buyIn: number, stopLoss: number | null, stopWin: number | null) => void;
  endSession: (cashOut: number) => void;
  cancelSession: () => void;

  addHandLogEntry: (entry: Omit<HandLogEntry, "id">) => void;
  deleteHandLogEntry: (id: string) => void;
}

export const usePokerToolkitStore = create<ToolkitState & ToolkitActions>()(
  persist(
    (set) => ({
      opponentNotes: [],
      tableChecklists: [],
      activeSession: null,
      sessionHistory: [],
      handLogEntries: [],
      logVersion: 0,
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      addOpponentNote: (name, tags, notes) => {
        const now = Date.now();
        set((prev) => ({
          opponentNotes: [
            ...prev.opponentNotes,
            { id: makeId("note"), name, tags, notes, createdAt: now, updatedAt: now },
          ],
        }));
      },

      updateOpponentNote: (id, updates) => {
        set((prev) => ({
          opponentNotes: prev.opponentNotes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n,
          ),
        }));
      },

      deleteOpponentNote: (id) => {
        set((prev) => ({ opponentNotes: prev.opponentNotes.filter((n) => n.id !== id) }));
      },

      addTableChecklist: (tableName, criteria) => {
        set((prev) => ({
          tableChecklists: [
            ...prev.tableChecklists,
            { id: makeId("checklist"), tableName, criteria, createdAt: Date.now() },
          ],
        }));
      },

      deleteTableChecklist: (id) => {
        set((prev) => ({ tableChecklists: prev.tableChecklists.filter((c) => c.id !== id) }));
      },

      startSession: (stake, buyIn, stopLoss, stopWin) => {
        set({
          activeSession: { id: makeId("session"), startedAt: Date.now(), stake, buyIn, stopLoss, stopWin },
        });
      },

      endSession: (cashOut) => {
        set((prev) => {
          if (!prev.activeSession) return prev;
          const summary: SessionSummary = {
            id: prev.activeSession.id,
            startedAt: prev.activeSession.startedAt,
            endedAt: Date.now(),
            stake: prev.activeSession.stake,
            buyIn: prev.activeSession.buyIn,
            cashOut,
            netResult: cashOut - prev.activeSession.buyIn,
          };
          return {
            activeSession: null,
            sessionHistory: pruneSessionHistory([...prev.sessionHistory, summary]),
            logVersion: prev.logVersion + 1,
          };
        });
      },

      cancelSession: () => set({ activeSession: null }),

      addHandLogEntry: (entry) => {
        set((prev) => ({
          handLogEntries: pruneHandLog([...prev.handLogEntries, { ...entry, id: makeId("hand") }]),
          logVersion: prev.logVersion + 1,
        }));
      },

      deleteHandLogEntry: (id) => {
        set((prev) => ({
          handLogEntries: prev.handLogEntries.filter((e) => e.id !== id),
          logVersion: prev.logVersion + 1,
        }));
      },
    }),
    {
      name: "poker-helper-toolkit",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const incoming = (persisted ?? {}) as Partial<ToolkitState>;
        return {
          ...current,
          ...incoming,
          handLogEntries: pruneHandLog(incoming.handLogEntries ?? current.handLogEntries),
          sessionHistory: pruneSessionHistory(incoming.sessionHistory ?? current.sessionHistory),
        };
      },
      partialize: (state) => ({
        opponentNotes: state.opponentNotes,
        tableChecklists: state.tableChecklists,
        activeSession: state.activeSession,
        sessionHistory: state.sessionHistory,
        handLogEntries: state.handLogEntries,
        logVersion: state.logVersion,
      }),
    },
  ),
);

/** Derived volume stats — never persisted, recomputed from handLogEntries.
 * Call from a component with useMemo keyed on logVersion, not on the array
 * reference (see plan: naive `useMemo([handLogEntries])` still re-triggers
 * full recompute + re-render for every subscriber on every write at scale). */
export function computeVolumeStats(entries: HandLogEntry[]) {
  const totalHands = entries.reduce((sum, e) => sum + e.hands, 0);
  const totalBbWon = entries.reduce((sum, e) => sum + e.bbWon, 0);
  const bb100 = totalHands > 0 ? (totalBbWon / totalHands) * 100 : 0;
  return { totalHands, totalBbWon, bb100 };
}
