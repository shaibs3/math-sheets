import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const squareProperties: Generator = {
  id: "square-properties",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxSide = level === 1 ? 10 : level === 2 ? 16 : 25;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : level === 2 ? rng.int(1, 4) : rng.int(1, 5);
      const side = rng.int(3, maxSide);

      if (kind === 1) {
        problems.push({
          prompt: `בריבוע אורך הצלע הוא ${side} ס"מ. מהו שטח הריבוע?`,
          answer: `${side * side} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width: side, height: side, unit: 'ס"מ' },
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `בריבוע אורך הצלע הוא ${side} ס"מ. מהו היקף הריבוע?`,
          answer: `${4 * side} ס"מ`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width: side, height: side, unit: 'ס"מ' },
        });
      } else if (kind === 3) {
        problems.push({
          prompt: `היקף הריבוע הוא ${4 * side} ס"מ. מהו אורך צלע הריבוע?`,
          answer: `${side} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 4) {
        problems.push({
          prompt: `שטח הריבוע הוא ${side * side} סמ"ר. מהו אורך צלע הריבוע?`,
          answer: `${side} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const diagonal = 2 * side;
        problems.push({
          prompt: `בריבוע האלכסונים שווים וחוצים זה את זה. אורך האלכסון הוא ${diagonal} ס"מ. מהו אורך חצי האלכסון?`,
          answer: `${side} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default squareProperties;
