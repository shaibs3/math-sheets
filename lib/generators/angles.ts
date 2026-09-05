import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const angles: Generator = {
  id: "angles",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);

      if (kind === 1) {
        const angle = rng.int(15, 165);
        problems.push({
          prompt: `שתי זוויות צמודות. גודל אחת מהן ${angle}°. מהו גודל השנייה?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "adjacent-angles", angle },
        });
      } else if (kind === 2) {
        const first = rng.int(20, 100);
        const second = rng.int(20, 170 - first);
        problems.push({
          prompt: `במשולש שתי זוויות הן ${first}° ו-${second}°. מהי הזווית השלישית?`,
          answer: `${180 - first - second}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "triangle-angles", angles: [first, second] },
        });
      } else if (kind === 3) {
        const sides = rng.int(3, level === 3 ? 12 : 8);
        problems.push({
          prompt: `מהו סכום הזוויות הפנימיות במצולע בעל ${sides} צלעות?`,
          answer: `${(sides - 2) * 180}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "polygon", sides },
        });
      } else {
        const angle = rng.int(20, 160);
        problems.push({
          prompt: `שני ישרים מקבילים נחתכים על ידי ישר שלישי. זווית מתאימה אחת היא ${angle}°. מהי הזווית החד-צדדית לה?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "parallel-lines", angle },
        });
      }
    }

    return problems;
  },
};

export default angles;
