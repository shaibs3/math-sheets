export type Rng = {
  next: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
  bool: () => boolean;
};

export function createRng(seed: number): Rng {
  let state = seed >>> 0 || 1;

  const next = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));

  return {
    next,
    int,
    pick: <T,>(items: readonly T[]) => items[int(0, items.length - 1)],
    bool: () => next() < 0.5,
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 900000) + 100000;
}
