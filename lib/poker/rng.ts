/**
 * Seedable PRNG (mulberry32) + the handful of random ops the equity engine
 * needs. Cross-language parity with `poker_math.py`'s `random.Random` is
 * statistical (matching trial-count-scale distributions within tolerance),
 * not bit-for-bit — Python's Mersenne Twister and this generator produce
 * different sequences from the same seed. Parity tests must never assert
 * exact-value equality against a Python-seeded run for anything that goes
 * through this RNG.
 */
export class Rng {
  private state: number;

  constructor(seed?: number) {
    this.state = seed === undefined ? (Math.random() * 0xffffffff) >>> 0 : seed >>> 0;
  }

  /** Returns a float in [0, 1). */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Fisher-Yates shuffle, in place. */
  shuffle<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Sample `n` distinct elements without replacement. */
  sample<T>(arr: T[], n: number): T[] {
    const pool = arr.slice();
    this.shuffle(pool);
    return pool.slice(0, n);
  }
}
