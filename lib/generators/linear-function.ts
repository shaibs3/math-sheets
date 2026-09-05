import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const linearFunction: Generator = {
  id: "linear-function",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 5 : level === 2 ? 8 : 12;

    for (let i = 0; i < count; i++) {
      const m = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);
      const b = (kind === 3 ? m : 1) * rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);

      if (kind === 1) {
        problems.push({
          prompt: `נתונה הפונקציה y = ${formatLinear(m, b)}. מהו השיפוע שלה?`,
          answer: formatSignedNumber(m),
          work: "none",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `נתונה הפונקציה y = ${formatLinear(m, b)}. מהי נקודת החיתוך עם ציר ה-y?`,
          answer: `(0 , ${formatSignedNumber(b)})`,
          work: "none",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `נתונה הפונקציה y = ${formatLinear(m, b)}. מהי נקודת החיתוך עם ציר ה-x?`,
          answer: `(${formatSignedNumber(-b / m)} , 0)`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default linearFunction;
