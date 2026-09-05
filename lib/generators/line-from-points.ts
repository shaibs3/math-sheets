import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const lineFromPoints: Generator = {
  id: "line-from-points",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 4 : level === 2 ? 7 : 10;

    for (let i = 0; i < count; i++) {
      const m = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const b = rng.int(1, bound * 2) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const x1 = rng.int(-6, 6);
      let x2 = rng.int(-6, 6);
      if (x2 === x1) x2 = x1 + 1;
      const y1 = m * x1 + b;
      const y2 = m * x2 + b;

      if (level !== 1 && rng.bool()) {
        problems.push({
          prompt: `מצאו את השיפוע של הישר העובר דרך (${formatSignedNumber(
            x1,
          )} , ${formatSignedNumber(y1)}) ו-(${formatSignedNumber(x2)} , ${formatSignedNumber(
            y2,
          )}).`,
          answer: `m = ${formatSignedNumber(m)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `מצאו את משוואת הישר העובר דרך (${formatSignedNumber(
            x1,
          )} , ${formatSignedNumber(y1)}) ו-(${formatSignedNumber(x2)} , ${formatSignedNumber(
            y2,
          )}).`,
          answer: `y = ${formatLinear(m, b)}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default lineFromPoints;
