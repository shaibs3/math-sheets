import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const rates = [10, 20, 25, 50, 100];

const exponentialGrowth: Generator = {
  id: "exponential-growth",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const rate = rng.pick(level === 1 ? [10, 50, 100] : rates);
      const periods = rng.int(2, level === 1 ? 2 : level === 2 ? 3 : 4);
      const start = rng.int(1, 9) * 10000;
      const growing = level === 1 ? true : rng.bool();
      const factor = growing ? 1 + rate / 100 : 1 - rate / 100;
      const result = start * factor ** periods;

      problems.push({
        prompt: `כמות התחלתית ${start} ${
          growing ? "גדלה" : "דועכת"
        } ב-${rate}% בכל שנה. מה תהיה הכמות אחרי ${periods} שנים?`,
        answer: formatNumber(result, 2),
        work: "lines",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default exponentialGrowth;
