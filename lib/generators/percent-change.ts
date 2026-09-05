import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const changes = [5, 10, 20, 25, 50];
const harderChanges = [4, 8, 15, 30, 40, 60, 75];

const percentChange: Generator = {
  id: "percent-change",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const options = level === 1 ? changes : [...changes, ...harderChanges];

    for (let i = 0; i < count; i++) {
      const p = rng.pick(options);
      const base = rng.int(2, 40) * 100;
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `מחיר מוצר ${base} ש"ח והוא התייקר ב-${p}%. מהו המחיר החדש?`,
          answer: `${formatNumber(base * (1 + p / 100), 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `מחיר מוצר ${base} ש"ח והוא הוזל ב-${p}%. מהו המחיר החדש?`,
          answer: `${formatNumber(base * (1 - p / 100), 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const q = rng.pick(options);
        problems.push({
          prompt: `מחיר מוצר ${base} ש"ח. תחילה הוא התייקר ב-${p}% ואחר כך הוזל ב-${q}%. מהו המחיר הסופי?`,
          answer: `${formatNumber(base * (1 + p / 100) * (1 - q / 100), 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default percentChange;
