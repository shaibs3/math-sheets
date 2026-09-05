import { createRng } from "../rng";
import { formatQuadratic, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const quadraticOptimum: Generator = {
  id: "quadratic-optimum",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 10 : 14;

    for (let i = 0; i < count; i++) {
      const opensUp = level === 1 ? true : rng.bool();
      const a = (opensUp ? 1 : -1) * rng.int(1, 3);
      const vertexX = rng.int(1, bound);
      const vertexY = rng.int(-bound * 3, bound * 3);
      const b = -2 * a * vertexX;
      const c = a * vertexX * vertexX + vertexY;
      const goal = opensUp ? "מינימלי" : "מקסימלי";

      if (rng.bool()) {
        problems.push({
          prompt: `רווח חברה נתון על ידי y = ${formatQuadratic(
            a,
            b,
            c,
          )}. עבור איזה x הערך ${goal}?`,
          answer: `x = ${formatSignedNumber(vertexX)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `רווח חברה נתון על ידי y = ${formatQuadratic(
            a,
            b,
            c,
          )}. מהו הערך ה${goal}?`,
          answer: `y = ${formatSignedNumber(vertexY)}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default quadraticOptimum;
