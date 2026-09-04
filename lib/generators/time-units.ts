import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

type Conversion = { big: string; small: string; factor: number };

const conversionsByLevel: Record<number, Conversion[]> = {
  1: [
    { big: "שעות", small: "דקות", factor: 60 },
    { big: "שבועות", small: "ימים", factor: 7 },
  ],
  2: [
    { big: "שעות", small: "דקות", factor: 60 },
    { big: "דקות", small: "שניות", factor: 60 },
    { big: "שבועות", small: "ימים", factor: 7 },
  ],
  3: [
    { big: "שעות", small: "דקות", factor: 60 },
    { big: "דקות", small: "שניות", factor: 60 },
    { big: "ימים", small: "שעות", factor: 24 },
    { big: "שנים", small: "חודשים", factor: 12 },
  ],
};

const timeUnits: Generator = {
  id: "time-units",
  columns: 2,
  defaultCount: 14,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const conversion = rng.pick(conversionsByLevel[level]);
      const amount = rng.int(2, level === 1 ? 6 : 12);
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

export default timeUnits;
