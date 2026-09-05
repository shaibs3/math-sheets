import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const speedDistanceTime: Generator = {
  id: "speed-distance-time",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const speeds = level === 1 ? [40, 50, 60, 80] : [45, 55, 60, 70, 75, 90, 100, 120];

    for (let i = 0; i < count; i++) {
      const speed = rng.pick(speeds);
      const hours = rng.int(2, level === 1 ? 5 : level === 2 ? 9 : 14);
      const distance = speed * hours;
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `רכב נוסע במהירות ${speed} קמ"ש במשך ${hours} שעות. מהו המרחק שעבר?`,
          answer: `${formatNumber(distance, 2)} ק"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `רכב עבר ${distance} ק"מ במשך ${hours} שעות. מהי מהירותו הממוצעת?`,
          answer: `${formatNumber(speed, 2)} קמ"ש`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `רכב עבר ${distance} ק"מ במהירות ${speed} קמ"ש. כמה שעות נמשכה הנסיעה?`,
          answer: `${formatNumber(hours, 2)} שעות`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default speedDistanceTime;
