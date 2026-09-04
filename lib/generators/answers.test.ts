import { describe, expect, it } from "vitest";
import fractionsMultiply from "./fractions-multiply";
import fractionsDivide from "./fractions-divide";
import fractionsAddSubtract from "./fractions-add-subtract";
import percent from "./percent";
import volume from "./volume";
import type { Level } from "../types";

function parseMixed(text: string): number {
  const [whole, fraction] = text.trim().split(" ");
  if (!fraction) return whole.includes("/") ? parseFraction(whole) : Number(whole);
  return Number(whole) + parseFraction(fraction);
}

function parseFraction(text: string): number {
  const [n, d] = text.split("/").map(Number);
  return d ? n / d : n;
}

const levels: Level[] = [1, 2, 3];

describe.each(levels)("fraction answers at level %i", (level) => {
  it("multiplication answers equal the product of the operands", () => {
    for (const problem of fractionsMultiply.generate({ seed: 9, count: 25, level })) {
      const [left, right] = problem.prompt.replace(" =", "").split(" × ");
      expect(parseMixed(problem.answer)).toBeCloseTo(parseMixed(left) * parseMixed(right), 10);
    }
  });

  it("division answers equal the quotient of the operands", () => {
    for (const problem of fractionsDivide.generate({ seed: 11, count: 25, level })) {
      const [left, right] = problem.prompt.replace(" =", "").split(" ÷ ");
      expect(parseMixed(problem.answer)).toBeCloseTo(parseMixed(left) / parseMixed(right), 10);
    }
  });

  it("addition and subtraction answers are correct and never negative", () => {
    for (const problem of fractionsAddSubtract.generate({ seed: 13, count: 25, level })) {
      const isAdd = problem.prompt.includes("+");
      const [left, right] = problem.prompt.replace(" =", "").split(isAdd ? " + " : " − ");
      const expected = isAdd
        ? parseMixed(left) + parseMixed(right)
        : parseMixed(left) - parseMixed(right);
      expect(expected).toBeGreaterThanOrEqual(0);
      expect(parseMixed(problem.answer)).toBeCloseTo(expected, 10);
    }
  });
});

describe("percent", () => {
  it("keeps values clean enough for pen and paper", () => {
    for (const problem of percent.generate({ seed: 5, count: 30, level: 3 })) {
      const numeric = Number(problem.answer.replace("%", ""));
      if (!Number.isNaN(numeric)) {
        expect(Math.round(numeric * 100) / 100).toBe(numeric);
      }
    }
  });
});

describe("volume", () => {
  it("computes box volume as the product of its edges", () => {
    for (const problem of volume.generate({ seed: 21, count: 30, level: 1 })) {
      const edges = [...problem.prompt.matchAll(/(\d+) ס"מ/g)].map((match) => Number(match[1]));
      const expected = edges.reduce((product, edge) => product * edge, 1);
      expect(Number(problem.answer.replace(' סמ"ק', ""))).toBe(expected);
    }
  });
});
