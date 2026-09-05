import { createRng } from "../rng";
import { formatLinear, leadingTerm } from "../algebra";
import type { Generator, Problem } from "../types";

const distributiveExpand: Generator = {
  id: "distributive-expand",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const k = rng.int(2, bound) * (level === 3 && rng.bool() ? -1 : 1);
      const a = rng.int(1, bound);
      const b = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);

      if (level === 1 || rng.bool()) {
        problems.push({
          prompt: `${leadingTerm(k, "")}(${formatLinear(a, b)}) =`,
          answer: formatLinear(k * a, k * b),
          work: "none",
          dir: "ltr",
        });
      } else {
        const m = rng.int(2, bound);
        const c = rng.int(1, bound);
        const d = rng.int(1, bound) * (rng.bool() ? 1 : -1);
        problems.push({
          prompt: `${leadingTerm(k, "")}(${formatLinear(a, b)}) + ${m}(${formatLinear(c, d)}) =`,
          answer: formatLinear(k * a + m * c, k * b + m * d),
          work: "lines",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default distributiveExpand;
