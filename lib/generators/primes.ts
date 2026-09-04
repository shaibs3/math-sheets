import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 40, 2: 80, 3: 150 };

function isPrime(value: number): boolean {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor++) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function smallestFactor(value: number): number {
  for (let divisor = 2; divisor * divisor <= value; divisor++) {
    if (value % divisor === 0) return divisor;
  }
  return value;
}

const primes: Generator = {
  id: "primes",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const value = rng.int(2, maxByLevel[level]);
      const prime = isPrime(value);

      problems.push({
        prompt: `${value} — ראשוני או פריק?`,
        answer: prime ? "ראשוני" : `פריק, מתחלק ב‑${smallestFactor(value)}`,
        work: "none",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default primes;
