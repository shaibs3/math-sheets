import { describe, expect, it } from "vitest";
import { buildMixedSheet, sliceBySkill, type MixedSpec } from "../mixed";
import grade6Topics from "../curriculum/grade6";
import { dueSkills, emptyProgress, gradeAttempt, topicStatus } from "./schedule";
import type { ProgressState } from "./types";

const day = 24 * 60 * 60 * 1000;
const start = new Date("2026-09-04T09:00:00.000Z");

const mivdakSpecs: MixedSpec[] = grade6Topics.map((topic) => ({
  topicId: topic.id,
  generatorId: topic.generatorId,
  level: 1,
  count: 2,
}));

function markSheet(
  state: ProgressState,
  specs: MixedSpec[],
  skillIds: string[],
  wrong: number[],
  now: Date,
): ProgressState {
  return sliceBySkill(specs, skillIds, wrong).reduce(
    (current, slice) =>
      gradeAttempt(
        current,
        { topicId: slice.topicId, level: slice.level, seed: 1, count: slice.count, wrong: slice.wrong },
        now,
      ),
    state,
  );
}

describe("diagnostic to review loop", () => {
  it("turns marked mistakes into tomorrow's review sheet", () => {
    const mivdak = buildMixedSheet(mivdakSpecs, 240601);
    expect(mivdak.problems).toHaveLength(grade6Topics.length * 2);

    const failedIndexes = mivdak.skillIds.flatMap((id, index) =>
      id.startsWith("achuzim") || id.startsWith("yachas") ? [index] : [],
    );
    const state = markSheet(emptyProgress(), mivdakSpecs, mivdak.skillIds, failedIndexes, start);

    expect(topicStatus(state, "achuzim", start)).toBe("learning");
    expect(topicStatus(state, "kefel-shvarim", start)).toBe("learning");

    const tomorrow = new Date(start.getTime() + day);
    expect(topicStatus(state, "achuzim", tomorrow)).toBe("due");
    expect(topicStatus(state, "kefel-shvarim", tomorrow)).toBe("learning");
    const due = dueSkills(state, tomorrow).map((skill) => skill.topicId);
    expect(due).toContain("achuzim");
    expect(due).toContain("yachas");
    expect(due).not.toContain("kefel-shvarim");

    const reviewSpecs: MixedSpec[] = dueSkills(state, tomorrow).slice(0, 5).flatMap((skill) => {
      const topic = grade6Topics.find((candidate) => candidate.id === skill.topicId);
      return topic
        ? [{ topicId: topic.id, generatorId: topic.generatorId, level: skill.level, count: 4 }]
        : [];
    });

    const review = buildMixedSheet(reviewSpecs, 260905);
    expect(review.problems).toHaveLength(8);
    expect(new Set(review.skillIds)).toEqual(new Set(["achuzim:1", "yachas:1"]));
  });

  it("gives fresh problems on review rather than repeating the diagnostic", () => {
    const specs: MixedSpec[] = [mivdakSpecs[5]];
    const mivdak = buildMixedSheet(specs, 240601);
    const review = buildMixedSheet([{ ...specs[0], count: 4 }], 260905);
    expect(review.problems).not.toContainEqual(mivdak.problems[0]);
  });

  it("stops asking for a skill once it is answered correctly enough times", () => {
    const specs: MixedSpec[] = [{ ...mivdakSpecs[0], count: 4 }];
    let state = emptyProgress();
    let now = start;

    for (let round = 0; round < 5; round++) {
      const sheet = buildMixedSheet(specs, 1000 + round);
      state = markSheet(state, specs, sheet.skillIds, [], now);
      now = new Date(now.getTime() + 40 * day);
    }

    expect(topicStatus(state, specs[0].topicId, now)).toBe("due");
    expect(dueSkills(state, new Date(start.getTime() + 5 * day))).toHaveLength(0);
  });
});
