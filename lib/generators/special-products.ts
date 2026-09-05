import { createRng } from "../rng";
import { formatLinear, formatQuadratic } from "../algebra";
import type { Generator, Problem } from "../types";

const specialProducts: Generator = {
  id: "special-products",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const a = level === 1 ? 1 : rng.int(1, 5);
      const b = rng.int(1, bound);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `(${formatLinear(a, b)})² =`,
          answer: formatQuadratic(a * a, 2 * a * b, b * b),
          work: "lines",
          dir: "ltr",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `(${formatLinear(a, -b)})² =`,
          answer: formatQuadratic(a * a, -2 * a * b, b * b),
          work: "lines",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `(${formatLinear(a, -b)})(${formatLinear(a, b)}) =`,
          answer: formatQuadratic(a * a, 0, -b * b),
          work: "lines",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default specialProducts;
