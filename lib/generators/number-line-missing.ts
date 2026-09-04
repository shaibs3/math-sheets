import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const stepsByLevel: Record<number, number[]> = {
  1: [1, 2],
  2: [2, 5, 10],
  3: [3, 4, 25, 50],
};

const numberLineMissing: Generator = {
  id: "number-line-missing",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const step = rng.pick(stepsByLevel[level]);
      const start = step * rng.int(1, level === 1 ? 8 : 20);
      const hidden = rng.int(1, 3);
      const terms = [0, 1, 2, 3, 4].map((k) => start + k * step);
      const shown = terms.map((value, index) => (index === hidden ? "___" : String(value)));

      problems.push({
        prompt: shown.join(", "),
        answer: String(terms[hidden]),
        work: "none",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default numberLineMissing;
