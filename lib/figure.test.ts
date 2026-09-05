import { describe, expect, it } from "vitest";
import { figureMatchesPrompt, figureValues, promptNumbers } from "./figure";
import generators from "./generators";
import type { Level } from "./types";

const LEVELS: Level[] = [1, 2, 3];

describe("figureValues", () => {
  it("returns the labelled sides of a rectangle", () => {
    expect(figureValues({ kind: "rect", width: 8, height: 3 })).toEqual([8, 3]);
  });

  it("returns the base and height of a triangle", () => {
    expect(figureValues({ kind: "triangle", base: 10, height: 4 })).toEqual([10, 4]);
  });

  it("returns the labelled length of a circle", () => {
    expect(figureValues({ kind: "circle", value: 7, label: "radius" })).toEqual([7]);
  });

  it("returns plotted points and line coefficients, but not the grid bounds", () => {
    expect(
      figureValues({
        kind: "axes",
        min: -5,
        max: 5,
        points: [{ x: 3, y: -2 }],
        line: { m: 2, b: -1 },
      }),
    ).toEqual([3, -2, 2, -1]);
  });
});

describe("promptNumbers", () => {
  it("reads negative and decimal values", () => {
    expect(promptNumbers("הנקודה (3, -2) והישר y = 1.5x")).toEqual([3, -2, 1.5]);
  });
});

describe("figureMatchesPrompt", () => {
  it("accepts a figure that only restates values from the prompt", () => {
    expect(
      figureMatchesPrompt(
        { kind: "rect", width: 8, height: 3 },
        "מלבן שאורכו 8 ס״מ ורוחבו 3 ס״מ. מהו השטח?",
      ),
    ).toBe(true);
  });

  it("rejects a figure carrying a value the prompt never states", () => {
    expect(
      figureMatchesPrompt(
        { kind: "rect", width: 8, height: 5 },
        "מלבן שאורכו 8 ס״מ ורוחבו 3 ס״מ. מהו השטח?",
      ),
    ).toBe(false);
  });

  it("rejects a plotted point the prompt never states", () => {
    expect(
      figureMatchesPrompt(
        { kind: "axes", min: -5, max: 5, points: [{ x: 4, y: 1 }] },
        "סמנו את הנקודה (3, -2).",
      ),
    ).toBe(false);
  });
});

describe("every registered generator", () => {
  it("emits figures that only restate values from their own prompt", () => {
    for (const generator of generators) {
      for (const level of LEVELS) {
        const problems = generator.generate({ seed: 12345, count: 12, level });
        for (const problem of problems) {
          if (!problem.figure) continue;
          expect(
            figureMatchesPrompt(problem.figure, problem.prompt),
            `${generator.id} level ${level}: figure states a value missing from "${problem.prompt}"`,
          ).toBe(true);
        }
      }
    }
  });
});
