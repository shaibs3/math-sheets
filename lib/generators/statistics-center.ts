import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const statisticsCenter: Generator = {
  id: "statistics-center",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const size = level === 1 ? 5 : level === 2 ? 7 : 9;
    const bound = level === 1 ? 20 : 100;

    for (let i = 0; i < count; i++) {
      const values: number[] = [];
      const repeated = rng.int(1, bound);
      values.push(repeated, repeated);
      const used = new Set([repeated]);
      while (values.length < size) {
        const candidate = rng.int(1, bound);
        if (used.has(candidate)) continue;
        used.add(candidate);
        values.push(candidate);
      }
      const shuffled = [...values];
      for (let j = shuffled.length - 1; j > 0; j--) {
        const k = rng.int(0, j);
        [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
      }
      const sorted = [...shuffled].sort((a, b) => a - b);
      const sum = sorted.reduce((total, value) => total + value, 0);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);
      const list = shuffled.join(", ");

      if (kind === 1) {
        problems.push({
          prompt: `נתונים המספרים: ${list}. מהו הממוצע?`,
          answer: formatNumber(sum / sorted.length, 2),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `נתונים המספרים: ${list}. מהו החציון?`,
          answer: String(sorted[(sorted.length - 1) / 2]),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `נתונים המספרים: ${list}. מהו השכיח?`,
          answer: String(repeated),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default statisticsCenter;
