import { createRng } from "../rng";
import { formatFraction } from "../math";
import type { Generator, Problem } from "../types";

const conditionalProbability: Generator = {
  id: "conditional-probability",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 6 : level === 2 ? 10 : 14;

    for (let i = 0; i < count; i++) {
      const red = rng.int(2, bound);
      const blue = rng.int(2, bound);
      const total = red + blue;
      const contents = `${red} כדורים אדומים ו-${blue} כדורים כחולים`;
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `בכד ${contents}. מוציאים שני כדורים ללא החזרה. מה ההסתברות ששניהם אדומים?`,
          answer: formatFraction({ n: red * (red - 1), d: total * (total - 1) }),
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `בכד ${contents}. מוציאים שני כדורים עם החזרה. מה ההסתברות ששניהם כחולים?`,
          answer: formatFraction({ n: blue * blue, d: total * total }),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `בכד ${contents}. מוציאים כדור ראשון והוא אדום ואין מחזירים אותו. מה ההסתברות שהכדור השני כחול?`,
          answer: formatFraction({ n: blue, d: total - 1 }),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default conditionalProbability;
