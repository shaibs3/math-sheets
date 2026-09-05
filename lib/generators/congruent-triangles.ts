import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const permutations = ["DEF", "DFE", "EDF", "EFD", "FDE", "FED"] as const;

const sidePairs: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
];

const source = "ABC";

const congruentTriangles: Generator = {
  id: "congruent-triangles",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxSide = level === 1 ? 15 : level === 2 ? 25 : 40;

    for (let i = 0; i < count; i++) {
      const image = level === 1 ? permutations[0] : rng.pick(permutations);
      const kind = level === 1 ? rng.int(1, 2) : level === 2 ? rng.int(1, 3) : rng.int(1, 5);
      const head = `משולש ABC חופף למשולש ${image}.`;

      if (kind === 1) {
        const [first, second] = rng.pick(sidePairs);
        const length = rng.int(3, maxSide);
        problems.push({
          prompt: `${head} נתון: ${source[first]}${source[second]} = ${length} ס"מ. מהו אורך ${image[first]}${image[second]}?`,
          answer: `${length} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const vertex = rng.int(0, 2);
        const angle = rng.int(20, 140);
        problems.push({
          prompt: `${head} נתון: זווית ${source[vertex]} = ${angle}°. מהי זווית ${image[vertex]}?`,
          answer: `${angle}°`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const first = rng.int(30, 100);
        const second = rng.int(25, Math.max(26, 150 - first));
        problems.push({
          prompt: `${head} נתון: זווית A = ${first}°, זווית B = ${second}°. מהי זווית ${image[2]}?`,
          answer: `${180 - first - second}°`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 4) {
        const a = rng.int(4, maxSide);
        const b = rng.int(4, maxSide);
        const c = rng.int(Math.abs(a - b) + 1, a + b - 1);
        problems.push({
          prompt: `${head} נתון: AB = ${a} ס"מ, BC = ${b} ס"מ, AC = ${c} ס"מ. מהו היקף משולש ${image}?`,
          answer: `${a + b + c} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const a = rng.int(4, maxSide);
        const b = rng.int(4, maxSide);
        const c = rng.int(Math.abs(a - b) + 1, a + b - 1);
        problems.push({
          prompt: `${head} נתון: היקף משולש ${image} הוא ${a + b + c} ס"מ, AB = ${a} ס"מ ו-BC = ${b} ס"מ. מהו אורך ${image[0]}${image[2]}?`,
          answer: `${c} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default congruentTriangles;
