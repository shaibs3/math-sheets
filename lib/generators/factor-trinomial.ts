import { createRng } from "../rng";
import { formatLinear, formatQuadratic } from "../algebra";
import type { Generator, Problem } from "../types";

const factorTrinomial: Generator = {
  id: "factor-trinomial",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const p = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      let q = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      if (q === p) q = p + 1;

      problems.push({
        prompt: `פרקו לגורמים: ${formatQuadratic(1, p + q, p * q)}`,
        answer: `(${formatLinear(1, p)})(${formatLinear(1, q)})`,
        work: "none",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default factorTrinomial;
