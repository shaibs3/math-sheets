import { describe, expect, it } from "vitest";
import fractionsMultiply from "./fractions-multiply";
import fractionsDivide from "./fractions-divide";
import fractionsAddSubtract from "./fractions-add-subtract";
import percent from "./percent";
import volume from "./volume";
import coordinatePoints from "./coordinate-points";
import coordinateSlope from "./coordinate-slope";
import coordinateTable from "./coordinate-table";
import linearGraph from "./linear-graph";
import addSub20 from "./add-sub-20";
import addSub100 from "./add-sub-100";
import addSubTens from "./add-sub-tens";
import multiplyDivide20 from "./multiply-divide-20";
import decimalMultiplyDivide from "./decimal-multiply-divide";
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
import wordMultDiv from "./word-mult-div";
import wordTwoStep from "./word-two-step";
import wordMoneyMeasure from "./word-money-measure";
import wordFractionsDecimals from "./word-fractions-decimals";
import wordRateAverage from "./word-rate-average";
import signedNumbers from "./signed-numbers";
import algebraicSubstitution from "./algebraic-substitution";
import collectLikeTerms from "./collect-like-terms";
import distributiveExpand from "./distributive-expand";
import linearEquation from "./linear-equation";
import equationWordProblems from "./equation-word-problems";
import powersRoots from "./powers-roots";
import angles from "./angles";
import functionValue from "./function-value";
import linearEquationBrackets from "./linear-equation-brackets";
import linearInequality from "./linear-inequality";
import linearSystem from "./linear-system";
import absoluteValueEquation from "./absolute-value-equation";
import linearFunction from "./linear-function";
import lineFromPoints from "./line-from-points";
import statisticsCenter from "./statistics-center";
import probabilityBasic from "./probability-basic";
import pythagoras from "./pythagoras";
import cylinder from "./cylinder";
import kiteProperties from "./kite-properties";
import parallelogramProperties from "./parallelogram-properties";
import rectangleProperties from "./rectangle-properties";
import rhombusProperties from "./rhombus-properties";
import squareProperties from "./square-properties";
import trapezoidProperties from "./trapezoid-properties";
import congruentTriangles from "./congruent-triangles";
import powerLaws from "./power-laws";
import scientificNotation from "./scientific-notation";
import rootLaws from "./root-laws";
import specialProducts from "./special-products";
import factoring from "./factoring";
import factorTrinomial from "./factor-trinomial";
import quadraticEquation from "./quadratic-equation";
import algebraicFractions from "./algebraic-fractions";
import parabola from "./parabola";
import conditionalProbability from "./conditional-probability";
import exponentialEquation from "./exponential-equation";
import standardDeviation from "./standard-deviation";
import rightTriangleTrig from "./right-triangle-trig";
import distancePoints from "./distance-points";
import midpoint from "./midpoint";
import slopeRelations from "./slope-relations";
import quadraticOptimum from "./quadratic-optimum";
import zScore from "./z-score";
import speedDistanceTime from "./speed-distance-time";
import arithmeticLaws from "./arithmetic-laws";
import compareFractions from "./compare-fractions";
import functionTransform from "./function-transform";
import placeValueMillion from "./place-value-million";
import quadraticInequality from "./quadratic-inequality";
import quadraticSystem from "./quadratic-system";
import rationalEquation from "./rational-equation";
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
  return [...text.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
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
  ["add-sub-tens", addSubTens],
  ["multiply-divide-20", multiplyDivide20],
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

describe("add-sub-tens", () => {
  it.each(allLevels)("stays inside the grade 1 range at level %i", (level) => {
    for (const problem of addSubTens.generate({ seed: 1201, count: 40, level })) {
      const values = [...numbersIn(problem.prompt), Number(problem.answer)];
      for (const value of values) {
        expect(value, problem.prompt).toBeLessThanOrEqual(100);
        expect(value, problem.prompt).toBeGreaterThanOrEqual(0);
      }
      const roundValues = values.filter((value) => value % 10 === 0);
      expect(roundValues.length, problem.prompt).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("multiply-divide-20", () => {
  it.each(allLevels)("keeps every product within 20 at level %i", (level) => {
    for (const problem of multiplyDivide20.generate({ seed: 1202, count: 40, level })) {
      const match = problem.prompt.match(/^(\d+) ([×÷]) (\d+) =$/);
      expect(match, problem.prompt).not.toBeNull();
      const [, left, operator, right] = match!;
      const product = operator === "×" ? Number(left) * Number(right) : Number(left);
      expect(product, problem.prompt).toBeLessThanOrEqual(20);
      expect(Number(problem.answer)).toBe(applyOperator(Number(left), operator, Number(right)));
      expect(Number.isInteger(Number(problem.answer)), problem.prompt).toBe(true);
    }
  });
});

describe("decimal-multiply-divide", () => {
  const scaled = (text: string) => {
    const [whole, fraction = ""] = text.split(".");
    return { integer: Number(whole + fraction), decimals: fraction.length };
  };

  it.each(allLevels)("recomputes the decimal result from the prompt at level %i", (level) => {
    for (const problem of decimalMultiplyDivide.generate({ seed: 1203, count: 40, level })) {
      const match = problem.prompt.match(/^(\d+(?:\.\d+)?) ([×÷]) (\d+(?:\.\d+)?) =$/);
      expect(match, problem.prompt).not.toBeNull();
      const [, left, operator, right] = match!;
      const a = scaled(left);
      const b = scaled(right);
      const expected =
        operator === "×"
          ? (a.integer * b.integer) / 10 ** (a.decimals + b.decimals)
          : (a.integer * 10 ** b.decimals) / (b.integer * 10 ** a.decimals);

      expect(a.decimals + b.decimals, problem.prompt).toBeGreaterThan(0);
      expect(Number(problem.answer), problem.prompt).toBeCloseTo(expected, 9);
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


describe("word-mult-div", () => {
  it.each(allLevels)("recomputes the answer from the prompt at level %i", (level) => {
    for (const problem of wordMultDiv.generate({ seed: 8123, count: 40, level })) {
      const [first, second] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("בסך הכול") ? first * second : first / second;
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(expected).toBeGreaterThan(0);
      expect(firstNumber(problem.answer), problem.prompt).toBe(expected);
    }
  });
});

describe("word-two-step", () => {
  it.each(allLevels)("recomputes the answer from the prompt at level %i", (level) => {
    for (const problem of wordTwoStep.generate({ seed: 5150, count: 40, level })) {
      const [first, second, third] = numbersIn(problem.prompt);
      const expected = problem.prompt.includes("חולקו")
        ? first / second - third
        : problem.prompt.includes("ונלקחו")
          ? first * second - third
          : first + second - third;
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(expected).toBeGreaterThan(0);
      expect(firstNumber(problem.answer), problem.prompt).toBe(expected);
    }
  });
});

describe("word-money-measure", () => {
  it.each(allLevels)("only ever pays with a real banknote at level %i", (level) => {
    const issued = [20, 50, 100, 200];
    for (const problem of wordMoneyMeasure.generate({ seed: 6262, count: 40, level })) {
      const note = /בשטר של (\d+) ₪/.exec(problem.prompt);
      if (!note) continue;
      expect(issued, problem.prompt).toContain(Number(note[1]));
      expect(firstNumber(problem.answer), problem.prompt).toBeGreaterThan(0);
    }
  });

  it.each(allLevels)("recomputes the answer from the prompt at level %i", (level) => {
    for (const problem of wordMoneyMeasure.generate({ seed: 6262, count: 40, level })) {
      const [first, second, third] = numbersIn(problem.prompt);
      let expected: number;
      if (problem.prompt.includes("עודף")) expected = third - first * second;
      else if (problem.prompt.includes("נשארו במכל")) expected = first - second * third;
      else if (problem.prompt.includes("חתיכות")) expected = first / second;
      else {
        const [priceA, priceB, countA, countB] = numbersIn(problem.prompt);
        expected = priceA * countA + priceB * countB;
      }
      expect(Number.isInteger(expected), problem.prompt).toBe(true);
      expect(expected).toBeGreaterThan(0);
      expect(firstNumber(problem.answer), problem.prompt).toBe(expected);
    }
  });
});

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

describe("word-fractions-decimals", () => {
  it.each(allLevels)("keeps a class small enough to be a real class at level %i", (level) => {
    for (const problem of wordFractionsDecimals.generate({ seed: 3311, count: 40, level })) {
      const size = /בכיתה (\d+) תלמידים/.exec(problem.prompt);
      if (!size) continue;
      expect(Number(size[1]), problem.prompt).toBeLessThanOrEqual(40);
    }
  });

  it.each(allLevels)("recomputes the answer from the prompt at level %i", (level) => {
    for (const problem of wordFractionsDecimals.generate({ seed: 3311, count: 40, level })) {
      const numbers = numbersIn(problem.prompt);
      let expected: number;
      if (problem.prompt.includes("מהם")) {
        const [total, numerator, denominator] = numbers;
        expect(total % denominator, problem.prompt).toBe(0);
        expected = (total / denominator) * numerator;
      } else if (problem.prompt.includes("כמה עולים")) {
        expected = numbers[0] * numbers[1];
      } else if (problem.prompt.includes("בסך הכול")) {
        expected = numbers[0] + numbers[1];
      } else {
        expected = numbers[0] - numbers[1];
      }
      expect(expected).toBeGreaterThan(0);
      expect(firstNumber(problem.answer), problem.prompt).toBe(roundTo(expected, 2));
    }
  });
});

describe("word-rate-average", () => {
  it.each(allLevels)("recomputes the answer from the prompt at level %i", (level) => {
    for (const problem of wordRateAverage.generate({ seed: 9090, count: 40, level })) {
      const numbers = numbersIn(problem.prompt);
      let expected: number;
      if (problem.prompt.includes("הציון הממוצע")) {
        const [howMany, ...scores] = numbers;
        expect(scores, problem.prompt).toHaveLength(howMany);
        const total = scores.reduce((sum, score) => sum + score, 0);
        expect(total % howMany, problem.prompt).toBe(0);
        expected = total / howMany;
        expect(firstNumber(problem.answer), problem.prompt).toBe(expected);
      } else if (problem.prompt.includes("המהירות הממוצעת")) {
        expected = numbers[0] / numbers[1];
      } else if (problem.prompt.includes("כמה עולה")) {
        expected = numbers[1] / numbers[0];
      } else {
        expected = numbers[0] * numbers[1];
      }
      expect(expected).toBeGreaterThan(0);
      expect(firstNumber(problem.answer), problem.prompt).toBe(roundTo(expected, 2));
    }
  });
});


type Bindings = Record<string, number>;

function normalizeExpression(text: string): string {
  return text
    .replace(/−/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4")
    .replace(/⁵/g, "^5")
    .replace(/\s+/g, "");
}

function evaluateExpression(text: string, bindings: Bindings = {}): number {
  const tokens = normalizeExpression(text).match(/\d+\.\d+|\d+|[a-z]|[-+*/^()]/g) ?? [];
  let position = 0;
  const peek = () => tokens[position];

  function parsePrimary(): number {
    const token = tokens[position++];
    if (token === "(") {
      const value = parseSum();
      position++;
      return value;
    }
    if (/^\d/.test(token)) return Number(token);
    if (!(token in bindings)) throw new Error(`unbound symbol ${token} in ${text}`);
    return bindings[token];
  }

  function parsePower(): number {
    const base = parsePrimary();
    if (peek() === "^") {
      position++;
      return base ** parseUnary();
    }
    return base;
  }

  function parseUnary(): number {
    if (peek() === "-") {
      position++;
      return -parseUnary();
    }
    if (peek() === "+") {
      position++;
      return parseUnary();
    }
    return parsePower();
  }

  function parseImplicit(): number {
    let value = parseUnary();
    while (peek() !== undefined && /^[\da-z(]/.test(peek())) value *= parsePower();
    return value;
  }

  function parseProduct(): number {
    let value = parseImplicit();
    while (peek() === "*" || peek() === "/") {
      const operator = tokens[position++];
      const right = parseImplicit();
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  }

  function parseSum(): number {
    let value = parseProduct();
    while (peek() === "+" || peek() === "-") {
      const operator = tokens[position++];
      const right = parseProduct();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  const result = parseSum();
  expect(position, `unconsumed tokens in ${text}`).toBe(tokens.length);
  return result;
}

function signedNumbersIn(text: string): number[] {
  return [...normalizeExpression(text).matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  );
}

function unsignedNumbersIn(text: string): number[] {
  return [...text.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

function pointsIn(text: string): [number, number][] {
  return [...normalizeExpression(text).matchAll(/\((-?\d+),(-?\d+)\)/g)].map((match) => [
    Number(match[1]),
    Number(match[2]),
  ]);
}

function solutionsIn(answer: string, symbol: string): number[] {
  return answer
    .split(" , ")
    .filter((part) => part.trim().startsWith(`${symbol} =`))
    .map((part) => evaluateExpression(part.split("=")[1]));
}

function functionOf(prompt: string): (x: number) => number {
  const expression = prompt.split("y = ")[1].split(".")[0];
  return (x: number) => evaluateExpression(expression, { x });
}

const testLevels: Level[] = [1, 2, 3];

describe("expression evaluator", () => {
  it("respects precedence, implicit multiplication and unary minus", () => {
    expect(evaluateExpression("2 + 3 × 4")).toBe(14);
    expect(evaluateExpression("(2 + 3) × 4")).toBe(20);
    expect(evaluateExpression("3x", { x: 5 })).toBe(15);
    expect(evaluateExpression("−2x²", { x: 3 })).toBe(-18);
    expect(evaluateExpression("−x²", { x: 3 })).toBe(-9);
    expect(evaluateExpression("(x − 2)(x + 3)", { x: 4 })).toBe(14);
    expect(evaluateExpression("(4x + 8) ÷ 4", { x: 3 })).toBe(5);
  });
});

const equationGenerators: [string, Generator][] = [
  ["linear-equation", linearEquation],
  ["linear-equation-brackets", linearEquationBrackets],
];

describe.each(equationGenerators)("%s", (_name, generator) => {
  it.each(testLevels)("the stated x satisfies the equation at level %i", (level) => {
    for (const problem of generator.generate({ seed: 3301, count: 40, level })) {
      const [left, right] = problem.prompt.split(" = ");
      const [x] = solutionsIn(problem.answer, "x");
      expect(Number.isInteger(x), problem.prompt).toBe(true);
      expect(
        evaluateExpression(left, { x }),
        `${problem.prompt} with ${problem.answer}`,
      ).toBeCloseTo(evaluateExpression(right, { x }), 9);
    }
  });

  it.each(testLevels)("no other integer nearby satisfies it at level %i", (level) => {
    for (const problem of generator.generate({ seed: 3307, count: 25, level })) {
      const [left, right] = problem.prompt.split(" = ");
      const [x] = solutionsIn(problem.answer, "x");
      for (const offset of [-1, 1]) {
        const probe = x + offset;
        expect(evaluateExpression(left, { x: probe })).not.toBeCloseTo(
          evaluateExpression(right, { x: probe }),
          9,
        );
      }
    }
  });
});

describe("linear-system", () => {
  it.each(testLevels)("the stated pair satisfies both equations at level %i", (level) => {
    for (const problem of linearSystem.generate({ seed: 3313, count: 40, level })) {
      const [x] = solutionsIn(problem.answer, "x");
      const [y] = solutionsIn(problem.answer, "y");
      expect(Number.isInteger(x) && Number.isInteger(y), problem.prompt).toBe(true);
      for (const equation of problem.prompt.split(" ; ")) {
        const [left, right] = equation.split(" = ");
        expect(evaluateExpression(left, { x, y }), problem.prompt).toBeCloseTo(
          evaluateExpression(right, { x, y }),
          9,
        );
      }
    }
  });
});

describe("absolute-value-equation", () => {
  it.each(testLevels)("both stated roots satisfy the equation at level %i", (level) => {
    for (const problem of absoluteValueEquation.generate({ seed: 3319, count: 40, level })) {
      const [inner, right] = problem.prompt.replace(/\|/g, "").split(" = ");
      const roots = solutionsIn(problem.answer, "x");
      expect(roots).toHaveLength(2);
      expect(roots[0]).not.toBe(roots[1]);
      for (const x of roots) {
        expect(Number.isInteger(x), problem.prompt).toBe(true);
        expect(Math.abs(evaluateExpression(inner, { x })), problem.prompt).toBeCloseTo(
          evaluateExpression(right),
          9,
        );
      }
    }
  });
});

describe("linear-inequality", () => {
  it.each(testLevels)("the stated boundary and direction hold at level %i", (level) => {
    for (const problem of linearInequality.generate({ seed: 3323, count: 40, level })) {
      const relation = problem.prompt.includes(" > ") ? " > " : " < ";
      const [left, right] = problem.prompt.split(relation);
      const answerRelation = problem.answer.includes(" > ") ? " > " : " < ";
      const boundary = evaluateExpression(problem.answer.split(answerRelation)[1]);
      const target = evaluateExpression(right);
      expect(evaluateExpression(left, { x: boundary }), problem.prompt).toBeCloseTo(target, 9);

      const probe = answerRelation === " > " ? boundary + 1 : boundary - 1;
      const value = evaluateExpression(left, { x: probe });
      expect(relation === " > " ? value > target : value < target, problem.prompt).toBe(true);
    }
  });
});

describe("quadratic-equation", () => {
  it.each(testLevels)("both stated roots make the expression zero at level %i", (level) => {
    for (const problem of quadraticEquation.generate({ seed: 3329, count: 40, level })) {
      const [left, right] = problem.prompt.split(" = ");
      expect(evaluateExpression(right)).toBe(0);
      const roots = solutionsIn(problem.answer, "x");
      expect(roots).toHaveLength(2);
      expect(roots[0]).toBeLessThan(roots[1]);
      for (const x of roots) {
        expect(evaluateExpression(left, { x }), problem.prompt).toBeCloseTo(0, 9);
      }
      const between = (roots[0] + roots[1]) / 2;
      expect(evaluateExpression(left, { x: between })).not.toBeCloseTo(0, 9);
    }
  });
});

const identityGenerators: [string, Generator][] = [
  ["collect-like-terms", collectLikeTerms],
  ["distributive-expand", distributiveExpand],
  ["special-products", specialProducts],
  ["factoring", factoring],
  ["factor-trinomial", factorTrinomial],
  ["algebraic-fractions", algebraicFractions],
];

describe.each(identityGenerators)("%s", (_name, generator) => {
  it.each(testLevels)("the answer is equivalent to the prompt at level %i", (level) => {
    const samples = [1.5, 2.5, 4.25, 7.75];
    for (const problem of generator.generate({ seed: 3331, count: 40, level })) {
      const expression = problem.prompt.includes(": ")
        ? problem.prompt.split(": ")[1]
        : problem.prompt.replace(/ =$/, "");
      for (const x of samples) {
        expect(evaluateExpression(expression, { x }), problem.prompt).toBeCloseTo(
          evaluateExpression(problem.answer, { x }),
          8,
        );
      }
    }
  });
});

describe("linear-function", () => {
  it.each(testLevels)("reports slope and intercepts of its own line at level %i", (level) => {
    for (const problem of linearFunction.generate({ seed: 3343, count: 40, level })) {
      const f = functionOf(problem.prompt);
      const slope = f(1) - f(0);
      if (problem.prompt.includes("השיפוע")) {
        expect(evaluateExpression(problem.answer), problem.prompt).toBeCloseTo(slope, 9);
      } else {
        const [[x, y]] = pointsIn(problem.answer);
        expect(f(x), problem.prompt).toBeCloseTo(y, 9);
        if (problem.prompt.includes("ציר ה-x")) expect(y).toBe(0);
        if (problem.prompt.includes("ציר ה-y")) expect(x).toBe(0);
      }
    }
  });
});

describe("function-value", () => {
  it.each(testLevels)("its pair satisfies the stated function at level %i", (level) => {
    for (const problem of functionValue.generate({ seed: 3347, count: 40, level })) {
      const f = functionOf(problem.prompt);
      const given = signedNumbersIn(problem.prompt.split(". ")[1]).at(-1)!;
      const stated = evaluateExpression(problem.answer.split("=")[1]);
      const [x, y] = problem.answer.startsWith("y") ? [given, stated] : [stated, given];
      expect(f(x), `${problem.prompt} -> ${problem.answer}`).toBeCloseTo(y, 9);
    }
  });
});

describe("line-from-points", () => {
  it.each(testLevels)("its line passes through both given points at level %i", (level) => {
    for (const problem of lineFromPoints.generate({ seed: 3359, count: 40, level })) {
      const [first, second] = pointsIn(problem.prompt);
      const slope = (second[1] - first[1]) / (second[0] - first[0]);
      if (problem.prompt.includes("השיפוע")) {
        expect(evaluateExpression(problem.answer.split("=")[1]), problem.prompt).toBeCloseTo(
          slope,
          9,
        );
      } else {
        const expression = problem.answer.split("y = ")[1];
        for (const [x, y] of [first, second]) {
          expect(evaluateExpression(expression, { x }), problem.prompt).toBeCloseTo(y, 9);
        }
      }
    }
  });
});

describe("slope-relations", () => {
  it.each(testLevels)("relates correctly to the given line at level %i", (level) => {
    for (const problem of slopeRelations.generate({ seed: 3361, count: 40, level })) {
      const f = functionOf(problem.prompt);
      const slope = f(1) - f(0);
      if (problem.prompt.includes("המאונך")) {
        expect(evaluateExpression(problem.answer.split("=")[1]) * slope, problem.prompt).toBeCloseTo(
          -1,
          9,
        );
      } else if (problem.answer.startsWith("m")) {
        expect(evaluateExpression(problem.answer.split("=")[1])).toBeCloseTo(slope, 9);
      } else {
        const expression = problem.answer.split("y = ")[1];
        const [[px, py]] = pointsIn(problem.prompt);
        const g = (x: number) => evaluateExpression(expression, { x });
        expect(g(1) - g(0), problem.prompt).toBeCloseTo(slope, 9);
        expect(g(px), problem.prompt).toBeCloseTo(py, 9);
      }
    }
  });
});

describe("parabola", () => {
  it.each(testLevels)("its vertex, axis and intercept match the curve at level %i", (level) => {
    for (const problem of parabola.generate({ seed: 3371, count: 40, level })) {
      const f = functionOf(problem.prompt);
      if (problem.prompt.includes("קודקודה")) {
        const [[x, y]] = pointsIn(problem.answer);
        expect(f(x), problem.prompt).toBeCloseTo(y, 9);
        const opensUp = f(x + 1) > y;
        expect(f(x - 1) > y, problem.prompt).toBe(opensUp);
      } else if (problem.prompt.includes("ציר הסימטריה")) {
        const axis = evaluateExpression(problem.answer.split("=")[1]);
        expect(f(axis - 3), problem.prompt).toBeCloseTo(f(axis + 3), 9);
      } else {
        const [[x, y]] = pointsIn(problem.answer);
        expect(x).toBe(0);
        expect(f(0), problem.prompt).toBeCloseTo(y, 9);
      }
    }
  });
});

describe("quadratic-optimum", () => {
  it.each(testLevels)("its optimum really is the extreme value at level %i", (level) => {
    for (const problem of quadraticOptimum.generate({ seed: 3373, count: 40, level })) {
      const f = functionOf(problem.prompt);
      const stated = evaluateExpression(problem.answer.split("=")[1]);
      const isMinimum = problem.prompt.includes("מינימלי");

      if (problem.answer.startsWith("x")) {
        for (const offset of [-2, -1, 1, 2]) {
          const compared = f(stated + offset);
          expect(isMinimum ? compared > f(stated) : compared < f(stated), problem.prompt).toBe(
            true,
          );
        }
      } else {
        const candidates: number[] = [];
        for (let x = -60; x <= 60; x++) candidates.push(f(x));
        const extreme = isMinimum ? Math.min(...candidates) : Math.max(...candidates);
        expect(stated, problem.prompt).toBeCloseTo(extreme, 9);
      }
    }
  });
});

describe("distance-points", () => {
  it.each(testLevels)("its distance matches the coordinates at level %i", (level) => {
    for (const problem of distancePoints.generate({ seed: 3389, count: 40, level })) {
      const [first, second] = pointsIn(problem.prompt);
      const expected = Math.hypot(second[0] - first[0], second[1] - first[1]);
      expect(Number(problem.answer), problem.prompt).toBeCloseTo(expected, 9);
    }
  });
});

describe("midpoint", () => {
  it.each(testLevels)("its midpoint is the average of the endpoints at level %i", (level) => {
    for (const problem of midpoint.generate({ seed: 3391, count: 40, level })) {
      const promptPoints = pointsIn(problem.prompt);
      const [answerPoint] = pointsIn(problem.answer);
      if (problem.prompt.includes("אמצע הקטע AB")) {
        const [middle, endpoint] = promptPoints;
        expect((endpoint[0] + answerPoint[0]) / 2, problem.prompt).toBe(middle[0]);
        expect((endpoint[1] + answerPoint[1]) / 2, problem.prompt).toBe(middle[1]);
      } else {
        const [first, second] = promptPoints;
        expect(answerPoint[0]).toBe((first[0] + second[0]) / 2);
        expect(answerPoint[1]).toBe((first[1] + second[1]) / 2);
      }
    }
  });
});

describe("signed-numbers", () => {
  it.each(testLevels)("recomputes every signed operation at level %i", (level) => {
    for (const problem of signedNumbers.generate({ seed: 3407, count: 40, level })) {
      const [expression] = problem.prompt.split(" =");
      expect(evaluateExpression(expression), problem.prompt).toBe(
        evaluateExpression(problem.answer),
      );
    }
  });
});

describe("powers-roots", () => {
  it.each(testLevels)("squares and roots agree at level %i", (level) => {
    for (const problem of powersRoots.generate({ seed: 3413, count: 40, level })) {
      const answer = Number(problem.answer);
      if (problem.prompt.startsWith("√")) {
        const radicand = Number(problem.prompt.replace("√", "").replace(" =", ""));
        expect(answer * answer, problem.prompt).toBe(radicand);
      } else {
        expect(evaluateExpression(problem.prompt.replace(" =", "")), problem.prompt).toBe(answer);
      }
    }
  });
});

describe("power-laws", () => {
  it.each(testLevels)("its exponent follows from the prompt structure at level %i", (level) => {
    for (const problem of powerLaws.generate({ seed: 3433, count: 40, level })) {
      const exponents = [...problem.prompt.matchAll(/\^(\d+)/g)].map((match) => Number(match[1]));
      const stated = evaluateExpression(problem.answer);
      const expected = problem.prompt.startsWith("(")
        ? exponents[0] * exponents[1]
        : problem.prompt.includes(" ÷ ")
          ? exponents[0] - exponents[1]
          : exponents[0] + exponents[1];
      expect(stated, problem.prompt).toBe(expected);
      expect(problem.prompt).toContain("^?");
    }
  });
});

describe("scientific-notation", () => {
  it.each(testLevels)("both directions describe the same number at level %i", (level) => {
    for (const problem of scientificNotation.generate({ seed: 3449, count: 40, level })) {
      const scientific = problem.prompt.includes("בכתיב מדעי") ? problem.answer : problem.prompt;
      const plain = problem.prompt.includes("בכתיב מדעי") ? problem.prompt : problem.answer;
      const [mantissa, exponent] = scientific.match(/(\d(?:\.\d+)?) · 10\^(\d+)/)!.slice(1);
      const plainValue = Number(plain.match(/\d+$/)![0]);
      expect(Number(mantissa) * 10 ** Number(exponent), problem.prompt).toBeCloseTo(plainValue, 6);
      expect(Number(mantissa)).toBeGreaterThanOrEqual(1);
      expect(Number(mantissa)).toBeLessThan(10);
    }
  });
});

describe("root-laws", () => {
  it.each(testLevels)("the answer squares back to the radicand at level %i", (level) => {
    function valueOf(text: string): number {
      return text
        .split(" · ")
        .map((part) => {
          const [coefficient, radicand] = part.split("√");
          const scale = coefficient === "" ? 1 : Number(coefficient);
          return radicand === undefined ? Number(coefficient) : scale * Math.sqrt(Number(radicand));
        })
        .reduce((product, factor) => product * factor, 1);
    }

    for (const problem of rootLaws.generate({ seed: 3457, count: 40, level })) {
      const expression = problem.prompt.replace(" =", "");
      const parts = expression.split(" ÷ ");
      const promptValue =
        parts.length === 2 ? valueOf(parts[0]) / valueOf(parts[1]) : valueOf(expression);
      expect(promptValue, problem.prompt).toBeCloseTo(valueOf(problem.answer), 8);
    }
  });
});

describe("exponential-equation", () => {
  it.each(testLevels)("the stated exponent reproduces the value at level %i", (level) => {
    for (const problem of exponentialEquation.generate({ seed: 3461, count: 40, level })) {
      const [left, right] = problem.prompt.split(" = ");
      const x = evaluateExpression(problem.answer.split("=")[1]);
      expect(evaluateExpression(left.replace(/x/g, String(x))), problem.prompt).toBe(
        Number(right),
      );
    }
  });
});

describe("algebraic-substitution", () => {
  it.each(testLevels)("evaluates its own expression at the given x at level %i", (level) => {
    for (const problem of algebraicSubstitution.generate({ seed: 3463, count: 40, level })) {
      const expression = problem.prompt.split("הביטוי ")[1].split(/\s*עבור/)[0];
      const x = evaluateExpression(problem.prompt.split("x = ")[1]);
      expect(evaluateExpression(expression, { x }), problem.prompt).toBe(Number(problem.answer));
    }
  });
});

describe("equation-word-problems", () => {
  it.each(testLevels)("its number satisfies the described operation at level %i", (level) => {
    for (const problem of equationWordProblems.generate({ seed: 3467, count: 40, level })) {
      const numbers = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];
      if (problem.prompt.includes("מלבן")) {
        const [gap, perimeter] = numbers;
        expect(2 * (answer + (answer + gap)), problem.prompt).toBe(perimeter);
      } else {
        const [factor, term, result] = numbers;
        const combined = problem.prompt.includes("והוספתי")
          ? answer * factor + term
          : answer * factor - term;
        expect(combined, problem.prompt).toBe(result);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("angles", () => {
  it.each(testLevels)("its angle sums are consistent at level %i", (level) => {
    for (const problem of angles.generate({ seed: 3469, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];
      if (problem.prompt.includes("מצולע")) {
        expect(answer, problem.prompt).toBe((given[0] - 2) * 180);
      } else if (problem.prompt.includes("במשולש")) {
        expect(given[0] + given[1] + answer, problem.prompt).toBe(180);
      } else {
        expect(given[0] + answer, problem.prompt).toBe(180);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("pythagoras", () => {
  it.each(testLevels)("its triangle satisfies a² + b² = c² at level %i", (level) => {
    for (const problem of pythagoras.generate({ seed: 3491, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];
      const sides = [...given, answer].sort((a, b) => a - b);
      expect(sides[0] ** 2 + sides[1] ** 2, problem.prompt).toBe(sides[2] ** 2);
    }
  });
});

describe("right-triangle-trig", () => {
  it.each(testLevels)("its ratios match the given sides at level %i", (level) => {
    for (const problem of rightTriangleTrig.generate({ seed: 3499, count: 40, level })) {
      if (problem.prompt.includes("30°")) {
        const [hypotenuse] = unsignedNumbersIn(problem.prompt.split("היתר")[1]);
        expect(unsignedNumbersIn(problem.answer)[0] * 2, problem.prompt).toBe(hypotenuse);
        continue;
      }
      const [opposite, adjacent, hypotenuse] = unsignedNumbersIn(problem.prompt);
      expect(opposite ** 2 + adjacent ** 2).toBe(hypotenuse ** 2);
      const expected = problem.prompt.includes("sin α")
        ? opposite / hypotenuse
        : problem.prompt.includes("cos α")
          ? adjacent / hypotenuse
          : opposite / adjacent;
      expect(evaluateExpression(problem.answer), problem.prompt).toBeCloseTo(expected, 9);
    }
  });
});

describe("statistics-center", () => {
  it.each(testLevels)("recomputes mean, median and mode at level %i", (level) => {
    for (const problem of statisticsCenter.generate({ seed: 3511, count: 40, level })) {
      const values = problem.prompt
        .split(": ")[1]
        .split(".")[0]
        .split(", ")
        .map(Number);
      const sorted = [...values].sort((a, b) => a - b);
      const answer = Number(problem.answer);
      if (problem.prompt.includes("הממוצע")) {
        expect(answer, problem.prompt).toBeCloseTo(
          values.reduce((sum, value) => sum + value, 0) / values.length,
          2,
        );
      } else if (problem.prompt.includes("החציון")) {
        expect(answer, problem.prompt).toBe(sorted[(sorted.length - 1) / 2]);
      } else {
        const counts = new Map<number, number>();
        for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
        const best = [...counts.entries()].sort((a, b) => b[1] - a[1]);
        expect(best[0][1]).toBeGreaterThan(best[1][1]);
        expect(answer, problem.prompt).toBe(best[0][0]);
      }
    }
  });
});

describe("standard-deviation", () => {
  it.each(testLevels)("recomputes mean and deviation from the list at level %i", (level) => {
    for (const problem of standardDeviation.generate({ seed: 3517, count: 40, level })) {
      const values = problem.prompt
        .split(": ")[1]
        .split(".")[0]
        .split(", ")
        .map(Number);
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance =
        values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
      const expected = problem.prompt.includes("סטיית התקן") ? Math.sqrt(variance) : mean;
      expect(Number(problem.answer), problem.prompt).toBeCloseTo(expected, 9);
    }
  });
});

const probabilityGenerators: [string, Generator][] = [
  ["probability-basic", probabilityBasic],
  ["conditional-probability", conditionalProbability],
];

describe.each(probabilityGenerators)("%s", (_name, generator) => {
  it.each(testLevels)("stays a reduced probability between 0 and 1 at level %i", (level) => {
    for (const problem of generator.generate({ seed: 3527, count: 40, level })) {
      const [numerator, denominator] = problem.answer.split("/").map(Number);
      const value = denominator ? numerator / denominator : numerator;
      expect(value, problem.prompt).toBeGreaterThan(0);
      expect(value, problem.prompt).toBeLessThanOrEqual(1);
      if (denominator) expect(gcd(numerator, denominator), problem.answer).toBe(1);
    }
  });
});

describe("probability-basic", () => {
  it.each(testLevels)("matches the counts stated in the prompt at level %i", (level) => {
    for (const problem of probabilityBasic.generate({ seed: 3529, count: 40, level })) {
      const counts = unsignedNumbersIn(problem.prompt.split(". ")[0]);
      const total = counts.reduce((sum, value) => sum + value, 0);
      const [numerator, denominator] = problem.answer.split("/").map(Number);
      const value = denominator ? numerator / denominator : numerator;
      const favourable = problem.prompt.includes("אינו אדום")
        ? total - counts[0]
        : problem.prompt.includes("כחול או ירוק")
          ? total - counts[0]
          : counts[0];
      expect(value, problem.prompt).toBeCloseTo(favourable / total, 9);
    }
  });
});

describe("cylinder", () => {
  it.each(testLevels)("uses the cylinder formulas at level %i", (level) => {
    for (const problem of cylinder.generate({ seed: 3533, count: 40, level })) {
      const [radius, height] = unsignedNumbersIn(problem.prompt);
      const expected = problem.prompt.includes("שטח הפנים")
        ? 2 * 3.14 * radius * (radius + height)
        : 3.14 * radius * radius * height;
      expect(unsignedNumbersIn(problem.answer)[0], problem.prompt).toBeCloseTo(expected, 2);
    }
  });
});

describe("z-score", () => {
  it.each(testLevels)("its z and value are consistent at level %i", (level) => {
    for (const problem of zScore.generate({ seed: 3539, count: 40, level })) {
      const [mean, deviation, third] = signedNumbersIn(problem.prompt);
      const answer = signedNumbersIn(problem.answer)[0];
      const [value, z] = problem.answer.startsWith("z") ? [third, answer] : [answer, third];
      expect((value - mean) / deviation, problem.prompt).toBeCloseTo(z, 9);
    }
  });
});

describe("speed-distance-time", () => {
  it.each(testLevels)("keeps distance equal to speed times time at level %i", (level) => {
    for (const problem of speedDistanceTime.generate({ seed: 3541, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];
      const [speed, hours, distance] = problem.prompt.includes("מהו המרחק")
        ? [given[0], given[1], answer]
        : problem.prompt.includes("מהירותו")
          ? [answer, given[1], given[0]]
          : [given[1], answer, given[0]];
      expect(speed * hours, problem.prompt).toBeCloseTo(distance, 6);
    }
  });
});

function lineIn(text: string): { m: number; b: number } {
  const match = /y=(-?\d*)x([+-]\d+)?/.exec(normalizeExpression(text));
  if (!match) throw new Error(`no line in ${text}`);
  const slope = match[1] === "" ? 1 : match[1] === "-" ? -1 : Number(match[1]);
  return { m: slope, b: match[2] ? Number(match[2]) : 0 };
}

function locationFor(x: number, y: number): string {
  if (x === 0 && y === 0) return "בראשית הצירים";
  if (x === 0) return "על ציר ה-y";
  if (y === 0) return "על ציר ה-x";
  if (x > 0 && y > 0) return "רביע ראשון";
  if (x < 0 && y > 0) return "רביע שני";
  if (x < 0 && y < 0) return "רביע שלישי";
  return "רביע רביעי";
}

describe("coordinate-points", () => {
  it.each(testLevels)("names the quadrant of the stated point at level %i", (level) => {
    for (const problem of coordinatePoints.generate({ seed: 4801, count: 40, level })) {
      const [[x, y]] = pointsIn(problem.prompt);
      expect(problem.answer, problem.prompt).toBe(locationFor(x, y));
    }
  });
});

describe("coordinate-table", () => {
  it.each(testLevels)("recomputes each y from the stated line at level %i", (level) => {
    for (const problem of coordinateTable.generate({ seed: 4802, count: 40, level })) {
      const { m, b } = lineIn(problem.prompt);
      const inputs = /כאשרx=([-\d,]+)/
        .exec(normalizeExpression(problem.prompt))![1]
        .split(",")
        .map(Number);
      expect(signedNumbersIn(problem.answer), problem.prompt).toEqual(
        inputs.map((x) => m * x + b),
      );
    }
  });
});

describe("linear-graph", () => {
  it.each(testLevels)("recomputes the stated intercept at level %i", (level) => {
    for (const problem of linearGraph.generate({ seed: 4803, count: 40, level })) {
      const { m, b } = lineIn(problem.prompt);
      const onXAxis = problem.prompt.includes("ציר ה-x");
      const expected: [number, number] = onXAxis ? [-b / m || 0, 0] : [0, b];
      const [point] = pointsIn(problem.answer);
      expect(point, problem.prompt).toEqual(expected);
    }
  });
});

describe("coordinate-slope", () => {
  it.each(testLevels)("recomputes the slope from the two stated points at level %i", (level) => {
    for (const problem of coordinateSlope.generate({ seed: 4804, count: 40, level })) {
      const [[x1, y1], [x2, y2]] = pointsIn(problem.prompt);
      expect(signedNumbersIn(problem.answer)[0], problem.prompt).toBeCloseTo(
        (y2 - y1) / (x2 - x1),
        9,
      );
    }
  });
});

const millionPlaces: [string, number][] = [
  ["היחידות", 0],
  ["העשרות", 1],
  ["המאות", 2],
  ["האלפים", 3],
  ["עשרות האלפים", 4],
  ["מאות האלפים", 5],
];

describe("arithmetic-laws", () => {
  it.each(testLevels)("the stated value makes both sides equal at level %i", (level) => {
    for (const problem of arithmeticLaws.generate({ seed: 5101, count: 40, level })) {
      expect(problem.prompt.match(/___/g), problem.prompt).toHaveLength(1);
      const [left, right] = problem.prompt.replace("___", `(${problem.answer})`).split(" = ");
      expect(evaluateExpression(left), problem.prompt).toBe(evaluateExpression(right));
    }
  });
});

describe("place-value-million", () => {
  it.each(testLevels)("recomputes the digit named in the prompt at level %i", (level) => {
    for (const problem of placeValueMillion.generate({ seed: 5102, count: 40, level })) {
      if (!problem.prompt.includes("במספר")) {
        expect(evaluateExpression(problem.prompt), problem.prompt).toBe(Number(problem.answer));
        continue;
      }
      const value = Number(/במספר (\d+)\?/.exec(problem.prompt)![1]);
      const named = millionPlaces.filter(([name]) => problem.prompt.includes(`ספרת ${name} `));
      expect(named, problem.prompt).toHaveLength(1);
      const exponent = named[0][1];
      const digit = Math.floor(value / 10 ** exponent) % 10;
      const wantsPlaceValue = problem.prompt.startsWith("מהו הערך");
      expect(Number(problem.answer), problem.prompt).toBe(
        wantsPlaceValue ? digit * 10 ** exponent : digit,
      );
    }
  });
});

describe("kite-properties", () => {
  it.each(testLevels)("recomputes every kite answer from its prompt at level %i", (level) => {
    for (const problem of kiteProperties.generate({ seed: 5101, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];

      if (problem.prompt.includes("היקף הדלתון")) {
        expect(answer, problem.prompt).toBe(2 * (given[0] + given[1]));
      } else if (problem.prompt.includes("זווית הזנב")) {
        expect(given[0] + given[1] + 2 * answer, problem.prompt).toBe(360);
      } else if (problem.prompt.includes("שטח הדלתון")) {
        expect(2 * answer, problem.prompt).toBe(given[0] * given[1]);
      } else {
        expect(2 * answer, problem.prompt).toBe(given[0]);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("compare-fractions", () => {
  it.each(testLevels)("recomputes the stated comparison at level %i", (level) => {
    for (const problem of compareFractions.generate({ seed: 5103, count: 40, level })) {
      const [left, right] = problem.prompt.split(" ___ ").map((part) => {
        const [n, d] = part.split("/").map(Number);
        return { n, d: d ?? 1 };
      });
      const difference = left.n * right.d - right.n * left.d;
      expect(problem.answer, problem.prompt).toBe(
        difference > 0 ? ">" : difference < 0 ? "<" : "=",
      );
    }
  });
});

describe("rational-equation", () => {
  it.each(testLevels)("the stated root satisfies the equation at level %i", (level) => {
    for (const problem of rationalEquation.generate({ seed: 5104, count: 40, level })) {
      const [x] = solutionsIn(problem.answer, "x");
      const [left, right] = problem.prompt.split(" = ");
      const value = evaluateExpression(left, { x });
      expect(Number.isFinite(value), problem.prompt).toBe(true);
      expect(value, problem.prompt).toBeCloseTo(evaluateExpression(right, { x }), 9);
    }
  });
});

describe("quadratic-inequality", () => {
  it.each(testLevels)("the stated solution set matches the inequality at level %i", (level) => {
    for (const problem of quadraticInequality.generate({ seed: 5105, count: 40, level })) {
      const relation = /[<>≤≥]/.exec(problem.prompt)![0];
      const [left, right] = problem.prompt.split(` ${relation} `);
      expect(evaluateExpression(right), problem.prompt).toBe(0);

      const roots = signedNumbersIn(problem.answer);
      expect(roots, problem.prompt).toHaveLength(2);
      const [low, high] = roots;
      expect(low, problem.prompt).toBeLessThan(high);
      for (const root of roots) {
        expect(evaluateExpression(left, { x: root }), problem.prompt).toBeCloseTo(0, 9);
      }

      const statesOutside = problem.answer.startsWith("x");
      for (const probe of [low - 1, (low + high) / 2, high + 1]) {
        const value = evaluateExpression(left, { x: probe });
        const holds = relation === ">" || relation === "≥" ? value > 0 : value < 0;
        const between = probe > low && probe < high;
        expect(holds, `${problem.prompt} @ ${probe}`).toBe(statesOutside ? !between : between);
      }
    }
  });
});

describe("parallelogram-properties", () => {
  it.each(testLevels)("recomputes every parallelogram answer from its prompt at level %i", (level) => {
    for (const problem of parallelogramProperties.generate({ seed: 5102, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];

      if (problem.prompt.includes("מהי הצלע הסמוכה אליה")) {
        expect(2 * (given[1] + answer), problem.prompt).toBe(given[0]);
      } else if (problem.prompt.includes("היקף המקבילית")) {
        expect(answer, problem.prompt).toBe(2 * (given[0] + given[1]));
      } else if (problem.prompt.includes("שטח המקבילית")) {
        expect(answer, problem.prompt).toBe(given[0] * given[1]);
      } else if (problem.prompt.includes("הזווית הסמוכה")) {
        expect(given[0] + answer, problem.prompt).toBe(180);
      } else {
        expect(answer, problem.prompt).toBe(given[0]);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("quadratic-system", () => {
  it.each(testLevels)("both stated pairs satisfy both equations at level %i", (level) => {
    for (const problem of quadraticSystem.generate({ seed: 5106, count: 30, level })) {
      const points = pointsIn(problem.answer);
      expect(points, problem.prompt).toHaveLength(2);
      expect(points[0], problem.prompt).not.toEqual(points[1]);
      for (const [x, y] of points) {
        for (const equation of problem.prompt.split(" ; ")) {
          const [left, right] = equation.split(" = ");
          expect(evaluateExpression(left, { x, y }), problem.prompt).toBeCloseTo(
            evaluateExpression(right, { x, y }),
            9,
          );
        }
      }
    }
  });
});

describe("rectangle-properties", () => {
  it.each(testLevels)("recomputes every rectangle answer from its prompt at level %i", (level) => {
    for (const problem of rectangleProperties.generate({ seed: 5103, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];

      if (problem.prompt.includes("מהו רוחב המלבן")) {
        expect(given[1] * answer, problem.prompt).toBe(given[0]);
      } else if (problem.prompt.includes("שטח המלבן")) {
        expect(answer, problem.prompt).toBe(given[0] * given[1]);
      } else if (problem.prompt.includes("היקף המלבן")) {
        expect(answer, problem.prompt).toBe(2 * (given[0] + given[1]));
      } else if (problem.prompt.includes("אלכסון המלבן")) {
        expect(answer ** 2, problem.prompt).toBe(given[0] ** 2 + given[1] ** 2);
      } else {
        expect(given[0] + answer, problem.prompt).toBe(90);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("rhombus-properties", () => {
  it.each(testLevels)("recomputes every rhombus answer from its prompt at level %i", (level) => {
    for (const problem of rhombusProperties.generate({ seed: 5104, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];

      if (problem.prompt.includes("מהו אורך צלע המעוין")) {
        if (given.length === 1) {
          expect(4 * answer, problem.prompt).toBe(given[0]);
        } else {
          expect(answer ** 2, problem.prompt).toBe((given[0] / 2) ** 2 + (given[1] / 2) ** 2);
        }
      } else if (problem.prompt.includes("היקף המעוין")) {
        expect(answer, problem.prompt).toBe(4 * given[0]);
      } else if (problem.prompt.includes("שטח המעוין")) {
        expect(2 * answer, problem.prompt).toBe(given[0] * given[1]);
      } else if (problem.prompt.includes("הזווית הסמוכה")) {
        expect(given[0] + answer, problem.prompt).toBe(180);
      } else {
        expect(2 * answer, problem.prompt).toBe(given[0]);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("function-transform", () => {
  it.each(testLevels)("the stated polynomial matches the composition at level %i", (level) => {
    for (const problem of functionTransform.generate({ seed: 5107, count: 30, level })) {
      const [base, transform] = problem.prompt.split(" ; ");
      const baseExpression = base.split(" = ")[1];
      const outer = transform.split(" = ")[1];
      const answerExpression = problem.answer.split(" = ")[1];
      const inner = /f\(([^)]*)\)/.exec(outer)![1];

      for (const x of [-3, -1, 0, 2, 5]) {
        const argument = evaluateExpression(inner, { x });
        const baseValue = evaluateExpression(baseExpression, { x: argument });
        const substituted = outer.replace(/f\([^)]*\)/, `(${baseValue})`);
        expect(evaluateExpression(answerExpression, { x }), problem.prompt).toBeCloseTo(
          evaluateExpression(substituted),
          9,
        );
      }
    }
  });
});

describe("square-properties", () => {
  it.each(testLevels)("recomputes every square answer from its prompt at level %i", (level) => {
    for (const problem of squareProperties.generate({ seed: 5105, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];

      if (problem.prompt.includes("חצי האלכסון")) {
        expect(2 * answer, problem.prompt).toBe(given[0]);
      } else if (problem.prompt.includes("מהו אורך צלע הריבוע")) {
        if (problem.prompt.includes("היקף")) {
          expect(4 * answer, problem.prompt).toBe(given[0]);
        } else {
          expect(answer ** 2, problem.prompt).toBe(given[0]);
        }
      } else if (problem.prompt.includes("שטח הריבוע")) {
        expect(answer, problem.prompt).toBe(given[0] ** 2);
      } else {
        expect(answer, problem.prompt).toBe(4 * given[0]);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("trapezoid-properties", () => {
  it.each(testLevels)("recomputes every trapezoid answer from its prompt at level %i", (level) => {
    for (const problem of trapezoidProperties.generate({ seed: 5106, count: 40, level })) {
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];

      if (problem.prompt.includes("הבסיס השני")) {
        expect((given[2] + answer) * given[1], problem.prompt).toBe(2 * given[0]);
      } else if (problem.prompt.includes("גובה הטרפז")) {
        expect((given[1] + given[2]) * answer, problem.prompt).toBe(2 * given[0]);
      } else if (problem.prompt.includes("שטח הטרפז")) {
        expect(2 * answer, problem.prompt).toBe((given[0] + given[1]) * given[2]);
      } else if (problem.prompt.includes("קטע האמצעים")) {
        expect(2 * answer, problem.prompt).toBe(given[0] + given[1]);
      } else {
        expect(given[0] + answer, problem.prompt).toBe(180);
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe("congruent-triangles", () => {
  it.each(testLevels)("matches corresponding parts through the stated congruence at level %i", (level) => {
    for (const problem of congruentTriangles.generate({ seed: 5107, count: 40, level })) {
      const image = /חופף למשולש ([A-F]{3})/.exec(problem.prompt)![1];
      const correspondence: Record<string, string> = {
        A: image[0],
        B: image[1],
        C: image[2],
      };
      const given = unsignedNumbersIn(problem.prompt);
      const answer = unsignedNumbersIn(problem.answer)[0];
      const askedSide = /מהו אורך ([A-F]{2})\?/.exec(problem.prompt);
      const askedAngle = /מהי זווית ([A-F])\?/.exec(problem.prompt);
      const statedAngles = [...problem.prompt.matchAll(/זווית ([A-C]) = (\d+)°/g)];

      if (problem.prompt.includes("מהו היקף משולש")) {
        expect(answer, problem.prompt).toBe(given[0] + given[1] + given[2]);
      } else if (problem.prompt.includes("היקף משולש")) {
        const asked = askedSide![1].split("").sort().join("");
        expect(asked, problem.prompt).toBe([correspondence.A, correspondence.C].sort().join(""));
        expect(given[0], problem.prompt).toBe(given[1] + given[2] + answer);
      } else if (askedSide) {
        const stated = /([A-C])([A-C]) = (\d+)/.exec(problem.prompt)!;
        const mapped = [correspondence[stated[1]], correspondence[stated[2]]].sort().join("");
        expect(askedSide[1].split("").sort().join(""), problem.prompt).toBe(mapped);
        expect(answer, problem.prompt).toBe(Number(stated[3]));
      } else if (statedAngles.length === 2) {
        expect(askedAngle![1], problem.prompt).toBe(correspondence.C);
        expect(Number(statedAngles[0][2]) + Number(statedAngles[1][2]) + answer, problem.prompt).toBe(
          180,
        );
      } else {
        expect(askedAngle![1], problem.prompt).toBe(correspondence[statedAngles[0][1]]);
        expect(answer, problem.prompt).toBe(Number(statedAngles[0][2]));
      }
      expect(answer).toBeGreaterThan(0);
    }
  });
});
