import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const quotientMaxByLevel: Record<number, number> = { 1: 9, 2: 40, 3: 120 };

const divideTwoDigit: Generator = {
  id: "divide-two-digit",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const divisor = rng.int(11, level === 1 ? 20 : 99);
      const quotient = rng.int(2, quotientMaxByLevel[level]);

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

export default divideTwoDigit;
