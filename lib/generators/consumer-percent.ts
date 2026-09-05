import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const VAT = 18;
const discounts = [10, 15, 20, 25, 30, 40, 50];

const consumerPercent: Generator = {
  id: "consumer-percent",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const price = rng.int(2, 40) * 100;
      const discount = rng.pick(discounts);
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 3);

      if (kind === 1) {
        problems.push({
          prompt: `מחיר מוצר ${price} ש"ח לפני הנחה. ניתנה הנחה של ${discount}%. כמה ישולם בפועל?`,
          answer: `${formatNumber(price * (1 - discount / 100), 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `מחיר מוצר ${price} ש"ח לפני מע"מ. מהו המחיר כולל מע"מ של ${VAT}%?`,
          answer: `${formatNumber(price * (1 + VAT / 100), 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const paid = price * (1 - discount / 100);
        problems.push({
          prompt: `לאחר הנחה של ${discount}% שולמו ${formatNumber(
            paid,
            2,
          )} ש"ח. מהו המחיר לפני ההנחה?`,
          answer: `${formatNumber(price, 2)} ש"ח`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default consumerPercent;
