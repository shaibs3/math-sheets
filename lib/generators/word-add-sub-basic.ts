import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const items = [
  { name: "בלונים", holder: "לדנה" },
  { name: "גולות", holder: "ליעל" },
  { name: "מדבקות", holder: "למיכל" },
  { name: "עפרונות", holder: "לשירה" },
  { name: "צדפים", holder: "לנועה" },
];

const maxByLevel: Record<number, number> = { 1: 20, 2: 50, 3: 100 };

const wordAddSubBasic: Generator = {
  id: "word-add-sub-basic",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const max = maxByLevel[level];

    for (let i = 0; i < count; i++) {
      const item = rng.pick(items);
      const total = rng.int(6, max);
      const part = rng.int(2, total - 2);

      if (rng.bool()) {
        problems.push({
          prompt: `${item.holder} היו ${part} ${item.name}, והיא קיבלה עוד ${total - part} ${item.name}. כמה ${item.name} יש עכשיו?`,
          answer: `${total} ${item.name}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `${item.holder} היו ${total} ${item.name}, והיא נתנה ${part} ${item.name}. כמה ${item.name} נשארו?`,
          answer: `${total - part} ${item.name}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default wordAddSubBasic;
