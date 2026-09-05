import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const PI = 3.14;

const compositeArea: Generator = {
  id: "composite-area",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 10 : level === 2 ? 16 : 24;

    for (let i = 0; i < count; i++) {
      const width = rng.int(4, bound) * 2;
      const height = rng.int(3, bound);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        const radius = width / 2;
        problems.push({
          prompt: `צורה מורכבת ממלבן שרוחבו ${width} ס"מ וגובהו ${height} ס"מ, ומעליו חצי עיגול שקוטרו ${width} ס"מ. חשבו את שטח הצורה (π ≈ 3.14).`,
          answer: `${formatNumber(width * height + (PI * radius * radius) / 2, 2)} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const cut = rng.int(1, Math.min(height, width) - 1);
        problems.push({
          prompt: `ממלבן שמידותיו ${width} ס"מ על ${height} ס"מ הוסר ריבוע שצלעו ${cut} ס"מ. מהו שטח הצורה שנותרה?`,
          answer: `${formatNumber(width * height - cut * cut, 2)} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const radius = width / 2;
        problems.push({
          prompt: `צורה מורכבת ממלבן שרוחבו ${width} ס"מ וגובהו ${height} ס"מ, ומעליו חצי עיגול שקוטרו ${width} ס"מ. חשבו את היקף הצורה (π ≈ 3.14).`,
          answer: `${formatNumber(width + 2 * height + PI * radius, 2)} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default compositeArea;
