import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const scalesByLevel: Record<number, number[]> = {
  1: [100, 1000, 10000],
  2: [500, 2000, 25000, 50000],
  3: [2500, 20000, 100000, 250000],
};

const scale: Generator = {
  id: "scale",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const factor = rng.pick(scalesByLevel[level]);
      const mapCm = rng.int(2, 12);
      const realCm = mapCm * factor;
      const realMeters = realCm / 100;
      const realText =
        realMeters >= 1000
          ? `${formatNumber(realMeters / 1000, 2)} ק"מ`
          : `${formatNumber(realMeters, 2)} מ'`;

      if (rng.bool()) {
        problems.push({
          prompt: `במפה בקנה מידה 1:${factor}, אורך קטע הוא ${mapCm} ס"מ. מהו האורך במציאות?`,
          answer: realText,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `במפה בקנה מידה 1:${factor}, המרחק במציאות הוא ${realText}. מהו האורך במפה בס"מ?`,
          answer: `${mapCm} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default scale;
