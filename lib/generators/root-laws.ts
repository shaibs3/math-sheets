import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const squareFactors = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
const radicands = [2, 3, 5, 6, 7, 10, 11, 13, 15];

const rootLaws: Generator = {
  id: "root-laws",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);
      const outer = rng.pick(squareFactors.slice(0, level === 1 ? 5 : squareFactors.length));
      const inner = rng.pick(radicands.slice(0, level === 1 ? 4 : radicands.length));

      if (kind === 1) {
        problems.push({
          prompt: `√${outer * outer * inner} =`,
          answer: `${outer}√${inner}`,
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 2) {
        const other = rng.pick(radicands);
        problems.push({
          prompt: `√${inner} · √${other} =`,
          answer: `√${inner * other}`,
          work: "none",
          dir: "ltr",
        });
      } else {
        const multiple = rng.int(2, 9);
        problems.push({
          prompt: `√${inner * multiple * multiple} ÷ √${inner} =`,
          answer: String(multiple),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default rootLaws;
