import { createRng } from "../rng";
import { formatQuadratic, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const quadraticInequality: Generator = {
  id: "quadratic-inequality",
  columns: 2,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 10;

    for (let i = 0; i < count; i++) {
      const first = level === 1 ? rng.int(1, bound) : rng.int(-bound, bound);
      let second = level === 1 ? rng.int(1, bound) : rng.int(-bound, bound);
      if (second === first) second = first + 1;
      const [low, high] = [first, second].sort((a, b) => a - b);
      const lead =
        level === 1
          ? 1
          : level === 2
            ? rng.bool()
              ? 1
              : -1
            : rng.int(1, 3) * (rng.bool() ? 1 : -1);
      const strict = level === 3 ? rng.bool() : true;
      const greater = rng.bool();
      const relation = greater ? (strict ? ">" : "≥") : strict ? "<" : "≤";

      const opensUpward = lead > 0;
      const outside = greater === opensUpward;
      const lowSign = strict ? "<" : "≤";
      const highSign = outside ? (strict ? ">" : "≥") : strict ? "<" : "≤";

      const answer = outside
        ? `x ${lowSign} ${formatSignedNumber(low)} , x ${highSign} ${formatSignedNumber(high)}`
        : `${formatSignedNumber(low)} ${lowSign} x ${highSign} ${formatSignedNumber(high)}`;

      problems.push({
        prompt: `${formatQuadratic(lead, -lead * (low + high), lead * low * high)} ${relation} 0`,
        answer,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default quadraticInequality;
