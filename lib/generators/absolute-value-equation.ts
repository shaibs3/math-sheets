import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const absoluteValueEquation: Generator = {
  id: "absolute-value-equation",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const a = level === 1 ? 1 : rng.int(1, bound);
      const b = a * rng.int(1, bound) * (rng.bool() ? 1 : -1);
      const value = rng.int(1, bound * 2) * a;
      const high = (value - b) / a;
      const low = (-value - b) / a;

      problems.push({
        prompt: `|${formatLinear(a, b)}| = ${value}`,
        answer: `x = ${formatSignedNumber(high)} , x = ${formatSignedNumber(low)}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default absoluteValueEquation;
