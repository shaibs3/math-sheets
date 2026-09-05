import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const contexts = [
  { container: "שולחנות", each: "על כל שולחן", item: "ספרים" },
  { container: "מדפים", each: "על כל מדף", item: "צעצועים" },
  { container: "קופסאות", each: "בכל קופסה", item: "עוגיות" },
  { container: "שקיות", each: "בכל שקית", item: "תפוחים" },
  { container: "אגרטלים", each: "בכל אגרטל", item: "פרחים" },
];

const rangeByLevel: Record<number, { groups: [number, number]; each: [number, number] }> = {
  1: { groups: [2, 5], each: [2, 5] },
  2: { groups: [3, 9], each: [3, 10] },
  3: { groups: [4, 9], each: [11, 25] },
};

const wordMultDiv: Generator = {
  id: "word-mult-div",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const range = rangeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const context = rng.pick(contexts);
      const groups = rng.int(range.groups[0], range.groups[1]);
      const per = rng.int(range.each[0], range.each[1]);
      const kind = rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `יש ${groups} ${context.container}, ו${context.each} ${per} ${context.item}. כמה ${context.item} יש בסך הכול?`,
          answer: `${groups * per} ${context.item}`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${groups * per} ${context.item} חולקו שווה בשווה בין ${groups} ילדים. כמה ${context.item} קיבל כל ילד?`,
          answer: `${per} ${context.item}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `יש ${groups * per} ${context.item}, ו${context.each} מניחים ${per} ${context.item}. כמה ${context.container} צריך?`,
          answer: `${groups} ${context.container}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default wordMultDiv;
