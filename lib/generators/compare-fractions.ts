import { createRng } from "../rng";
import type { Rng } from "../rng";
import type { Generator, Problem } from "../types";

type Pair = [[number, number], [number, number]];

function sameDenominator(rng: Rng): Pair {
  const d = rng.int(3, 10);
  const a = rng.int(1, d - 1);
  const b = rng.int(1, 5) === 1 ? a : rng.int(1, d - 1);
  return [
    [a, d],
    [b, d],
  ];
}

function relatedDenominator(rng: Rng): Pair {
  const d = rng.int(2, 6);
  const factor = rng.int(2, 4);
  const big = d * factor;
  const a = rng.int(1, d - 1 || 1);
  const b = rng.int(1, big - 1);
  return rng.bool()
    ? [
        [a, d],
        [b, big],
      ]
    : [
        [b, big],
        [a, d],
      ];
}

function unrelatedDenominator(rng: Rng): Pair {
  const first = rng.int(3, 12);
  let second = rng.int(3, 12);
  if (second === first) second = first === 12 ? 5 : first + 1;
  return [
    [rng.int(1, first - 1), first],
    [rng.int(1, second - 1), second],
  ];
}

function againstWhole(rng: Rng): Pair {
  const d = rng.int(2, 9);
  const n = rng.int(1, 2 * d);
  const whole = rng.bool() ? 1 : 2;
  return rng.bool()
    ? [
        [n, d],
        [whole, 1],
      ]
    : [
        [whole, 1],
        [n, d],
      ];
}

function display([n, d]: [number, number]): string {
  return d === 1 ? String(n) : `${n}/${d}`;
}

const compareFractions: Generator = {
  id: "compare-fractions",
  columns: 3,
  defaultCount: 18,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const pair =
        level === 1
          ? sameDenominator(rng)
          : level === 2
            ? i % 2 === 0
              ? relatedDenominator(rng)
              : sameDenominator(rng)
            : i % 3 === 0
              ? againstWhole(rng)
              : unrelatedDenominator(rng);

      const [left, right] = pair;
      const leftValue = left[0] * right[1];
      const rightValue = right[0] * left[1];
      const sign = leftValue > rightValue ? ">" : leftValue < rightValue ? "<" : "=";

      problems.push({
        prompt: `${display(left)} ___ ${display(right)}`,
        answer: sign,
        work: "none",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default compareFractions;
