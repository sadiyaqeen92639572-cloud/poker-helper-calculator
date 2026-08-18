import * as Comlink from "comlink";
import { computeEquity, type ComputeEquityOptions } from "../lib/poker/equity";
import { countOuts, outsToEquityRule } from "../lib/poker/outs";
import type { HandSpec } from "../lib/poker/types";

/**
 * Web Worker home for the genuinely expensive poker math — equity
 * (calculateEquityMultiway under the hood) and outs (up to 46 bestHand
 * calls). Kept off the main thread so typing/picking cards never stalls
 * the UI. Request-staleness is handled by the caller (see
 * hooks/usePokerWorker.ts), not here — each call here is stateless.
 */
const api = {
  computeEquity(hero: HandSpec, board: string[], villains: HandSpec[], options: ComputeEquityOptions) {
    return computeEquity(hero, board, villains, options);
  },
  countOuts(hero: string[], board: string[], villain: string[]) {
    return countOuts(hero, board, villain);
  },
  outsToEquityRule(outs: number, cardsToCome: 1 | 2) {
    return outsToEquityRule(outs, cardsToCome);
  },
};

export type PokerWorkerApi = typeof api;

Comlink.expose(api);
