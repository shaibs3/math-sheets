import { createRng } from "../rng";
import { formatPolynomial, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const linearSystem: Generator = {
  id: "linear-system",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 4 : level === 2 ? 7 : 10;
    const solutionBound = level === 1 ? 8 : 10;

    for (let i = 0; i < count; i++) {
      const x = level === 1 ? rng.int(1, solutionBound) : rng.int(-solutionBound, solutionBound);
      const y = level === 1 ? rng.int(1, solutionBound) : rng.int(-solutionBound, solutionBound);
      const a1 = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const b1 = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      let a2 = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      let b2 = rng.int(1, bound) * (rng.bool() ? 1 : -1);
      if (a1 * b2 - a2 * b1 === 0) {
        a2 = a1 + 1;
        b2 = b1 - 1 === 0 ? b1 + 1 : b1 - 1;
      }

      const first = formatPolynomial([
        [a1, "x"],
        [b1, "y"],
      ]);
      const second = formatPolynomial([
        [a2, "x"],
        [b2, "y"],
      ]);

      problems.push({
        prompt: `${first} = ${formatSignedNumber(a1 * x + b1 * y)} ; ${second} = ${formatSignedNumber(
          a2 * x + b2 * y,
        )}`,
        answer: `x = ${formatSignedNumber(x)} , y = ${formatSignedNumber(y)}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default linearSystem;
