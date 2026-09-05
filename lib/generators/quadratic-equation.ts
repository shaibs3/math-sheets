import { createRng } from "../rng";
import { formatQuadratic, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const quadraticEquation: Generator = {
  id: "quadratic-equation",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 5 : level === 2 ? 8 : 12;

    for (let i = 0; i < count; i++) {
      const first = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      let second = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      if (second === first) second = first + 1;
      const roots = [first, second].sort((a, b) => a - b);
      const scale = level === 3 ? rng.int(1, 4) : 1;

      problems.push({
        prompt: `${formatQuadratic(
          scale,
          -scale * (roots[0] + roots[1]),
          scale * roots[0] * roots[1],
        )} = 0`,
        answer: `x = ${formatSignedNumber(roots[0])} , x = ${formatSignedNumber(roots[1])}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default quadraticEquation;
