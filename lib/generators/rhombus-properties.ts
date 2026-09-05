import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const rhombusProperties: Generator = {
  id: "rhombus-properties",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxSide = level === 1 ? 12 : level === 2 ? 20 : 35;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 3) : level === 2 ? rng.int(1, 4) : rng.int(1, 6);

      if (kind === 1) {
        const side = rng.int(3, maxSide);
        problems.push({
          prompt: `במעוין אורך הצלע הוא ${side} ס"מ. מהו היקף המעוין?`,
          answer: `${4 * side} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const side = rng.int(3, maxSide);
        problems.push({
          prompt: `היקף המעוין הוא ${4 * side} ס"מ. מהו אורך צלע המעוין?`,
          answer: `${side} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const angle = rng.int(level === 3 ? 11 : 25, level === 3 ? 169 : 155);
        problems.push({
          prompt: `במעוין זווית אחת היא ${angle}°. מהי הזווית הסמוכה לה?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 4) {
        const first = 2 * rng.int(2, maxSide);
        const second = rng.int(Math.max(3, Math.floor(first / 3)), first + 4);
        problems.push({
          prompt: `במעוין אורכי האלכסונים הם ${first} ס"מ ו-${second} ס"מ. מהו שטח המעוין?`,
          answer: `${(first * second) / 2} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 5) {
        const angle = 2 * rng.int(11, 84);
        problems.push({
          prompt: `במעוין האלכסון חוצה את הזווית שגודלה ${angle}°. מהי הזווית שבין האלכסון לצלע?`,
          answer: `${angle / 2}°`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const unit = rng.int(1, 6);
        problems.push({
          prompt: `במעוין האלכסונים מאונכים וחוצים זה את זה, ואורכיהם ${6 * unit} ס"מ ו-${8 * unit} ס"מ. מהו אורך צלע המעוין?`,
          answer: `${5 * unit} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default rhombusProperties;
