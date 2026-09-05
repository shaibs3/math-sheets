import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const GRID_LIMIT = 5;

function locationOf(x: number, y: number): string {
  if (x === 0 && y === 0) return "בראשית הצירים";
  if (x === 0) return "על ציר ה-y";
  if (y === 0) return "על ציר ה-x";
  if (x > 0 && y > 0) return "רביע ראשון";
  if (x < 0 && y > 0) return "רביע שני";
  if (x < 0 && y < 0) return "רביע שלישי";
  return "רביע רביעי";
}

const coordinatePoints: Generator = {
  id: "coordinate-points",
  columns: 2,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const allowAxis = level > 1 && rng.int(1, level === 3 ? 2 : 4) === 1;
      let x = rng.int(-GRID_LIMIT, GRID_LIMIT);
      let y = rng.int(-GRID_LIMIT, GRID_LIMIT);

      if (!allowAxis) {
        if (x === 0) x = rng.bool() ? 1 : -1;
        if (y === 0) y = rng.bool() ? 1 : -1;
      }

      const onAxis = x === 0 || y === 0;
      const question = onAxis ? "היכן היא נמצאת?" : "באיזה רביע היא נמצאת?";

      problems.push({
        prompt: `סמנו במערכת הצירים את הנקודה (${x}, ${y}). ${question}`,
        answer: locationOf(x, y),
        work: "grid",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default coordinatePoints;
