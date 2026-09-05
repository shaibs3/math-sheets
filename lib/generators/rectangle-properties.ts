import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const triples: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [20, 21, 29],
];

const rectangleProperties: Generator = {
  id: "rectangle-properties",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxSide = level === 1 ? 12 : level === 2 ? 20 : 30;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : level === 2 ? rng.int(1, 4) : rng.int(1, 5);

      if (kind === 1) {
        const width = rng.int(3, maxSide);
        const height = rng.int(2, Math.max(3, width - 1));
        problems.push({
          prompt: `במלבן האורך הוא ${width} ס"מ והרוחב הוא ${height} ס"מ. מהו שטח המלבן?`,
          answer: `${width * height} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width, height, unit: 'ס"מ' },
        });
      } else if (kind === 2) {
        const width = rng.int(3, maxSide);
        const height = rng.int(2, Math.max(3, width - 1));
        problems.push({
          prompt: `במלבן האורך הוא ${width} ס"מ והרוחב הוא ${height} ס"מ. מהו היקף המלבן?`,
          answer: `${2 * (width + height)} ס"מ`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width, height, unit: 'ס"מ' },
        });
      } else if (kind === 3) {
        const width = rng.int(3, maxSide);
        const height = rng.int(2, Math.max(3, width - 1));
        problems.push({
          prompt: `שטח המלבן הוא ${width * height} סמ"ר ואורכו ${width} ס"מ. מהו רוחב המלבן?`,
          answer: `${height} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 4) {
        const [short, long, diagonal] = rng.pick(triples);
        problems.push({
          prompt: `במלבן האורך הוא ${long} ס"מ והרוחב הוא ${short} ס"מ. מהו אורך אלכסון המלבן?`,
          answer: `${diagonal} ס"מ`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "rect", width: long, height: short, unit: 'ס"מ' },
        });
      } else {
        const angle = rng.int(10, 80);
        problems.push({
          prompt: `במלבן הזווית שבין אלכסון לצלע הארוכה היא ${angle}°. מהי הזווית שבין אותו אלכסון לצלע הקצרה?`,
          answer: `${90 - angle}°`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default rectangleProperties;
