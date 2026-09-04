import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const maxByLevel: Record<number, number> = { 1: 20, 2: 100, 3: 1000 };

const evenOdd: Generator = {
  id: "even-odd",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const value = rng.int(1, maxByLevel[level]);
      problems.push({
        prompt: `${value} — זוגי או אי‑זוגי?`,
        answer: value % 2 === 0 ? "זוגי" : "אי‑זוגי",
        work: "none",
        dir: "rtl",
      });
    }

    return problems;
  },
};

export default evenOdd;
