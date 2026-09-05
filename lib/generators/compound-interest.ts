import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const compoundInterest: Generator = {
  id: "compound-interest",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const rates = level === 1 ? [10, 20] : level === 2 ? [5, 10, 20, 25] : [4, 5, 8, 10, 15, 20];

    for (let i = 0; i < count; i++) {
      const rate = rng.pick(rates);
      const years = rng.int(2, level === 1 ? 2 : level === 2 ? 3 : 4);
      const principal = rng.int(1, 20) * 10000;
      const total = principal * (1 + rate / 100) ** years;

      if (rng.bool()) {
        problems.push({
          prompt: `הופקדו ${principal} ש"ח בריבית דריבית שנתית של ${rate}%. כמה יהיה בחשבון אחרי ${years} שנים?`,
          answer: `${formatNumber(total, 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `הופקדו ${principal} ש"ח בריבית דריבית שנתית של ${rate}%. מהי הריבית שנצברה אחרי ${years} שנים?`,
          answer: `${formatNumber(total - principal, 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default compoundInterest;
