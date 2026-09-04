import { createRng } from "../rng";
import { formatFraction, formatMixed, mixedToFraction, reduce } from "../math";
import type { Generator, Problem } from "../types";

const fractionsDivide: Generator = {
  id: "fractions-divide",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const d1 = rng.int(2, level === 1 ? 8 : 12);
      const n1 = rng.int(1, d1 - 1);
      const d2 = rng.int(2, level === 1 ? 8 : 12);
      const n2 = rng.int(1, d2 - 1);
      const w1 = level === 3 ? rng.int(0, 3) : 0;

      const f1 = mixedToFraction(w1, n1, d1);
      const f2 = { n: n2, d: d2 };
      const quotient = reduce({ n: f1.n * f2.d, d: f1.d * f2.n });

      problems.push({
        prompt: `${formatMixed(w1, n1, d1)} ÷ ${n2}/${d2} =`,
        answer: formatFraction(quotient),
        work: "lines",
      });
    }

    return problems;
  },
};

export default fractionsDivide;
