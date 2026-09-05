import { createRng } from "../rng";
import { formatLinear, formatPolynomial, formatQuadratic } from "../algebra";
import { gcd } from "../math";
import type { Generator, Problem } from "../types";

const factoring: Generator = {
  id: "factoring",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? 1 : rng.int(1, 3);
      const k = rng.int(2, bound);
      const rawA = rng.int(1, bound);
      const rawB = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const common = gcd(rawA, rawB);
      const a = rawA / common;
      const b = rawB / common;

      if (kind === 1) {
        problems.push({
          prompt: `${formatPolynomial([
            [k * a, "x²"],
            [k * b, "x"],
          ])} =`,
          answer: `${k}x(${formatLinear(a, b)})`,
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${formatQuadratic(0, k * a, k * b)} =`,
          answer: `${k}(${formatLinear(a, b)})`,
          work: "none",
          dir: "ltr",
        });
      } else {
        const m = rng.int(2, bound);
        problems.push({
          prompt: `${formatQuadratic(1, 0, -(m * m))} =`,
          answer: `(${formatLinear(1, -m)})(${formatLinear(1, m)})`,
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default factoring;
