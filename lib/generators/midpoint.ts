import { createRng } from "../rng";
import { formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

const midpoint: Generator = {
  id: "midpoint",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 8 : level === 2 ? 12 : 20;

    for (let i = 0; i < count; i++) {
      const midX = level === 1 ? rng.int(1, bound) : rng.int(-bound, bound);
      const midY = level === 1 ? rng.int(1, bound) : rng.int(-bound, bound);
      const offsetX = rng.int(1, bound);
      const offsetY = rng.int(1, bound);
      const x1 = midX - offsetX;
      const y1 = midY - offsetY;
      const x2 = midX + offsetX;
      const y2 = midY + offsetY;
      const point = (x: number, y: number) =>
        `(${formatSignedNumber(x)}, ${formatSignedNumber(y)})`;

      if (level !== 1 && rng.bool()) {
        problems.push({
          prompt: `אמצע הקטע AB הוא ${point(midX, midY)} וקצה אחד הוא A${point(
            x1,
            y1,
          )}. מהן קואורדינטות B?`,
          answer: point(x2, y2),
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `מצאו את אמצע הקטע שקצותיו ${point(x1, y1)} ו- ${point(x2, y2)}.`,
          answer: point(midX, midY),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default midpoint;
