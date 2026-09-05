import { createRng } from "../rng";
import { formatFraction } from "../math";
import type { Generator, Problem } from "../types";

const probabilityBasic: Generator = {
  id: "probability-basic",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 10 : 15;

    for (let i = 0; i < count; i++) {
      const red = rng.int(2, bound);
      const blue = rng.int(2, bound);
      const green = level === 1 ? 0 : rng.int(2, bound);
      const total = red + blue + green;
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);
      const contents = green
        ? `${red} כדורים אדומים, ${blue} כדורים כחולים ו-${green} כדורים ירוקים`
        : `${red} כדורים אדומים ו-${blue} כדורים כחולים`;

      if (kind === 1) {
        problems.push({
          prompt: `בכד ${contents}. מוציאים כדור אחד באקראי. מה ההסתברות שהוא אדום?`,
          answer: formatFraction({ n: red, d: total }),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `בכד ${contents}. מוציאים כדור אחד באקראי. מה ההסתברות שהוא אינו אדום?`,
          answer: formatFraction({ n: total - red, d: total }),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `בכד ${contents}. מוציאים כדור אחד באקראי. מה ההסתברות שהוא כחול או ירוק?`,
          answer: formatFraction({ n: blue + green, d: total }),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default probabilityBasic;
