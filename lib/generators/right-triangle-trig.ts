import { createRng } from "../rng";
import { formatRatio } from "../algebra";
import type { Generator, Problem } from "../types";

const triples: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [20, 21, 29],
];

const rightTriangleTrig: Generator = {
  id: "right-triangle-trig",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const pool = level === 1 ? triples.slice(0, 3) : level === 2 ? triples.slice(0, 5) : triples;

    for (let i = 0; i < count; i++) {
      const [opposite, adjacent, hypotenuse] = rng.pick(pool);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);
      const setup = `במשולש ישר זווית הניצב שמול הזווית α הוא ${opposite} ס"מ, הניצב שליד α הוא ${adjacent} ס"מ והיתר ${hypotenuse} ס"מ.`;

      if (kind === 1) {
        problems.push({
          prompt: `${setup} מהו sin α?`,
          answer: formatRatio(opposite, hypotenuse),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${setup} מהו cos α?`,
          answer: formatRatio(adjacent, hypotenuse),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        problems.push({
          prompt: `${setup} מהו tan α?`,
          answer: formatRatio(opposite, adjacent),
          work: "lines",
          dir: "rtl",
        });
      } else {
        const half = rng.int(2, 12);
        problems.push({
          prompt: `במשולש ישר זווית זווית חדה היא 30° והיתר ${
            half * 2
          } ס"מ. מהו הניצב שמול זווית זו?`,
          answer: `${half} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default rightTriangleTrig;
