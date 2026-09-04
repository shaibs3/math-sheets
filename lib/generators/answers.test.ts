import { describe, expect, it } from "vitest";
import fractionsMultiply from "./fractions-multiply";
import fractionsDivide from "./fractions-divide";
import fractionsAddSubtract from "./fractions-add-subtract";
import percent from "./percent";
import volume from "./volume";
import addSub20 from "./add-sub-20";
import addSub100 from "./add-sub-100";
import addSubVertical from "./add-sub-vertical";
import multiplyTable from "./multiply-table";
import multiplyVertical from "./multiply-vertical";
import multiplyPowersTen from "./multiply-powers-ten";
import longDivision from "./long-division";
import divideTwoDigit from "./divide-two-digit";
import divideRemainder from "./divide-remainder";
import orderOfOperations from "./order-of-operations";
import powers from "./powers";
import compareNumbers from "./compare-numbers";
import evenOdd from "./even-odd";
import numberLineMissing from "./number-line-missing";
import placeValue from "./place-value";
import divisibility from "./divisibility";
import divisibility369 from "./divisibility-369";
import primes from "./primes";
import unitFraction from "./unit-fraction";
import fractionSimplify from "./fraction-simplify";
import improperMixed from "./improper-mixed";
import fractionToDecimal from "./fraction-to-decimal";
import average from "./average";
import rectangleArea from "./rectangle-area";
import areaShapes from "./area-shapes";
import boxVolumeSurface from "./box-volume-surface";
import clock from "./clock";
import money from "./money";
import wordAddSubBasic from "./word-add-sub-basic";
import { gcd } from "../math";
import type { Generator, Level } from "../types";

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

function numbersIn(text: string): number[] {
  return [...text.matchAll(/\d+/g)].map((match) => Number(match[0]));
}

function firstNumber(text: string): number {
  return numbersIn(text)[0];
}

function applyOperator(left: number, operator: string, right: number): number {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  return left / right;
}

const binaryGenerators: [string, Generator][] = [
  ["add-sub-20", addSub20],
  ["add-sub-100", addSub100],
  ["add-sub-vertical", addSubVertical],
  ["multiply-table", multiplyTable],
  ["multiply-vertical", multiplyVertical],
  ["multiply-powers-ten", multiplyPowersTen],
  ["long-division", longDivision],
  ["divide-two-digit", divideTwoDigit],
];

const allLevels: Level[] = [1, 2, 3];

describe.each(binaryGenerators)("%s", (_name, generator) => {
  it.each(allLevels)("recomputes every answer from the prompt at level %i", (level) => {
    for (const problem of generator.generate({ seed: 4242, count: 40, level })) {
      const match = problem.prompt.match(/^(\d+) ([+−×÷]) (\d+) =$/);
      expect(match, problem.prompt).not.toBeNull();
      const [, left, operator, right] = match!;
      const expected = applyOperator(Number(left), operator, Number(right));
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(expected).toBeGreaterThanOrEqual(0);
      expect(Number(problem.answer)).toBe(expected);
    }
  });
});

describe("divide-remainder", () => {
  it.each(allLevels)("quotient and remainder rebuild the dividend at level %i", (level) => {
    for (const problem of divideRemainder.generate({ seed: 31, count: 40, level })) {
      const [dividend, divisor] = numbersIn(problem.prompt);
      const [quotient, remainder = 0] = numbersIn(problem.answer);
      expect(remainder).toBeLessThan(divisor);
      expect(quotient * divisor + remainder).toBe(dividend);
    }
  });
});

describe("order-of-operations", () => {
  it.each(allLevels)("respects operator precedence at level %i", (level) => {
    for (const problem of orderOfOperations.generate({ seed: 57, count: 40, level })) {
      const expression = problem.prompt.replace(" =", "");
      const parenthesised = expression.match(/^\((\d+) \+ (\d+)\) × (\d+)$/);
      const addThenMultiply = expression.match(/^(\d+) \+ (\d+) × (\d+)$/);
      const divideThenAdd = expression.match(/^(\d+) ÷ (\d+) \+ (\d+)$/);
      const subtractProduct = expression.match(/^(\d+) − (\d+) × (\d+)$/);
      const parts = (parenthesised ?? addThenMultiply ?? divideThenAdd ?? subtractProduct)!;
      expect(parts, problem.prompt).toBeTruthy();
      const [a, b, c] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
      const expected = parenthesised
        ? (a + b) * c
        : addThenMultiply
          ? a + b * c
          : divideThenAdd
            ? a / b + c
            : a - b * c;
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(expected).toBeGreaterThanOrEqual(0);
      expect(Number(problem.answer)).toBe(expected);
    }
  });
});

