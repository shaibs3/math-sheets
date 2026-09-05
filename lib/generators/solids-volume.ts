import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const PI = 3.14;

const solidsVolume: Generator = {
  id: "solids-volume",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 8 : level === 2 ? 12 : 18;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);
      const radius = rng.int(1, bound);
      const height = rng.int(2, bound * 2);
      const base = rng.int(2, bound);

      if (kind === 1) {
        problems.push({
          prompt: `מנסרה ישרה שבסיסה מלבן ${base} ס"מ על ${radius} ס"מ וגובהה ${height} ס"מ. מהו נפחה?`,
          answer: `${formatNumber(base * radius * height, 2)} סמ"ק`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `גליל שרדיוס בסיסו ${radius} ס"מ וגובהו ${height} ס"מ. מהו נפחו (π ≈ 3.14)?`,
          answer: `${formatNumber(PI * radius * radius * height, 2)} סמ"ק`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        problems.push({
          prompt: `חרוט שרדיוס בסיסו ${radius} ס"מ וגובהו ${height * 3} ס"מ. מהו נפחו (π ≈ 3.14)?`,
          answer: `${formatNumber(PI * radius * radius * height, 2)} סמ"ק`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `פירמידה שבסיסה ריבוע שצלעו ${base} ס"מ וגובהה ${height * 3} ס"מ. מהו נפחה?`,
          answer: `${formatNumber(base * base * height, 2)} סמ"ק`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default solidsVolume;
