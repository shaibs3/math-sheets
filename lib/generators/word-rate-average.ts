import { formatNumber } from "../math";
import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const vehicles = ["מכונית", "משאית", "רכבת"];

const riders = ["אופנוען", "נהג משאית", "נהג אוטובוס"];

const goods = [
  { single: "מחברת", plural: "מחברות" },
  { single: "חוברת", plural: "חוברות" },
  { single: "מפית", plural: "מפיות" },
];

const students = ["דן", "עומר", "תמר", "ליאור"];

const rangeByLevel: Record<
  number,
  {
    speed: [number, number];
    hours: [number, number];
    unitPrice: [number, number];
    packs: [number, number];
    scores: [number, number];
    grade: [number, number];
  }
> = {
  1: {
    speed: [20, 60],
    hours: [2, 4],
    unitPrice: [3, 9],
    packs: [2, 6],
    scores: [3, 4],
    grade: [60, 90],
  },
  2: {
    speed: [50, 90],
    hours: [3, 7],
    unitPrice: [6, 20],
    packs: [4, 10],
    scores: [4, 5],
    grade: [50, 100],
  },
  3: {
    speed: [70, 120],
    hours: [4, 9],
    unitPrice: [15, 45],
    packs: [6, 16],
    scores: [5, 6],
    grade: [40, 100],
  },
};

const wordRateAverage: Generator = {
  id: "word-rate-average",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const range = rangeByLevel[level];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = rng.int(1, 4);

      if (kind === 1) {
        const speed = rng.int(range.speed[0], range.speed[1]);
        const hours = rng.int(range.hours[0], range.hours[1]);
        problems.push({
          prompt: `${rng.pick(vehicles)} נוסעת במהירות קבועה של ${speed} קמ"ש. כמה ק"מ תעבור ב-${hours} שעות?`,
          answer: `${speed * hours} ק"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const speed = rng.int(range.speed[0], range.speed[1]);
        const hours = rng.int(range.hours[0], range.hours[1]);
        problems.push({
          prompt: `${rng.pick(riders)} עבר ${speed * hours} ק"מ ב-${hours} שעות. מה המהירות הממוצעת שלו?`,
          answer: `${speed} קמ"ש`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const item = rng.pick(goods);
        const packs = rng.int(range.packs[0], range.packs[1]);
        const price = rng.int(range.unitPrice[0], range.unitPrice[1]);
        problems.push({
          prompt: `${packs} ${item.plural} עולות ${packs * price} ₪. כמה עולה ${item.single} אחת?`,
          answer: `${price} ₪`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const howMany = rng.int(range.scores[0], range.scores[1]);
        const [lowest, highest] = range.grade;
        const scores: number[] = [];
        for (let n = 0; n < howMany - 1; n++) scores.push(rng.int(lowest, highest));
        const partial = scores.reduce((sum, score) => sum + score, 0);
        const span = highest - lowest + 1;
        const first = rng.int(lowest, highest);
        let last = first;
        for (let step = 0; step < span; step++) {
          const candidate = lowest + ((first - lowest + step) % span);
          if ((partial + candidate) % howMany === 0) {
            last = candidate;
            break;
          }
        }
        scores.push(last);
        const list = scores.slice(0, -1).join(", ");
        const total = scores.reduce((sum, score) => sum + score, 0);
        problems.push({
          prompt: `${rng.pick(students)} קיבל ${howMany} ציונים: ${list} ו-${scores[scores.length - 1]}. מה הציון הממוצע?`,
          answer: formatNumber(total / howMany),
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default wordRateAverage;