describe("powers", () => {
  const exponentOf: Record<string, number> = { "²": 2, "³": 3, "⁴": 4, "⁵": 5 };

  it.each(allLevels)("raises the base to the written exponent at level %i", (level) => {
    for (const problem of powers.generate({ seed: 63, count: 40, level })) {
      const match = problem.prompt.match(/^(\d+)([²³⁴⁵]) =$/);
      expect(match, problem.prompt).not.toBeNull();
      const [, base, superscript] = match!;
      expect(Number(problem.answer)).toBe(Number(base) ** exponentOf[superscript]);
    }
  });
});

describe("compare-numbers", () => {
  it.each(allLevels)("picks the sign that makes the statement true at level %i", (level) => {
    for (const problem of compareNumbers.generate({ seed: 71, count: 40, level })) {
      const [left, right] = numbersIn(problem.prompt);
      const holds =
        problem.answer === ">"
          ? left > right
          : problem.answer === "<"
            ? left < right
            : left === right;
      expect(holds, problem.prompt).toBe(true);
    }
  });
});

describe("even-odd", () => {
  it.each(allLevels)("labels parity correctly at level %i", (level) => {
    for (const problem of evenOdd.generate({ seed: 83, count: 40, level })) {
      const value = firstNumber(problem.prompt);
      expect(problem.answer.startsWith("אי"), problem.prompt).toBe(value % 2 !== 0);
    }
  });
});

describe("number-line-missing", () => {
  it.each(allLevels)("continues the arithmetic sequence at level %i", (level) => {
    for (const problem of numberLineMissing.generate({ seed: 97, count: 40, level })) {
      const terms = problem.prompt.split(", ");
      const known = terms
        .map((term, index) => ({ index, value: Number(term) }))
        .filter((term) => !Number.isNaN(term.value));
      const first = known[0];
      const last = known[known.length - 1];
      const step = (last.value - first.value) / (last.index - first.index);
      const hiddenIndex = terms.indexOf("___");
      expect(hiddenIndex).toBeGreaterThanOrEqual(0);
      expect(Number(problem.answer)).toBe(first.value + (hiddenIndex - first.index) * step);
    }
  });
});

describe("place-value", () => {
  const placeExponent: Record<string, number> = {
    היחידות: 0,
    העשרות: 1,
    המאות: 2,
    האלפים: 3,
  };

  it.each(allLevels)("reads the digit and its value at level %i", (level) => {
    for (const problem of placeValue.generate({ seed: 103, count: 40, level })) {
      const place = Object.keys(placeExponent).find((name) => problem.prompt.includes(name))!;
      const exponent = placeExponent[place];
      const value = firstNumber(problem.prompt);
      const digit = Math.floor(value / 10 ** exponent) % 10;
      const expected = problem.prompt.includes("הערך של") ? digit * 10 ** exponent : digit;
      expect(Number(problem.answer)).toBe(expected);
    }
  });
});

describe.each([
  ["divisibility", divisibility],
  ["divisibility-369", divisibility369],
] as [string, Generator][])("%s", (_name, generator) => {
  it.each(allLevels)("answers yes exactly when the division is exact at level %i", (level) => {
    for (const problem of generator.generate({ seed: 109, count: 40, level })) {
      const [value, divisor] = numbersIn(problem.prompt);
      expect(problem.answer === "כן", problem.prompt).toBe(value % divisor === 0);
    }
  });
});

describe("primes", () => {
  it.each(allLevels)("separates primes from composites at level %i", (level) => {
    for (const problem of primes.generate({ seed: 113, count: 40, level })) {
      const value = firstNumber(problem.prompt);
      let hasFactor = false;
      for (let divisor = 2; divisor * divisor <= value; divisor++) {
        if (value % divisor === 0) hasFactor = true;
      }
      expect(problem.answer.startsWith("ראשוני"), problem.prompt).toBe(!hasFactor);
      if (hasFactor) {
        const factor = numbersIn(problem.answer)[0];
        expect(value % factor).toBe(0);
        expect(factor).toBeGreaterThan(1);
        expect(factor).toBeLessThan(value);
      }
    }
  });
});

describe("unit-fraction", () => {
  it.each(allLevels)("relates the part and the whole at level %i", (level) => {
    for (const problem of unitFraction.generate({ seed: 127, count: 40, level })) {
      const [, denominator, given] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("מתוך") ? given / denominator : given * denominator;
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(Number(problem.answer)).toBe(expected);
    }
  });
});

describe("fraction-simplify", () => {
  it.each(allLevels)("keeps the value and reduces fully at level %i", (level) => {
    for (const problem of fractionSimplify.generate({ seed: 131, count: 40, level })) {
      const [promptNumerator, promptDenominator] = numbersIn(problem.prompt);
      const [answerNumerator, answerDenominator] = numbersIn(problem.answer);
      expect(promptNumerator / promptDenominator).toBeCloseTo(
        answerNumerator / answerDenominator,
        10,
      );
      if (!problem.prompt.includes("?")) {
        expect(gcd(answerNumerator, answerDenominator)).toBe(1);
      } else {
        expect(answerDenominator).toBe(numbersIn(problem.prompt)[2]);
      }
    }
  });
});

