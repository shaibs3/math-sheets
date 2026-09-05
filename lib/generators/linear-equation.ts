import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const linearEquation: Generator = {
  id: "linear-equation",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 8 : level === 2 ? 12 : 15;

    for (let i = 0; i < count; i++) {
      const x = level === 1 ? rng.int(1, 10) : rng.int(-10, 12) || 3;
      const a = rng.int(2, bound) * (level === 3 && rng.bool() ? -1 : 1);
      const b = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const useBothSides = level !== 1 && rng.bool();

      if (useBothSides) {
        let c = rng.int(1, bound) * (rng.bool() ? 1 : -1);
        if (c === a) c = a + 1;
        problems.push({
          prompt: `${formatLinear(a, b)} = ${formatLinear(c, (a - c) * x + b)}`,
          answer: `x = ${formatSignedNumber(x)}`,
          work: "lines",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${formatLinear(a, b)} = ${formatSignedNumber(a * x + b)}`,
          answer: `x = ${formatSignedNumber(x)}`,
          work: "lines",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default linearEquation;
