import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const quotientMaxByLevel: Record<number, number> = { 1: 9, 2: 20, 3: 50 };

const divideRemainder: Generator = {
  id: "divide-remainder",
  columns: 3,
  defaultCount: 15,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const divisor = rng.int(2, 9);
      const quotient = rng.int(2, quotientMaxByLevel[level]);
      const remainder = rng.int(0, divisor - 1);
      const dividend = divisor * quotient + remainder;

      problems.push({
        prompt: `${dividend} ÷ ${divisor} =`,
        answer: remainder === 0 ? String(quotient) : `${quotient} ושארית ${remainder}`,
        work: "vertical",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default divideRemainder;
