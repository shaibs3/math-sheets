import { describe, expect, it } from "vitest";
import generators, { getGenerator } from "./index";
import { grade6Topics } from "../curriculum/grade6";
import type { Level } from "../types";

const levels: Level[] = [1, 2, 3];

describe("generator registry", () => {
  it("has a generator for every grade 6 topic", () => {
    for (const topic of grade6Topics) {
      expect(getGenerator(topic.generatorId), topic.id).toBeDefined();
    }
  });
});

describe.each(generators)("$id", (generator) => {
  it.each(levels)("produces the requested count at level %i", (level) => {
    const problems = generator.generate({ seed: 12345, count: 12, level });
    expect(problems).toHaveLength(12);
    for (const problem of problems) {
      expect(problem.prompt.length).toBeGreaterThan(0);
      expect(problem.answer.length).toBeGreaterThan(0);
      expect(problem.answer).not.toMatch(/NaN|Infinity|undefined/);
      expect(problem.prompt).not.toMatch(/NaN|Infinity|undefined/);
    }
  });

  it("is deterministic for the same seed", () => {
    const options = { seed: 777, count: 20, level: 2 as Level };
    expect(generator.generate(options)).toEqual(generator.generate(options));
  });

  it("differs for a different seed", () => {
    const a = generator.generate({ seed: 1, count: 20, level: 2 });
    const b = generator.generate({ seed: 2, count: 20, level: 2 });
    expect(a).not.toEqual(b);
  });
});
