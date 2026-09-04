import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 100, 2: 500, 3: 1000 };

const divisibility: Generator = {
  id: "divisibility",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const divisors = [2, 5, 10];

    for (let i = 0; i < count; i++) {
      const divisor = rng.pick(divisors);
      const base = rng.int(2, maxByLevel[level]);
      const value = rng.bool() ? base * divisor : base;

      problems.push({
        prompt: `האם ${value} מתחלק ב‑${divisor} ללא שארית?`,
        answer: value % divisor === 0 ? "כן" : "לא",
        work: "none",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default divisibility;
