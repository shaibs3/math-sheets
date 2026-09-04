import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxEdgeByLevel: Record<number, number> = { 1: 8, 2: 12, 3: 20 };

const boxVolumeSurface: Generator = {
  id: "box-volume-surface",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const max = maxEdgeByLevel[level];
      const a = rng.int(2, max);
      const b = rng.int(2, max);
      const c = rng.int(2, max);
      const dimensions = `${a} ס"מ, ${b} ס"מ ו‑${c} ס"מ`;

      if (level === 1 || rng.bool()) {
        problems.push({
          prompt: `תיבה שמידותיה ${dimensions}. מהו נפחה?`,
          answer: `${a * b * c} סמ"ק`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `תיבה שמידותיה ${dimensions}. מהו שטח הפנים שלה?`,
          answer: `${2 * (a * b + b * c + a * c)} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default boxVolumeSurface;
