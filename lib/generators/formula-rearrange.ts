import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const formulaRearrange: Generator = {
  id: "formula-rearrange",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 12 : level === 2 ? 25 : 40;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        const height = rng.int(2, bound);
        const base = rng.int(2, bound) * 2;
        problems.push({
          prompt: `בנוסחה S = (a · h) ÷ 2 נתון S = ${
            (base * height) / 2
          } ו-h = ${height}. מהו a?`,
          answer: `a = ${formatNumber(base, 2)}`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const speed = rng.int(2, bound) * 5;
        const time = rng.int(2, 12);
        problems.push({
          prompt: `בנוסחה d = v · t נתון d = ${speed * time} ו-t = ${time}. מהו v?`,
          answer: `v = ${formatNumber(speed, 2)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const start = rng.int(2, bound);
        const rate = rng.int(2, 9);
        const periods = rng.int(2, 6);
        problems.push({
          prompt: `בנוסחה y = c + m · t נתון y = ${
            start + rate * periods
          }, c = ${start} ו-t = ${periods}. מהו m?`,
          answer: `m = ${formatNumber(rate, 2)}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default formulaRearrange;
