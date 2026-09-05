import { createRng } from "../rng";
import { formatLinear, formatSignedNumber } from "../algebra";
import type { Generator, Problem } from "../types";

function linearFactor(constant: number): string {
  return constant === 0 ? "x" : `(${formatLinear(1, constant)})`;
}

const rationalEquation: Generator = {
  id: "rational-equation",
  columns: 2,
  defaultCount: 10,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      if (level === 1) {
        const root = rng.int(2, 12) * (rng.bool() ? 1 : -1);
        const factor = rng.int(2, 9);
        problems.push({
          prompt: `${formatSignedNumber(root * factor)} ÷ x = ${factor}`,
          answer: `x = ${formatSignedNumber(root)}`,
          work: "lines",
          dir: "ltr",
        });
        continue;
      }

      if (level === 2) {
        const root = rng.int(-9, 9);
        let shift = rng.int(-8, 8);
        if (root + shift === 0) shift += 1;
        const factor = rng.int(2, 7) * (rng.bool() ? 1 : -1);
        problems.push({
          prompt: `${formatSignedNumber(factor * (root + shift))} ÷ ${linearFactor(
            shift,
          )} = ${formatSignedNumber(factor)}`,
          answer: `x = ${formatSignedNumber(root)}`,
          work: "lines",
          dir: "ltr",
        });
        continue;
      }

      const root = rng.int(-8, 8);
      let shift = rng.int(-7, 7);
      if (root + shift === 0) shift += 1;
      let quotient = rng.int(-4, 5);
      if (quotient === 1) quotient = 6;
      const top = quotient * (root + shift) - root;

      problems.push({
        prompt: `${linearFactor(top)} ÷ ${linearFactor(shift)} = ${formatSignedNumber(quotient)}`,
        answer: `x = ${formatSignedNumber(root)}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default rationalEquation;
