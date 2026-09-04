import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const goods = ["מחברת", "עיפרון", "מחק", "ספר", "כדור", "בקבוק מים"];

const paidByLevel: Record<number, number[]> = {
  1: [10, 20],
  2: [20, 50],
  3: [50, 100],
};

const money: Generator = {
  id: "money",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const paid = rng.pick(paidByLevel[level]);
      const first = rng.int(2, Math.floor(paid / 2));
      const second = rng.int(1, paid - first - 1);
      const spent = first + second;
      const firstGood = rng.pick(goods);
      const secondGood = rng.pick(goods.filter((good) => good !== firstGood));

      if (rng.bool()) {
        problems.push({
          prompt: `קניתי ${firstGood} ב‑${first} ש"ח ו${secondGood} ב‑${second} ש"ח, ושילמתי בשטר של ${paid} ש"ח. כמה עודף קיבלתי?`,
          answer: `${paid - spent} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `${firstGood} עולה ${first} ש"ח ו${secondGood} עולה ${second} ש"ח. כמה עולים שניהם יחד?`,
          answer: `${spent} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default money;
