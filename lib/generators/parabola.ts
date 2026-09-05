import { createRng } from "../rng";
import { formatQuadratic, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const parabola: Generator = {
  id: "parabola",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 5 : level === 2 ? 8 : 10;

    for (let i = 0; i < count; i++) {
      const a = level === 1 ? 1 : rng.int(1, 3) * (rng.bool() ? 1 : -1);
      const vertexX = rng.int(-bound, bound);
      const vertexY = rng.int(-bound * 2, bound * 2);
      const b = -2 * a * vertexX;
      const c = a * vertexX * vertexX + vertexY;
      const expression = formatQuadratic(a, b, c);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `נתונה הפרבולה y = ${expression}. מהו קודקודה?`,
          answer: `(${formatSignedNumber(vertexX)} , ${formatSignedNumber(vertexY)})`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `נתונה הפרבולה y = ${expression}. מהי משוואת ציר הסימטריה שלה?`,
          answer: `x = ${formatSignedNumber(vertexX)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `נתונה הפרבולה y = ${expression}. מהי נקודת החיתוך עם ציר ה-y?`,
          answer: `(0 , ${formatSignedNumber(c)})`,
          work: "none",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default parabola;
