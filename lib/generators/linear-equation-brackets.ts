import { createRng } from "../rng";
import { formatLinear, formatSignedNumber, leadingTerm } from "../algebra";
import type { Generator, Problem } from "../types";

const linearEquationBrackets: Generator = {
  id: "linear-equation-brackets",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const x = level === 1 ? rng.int(1, 10) : rng.int(-9, 12) || 4;
      const k = rng.int(2, bound) * (level === 3 && rng.bool() ? -1 : 1);
      const a = rng.int(1, bound);
      const b = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const kind = level === 1 ? 1 : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `${leadingTerm(k, "")}(${formatLinear(a, b)}) = ${formatSignedNumber(
            k * (a * x + b),
          )}`,
          answer: `x = ${formatSignedNumber(x)}`,
          work: "lines",
          dir: "ltr",
        });
      } else if (kind === 2) {
        const m = rng.int(2, bound);
        const c = rng.int(1, bound);
        const d = rng.int(1, bound) * (rng.bool() ? 1 : -1);
        problems.push({
          prompt: `${leadingTerm(k, "")}(${formatLinear(a, b)}) + ${m}(${formatLinear(
            c,
            d,
          )}) = ${formatSignedNumber(k * (a * x + b) + m * (c * x + d))}`,
          answer: `x = ${formatSignedNumber(x)}`,
          work: "lines",
          dir: "ltr",
        });
      } else {
        const divisor = rng.int(2, 9);
        const slope = rng.int(1, bound);
        const shift = rng.int(1, bound) * (rng.bool() ? 1 : -1);
        problems.push({
          prompt: `(${formatLinear(divisor * slope, divisor * shift)}) ÷ ${divisor} = ${formatSignedNumber(
            slope * x + shift,
          )}`,
          answer: `x = ${formatSignedNumber(x)}`,
          work: "lines",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default linearEquationBrackets;
