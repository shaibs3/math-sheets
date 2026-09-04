import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 10, 2: 18, 3: 20 };

const addSub20: Generator = {
  id: "add-sub-20",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const max = maxByLevel[level];

    for (let i = 0; i < count; i++) {
      if (rng.bool()) {
        const a = rng.int(1, max - 1);
        const b = rng.int(1, max - a);
        problems.push({ prompt: `${a} + ${b} =`, answer: String(a + b), work: "none", dir: "ltr" });
      } else {
        const total = rng.int(2, max);
        const b = rng.int(1, total - 1);
        problems.push({
          prompt: `${total} − ${b} =`,
          answer: String(total - b),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default addSub20;
