import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

type Conversion = { big: string; small: string; factor: number };

const conversionsByLevel: Record<number, Conversion[]> = {
  1: [{ big: "מטר", small: 'ס"מ', factor: 100 }],
  2: [
    { big: "מטר", small: 'ס"מ', factor: 100 },
    { big: 'ס"מ', small: 'מ"מ', factor: 10 },
  ],
  3: [
    { big: "מטר", small: 'ס"מ', factor: 100 },
    { big: 'ס"מ', small: 'מ"מ', factor: 10 },
    { big: 'ק"מ', small: "מטר", factor: 1000 },
  ],
};

const lengthUnits: Generator = {
  id: "length-units",
  columns: 2,
  defaultCount: 14,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const conversion = rng.pick(conversionsByLevel[level]);
      const amount = rng.int(2, level === 1 ? 9 : 25);
      const converted = amount * conversion.factor;

      if (rng.bool()) {
        problems.push({
          prompt: `כמה ${conversion.small} יש ב‑${amount} ${conversion.big}?`,
          answer: `${converted} ${conversion.small}`,
          work: "none",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `כמה ${conversion.big} יש ב‑${converted} ${conversion.small}?`,
          answer: `${amount} ${conversion.big}`,
          work: "none",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default lengthUnits;
