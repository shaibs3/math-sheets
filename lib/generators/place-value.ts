import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const digitsByLevel: Record<number, number> = { 1: 2, 2: 3, 3: 4 };

const placeNames = ["היחידות", "העשרות", "המאות", "האלפים"];

const placeValue: Generator = {
  id: "place-value",
  columns: 1,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const digits = digitsByLevel[level];

    for (let i = 0; i < count; i++) {
      const value = rng.int(10 ** (digits - 1), 10 ** digits - 1);
      let place = rng.int(0, digits - 1);
      for (let attempt = 0; attempt < digits; attempt++) {
        if (Math.floor(value / 10 ** place) % 10 !== 0) break;
        place = (place + 1) % digits;
      }
      const digit = Math.floor(value / 10 ** place) % 10;

      if (rng.bool()) {
        problems.push({
          prompt: `מהי ספרת ${placeNames[place]} במספר ${value}?`,
          answer: String(digit),
          work: "none",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `מהו הערך של ספרת ${placeNames[place]} במספר ${value}?`,
          answer: String(digit * 10 ** place),
          work: "none",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default placeValue;
