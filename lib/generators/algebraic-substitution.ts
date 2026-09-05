import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const algebraicSubstitution: Generator = {
  id: "algebraic-substitution",
  columns: 1,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const a = rng.int(2, bound);
      const b = rng.int(1, bound);
      const x = level === 3 ? rng.int(-8, 8) || 2 : rng.int(1, 9);
      const kind = level === 1 ? 1 : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `חשבו את ערך הביטוי ${a}x + ${b} עבור x = ${x}`,
          answer: String(a * x + b),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `חשבו את ערך הביטוי ${a}x − ${b} עבור x = ${x}`,
          answer: String(a * x - b),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `חשבו את ערך הביטוי ${a}(x + ${b}) עבור x = ${x}`,
          answer: String(a * (x + b)),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default algebraicSubstitution;
