import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 20, 2: 100, 3: 1000 };

const compareNumbers: Generator = {
  id: "compare-numbers",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const max = maxByLevel[level];

    for (let i = 0; i < count; i++) {
      const a = rng.int(1, max);
      const b = rng.bool() ? a : rng.int(1, max);
      const sign = a > b ? ">" : a < b ? "<" : "=";
      problems.push({
        prompt: `${a} ___ ${b}`,
        answer: sign,
        work: "none",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default compareNumbers;
