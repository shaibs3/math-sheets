import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const superscripts: Record<number, string> = { 2: "²", 3: "³", 4: "⁴", 5: "⁵" };

const powers: Generator = {
  id: "powers",
  columns: 3,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const exponent = level === 1 ? 2 : level === 2 ? rng.int(2, 3) : rng.int(2, 5);
      const maxBase = exponent >= 4 ? 4 : exponent === 3 ? 9 : 15;
      const base = level === 3 && rng.bool() ? 10 : rng.int(2, maxBase);
      const value = base ** exponent;

      problems.push({
        prompt: `${base}${superscripts[exponent]} =`,
        answer: String(value),
        work: "none",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default powers;
