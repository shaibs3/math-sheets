import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const quadrilateralAngles: Generator = {
  id: "quadrilateral-angles",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);
      const angle = rng.int(level === 3 ? 11 : 20, level === 3 ? 169 : 160);

      if (kind === 1) {
        problems.push({
          prompt: `במקבילית זווית אחת היא ${angle}°. מהי הזווית הסמוכה לה?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "parallelogram-angle", angle },
        });
      } else if (kind === 2) {
        const base = rng.int(20, 89);
        problems.push({
          prompt: `במשולש שווה שוקיים זווית הראש היא ${180 - 2 * base}°. מהי זווית הבסיס?`,
          answer: `${base}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "isosceles-apex", apex: 180 - 2 * base },
        });
      } else if (kind === 3) {
        const first = rng.int(20, 120);
        const second = rng.int(20, 200 - first);
        problems.push({
          prompt: `במרובע שלוש זוויות הן ${first}°, ${second}° ו-90°. מהי הזווית הרביעית?`,
          answer: `${360 - first - second - 90}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "quad-angles", angles: [first, second, 90] },
        });
      } else {
        const leg = rng.int(20, 160);
        problems.push({
          prompt: `בטרפז שתי הזוויות שליד אותה שוק הן חד-צדדיות. אחת מהן ${leg}°. מהי השנייה?`,
          answer: `${180 - leg}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "trapezoid-angle", angle: leg },
        });
      }
    }

    return problems;
  },
};

export default quadrilateralAngles;
