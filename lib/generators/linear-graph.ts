import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const slopeByLevel: Record<number, number> = { 1: 3, 2: 4, 3: 6 };

function formatLine(m: number, b: number): string {
  const slope = m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
  if (b === 0) return `y = ${slope}`;
  return b > 0 ? `y = ${slope} + ${b}` : `y = ${slope} - ${Math.abs(b)}`;
}

const linearGraph: Generator = {
  id: "linear-graph",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const limit = slopeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      let m = rng.int(-limit, limit);
      if (m === 0) m = 1;

      const askXAxis = level > 1 && rng.bool();
      const b = askXAxis ? m * rng.int(-3, 3) : rng.int(-limit, limit);

      const axis = askXAxis ? "x" : "y";
      const intercept = askXAxis ? `(${-b / m}, 0)` : `(0, ${b})`;

      problems.push({
        prompt: `שרטטו במערכת הצירים את הישר ${formatLine(m, b)}. מהי נקודת החיתוך שלו עם ציר ה-${axis}?`,
        answer: intercept,
        work: "grid",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default linearGraph;
