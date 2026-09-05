import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

type Shape = {
  leftDecimals: number;
  leftMin: number;
  leftMax: number;
  rightDecimals: number;
  rightMin: number;
  rightMax: number;
};

const multiplyShapes: Record<number, Shape> = {
  1: { leftDecimals: 1, leftMin: 11, leftMax: 99, rightDecimals: 1, rightMin: 11, rightMax: 49 },
  2: { leftDecimals: 1, leftMin: 11, leftMax: 99, rightDecimals: 2, rightMin: 105, rightMax: 995 },
  3: { leftDecimals: 2, leftMin: 105, leftMax: 999, rightDecimals: 2, rightMin: 105, rightMax: 999 },
};

const divideShapes: Record<number, Shape> = {
  1: { leftDecimals: 1, leftMin: 11, leftMax: 49, rightDecimals: 0, rightMin: 2, rightMax: 9 },
  2: { leftDecimals: 1, leftMin: 11, leftMax: 99, rightDecimals: 1, rightMin: 11, rightMax: 49 },
  3: { leftDecimals: 2, leftMin: 105, leftMax: 499, rightDecimals: 1, rightMin: 11, rightMax: 99 },
};

const withNonZeroLastDigit = (value: number) => (value % 10 === 0 ? value + 1 : value);

const decimalMultiplyDivide: Generator = {
  id: "decimal-multiply-divide",
  columns: 2,
  defaultCount: 16,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      if (rng.bool()) {
        const shape = multiplyShapes[level];
        const leftScaled = withNonZeroLastDigit(rng.int(shape.leftMin, shape.leftMax));
        const rightScaled = withNonZeroLastDigit(rng.int(shape.rightMin, shape.rightMax));
        const productDecimals = shape.leftDecimals + shape.rightDecimals;

        problems.push({
          prompt: `${formatNumber(leftScaled / 10 ** shape.leftDecimals, shape.leftDecimals)} × ${formatNumber(rightScaled / 10 ** shape.rightDecimals, shape.rightDecimals)} =`,
          answer: formatNumber((leftScaled * rightScaled) / 10 ** productDecimals, productDecimals),
          work: "vertical",
          dir: "ltr",
        });
      } else {
        const shape = divideShapes[level];
        const divisorScaled = withNonZeroLastDigit(rng.int(shape.leftMin, shape.leftMax));
        const quotientScaled = rng.int(shape.rightMin, shape.rightMax);
        const dividendDecimals = shape.leftDecimals + shape.rightDecimals;

        problems.push({
          prompt: `${formatNumber((divisorScaled * quotientScaled) / 10 ** dividendDecimals, dividendDecimals)} ÷ ${formatNumber(divisorScaled / 10 ** shape.leftDecimals, shape.leftDecimals)} =`,
          answer: formatNumber(quotientScaled / 10 ** shape.rightDecimals, shape.rightDecimals),
          work: "vertical",
          dir: "ltr",
        });
      }
    }

    return problems;
  },
};

export default decimalMultiplyDivide;
