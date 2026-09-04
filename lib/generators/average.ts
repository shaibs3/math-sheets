import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const countByLevel: Record<number, number[]> = {
  1: [3],
  2: [3, 4],
  3: [4, 5, 6],
};

const average: Generator = {
  id: "average",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const amount = rng.pick(countByLevel[level]);
      const spread = level === 1 ? 3 : 5;
      const maxDeviation = spread * (amount - 1);
      const mean = rng.int(maxDeviation + 2, level === 1 ? 20 : 90);
      const offsets: number[] = [];
      let total = 0;

      for (let k = 0; k < amount - 1; k++) {
        const offset = rng.int(-spread, spread);
        offsets.push(offset);
        total += offset;
      }
      offsets.push(-total);

      const values = offsets.map((offset) => mean + offset);

      problems.push({
        prompt: `מהו הממוצע של המספרים ${values.join(", ")}?`,
        answer: String(mean),
        work: "lines",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default average;
