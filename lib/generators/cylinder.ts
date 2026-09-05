import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const PI = 3.14;

const cylinder: Generator = {
  id: "cylinder",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 10 : 15;

    for (let i = 0; i < count; i++) {
      const radius = rng.int(1, bound);
      const height = rng.int(2, bound * 2);
      const wantsSurface = level !== 1 && rng.bool();

      if (wantsSurface) {
        problems.push({
          prompt: `גליל שרדיוס בסיסו ${radius} ס"מ וגובהו ${height} ס"מ. חשבו את שטח הפנים (π ≈ 3.14).`,
          answer: `${formatNumber(2 * PI * radius * (radius + height), 2)} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `גליל שרדיוס בסיסו ${radius} ס"מ וגובהו ${height} ס"מ. חשבו את נפחו (π ≈ 3.14).`,
          answer: `${formatNumber(PI * radius * radius * height, 2)} סמ"ק`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default cylinder;
