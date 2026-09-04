import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const orderOfOperations: Generator = {
  id: "order-of-operations",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxFactor = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const a = rng.int(2, maxFactor);
      const b = rng.int(2, maxFactor);
      const c = rng.int(2, maxFactor);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);

      if (kind === 1) {
        problems.push({
          prompt: `${a} + ${b} × ${c} =`,
          answer: String(a + b * c),
          work: "lines",
          dir: "ltr",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `(${a} + ${b}) × ${c} =`,
          answer: String((a + b) * c),
          work: "lines",
          dir: "ltr",
        });
      } else if (kind === 3) {
        problems.push({
          prompt: `${b * c} ÷ ${c} + ${a} =`,
          answer: String(b + a),
          work: "lines",
          dir: "ltr",
        });
      } else {
        const bigger = Math.max(a, b) + c;
        problems.push({
          prompt: `${bigger * c} − ${a} × ${c} =`,
          answer: String(bigger * c - a * c),
          work: "lines",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default orderOfOperations;
