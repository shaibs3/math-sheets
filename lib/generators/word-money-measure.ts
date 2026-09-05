import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const goods = [
  { single: "מחברת", plural: "מחברות", each: "כל אחת", other: "עט", otherPlural: "עטים" },
  { single: "מחברת", plural: "מחברות", each: "כל אחת", other: "סרגל", otherPlural: "סרגלים" },
  { single: "חוברת", plural: "חוברות", each: "כל אחת", other: "עיפרון", otherPlural: "עפרונות" },
  { single: "מחק", plural: "מחקים", each: "כל אחד", other: "תיק", otherPlural: "תיקים" },
];

const buyers = ["דנה", "מיכל", "נועה", "שירה"];

const fabrics = ["בד", "חבל", "סרט"];

const rangeByLevel: Record<
  number,
  {
    price: [number, number];
    quantity: [number, number];
    length: [number, number];
    tank: [number, number];
  }
> = {
  1: { price: [2, 9], quantity: [2, 5], length: [2, 6], tank: [20, 60] },
  2: { price: [5, 25], quantity: [3, 9], length: [3, 12], tank: [60, 200] },
  3: { price: [12, 60], quantity: [4, 12], length: [6, 20], tank: [200, 800] },
};

const wordMoneyMeasure: Generator = {
  id: "word-money-measure",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const range = rangeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = rng.int(1, 4);

      if (kind === 1) {
        const item = rng.pick(goods);
        const priceA = rng.int(range.price[0], range.price[1]);
        const priceB = rng.int(range.price[0], range.price[1]);
        const countA = rng.int(range.quantity[0], range.quantity[1]);
        const countB = rng.int(range.quantity[0], range.quantity[1]);
        problems.push({
          prompt: `${item.single} עולה ${priceA} ₪ ו${item.other} עולה ${priceB} ₪. כמה עולים יחד ${countA} ${item.plural} ו-${countB} ${item.otherPlural}?`,
          answer: `${priceA * countA + priceB * countB} ₪`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const item = rng.pick(goods);
        const buyer = rng.pick(buyers);
        const quantity = rng.int(range.quantity[0], range.quantity[1]);
        const price = rng.int(range.price[0], range.price[1]);
        const note = [50, 100, 200, 500].find((value) => value > quantity * price) ?? 1000;
        problems.push({
          prompt: `${buyer} קנתה ${quantity} ${item.plural} במחיר ${price} ₪ ${item.each} ושילמה בשטר של ${note} ₪. כמה עודף קיבלה?`,
          answer: `${note - quantity * price} ₪`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const piece = rng.int(2, 8);
        const pieces = rng.int(range.length[0], range.length[1]);
        problems.push({
          prompt: `גליל ${rng.pick(fabrics)} באורך ${piece * pieces} מטרים נחתך לחתיכות באורך ${piece} מטרים כל אחת. כמה חתיכות התקבלו?`,
          answer: `${pieces} חתיכות`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const capacity = rng.int(range.tank[0], range.tank[1]);
        const buckets = rng.int(2, 8);
        const bucket = rng.int(2, Math.max(2, Math.floor((capacity - 1) / buckets)));
        problems.push({
          prompt: `במכל היו ${capacity} ליטר מים. מילאו ממנו ${buckets} דליים של ${bucket} ליטר כל אחד. כמה ליטר נשארו במכל?`,
          answer: `${capacity - buckets * bucket} ליטר`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default wordMoneyMeasure;
