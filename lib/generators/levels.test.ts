import { describe, expect, it } from "vitest";
import generators from "./index";
import type { Level } from "../types";

describe("every generator", () => {
  it("produces a different sheet at each level", () => {
    for (const generator of generators) {
      const [easy, medium, hard] = ([1, 2, 3] as Level[]).map((level) =>
        JSON.stringify(
          generator.generate({ seed: 4242, count: 20, level }).map((problem) => problem.prompt),
        ),
      );

      expect(easy, `${generator.id}: level 1 and 2 are identical`).not.toBe(medium);
      expect(medium, `${generator.id}: level 2 and 3 are identical`).not.toBe(hard);
    }
  });
});