describe("improper-mixed", () => {
  it.each(allLevels)("keeps the value across both notations at level %i", (level) => {
    for (const problem of improperMixed.generate({ seed: 137, count: 40, level })) {
      const promptNumbers = numbersIn(problem.prompt);
      const answerNumbers = numbersIn(problem.answer);
      const asValue = (parts: number[]) =>
        parts.length === 2 ? parts[0] / parts[1] : parts[0] + parts[1] / parts[2];
      expect(asValue(promptNumbers)).toBeCloseTo(asValue(answerNumbers), 10);
      expect(promptNumbers.length + answerNumbers.length).toBe(5);
    }
  });
});

describe("fraction-to-decimal", () => {
  it.each(allLevels)("keeps the value across notations at level %i", (level) => {
    for (const problem of fractionToDecimal.generate({ seed: 139, count: 40, level })) {
      const left = problem.prompt.replace(" = ?", "");
      const promptValue = left.includes("/")
        ? Number(left.split("/")[0]) / Number(left.split("/")[1])
        : Number(left);
      const answerValue = problem.answer.includes("/")
        ? Number(problem.answer.split("/")[0]) / Number(problem.answer.split("/")[1])
        : Number(problem.answer);
      expect(promptValue).toBeCloseTo(answerValue, 10);
    }
  });
});

describe("average", () => {
  it.each(allLevels)("answers the arithmetic mean of the listed values at level %i", (level) => {
    for (const problem of average.generate({ seed: 149, count: 40, level })) {
      const values = numbersIn(problem.prompt);
      const total = values.reduce((sum, value) => sum + value, 0);
      expect(values.every((value) => value > 0), problem.prompt).toBe(true);
      expect(Number(problem.answer)).toBe(total / values.length);
    }
  });
});

describe("rectangle-area", () => {
  it.each(allLevels)("uses the rectangle formulas at level %i", (level) => {
    for (const problem of rectangleArea.generate({ seed: 151, count: 40, level })) {
      const [first, second] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("מהו שטחו")
        ? first * second
        : problem.prompt.includes("מהו היקפו")
          ? 2 * (first + second)
          : first / second;
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(firstNumber(problem.answer)).toBe(expected);
    }
  });
});

describe("area-shapes", () => {
  it.each(allLevels)("halves the product only for a triangle at level %i", (level) => {
    for (const problem of areaShapes.generate({ seed: 157, count: 40, level })) {
      const [base, height] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("משולש") ? (base * height) / 2 : base * height;
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(firstNumber(problem.answer)).toBe(expected);
    }
  });
});

describe("box-volume-surface", () => {
  it.each(allLevels)("uses the box formulas at level %i", (level) => {
    for (const problem of boxVolumeSurface.generate({ seed: 163, count: 40, level })) {
      const [a, b, c] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("נפחה")
        ? a * b * c
        : 2 * (a * b + b * c + a * c);
      expect(firstNumber(problem.answer)).toBe(expected);
    }
  });
});

describe("clock", () => {
  function minutesOf(text: string): number {
    const match = text.match(/(\d+):(\d\d)/)!;
    return (Number(match[1]) % 12) * 60 + Number(match[2]);
  }

  function durationOf(text: string): number {
    if (text.includes("שעה אחת")) return 60;
    const hours = text.match(/(\d+) שעות/);
    const minutes = text.match(/(\d+) דקות/);
    return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
  }

  it.each(allLevels)("advances and measures times consistently at level %i", (level) => {
    for (const problem of clock.generate({ seed: 167, count: 40, level })) {
      const times = [...problem.prompt.matchAll(/\d+:\d\d/g)].map((match) => match[0]);
      if (problem.prompt.includes("מה תהיה השעה")) {
        const start = minutesOf(times[0]);
        const gap = durationOf(problem.prompt.split(".")[1]);
        expect(minutesOf(problem.answer)).toBe((start + gap) % 720);
      } else {
        const gap = (minutesOf(times[1]) - minutesOf(times[0]) + 720) % 720;
        expect(durationOf(problem.answer)).toBe(gap);
      }
    }
  });
});

describe("money", () => {
  it.each(allLevels)("computes totals and change at level %i", (level) => {
    for (const problem of money.generate({ seed: 173, count: 40, level })) {
      const [first, second, paid] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("עודף") ? paid - first - second : first + second;
      expect(expected).toBeGreaterThanOrEqual(0);
      expect(firstNumber(problem.answer)).toBe(expected);
    }
  });
});

describe("word-add-sub-basic", () => {
  it.each(allLevels)("adds when receiving and subtracts when giving at level %i", (level) => {
    for (const problem of wordAddSubBasic.generate({ seed: 179, count: 40, level })) {
      const [first, second] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("קיבלה") ? first + second : first - second;
      expect(expected).toBeGreaterThan(0);
      expect(firstNumber(problem.answer)).toBe(expected);
    }
  });
});
