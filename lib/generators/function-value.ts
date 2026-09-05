import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const functionValue: Generator = {
  id: "function-value",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const m = rng.int(2, bound) * (level === 3 && rng.bool() ? -1 : 1);
      const b = rng.int(1, bound * 2) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const x = level === 1 ? rng.int(1, 10) : rng.int(-8, 10);

      if (level !== 1 && rng.bool()) {
        const y = m * x + b;
        problems.push({
          prompt: `נתונה הפונקציה y = ${formatLinear(m, b)}. עבור איזה x מתקיים y = ${formatSignedNumber(
            y,
          )}?`,
          answer: `x = ${formatSignedNumber(x)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `נתונה הפונקציה y = ${formatLinear(m, b)}. מהו y כאשר x = ${formatSignedNumber(
            x,
          )}?`,
          answer: `y = ${formatSignedNumber(m * x + b)}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default functionValue;
