import { createRng } from "../rng";
import { formatNumber } from "../math";
import { formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const zScore: Generator = {
  id: "z-score",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const steps = level === 1 ? [1, 2] : level === 2 ? [1, 2, 3] : [1, 2, 3, 4];

    for (let i = 0; i < count; i++) {
      const mean = rng.int(10, 20) * 5;
      const deviation = rng.int(1, 5) * 2;
      const step = rng.pick(steps) * (level === 1 ? 1 : rng.bool() ? 1 : -1);
      const value = mean + step * deviation;

      if (rng.bool()) {
        problems.push({
          prompt: `בהתפלגות נורמלית הממוצע ${mean} וסטיית התקן ${deviation}. מהו ציון התקן של הערך ${value}?`,
          answer: `z = ${formatSignedNumber(step)}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `בהתפלגות נורמלית הממוצע ${mean} וסטיית התקן ${deviation}. איזה ערך מתאים לציון תקן z = ${formatSignedNumber(step)}?`,
          answer: formatNumber(value, 2),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default zScore;
