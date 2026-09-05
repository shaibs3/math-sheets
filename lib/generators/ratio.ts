import { createRng } from "../rng";
import { gcd } from "../math";
import type { Generator, Problem } from "../types";

const contexts = [
  { total: "גולות", share: "בין הכחולות לאדומות", a: "גולות כחולות", b: "גולות אדומות" },
  { total: "מדבקות", share: "בין נועה לתמר", a: "מדבקות של נועה", b: "מדבקות של תמר" },
  {
    total: "עוגיות",
    share: "בין שתי הצלחות",
    a: "עוגיות בצלחת הראשונה",
    b: "עוגיות בצלחת השנייה",
  },
];

const ratio: Generator = {
  id: "ratio",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const maxPart = level === 1 ? 5 : level === 2 ? 7 : 9;
      let a = rng.int(1, maxPart);
      let b = rng.int(1, maxPart);
      const g = gcd(a, b);
      a = a / g;
      b = b / g;
      if (a === b) b = a + 1;

      const unit = rng.int(2, level === 1 ? 8 : 15);
      const total = (a + b) * unit;
      const context = rng.pick(contexts);
      const kind = level >= 2 && rng.bool() ? 2 : 1;

      if (kind === 1) {
        problems.push({
          prompt: `חלקו ${total} ${context.total} ${context.share} ביחס ${a}:${b}. כמה יקבל כל צד?`,
          answer: `${a * unit} ו-${b * unit}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `היחס בין ${context.a} ל${context.b} הוא ${a}:${b}. אם יש ${a * unit} ${context.a}, כמה ${context.b} יש?`,
          answer: String(b * unit),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default ratio;
