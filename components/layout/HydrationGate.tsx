"use client";

import { useEffect } from "react";
import { usePokerToolkitStore } from "@/store/poker-toolkit-store";

/**
 * Triggers the toolkit store's deferred rehydration once, on mount —
 * skipHydration on the store means SSR and the pre-hydration client
 * render use the same default state (no hydration-mismatch risk), and
 * rehydration only happens client-side after that. Renders children
 * immediately/unconditionally — pages gate their own "empty" vs "loading"
 * copy on the store's hasHydrated flag (set true here once rehydrate()
 * resolves) rather than blocking the whole tree on it.
 */
export function HydrationGate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    usePokerToolkitStore.persist.rehydrate();
    usePokerToolkitStore.persist.onFinishHydration(() => {
      usePokerToolkitStore.getState().setHasHydrated(true);
    });
  }, []);

  return <>{children}</>;
}
