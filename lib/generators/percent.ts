import { createRng } from "../rng";
import { formatNumber, gcd } from "../math";
import type { Generator, Problem } from "../types";

const easyPercents = [10, 20, 25, 50, 75];
const harderPercents = [5, 12, 15, 30, 40, 60, 80, 90];

const percent: Generator = {
  id: "percent",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const percents = level === 1 ? easyPercents : [...easyPercents, ...harderPercents];

    for (let i = 0; i < count; i++) {
      const p = rng.pick(percents);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);
      const wholeStep = 100 / gcd(p, 100);
      const base =
        kind === 2 ? wholeStep * rng.int(1, 8) : rng.int(2, 30) * (level === 1 ? 10 : level === 2 ? 5 : 4);
      const part = (base * p) / 100;

      if (kind === 1) {
        problems.push({
          prompt: `כמה הם ${p}% מתוך ${base}?`,
          answer: formatNumber(part, 2),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `בכיתה ${base} תלמידים, ${p}% מהם הביאו אישור. כמה תלמידים הביאו אישור?`,
          answer: `${formatNumber(part, 2)} תלמידים`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        problems.push({
          prompt: `${formatNumber(part, 2)} הם ${p}% ממספר כלשהו. מהו המספר?`,
          answer: formatNumber(base, 2),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `איזה אחוז הם ${formatNumber(part, 2)} מתוך ${base}?`,
          answer: `${p}%`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default percent;
