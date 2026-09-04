import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 60, 2: 200, 3: 800 };

const divisibility369: Generator = {
  id: "divisibility-369",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const divisors = [3, 6, 9];

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

export default divisibility369;
