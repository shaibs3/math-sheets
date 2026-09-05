import { createRng } from "../rng";
import { formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

function operand(value: number): string {
  return value < 0 ? `(${formatSignedNumber(value)})` : String(value);
}

const signedNumbers: Generator = {
  id: "signed-numbers",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const bound = level === 1 ? 10 : level === 2 ? 20 : 40;
    const factorBound = level === 3 ? 20 : 12;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);
      const a = rng.int(1, bound) * (rng.bool() ? 1 : -1);
      const b = rng.int(1, bound) * (rng.bool() ? 1 : -1);

      if (kind === 1) {
        problems.push({
          prompt: `${operand(a)} + ${operand(b)} =`,
          answer: formatSignedNumber(a + b),
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 2) {
        problems.push({
          prompt: `${operand(a)} − ${operand(b)} =`,
          answer: formatSignedNumber(a - b),
          work: "none",
          dir: "ltr",
        });
      } else if (kind === 3) {
        const left = rng.int(2, factorBound) * (rng.bool() ? 1 : -1);
        const right = rng.int(2, factorBound) * (rng.bool() ? 1 : -1);
        problems.push({
          prompt: `${operand(left)} × ${operand(right)} =`,
          answer: formatSignedNumber(left * right),
          work: "none",
          dir: "ltr",
        });
      } else {
        const divisor = rng.int(2, factorBound) * (rng.bool() ? 1 : -1);
        const quotient = rng.int(2, factorBound) * (rng.bool() ? 1 : -1);
        problems.push({
          prompt: `${operand(divisor * quotient)} ÷ ${operand(divisor)} =`,
          answer: formatSignedNumber(quotient),
          work: "none",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default signedNumbers;
