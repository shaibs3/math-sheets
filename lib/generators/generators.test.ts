import { describe, expect, it } from "vitest";
import generators, { getGenerator } from "./index";
import { getGrade, grades } from "../curriculum";
import { retiredTopics } from "../curriculum/retired-topics";
import type { Level } from "../types";

const levels: Level[] = [1, 2, 3];

describe("generator registry", () => {
  it.each(grades)("has a generator for every topic in $name", (grade) => {
    expect(grade.topics.length).toBeGreaterThan(0);
    for (const topic of grade.topics) {
      expect(getGenerator(topic.generatorId), `${grade.id}/${topic.id}`).toBeDefined();
    }
  });

  it.each(grades)("gives every topic in $name a unique id", (grade) => {
    const ids = grade.topics.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every retired topic at a live replacement", () => {
    for (const { gradeId, retiredTopicId, replacementTopicId } of retiredTopics) {
      const topicIds = getGrade(gradeId)!.topics.map((topic) => topic.id);
      expect(topicIds, retiredTopicId).not.toContain(retiredTopicId);
      expect(topicIds, replacementTopicId).toContain(replacementTopicId);
    }
  });

  it("marks every grade as available", () => {
    for (const grade of grades) {
      expect(grade.available, String(grade.id)).toBe(true);
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
