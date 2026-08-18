"use client";

import * as Comlink from "comlink";
import { useEffect, useRef } from "react";
import type { PokerWorkerApi } from "@/workers/poker.worker";

/** Lazily creates the poker Web Worker once per mount, terminates on unmount. */
export function usePokerWorker() {
  const apiRef = useRef<Comlink.Remote<PokerWorkerApi> | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../workers/poker.worker.ts", import.meta.url));
    apiRef.current = Comlink.wrap<PokerWorkerApi>(worker);
    return () => {
      worker.terminate();
      apiRef.current = null;
    };
  }, []);

  return apiRef;
}
