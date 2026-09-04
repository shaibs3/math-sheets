import { createRng } from "../rng";
import { formatMixed } from "../math";
import type { Generator, Problem } from "../types";

const denominatorsByLevel: Record<number, number[]> = {
  1: [2, 3, 4],
  2: [3, 4, 5, 6, 8],
  3: [5, 6, 7, 8, 9, 10, 12],
};

const improperMixed: Generator = {
  id: "improper-mixed",
  columns: 3,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const denominator = rng.pick(denominatorsByLevel[level]);
      const whole = rng.int(1, level === 1 ? 4 : 9);
      const remainder = rng.int(1, denominator - 1);
      const improper = whole * denominator + remainder;

      if (rng.bool()) {
        problems.push({
          prompt: `${improper}/${denominator} =`,
          answer: formatMixed(whole, remainder, denominator),
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${formatMixed(whole, remainder, denominator)} =`,
          answer: `${improper}/${denominator}`,
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default improperMixed;
