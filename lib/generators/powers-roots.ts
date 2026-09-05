import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const superscripts: Record<number, string> = { 2: "²", 3: "³", 4: "⁴", 5: "⁵" };

const powersRoots: Generator = {
  id: "powers-roots",
  columns: 3,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxRoot = level === 1 ? 12 : level === 2 ? 20 : 30;

    for (let i = 0; i < count; i++) {
      if (rng.bool()) {
        const exponent = level === 1 ? 2 : level === 2 ? rng.int(2, 3) : rng.int(2, 5);
        const maxBase = exponent >= 4 ? 4 : exponent === 3 ? 9 : 15;
        const base = rng.int(2, maxBase);
        problems.push({
          prompt: `${base}${superscripts[exponent]} =`,
          answer: String(base ** exponent),
          work: "none",
          dir: "ltr",
        });
      } else {
        const root = rng.int(2, maxRoot);
        problems.push({
          prompt: `√${root * root} =`,
          answer: String(root),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default powersRoots;
