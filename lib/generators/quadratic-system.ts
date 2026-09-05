import { createRng } from "../rng";
import { formatPolynomial, formatQuadratic, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const quadraticSystem: Generator = {
  id: "quadratic-system",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 5 : 7;

    for (let i = 0; i < count; i++) {
      const first = level === 1 ? rng.int(1, bound) : rng.int(-bound, bound);
      let second = level === 1 ? rng.int(1, bound) : rng.int(-bound, bound);
      if (second === first) second = first + 1;
      const [low, high] = [first, second].sort((a, b) => a - b);

      if (level === 3 && i % 2 === 0) {
        problems.push({
          prompt: `x + y = ${formatSignedNumber(low + high)} ; x × y = ${formatSignedNumber(
            low * high,
          )}`,
          answer: `(${formatSignedNumber(low)}, ${formatSignedNumber(
            high,
          )}) , (${formatSignedNumber(high)}, ${formatSignedNumber(low)})`,
          work: "lines",
          dir: "ltr",
        });
        continue;
      }

      const slope = level === 1 ? rng.int(0, 4) : rng.int(-5, 5);
      const intercept = level === 1 ? rng.int(0, 6) : rng.int(-8, 8);
      const parabolaB = slope - (low + high);
      const parabolaC = intercept + low * high;

      problems.push({
        prompt: `y = ${formatQuadratic(1, parabolaB, parabolaC)} ; y = ${formatPolynomial([
          [slope, "x"],
          [intercept, ""],
        ])}`,
        answer: `(${formatSignedNumber(low)}, ${formatSignedNumber(
          slope * low + intercept,
        )}) , (${formatSignedNumber(high)}, ${formatSignedNumber(slope * high + intercept)})`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default quadraticSystem;
