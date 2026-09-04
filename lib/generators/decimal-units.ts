import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

type Conversion = { from: string; to: string; factor: number };

const lengths: Conversion[] = [
  { from: 'ס"מ', to: 'מ"מ', factor: 10 },
  { from: "מ'", to: 'ס"מ', factor: 100 },
  { from: 'ק"מ', to: "מ'", factor: 1000 },
];

const weights: Conversion[] = [
  { from: 'ק"ג', to: "גרם", factor: 1000 },
  { from: "טון", to: 'ק"ג', factor: 1000 },
];

const areas: Conversion[] = [
  { from: 'מ"ר', to: 'סמ"ר', factor: 10000 },
  { from: "דונם", to: 'מ"ר', factor: 1000 },
];

const decimalUnits: Generator = {
  id: "decimal-units",
  columns: 2,
  defaultCount: 14,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const pool =
      level === 1 ? lengths : level === 2 ? [...lengths, ...weights] : [...lengths, ...weights, ...areas];
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const conversion = rng.pick(pool);
      const decimals = level === 1 ? 1 : 2;
      const value = rng.int(11, 999) / 10 ** decimals;
      const up = rng.bool();

      if (up) {
        problems.push({
          prompt: `${formatNumber(value, decimals)} ${conversion.from} = ______ ${conversion.to}`,
          answer: `${formatNumber(value * conversion.factor, 2)} ${conversion.to}`,
          work: "none",
          dir: "rtl",
        });
      } else {
        const big = rng.int(1, 900) * (conversion.factor >= 1000 ? 10 : 1);
        problems.push({
          prompt: `${big} ${conversion.to} = ______ ${conversion.from}`,
          answer: `${formatNumber(big / conversion.factor, 4)} ${conversion.from}`,
          work: "none",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default decimalUnits;
