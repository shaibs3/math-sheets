import { createRng } from "../rng";
import { formatLinear, formatQuadratic, signedTerm } from "../algebra";
import type { Generator, Problem } from "../types";

function scalePrefix(scale: number): string {
  const magnitude = Math.abs(scale);
  return `${scale < 0 ? "−" : ""}${magnitude === 1 ? "" : magnitude}`;
}

const functionTransform: Generator = {
  id: "function-transform",
  columns: 2,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const baseB = level === 1 ? 0 : rng.int(-6, 6);
      const baseC = level === 1 ? 0 : rng.int(-8, 8);
      const scale =
        level === 3 ? rng.pick([-1, 2, 3, -2]) : level === 2 ? (rng.bool() ? 1 : -1) : 1;
      const reflect = level === 3 && rng.bool() ? -1 : 1;
      const shift = level === 1 ? rng.int(-5, 5) : rng.int(-6, 6);
      let raise = level === 1 ? rng.int(-6, 6) : rng.int(-9, 9);
      if (shift === 0 && raise === 0 && scale === 1 && reflect === 1) raise = 4;
      if (level === 1 && shift !== 0) raise = 0;

      const inner = formatLinear(reflect, shift);
      const outer = `${scalePrefix(scale)}f(${inner})${raise === 0 ? "" : ` ${signedTerm(raise, "")}`}`;

      const innerSquareX = 2 * reflect * shift;
      const composedB = innerSquareX + baseB * reflect;
      const composedC = shift * shift + baseB * shift + baseC;

      problems.push({
        prompt: `f(x) = ${formatQuadratic(1, baseB, baseC)} ; g(x) = ${outer}`,
        answer: `g(x) = ${formatQuadratic(scale, scale * composedB, scale * composedC + raise)}`,
        work: "lines",
        dir: "ltr",
      });
    }

    return problems;
  },
};

export default functionTransform;
