import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 10, 2: 20, 3: 40 };

const areaShapes: Generator = {
  id: "area-shapes",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const max = maxByLevel[level];

    for (let i = 0; i < count; i++) {
      const height = rng.int(2, max);
      const base = rng.int(1, Math.floor(max / 2)) * 2;

      if (rng.bool()) {
        problems.push({
          prompt: `משולש שאורך בסיסו ${base} ס"מ והגובה לבסיס הוא ${height} ס"מ. מהו שטחו?`,
          answer: `${(base * height) / 2} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "triangle", base, height, unit: 'ס"מ' },
        });
      } else {
        problems.push({
          prompt: `מקבילית שאורך בסיסה ${base} ס"מ והגובה לבסיס הוא ${height} ס"מ. מהו שטחה?`,
          answer: `${base * height} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "parallelogram", base, height, unit: 'ס"מ' },
        });
      }
    }

    return problems;
  },
};

export default areaShapes;
