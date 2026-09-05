import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxSideByLevel: Record<number, number> = { 1: 12, 2: 25, 3: 60 };

const rectangleArea: Generator = {
  id: "rectangle-area",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const width = rng.int(2, maxSideByLevel[level]);
      const height = rng.int(2, maxSideByLevel[level]);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `מלבן שאורכו ${width} ס"מ ורוחבו ${height} ס"מ. מהו שטחו?`,
          answer: `${width * height} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width, height, unit: 'ס"מ' },
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `מלבן שאורכו ${width} ס"מ ורוחבו ${height} ס"מ. מהו היקפו?`,
          answer: `${2 * (width + height)} ס"מ`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width, height, unit: 'ס"מ' },
        });
      } else {
        problems.push({
          prompt: `שטח מלבן הוא ${width * height} סמ"ר ואורכו ${width} ס"מ. מהו רוחבו?`,
          answer: `${height} ס"מ`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width, height: "?", unit: 'ס"מ' },
        });
      }
    }

    return problems;
  },
};

export default rectangleArea;
