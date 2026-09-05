import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const scientificNotation: Generator = {
  id: "scientific-notation",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxExponent = level === 1 ? 4 : level === 2 ? 7 : 9;

    for (let i = 0; i < count; i++) {
      const exponent = rng.int(2, maxExponent);
      const digitCount = rng.int(1, Math.min(3, exponent + 1));
      let digits = String(rng.int(1, 9));
      while (digits.length < digitCount) digits += String(rng.int(0, 9));
      if (digits.length > 1 && digits.endsWith("0")) digits = `${digits.slice(0, -1)}${rng.int(1, 9)}`;

      const mantissa = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
      const plain = `${digits}${"0".repeat(exponent - (digits.length - 1))}`;

      if (rng.bool()) {
        problems.push({
          prompt: `כתבו בכתיב מדעי את המספר ${plain}`,
          answer: `${mantissa} · 10^${exponent}`,
          work: "none",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `כתבו כמספר רגיל את ${mantissa} · 10^${exponent}`,
          answer: plain,
          work: "none",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default scientificNotation;
