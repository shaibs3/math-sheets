import { describe, expect, it } from "vitest";
import { splitMathSegments } from "./math-text";
import generators from "./generators";
import type { Level } from "./types";

const isolated = (text: string) =>
  splitMathSegments(text)
    .filter((segment) => segment.isolated)
    .map((segment) => segment.text);

describe("splitMathSegments", () => {
  it("isolates a coordinate pair", () => {
    expect(isolated("סמנו את הנקודה (3, -2). באיזה רביע?")).toContain("(3, -2)");
  });

  it("isolates a coordinate pair written with a space before the comma", () => {
    expect(isolated("מצאו את המרחק בין הנקודות (-3 , 4) ו-(5 , 1).")).toContain("(-3 , 4)");
  });

  it("isolates a linear function", () => {
    expect(isolated("שרטטו את הישר y = 2x - 1 במערכת הצירים.")).toContain("y = 2x - 1");
  });

  it("isolates parenthesised algebraic factors", () => {
    expect(isolated("פרקו לגורמים: (x + 3)(x - 5)")).toContain("(x + 3)(x - 5)");
  });

  it("isolates a negative number inside a Hebrew sentence", () => {
    expect(isolated("הטמפרטורה ירדה אל -7 מעלות.")).toContain("-7");
  });

  it("isolates a ratio", () => {
    expect(isolated("היחס בין הצלעות הוא 3 : 4 במשולש.")).toContain("3 : 4");
  });

  it("does not treat a Hebrew conjunction prefix as a negative number", () => {
    expect(isolated("שתי זוויות הן 44° ו-71°")).not.toContain("-71");
  });

  it("leaves plain Hebrew untouched", () => {
    const segments = splitMathSegments("מהו הממוצע של המספרים?");
    expect(segments).toHaveLength(1);
    expect(segments[0].isolated).toBe(false);
  });

  it("reassembles every segment back into the original text", () => {
    const source = "הישר עובר דרך (1, 2) ו-(3, 6). מהו שיפועו? y = 2x + 1";
    expect(splitMathSegments(source).map((segment) => segment.text).join("")).toBe(source);
  });
});

describe("every prompt in the registry", () => {
  it("reassembles losslessly", () => {
    for (const generator of generators) {
      for (const level of [1, 2, 3] as Level[]) {
        for (const problem of generator.generate({ seed: 4242, count: 8, level })) {
          const joined = splitMathSegments(problem.prompt)
            .map((segment) => segment.text)
            .join("");
          expect(joined, `${generator.id}: ${problem.prompt}`).toBe(problem.prompt);
        }
      }
    }
  });
});
