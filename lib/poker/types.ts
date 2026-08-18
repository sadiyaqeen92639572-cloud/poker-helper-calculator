/** Concrete 2-card hand, a range notation string, or null = any two cards. */
export type HandSpec = string[] | string | null;

export interface EquityResult {
  win: number;
  tie: number;
  lose: number;
  trials: number;
}

export function equityOf(r: EquityResult): number {
  return r.win + r.tie * 0.5;
}
