import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const names = ["רון", "דני", "יואב", "אורי", "איתי"];

const contexts = [
  { single: "קופסה", plural: "קופסאות", item: "עוגיות" },
  { single: "שקית", plural: "שקיות", item: "סוכריות" },
  { single: "מגש", plural: "מגשים", item: "לחמניות" },
  { single: "ארגז", plural: "ארגזים", item: "תפוזים" },
];

const rangeByLevel: Record<
  number,
  { start: [number, number]; per: [number, number]; groups: [number, number] }
> = {
  1: { start: [10, 30], per: [2, 5], groups: [2, 4] },
  2: { start: [30, 90], per: [3, 8], groups: [3, 7] },
  3: { start: [100, 400], per: [6, 12], groups: [4, 9] },
};

const wordTwoStep: Generator = {
  id: "word-two-step",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const range = rangeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const context = rng.pick(contexts);
      const name = rng.pick(names);
      const kind = rng.int(1, 3);

      if (kind === 1) {
        const start = rng.int(range.start[0], range.start[1]);
        const bought = rng.int(range.start[0], range.start[1]);
        const given = rng.int(2, start + bought - 2);
        problems.push({
          prompt: `ל${name} היו ${start} ${context.item}. הוא קנה עוד ${bought} ${context.item}, ואחר כך נתן ${given} ${context.item} לחבר. כמה ${context.item} נשארו לו?`,
          answer: `${start + bought - given} ${context.item}`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const per = rng.int(range.per[0], range.per[1]);
        const groups = rng.int(range.groups[0], range.groups[1]);
        const taken = rng.int(1, per * groups - 1);
        problems.push({
          prompt: `בכל ${context.single} יש ${per} ${context.item}. יש ${groups} ${context.plural}, ונלקחו ${taken} ${context.item}. כמה ${context.item} נשארו?`,
          answer: `${per * groups - taken} ${context.item}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const per = rng.int(range.per[0], range.per[1]) + 2;
        const kids = rng.int(range.groups[0], range.groups[1]);
        const eaten = rng.int(1, per - 1);
        problems.push({
          prompt: `${per * kids} ${context.item} חולקו שווה בשווה בין ${kids} ילדים, וכל ילד אכל ${eaten} ${context.item}. כמה ${context.item} נשארו לכל ילד?`,
          answer: `${per - eaten} ${context.item}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default wordTwoStep;
