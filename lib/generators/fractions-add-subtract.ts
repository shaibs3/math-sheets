import { createRng } from "../rng";
import { formatFraction, lcm } from "../math";
import type { Generator, Problem } from "../types";

const denominatorsByLevel: Record<number, number[]> = {
  1: [2, 3, 4, 5, 6, 8, 10],
  2: [3, 4, 5, 6, 7, 8, 9, 10, 12],
  3: [6, 7, 8, 9, 10, 11, 12, 15, 16],
};

const fractionsAddSubtract: Generator = {
  id: "fractions-add-subtract",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const denominators = denominatorsByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const d1 = rng.pick(denominators);
      let d2 = rng.pick(denominators);
      if (d2 === d1) d2 = rng.pick(denominators);

      const n1 = rng.int(1, d1 - 1);
      const n2 = rng.int(1, d2 - 1);
      const common = lcm(d1, d2);
      const a = { n: (n1 * common) / d1, d: common };
      const b = { n: (n2 * common) / d2, d: common };
      const isAdd = rng.bool() || a.n <= b.n;

      const result = isAdd
        ? { n: a.n + b.n, d: common }
        : { n: a.n - b.n, d: common };

      problems.push({
        prompt: `${n1}/${d1} ${isAdd ? "+" : "−"} ${n2}/${d2} =`,
        answer: formatFraction(result),
        work: "lines",
      });
    }

    return problems;
  },
};

export default fractionsAddSubtract;
