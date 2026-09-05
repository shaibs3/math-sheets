import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const linearInequality: Generator = {
  id: "linear-inequality",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const boundary = level === 1 ? rng.int(1, 10) : rng.int(-9, 12);
      const a = rng.int(2, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const b = rng.int(1, bound * 2) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const relation = rng.bool() ? ">" : "<";
      const flipped = a < 0;
      const answerRelation = flipped ? (relation === ">" ? "<" : ">") : relation;

      problems.push({
        prompt: `${formatLinear(a, b)} ${relation} ${formatSignedNumber(a * boundary + b)}`,
        answer: `x ${answerRelation} ${formatSignedNumber(boundary)}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default linearInequality;
