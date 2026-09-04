import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const powersByLevel: Record<number, number[]> = {
  1: [10],
  2: [10, 100],
  3: [10, 100, 1000],
};

const multiplyPowersTen: Generator = {
  id: "multiply-powers-ten",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const powers = powersByLevel[level];

    for (let i = 0; i < count; i++) {
      const power = rng.pick(powers);
      const kind = rng.int(1, 3);
      const a = rng.int(2, 9);
      const b = rng.int(2, 9);

      if (kind === 1) {
        problems.push({
          prompt: `${a} × ${power} =`,
          answer: String(a * power),
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${a * power} ÷ ${power} =`,
          answer: String(a),
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${a * 10} × ${b * 10} =`,
          answer: String(a * b * 100),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default multiplyPowersTen;
