import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const denominatorsByLevel: Record<number, number[]> = {
  1: [2, 4],
  2: [2, 3, 4, 5],
  3: [3, 4, 5, 6, 8, 10],
};

const unitFraction: Generator = {
  id: "unit-fraction",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const denominator = rng.pick(denominatorsByLevel[level]);
      const part = rng.int(2, level === 1 ? 10 : 20);
      const whole = part * denominator;

      if (rng.bool()) {
        problems.push({
          prompt: `כמה הם 1/${denominator} מתוך ${whole}?`,
          answer: String(part),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `1/${denominator} ממספר כלשהו הוא ${part}. מהו המספר?`,
          answer: String(whole),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default unitFraction;
