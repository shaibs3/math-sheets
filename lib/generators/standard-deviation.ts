import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const standardDeviation: Generator = {
  id: "standard-deviation",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const pairs = level === 1 ? 2 : level === 2 ? 3 : 4;

    for (let i = 0; i < count; i++) {
      const mean = rng.int(5, level === 1 ? 20 : 60);
      const spread = rng.int(1, level === 1 ? 5 : 10);
      const values: number[] = [];
      for (let j = 0; j < pairs; j++) values.push(mean - spread, mean + spread);
      for (let j = values.length - 1; j > 0; j--) {
        const k = rng.int(0, j);
        [values[j], values[k]] = [values[k], values[j]];
      }
      const list = values.join(", ");

      if (rng.bool()) {
        problems.push({
          prompt: `נתונים המספרים: ${list}. מהי סטיית התקן?`,
          answer: String(spread),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `נתונים המספרים: ${list}. מהו הממוצע?`,
          answer: String(mean),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default standardDeviation;
