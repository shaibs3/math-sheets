import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const items = [
  { name: "תלמידים בכיתה", unit: "תלמידים" },
  { name: "שקלים בקופה", unit: "שקלים" },
  { name: "עמודים בספר", unit: "עמודים" },
  { name: "בקבוקים בארגז", unit: "בקבוקים" },
];

const fractionOfQuantity: Generator = {
  id: "fraction-of-quantity",
  columns: 1,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const d = rng.int(2, level === 1 ? 6 : 12);
      const n = rng.int(1, d - 1);
      const unitSize = rng.int(2, level === 1 ? 10 : 25);
      const total = d * unitSize;
      const part = n * unitSize;
      const item = rng.pick(items);
      const findWhole = level >= 2 && rng.bool();

      if (findWhole) {
        problems.push({
          prompt: `${part} ${item.unit} הם ${n}/${d} מהכמות. מהי הכמות כולה?`,
          answer: `${total} ${item.unit}`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `בכמות של ${total} ${item.name}. כמה הם ${n}/${d} מהכמות?`,
          answer: `${part} ${item.unit}`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default fractionOfQuantity;
