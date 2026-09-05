import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const slopeByLevel: Record<number, number> = { 1: 2, 2: 3, 3: 4 };

const coordinateSlope: Generator = {
  id: "coordinate-slope",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const limit = slopeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      let m = rng.int(-limit, limit);
      if (m === 0) m = 1;

      const x1 = rng.int(-4, 1);
      const run = rng.int(1, 3);
      const x2 = x1 + run;

      const spread = Math.abs(m) * Math.max(Math.abs(x1), Math.abs(x2));
      const b = spread > 3 ? 0 : rng.int(-2, 2);

      const y1 = m * x1 + b;
      const y2 = m * x2 + b;

      problems.push({
        prompt: `הישר עובר דרך הנקודות (${x1}, ${y1}) ו- (${x2}, ${y2}). מהו שיפועו?`,
        answer: `${m}`,
        work: "lines",
        dir: "rtl",
        figure: {
          kind: "axes",
          min: -8,
          max: 8,
          points: [
            { x: x1, y: y1 },
            { x: x2, y: y2 },
          ],
        },
      });
    }

    return problems;
  },
};

export default coordinateSlope;
