import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const exponentialEquation: Generator = {
  id: "exponential-equation",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bases = level === 1 ? [2, 3] : level === 2 ? [2, 3, 5] : [2, 3, 5, 7, 10];

    for (let i = 0; i < count; i++) {
      const base = rng.pick(bases);
      const exponent = rng.int(2, base >= 7 ? 4 : base === 5 ? 5 : 8);
      const coefficient = level === 3 ? rng.int(1, 6) : 1;
      const value = coefficient * base ** exponent;

      problems.push({
        prompt:
          coefficient === 1 ? `${base}^x = ${value}` : `${coefficient} · ${base}^x = ${value}`,
        answer: `x = ${exponent}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default exponentialEquation;
