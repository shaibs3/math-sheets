import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const trapezoidProperties: Generator = {
  id: "trapezoid-properties",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxBase = level === 1 ? 12 : level === 2 ? 20 : 30;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : level === 2 ? rng.int(1, 4) : rng.int(1, 6);
      const shortBase = rng.int(3, maxBase);
      const longBase = shortBase + rng.int(1, maxBase);
      const height = 2 * rng.int(2, Math.max(3, maxBase / 2));

      if (kind === 1) {
        const angle = rng.int(level === 3 ? 11 : 25, level === 3 ? 169 : 155);
        problems.push({
          prompt: `בטרפז שתי הזוויות שליד אותה שוק הן חד-צדדיות. אחת מהן היא ${angle}°. מהי השנייה?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "trapezoid-angle", angle },
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `בטרפז אורכי הבסיסים הם ${longBase} ס"מ ו-${shortBase} ס"מ והגובה הוא ${height} ס"מ. מהו שטח הטרפז?`,
          answer: `${((longBase + shortBase) * height) / 2} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const even = 2 * rng.int(2, maxBase);
        const other = 2 * rng.int(2, maxBase);
        problems.push({
          prompt: `בטרפז אורכי הבסיסים הם ${even} ס"מ ו-${other} ס"מ. מהו אורך קטע האמצעים של הטרפז?`,
          answer: `${(even + other) / 2} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 4) {
        const angle = rng.int(level === 3 ? 21 : 30, level === 3 ? 159 : 150);
        problems.push({
          prompt: `בטרפז שווה שוקיים זווית הבסיס הגדול היא ${angle}°. מהי זווית הבסיס הקטן?`,
          answer: `${180 - angle}°`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 5) {
        const area = ((longBase + shortBase) * height) / 2;
        problems.push({
          prompt: `שטח הטרפז הוא ${area} סמ"ר, גובהו ${height} ס"מ ואחד מבסיסיו ${longBase} ס"מ. מהו אורך הבסיס השני?`,
          answer: `${shortBase} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const area = ((longBase + shortBase) * height) / 2;
        problems.push({
          prompt: `שטח הטרפז הוא ${area} סמ"ר ואורכי בסיסיו ${longBase} ס"מ ו-${shortBase} ס"מ. מהו גובה הטרפז?`,
          answer: `${height} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default trapezoidProperties;
