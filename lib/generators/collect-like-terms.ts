import { createRng } from "../rng";
import { formatLinear, leadingTerm, signedTerm } from "../algebra";
import type { Generator, Problem } from "../types";

const collectLikeTerms: Generator = {
  id: "collect-like-terms",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 9 : 12;

    for (let i = 0; i < count; i++) {
      const a = rng.int(1, bound);
      const b = rng.int(1, bound);
      const c = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const d = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const extra = level === 3 ? rng.int(1, bound) * (rng.bool() ? 1 : -1) : 0;

      const parts = [
        leadingTerm(a, "x"),
        signedTerm(c, ""),
        signedTerm(b, "x"),
        signedTerm(d, ""),
      ];
      if (extra !== 0) parts.push(signedTerm(extra, "x"));

      problems.push({
        prompt: `${parts.join(" ")} =`,
        answer: formatLinear(a + b + extra, c + d),
        work: "none",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default collectLikeTerms;
