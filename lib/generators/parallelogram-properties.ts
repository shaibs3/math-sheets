import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const parallelogramProperties: Generator = {
  id: "parallelogram-properties",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxSide = level === 1 ? 12 : level === 2 ? 20 : 30;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 3) : level === 2 ? rng.int(1, 4) : rng.int(1, 5);

      if (kind === 1) {
        const angle = rng.int(level === 3 ? 11 : 25, level === 3 ? 169 : 155);
        problems.push({
          prompt: `במקבילית זווית אחת היא ${angle}°. מהי הזווית הסמוכה לה?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "parallelogram-angle", angle },
        });
      } else if (kind === 2) {
        const angle = rng.int(level === 3 ? 11 : 25, level === 3 ? 169 : 155);
        problems.push({
          prompt: `במקבילית זווית אחת היא ${angle}°. מהי הזווית הנגדית לה?`,
          answer: `${angle}°`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const first = rng.int(3, maxSide);
        const second = rng.int(3, maxSide);
        problems.push({
          prompt: `במקבילית שתי הצלעות הסמוכות הן ${first} ס"מ ו-${second} ס"מ. מהו היקף המקבילית?`,
          answer: `${2 * (first + second)} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 4) {
        const base = rng.int(4, maxSide);
        const height = rng.int(3, Math.max(4, base));
        problems.push({
          prompt: `במקבילית הבסיס הוא ${base} ס"מ והגובה לבסיס הוא ${height} ס"מ. מהו שטח המקבילית?`,
          answer: `${base * height} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "parallelogram", base, height, unit: 'ס"מ' },
        });
      } else {
        const first = rng.int(3, maxSide);
        const second = rng.int(3, maxSide);
        problems.push({
          prompt: `היקף המקבילית הוא ${2 * (first + second)} ס"מ ואחת מצלעותיה היא ${first} ס"מ. מהי הצלע הסמוכה אליה?`,
          answer: `${second} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default parallelogramProperties;
