import { describe, expect, it } from "vitest";
import { buildMixedSheet, sliceBySkill, type MixedSpec } from "./mixed";

const specs: MixedSpec[] = [
  { topicId: "kefel-shvarim", generatorId: "fractions-multiply", level: 1, count: 3 },
  { topicId: "achuzim", generatorId: "percent", level: 2, count: 3 },
  { topicId: "yachas", generatorId: "ratio", level: 1, count: 2 },
];

describe("buildMixedSheet", () => {
  it("returns one problem per requested exercise", () => {
    const sheet = buildMixedSheet(specs, 999);
    expect(sheet.problems).toHaveLength(8);
    expect(sheet.skillIds).toHaveLength(8);
  });

  it("interleaves topics so consecutive problems come from different skills", () => {
    const { skillIds } = buildMixedSheet(specs, 999);
    expect(skillIds.slice(0, 3)).toEqual(["kefel-shvarim:1", "achuzim:2", "yachas:1"]);
    expect(skillIds.slice(3, 6)).toEqual(["kefel-shvarim:1", "achuzim:2", "yachas:1"]);
  });

  it("keeps producing problems after a shorter lane runs out", () => {
    const { skillIds } = buildMixedSheet(specs, 999);
    expect(skillIds.slice(6)).toEqual(["kefel-shvarim:1", "achuzim:2"]);
  });

  it("is deterministic for the same seed and differs for another", () => {
    expect(buildMixedSheet(specs, 42)).toEqual(buildMixedSheet(specs, 42));
    expect(buildMixedSheet(specs, 42)).not.toEqual(buildMixedSheet(specs, 43));
  });

  it("gives each lane different problems than its neighbours", () => {
    const same: MixedSpec[] = [
      { topicId: "a", generatorId: "fractions-multiply", level: 1, count: 4 },
      { topicId: "b", generatorId: "fractions-multiply", level: 1, count: 4 },
    ];
    const { problems } = buildMixedSheet(same, 7);
    expect(problems[0]).not.toEqual(problems[1]);
  });

  it("ignores unknown generators and empty lanes", () => {
    const sheet = buildMixedSheet(
      [
        { topicId: "ghost", generatorId: "does-not-exist", level: 1, count: 5 },
        { topicId: "yachas", generatorId: "ratio", level: 1, count: 2 },
        { topicId: "empty", generatorId: "percent", level: 1, count: 0 },
      ],
      3,
    );
    expect(sheet.problems).toHaveLength(2);
    expect(new Set(sheet.skillIds)).toEqual(new Set(["yachas:1"]));
  });

  it("uses the narrowest column count of the lanes it mixes", () => {
    expect(buildMixedSheet(specs, 1).columns).toBe(1);
    expect(buildMixedSheet([specs[0]], 1).columns).toBe(2);
  });
});

describe("sliceBySkill", () => {
  it("attributes each wrong index to the skill that produced it", () => {
    const { skillIds } = buildMixedSheet(specs, 999);
    const slices = sliceBySkill(specs, skillIds, [0, 1, 7]);

    expect(slices).toEqual([
      { topicId: "kefel-shvarim", level: 1, count: 3, wrong: [0] },
      { topicId: "achuzim", level: 2, count: 3, wrong: [1, 7] },
      { topicId: "yachas", level: 1, count: 2, wrong: [] },
    ]);
  });

  it("drops skills that contributed no problems", () => {
    const { skillIds } = buildMixedSheet(specs, 5);
    const slices = sliceBySkill(
      [...specs, { topicId: "nefach", generatorId: "volume", level: 1, count: 0 }],
      skillIds,
      [],
    );
    expect(slices.map((slice) => slice.topicId)).toEqual([
      "kefel-shvarim",
      "achuzim",
      "yachas",
    ]);
  });
});
