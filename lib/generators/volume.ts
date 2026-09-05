import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const PI = 3.14;

const volume: Generator = {
  id: "volume",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? 1 : rng.int(1, 3);

      if (kind === 1) {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const c = rng.int(2, 15);
        problems.push({
          prompt: `תיבה שמידותיה ${a} ס"מ, ${b} ס"מ ו-${c} ס"מ. חשבו את נפחה.`,
          answer: `${a * b * c} סמ"ק`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "box", a, b, c, unit: 'ס"מ' },
        });
      } else if (kind === 2) {
        const edge = rng.int(2, 12);
        problems.push({
          prompt: `קובייה שאורך צלעה ${edge} ס"מ. חשבו את נפחה ואת שטח הפנים שלה.`,
          answer: `נפח ${edge ** 3} סמ"ק, שטח פנים ${6 * edge ** 2} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "box", a: edge, b: edge, c: edge, unit: 'ס"מ' },
        });
      } else {
        const radius = rng.int(2, 10);
        const height = rng.int(3, 20);
        problems.push({
          prompt: `גליל שרדיוס בסיסו ${radius} ס"מ וגובהו ${height} ס"מ. חשבו את נפחו (π ≈ 3.14).`,
          answer: `${formatNumber(PI * radius * radius * height, 2)} סמ"ק`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "cylinder", radius, height, unit: 'ס"מ' },
        });
      }
    }

    return problems;
  },
};

export default volume;
