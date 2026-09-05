import { createRng } from "../rng";
import { formatNumber } from "../math";
import type { Generator, Problem } from "../types";

const PI = 3.14;

const circle: Generator = {
  id: "circle",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];

    for (let i = 0; i < count; i++) {
      const radius = rng.int(1, level === 1 ? 10 : 20);
      const givenDiameter = level >= 2 && rng.bool();
      const measure = givenDiameter ? radius * 2 : radius;
      const label = givenDiameter ? "קוטר" : "רדיוס";
      const wantsArea = rng.bool();

      if (wantsArea) {
        problems.push({
          prompt: `מעגל שה${label} שלו ${measure} ס"מ. חשבו את שטח העיגול (π ≈ 3.14).`,
          answer: `${formatNumber(PI * radius * radius, 2)} סמ"ר`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "circle", value: measure, label: givenDiameter ? "diameter" : "radius", unit: 'ס"מ' },
        });
      } else {
        problems.push({
          prompt: `מעגל שה${label} שלו ${measure} ס"מ. חשבו את היקף המעגל (π ≈ 3.14).`,
          answer: `${formatNumber(2 * PI * radius, 2)} ס"מ`,
          work: "lines",
          dir: "rtl",
          figure: { kind: "circle", value: measure, label: givenDiameter ? "diameter" : "radius", unit: 'ס"מ' },
        });
      }
    }

    return problems;
  },
};

export default circle;
