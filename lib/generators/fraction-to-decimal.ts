import { createRng } from "../rng";
import { formatNumber, reduce } from "../math";
import type { Generator, Problem } from "../types";

const denominatorsByLevel: Record<number, number[]> = {
  1: [2, 4, 5, 10],
  2: [2, 4, 5, 8, 10, 20],
  3: [4, 8, 16, 20, 25, 40, 50, 100],
};

const fractionToDecimal: Generator = {
  id: "fraction-to-decimal",
  columns: 3,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const denominator = rng.pick(denominatorsByLevel[level]);
      const numerator = rng.int(1, denominator - 1);
      const decimal = formatNumber(numerator / denominator, 6);
      const simple = reduce({ n: numerator, d: denominator });

      if (rng.bool()) {
        problems.push({
          prompt: `${numerator}/${denominator} = ?`,
          answer: decimal,
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${decimal} = ?`,
          answer: `${simple.n}/${simple.d}`,
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default fractionToDecimal;
