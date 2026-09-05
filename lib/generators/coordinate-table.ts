import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const slopeByLevel: Record<number, number> = { 1: 3, 2: 5, 3: 9 };

function formatLine(m: number, b: number): string {
  const slope = m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
  if (b === 0) return `y = ${slope}`;
  return b > 0 ? `y = ${slope} + ${b}` : `y = ${slope} - ${Math.abs(b)}`;
}

const coordinateTable: Generator = {
  id: "coordinate-table",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const limit = slopeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      let m = rng.int(-limit, limit);
      if (m === 0) m = 1;
      const b = rng.int(-limit, limit);

      const first = rng.int(-4, -1);
      const step = rng.int(1, 3);
      const inputs = [first, first + step, first + step * 2];
      const outputs = inputs.map((x) => m * x + b);

      problems.push({
        prompt: `השלימו את ערכי y עבור ${formatLine(m, b)} כאשר x = ${inputs.join(", ")}.`,
        answer: `y = ${outputs.join(", ")}`,
        work: "lines",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default coordinateTable;
