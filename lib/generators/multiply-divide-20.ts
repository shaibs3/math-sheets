import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const factorsByLevel: Record<number, number[]> = {
  1: [2, 3, 4, 5],
  2: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  3: [2, 3, 4, 5, 6, 7, 8, 9, 10],
};

const multiplyDivide20: Generator = {
  id: "multiply-divide-20",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const factors = factorsByLevel[level];

    for (let i = 0; i < count; i++) {
      const first = rng.pick(factors);
      const second = rng.int(2, Math.floor(20 / first));
      const product = first * second;

      if (level === 3 && rng.bool()) {
        problems.push({
          prompt: `${product} ÷ ${first} =`,
          answer: String(second),
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${first} × ${second} =`,
          answer: String(product),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default multiplyDivide20;
