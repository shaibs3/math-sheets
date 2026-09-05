import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const powerLaws: Generator = {
  id: "power-laws",
  columns: 2,
  defaultCount: 14,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxExponent = level === 1 ? 5 : level === 2 ? 8 : 12;

    for (let i = 0; i < count; i++) {
      const symbol = level === 3 && rng.bool() ? String(rng.int(2, 9)) : "x";
      const m = rng.int(2, maxExponent);
      const n = rng.int(2, maxExponent);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);

      if (kind === 1) {
        problems.push({
          prompt: `${symbol}^${m} · ${symbol}^${n} = ${symbol}^?`,
          answer: String(m + n),
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${symbol}^${m + n} ÷ ${symbol}^${n} = ${symbol}^?`,
          answer: String(m),
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 3) {
        problems.push({
          prompt: `(${symbol}^${m})^${n} = ${symbol}^?`,
          answer: String(m * n),
          work: "none",
          dir: "ltr",
        });
      } else {
        problems.push({
          prompt: `${symbol}^${n} ÷ ${symbol}^${m + n} = ${symbol}^?`,
          answer: `−${m}`,
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default powerLaws;
