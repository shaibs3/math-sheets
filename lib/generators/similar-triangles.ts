import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const similarTriangles: Generator = {
  id: "similar-triangles",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxRatio = level === 1 ? 3 : level === 2 ? 5 : 8;

    for (let i = 0; i < count; i++) {
      const ratio = rng.int(2, maxRatio);
      const a = rng.int(2, 12);
      const b = rng.int(2, 12);
      const kind = level === 1 ? 1 : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `שני משולשים דומים ביחס דמיון ${ratio}. צלע במשולש הקטן היא ${a} ס"מ. מהי הצלע המתאימה במשולש הגדול?`,
          answer: `${a * ratio} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `שני משולשים דומים ביחס דמיון ${ratio}. היקף המשולש הקטן ${b * 3} ס"מ. מהו היקף המשולש הגדול?`,
          answer: `${b * 3 * ratio} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `שני משולשים דומים ביחס דמיון ${ratio}. שטח המשולש הקטן ${b} סמ"ר. מהו שטח המשולש הגדול?`,
          answer: `${b * ratio * ratio} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default similarTriangles;
