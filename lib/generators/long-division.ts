import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const quotientRangeByLevel: Record<number, [number, number]> = {
  1: [21, 99],
  2: [101, 499],
  3: [101, 999],
};

const longDivision: Generator = {
  id: "long-division",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const divisor = level === 3 && rng.bool() ? rng.int(2, 9) * 10 : rng.int(3, 9);
      const [min, max] = quotientRangeByLevel[level];
      const quotient = rng.int(min, divisor > 9 ? Math.min(max, 99) : max);

      problems.push({
        prompt: `${divisor * quotient} ÷ ${divisor} =`,
        answer: String(quotient),
        work: "vertical",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default longDivision;
