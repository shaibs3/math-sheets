import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const rangesByLevel: Record<number, { left: [number, number]; right: [number, number] }> = {
  1: { left: [12, 99], right: [2, 9] },
  2: { left: [102, 999], right: [3, 9] },
  3: { left: [112, 999], right: [12, 99] },
};

const multiplyVertical: Generator = {
  id: "multiply-vertical",
  columns: 3,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const { left, right } = rangesByLevel[level];

    for (let i = 0; i < count; i++) {
      const a = rng.int(left[0], left[1]);
      const b = rng.int(right[0], right[1]);
      problems.push({
        prompt: `${a} × ${b} =`,
        answer: String(a * b),
        work: "vertical",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default multiplyVertical;
