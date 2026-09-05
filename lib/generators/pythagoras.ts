import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const triples: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [20, 21, 29],
  [12, 16, 20],
  [10, 24, 26],
  [15, 20, 25],
];

const pythagoras: Generator = {
  id: "pythagoras",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const pool = level === 1 ? triples.slice(0, 4) : level === 2 ? triples.slice(0, 7) : triples;

    for (let i = 0; i < count; i++) {
      const [a, b, c] = rng.pick(pool);

      if (level === 1 || rng.bool()) {
        problems.push({
          prompt: `במשולש ישר זווית הניצבים הם ${a} ס"מ ו-${b} ס"מ. מהו אורך היתר?`,
          answer: `${c} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `במשולש ישר זווית היתר הוא ${c} ס"מ וניצב אחד הוא ${a} ס"מ. מהו אורך הניצב השני?`,
          answer: `${b} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default pythagoras;
