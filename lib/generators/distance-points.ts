import { createRng } from "../rng";
import { formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const legs: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [12, 16, 20],
];

const distancePoints: Generator = {
  id: "distance-points",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const pool = level === 1 ? legs.slice(0, 3) : level === 2 ? legs.slice(0, 5) : legs;
    const origin = level === 1 ? 6 : 12;

    for (let i = 0; i < count; i++) {
      const [dx, dy, distance] = rng.pick(pool);
      const x1 = level === 1 ? rng.int(0, origin) : rng.int(-origin, origin);
      const y1 = level === 1 ? rng.int(0, origin) : rng.int(-origin, origin);
      const signX = level === 1 ? 1 : rng.bool() ? 1 : -1;
      const signY = level === 1 ? 1 : rng.bool() ? 1 : -1;
      const x2 = x1 + dx * signX;
      const y2 = y1 + dy * signY;

      problems.push({
        prompt: `מצאו את המרחק בין הנקודות (${formatSignedNumber(x1)} , ${formatSignedNumber(
          y1,
        )}) ו-(${formatSignedNumber(x2)} , ${formatSignedNumber(y2)}).`,
        answer: String(distance),
        work: "lines",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default distancePoints;
