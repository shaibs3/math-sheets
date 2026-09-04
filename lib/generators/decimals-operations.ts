import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const decimalsOperations: Generator = {
  id: "decimals-operations",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const powers = [10, 100, 1000];

    for (let i = 0; i < count; i++) {
      const kind = rng.int(1, level === 1 ? 2 : 4);
      const decimals = level === 1 ? 1 : 2;
      const a = formatNumber(rng.int(11, 999) / 10 ** decimals, decimals);
      const b = formatNumber(rng.int(11, 999) / 10 ** decimals, decimals);
      const power = rng.pick(powers);

      if (kind === 1) {
        problems.push({
          prompt: `${a} × ${power} =`,
          answer: formatNumber(Number(a) * power, 3),
          work: "none",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${a} ÷ ${power} =`,
          answer: formatNumber(Number(a) / power, 6),
          work: "none",
        });
      } else if (kind === 3) {
        const sum = Number(a) + Number(b);
        problems.push({
          prompt: `${a} + ${b} =`,
          answer: formatNumber(sum, 4),
          work: "vertical",
        });
      } else {
        const [big, small] = Number(a) >= Number(b) ? [a, b] : [b, a];
        problems.push({
          prompt: `${big} − ${small} =`,
          answer: formatNumber(Number(big) - Number(small), 4),
          work: "vertical",
        });
      }
    }

    return problems;
  },
};

export default decimalsOperations;
