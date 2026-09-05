import { createRng } from "../rng";
import { formatLinear, formatRatio, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const slopeRelations: Generator = {
  id: "slope-relations",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 5 : level === 2 ? 8 : 12;

    for (let i = 0; i < count; i++) {
      const m = rng.int(1, bound) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const b = rng.int(1, bound * 2) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const kind = level === 1 ? 1 : rng.int(1, 3);
      const line = `y = ${formatLinear(m, b)}`;

      if (kind === 1) {
        problems.push({
          prompt: `נתון הישר ${line}. מהו שיפוע הישר המקביל לו?`,
          answer: `m = ${formatSignedNumber(m)}`,
          work: "none",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `נתון הישר ${line}. מהו שיפוע הישר המאונך לו?`,
          answer: `m = ${formatRatio(-1, m)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const px = rng.int(-bound, bound);
        const py = rng.int(-bound * 2, bound * 2);
        problems.push({
          prompt: `נתון הישר ${line}. מצאו את משוואת הישר המקביל לו העובר דרך (${formatSignedNumber(
            px,
          )}, ${formatSignedNumber(py)}).`,
          answer: `y = ${formatLinear(m, py - m * px)}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default slopeRelations;
