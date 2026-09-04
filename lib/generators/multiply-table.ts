import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxFactorByLevel: Record<number, number> = { 1: 5, 2: 10, 3: 10 };

const multiplyTable: Generator = {
  id: "multiply-table",
  columns: 3,
  defaultCount: 20,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxFactor = maxFactorByLevel[level];

    for (let i = 0; i < count; i++) {
      const a = rng.int(2, maxFactor);
      const b = rng.int(2, maxFactor);
      const product = a * b;

      if (level === 3 && rng.bool()) {
        problems.push({
          prompt: `${product} ÷ ${a} =`,
          answer: String(b),
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${a} × ${b} =`,
          answer: String(product),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default multiplyTable;
