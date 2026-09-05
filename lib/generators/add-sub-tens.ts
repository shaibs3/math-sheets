import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxTensByLevel: Record<number, number> = { 1: 5, 2: 10, 3: 10 };

const addSubTens: Generator = {
  id: "add-sub-tens",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxTens = maxTensByLevel[level];

    for (let i = 0; i < count; i++) {
      const withUnits = level === 3 && rng.bool();

      if (withUnits) {
        const tens = rng.int(1, maxTens - 1) * 10;
        const units = rng.int(1, 9);
        if (rng.bool()) {
          problems.push({
            prompt: `${tens} + ${units} =`,
            answer: String(tens + units),
            work: "none",
            dir: "ltr",
          });
        } else {
          problems.push({
            prompt: `${tens + units} − ${units} =`,
            answer: String(tens),
            work: "none",
            dir: "ltr",
          });
        }
        continue;
      }

      if (rng.bool()) {
        const first = rng.int(1, maxTens - 1);
        const second = rng.int(1, maxTens - first);
        problems.push({
          prompt: `${first * 10} + ${second * 10} =`,
          answer: String((first + second) * 10),
          work: "none",
          dir: "ltr",
        });
      } else {
        const total = rng.int(2, maxTens);
        const taken = rng.int(1, total - 1);
        problems.push({
          prompt: `${total * 10} − ${taken * 10} =`,
          answer: String((total - taken) * 10),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default addSubTens;
