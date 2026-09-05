import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const equationWordProblems: Generator = {
  id: "equation-word-problems",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);
      const a = rng.int(2, bound);
      const b = rng.int(1, bound * 2);
      const x = rng.int(2, 15);

      if (kind === 1) {
        problems.push({
          prompt: `חשבתי על מספר, הכפלתי אותו ב-${a} והוספתי ${b}. קיבלתי ${a * x + b}. מהו המספר?`,
          answer: String(x),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const subtrahend = Math.min(b, a * x - 1);
        problems.push({
          prompt: `חשבתי על מספר, הכפלתי אותו ב-${a} וחיסרתי ${subtrahend}. קיבלתי ${
            a * x - subtrahend
          }. מהו המספר?`,
          answer: String(x),
          work: "lines",
          dir: "rtl",
        });
      } else {
        const width = rng.int(3, 20);
        const gap = rng.int(1, 10);
        problems.push({
          prompt: `אורך מלבן גדול ב-${gap} ס"מ מרוחבו. היקף המלבן ${
            4 * width + 2 * gap
          } ס"מ. מהו הרוחב?`,
          answer: `${width} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default equationWordProblems;
