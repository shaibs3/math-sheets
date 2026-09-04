import { createRng } from "../rng";
import { reduce } from "../math";
import type { Generator, Problem } from "../types";

const baseDenominators = [2, 3, 4, 5, 6, 8, 9, 10, 12];

const fractionSimplify: Generator = {
  id: "fraction-simplify",
  columns: 3,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxFactor = level === 1 ? 3 : level === 2 ? 6 : 9;

    for (let i = 0; i < count; i++) {
      const denominator = rng.pick(baseDenominators);
      const numerator = rng.int(1, denominator - 1);
      const simple = reduce({ n: numerator, d: denominator });
      const factor = rng.int(2, maxFactor);

      if (rng.bool()) {
        problems.push({
          prompt: `${simple.n * factor}/${simple.d * factor} =`,
          answer: `${simple.n}/${simple.d}`,
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${simple.n}/${simple.d} = ?/${simple.d * factor}`,
          answer: `${simple.n * factor}/${simple.d * factor}`,
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default fractionSimplify;
