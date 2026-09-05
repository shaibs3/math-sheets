import { createRng } from "../rng";
import { formatLinear, formatQuadratic } from "../algebra";
import type { Generator, Problem } from "../types";

const algebraicFractions: Generator = {
  id: "algebraic-fractions",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 5 : level === 2 ? 8 : 12;

    for (let i = 0; i < count; i++) {
      const p = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      let q = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      if (q === p) q = p + 1;

      if (level !== 1 && rng.bool()) {
        problems.push({
          prompt: `(${formatQuadratic(1, 0, -(p * p))}) ÷ (${formatLinear(1, p)}) =`,
          answer: formatLinear(1, -p),
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `(${formatQuadratic(1, p + q, p * q)}) ÷ (${formatLinear(1, p)}) =`,
          answer: formatLinear(1, q),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default algebraicFractions;
