import { formatNumber, round } from "../math";
import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const groups = [
  { place: "בכיתה", people: "תלמידים", verb: "נסעו לטיול", question: "כמה תלמידים נסעו?", most: 40 },
  {
    place: "במועדון",
    people: "ילדים",
    verb: "משחקים כדורסל",
    question: "כמה ילדים משחקים כדורסל?",
    most: 60,
  },
  { place: "בגן", people: "עצים", verb: "עצי זית", question: "כמה עצי זית יש בגן?", most: 120 },
];

const produce = ["תפוחים", "עגבניות", "גבינה", "ענבים"];

const runners = ["שרה", "מיכל", "נועה", "יעל"];

const drinks = ["מיץ", "לימונדה", "חלב"];

const fractionsByLevel: Record<number, [number, number][]> = {
  1: [
    [1, 2],
    [1, 4],
    [3, 4],
    [1, 5],
  ],
  2: [
    [1, 3],
    [2, 3],
    [2, 5],
    [3, 5],
    [3, 8],
  ],
  3: [
    [3, 7],
    [5, 8],
    [4, 9],
    [7, 12],
    [5, 6],
  ],
};

const decimalsByLevel: Record<number, { scale: number; low: number; high: number }> = {
  1: { scale: 10, low: 11, high: 60 },
  2: { scale: 10, low: 40, high: 190 },
  3: { scale: 100, low: 150, high: 990 },
};

const wordFractionsDecimals: Generator = {
  id: "word-fractions-decimals",
  columns: 1,
  defaultCount: 6,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const fractions = fractionsByLevel[level];
    const decimals = decimalsByLevel[level];
    const decimal = () => round(rng.int(decimals.low, decimals.high) / decimals.scale, 2);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const kind = rng.int(1, 4);

      if (kind === 1) {
        const group = rng.pick(groups);
        const [numerator, denominator] = rng.pick(fractions);
        const parts = rng.int(2, Math.max(2, Math.min(9, Math.floor(group.most / denominator))));
        const total = denominator * parts;
        problems.push({
          prompt: `${group.place} ${total} ${group.people}, ו-${numerator}/${denominator} מהם ${group.verb}. ${group.question}`,
          answer: `${(total / denominator) * numerator}`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const price = decimal();
        const weight = round(rng.int(15, 45) / 10, 2);
        problems.push({
          prompt: `קילוגרם ${rng.pick(produce)} עולה ${price} ₪. כמה עולים ${weight} קילוגרם?`,
          answer: `${formatNumber(price * weight)} ₪`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const first = decimal();
        const second = decimal();
        problems.push({
          prompt: `${rng.pick(runners)} רצה ${first} ק"מ ביום ראשון ו-${second} ק"מ ביום שני. כמה ק"מ רצה בסך הכול?`,
          answer: `${formatNumber(first + second)} ק"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const poured = decimal();
        const start = round(poured + decimal(), 2);
        problems.push({
          prompt: `בכד היו ${start} ליטר ${rng.pick(drinks)}, ונשפכו ${poured} ליטר. כמה ליטר נשארו בכד?`,
          answer: `${formatNumber(start - poured)} ליטר`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default wordFractionsDecimals;
