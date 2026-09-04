import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const rangeByLevel: Record<number, [number, number]> = {
  1: [11, 99],
  2: [101, 999],
  3: [1001, 9999],
};

const addSubVertical: Generator = {
  id: "add-sub-vertical",
  columns: 3,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const [min, max] = rangeByLevel[level];

    for (let i = 0; i < count; i++) {
      const a = rng.int(min, max);
      const b = rng.int(min, max);
      const [big, small] = a >= b ? [a, b] : [b, a];

      if (rng.bool()) {
        problems.push({
          prompt: `${big} + ${small} =`,
          answer: String(big + small),
          work: "vertical",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${big} − ${small} =`,
          answer: String(big - small),
          work: "vertical",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default addSubVertical;
