import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const addSub100: Generator = {
  id: "add-sub-100",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const small = level === 1;
      if (rng.bool()) {
        const a = rng.int(11, small ? 89 : 88);
        const b = small ? rng.int(2, 9) : rng.int(11, 100 - a);
        problems.push({ prompt: `${a} + ${b} =`, answer: String(a + b), work: "none", dir: "ltr" });
      } else {
        const total = rng.int(level === 3 ? 60 : 21, 100);
        const b = small ? rng.int(2, 9) : rng.int(11, total - 1);
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

export default addSub100;
