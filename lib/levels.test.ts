import { describe, expect, it } from "vitest";
import { grades, getTopic } from "./curriculum";
import { ALL_LEVELS, clampLevel, defaultLevel, supportsLevel, topicLevels } from "./levels";
import { getGenerator } from "./generators";
import { buildMixedSheet, sliceBySkill, type MixedSpec } from "./mixed";
import { skillId } from "./progress/schedule";
import type { Level, Topic } from "./types";

const capped = (levels: Level[]): Pick<Topic, "levels"> => ({ levels });

describe("topicLevels", () => {
  it("defaults to every level when the topic declares nothing", () => {
    expect(topicLevels({})).toEqual([...ALL_LEVELS]);
    expect(topicLevels(undefined)).toEqual([...ALL_LEVELS]);
    expect(topicLevels({ levels: [] })).toEqual([...ALL_LEVELS]);
  });

  it("sorts and dedupes declared levels", () => {
    expect(topicLevels(capped([3, 1, 1]))).toEqual([1, 3]);
  });
});

describe("clampLevel", () => {
  it("keeps a supported level untouched", () => {
    for (const level of ALL_LEVELS) {
      expect(clampLevel(capped([1, 2, 3]), level)).toBe(level);
    }
    expect(clampLevel(capped([1, 2]), 2)).toBe(2);
  });

  it("pulls an unsupported level down to the nearest supported one", () => {
    expect(clampLevel(capped([1, 2]), 3)).toBe(2);
    expect(clampLevel(capped([1]), 3)).toBe(1);
    expect(clampLevel(capped([2, 3]), 1)).toBe(2);
  });

  it("prefers the easier level on a tie", () => {
    expect(clampLevel(capped([1, 3]), 2)).toBe(1);
  });

  it("falls back to the easiest supported level for junk input", () => {
    expect(clampLevel(capped([2, 3]), Number.NaN)).toBe(2);
    expect(clampLevel(capped([2, 3]), undefined)).toBe(2);
    expect(clampLevel({}, Number.NaN)).toBe(1);
  });

  it("clamps out-of-range numbers into the supported set", () => {
    expect(clampLevel({}, 9)).toBe(3);
    expect(clampLevel({}, -4)).toBe(1);
    expect(clampLevel(capped([1, 2]), 99)).toBe(2);
  });

  it("always returns a level the topic supports", () => {
    for (const grade of grades) {
      for (const topic of grade.topics) {
        for (const requested of [-1, 0, 1, 2, 3, 4, 17, Number.NaN]) {
          expect(supportsLevel(topic, clampLevel(topic, requested))).toBe(true);
        }
      }
    }
  });
});

describe("curriculum level declarations", () => {
  it("declares only real levels and never an empty list", () => {
    for (const grade of grades) {
      for (const topic of grade.topics) {
        if (!topic.levels) continue;
        expect(topic.levels.length).toBeGreaterThan(0);
        for (const level of topic.levels) expect(ALL_LEVELS).toContain(level);
      }
    }
  });

  it("caps the grade 1 clock below the grade 2 clock", () => {
    const grade1Clock = getTopic(1, "shaon");
    const grade2Clock = getTopic(2, "shaon");
    expect(topicLevels(grade1Clock)).toEqual([1, 2]);
    expect(topicLevels(grade2Clock)).toEqual([2, 3]);
    expect(supportsLevel(grade1Clock, 3)).toBe(false);
    expect(clampLevel(grade1Clock, 3)).toBe(2);
  });

  it("starts the grade 2 clock at half hours so the default sheet is not whole hours", () => {
    expect(defaultLevel(getTopic(2, "shaon"))).toBe(2);
    expect(supportsLevel(getTopic(2, "shaon"), 3)).toBe(true);
  });

  it("never lets a shared generator expose the harder grade's level to the younger grade", () => {
    const byGenerator = new Map<string, { gradeId: number; levels: Level[] }[]>();
    for (const grade of grades) {
      for (const topic of grade.topics) {
        const entries = byGenerator.get(topic.generatorId) ?? [];
        entries.push({ gradeId: grade.id, levels: topicLevels(topic) });
        byGenerator.set(topic.generatorId, entries);
      }
    }

    const shared = [...byGenerator.entries()].filter(([, entries]) => entries.length > 1);
    expect(shared.length).toBeGreaterThan(0);

    for (const [, entries] of shared) {
      const sorted = [...entries].sort((a, b) => a.gradeId - b.gradeId);
      for (let i = 1; i < sorted.length; i++) {
        const younger = Math.max(...sorted[i - 1].levels);
        const older = Math.max(...sorted[i].levels);
        expect(younger).toBeLessThanOrEqual(older);
      }
    }
  });
});

describe("mivdak level selection", () => {
  const mivdakSpecs = (gradeId: number, requested: number): MixedSpec[] => {
    const grade = grades.find((current) => current.id === gradeId);
    if (!grade) return [];
    return grade.topics.map((topic) => ({
      topicId: topic.id,
      generatorId: topic.generatorId,
      level: clampLevel(topic, requested),
      count: 2,
    }));
  };

  it("gives each topic a level it supports, whatever the sheet asks for", () => {
    for (const grade of grades) {
      for (const requested of [1, 2, 3, 8]) {
        for (const spec of mivdakSpecs(grade.id, requested)) {
          const topic = getTopic(grade.id, spec.topicId);
          expect(supportsLevel(topic, spec.level)).toBe(true);
        }
      }
    }
  });

  it("downgrades only the capped topics and leaves the rest at the requested level", () => {
    const specs = mivdakSpecs(1, 3);
    const clock = specs.find((spec) => spec.topicId === "shaon");
    const evenOdd = specs.find((spec) => spec.topicId === "zugi-i-zugi");
    expect(clock?.level).toBe(2);
    expect(evenOdd?.level).toBe(3);
  });

  it("still builds a full sheet after clamping", () => {
    const specs = mivdakSpecs(1, 3);
    const sheet = buildMixedSheet(specs, 4242);
    expect(sheet.problems.length).toBe(specs.length * 2);
    expect(sheet.skillIds).toEqual(
      expect.arrayContaining([skillId("shaon", 2)]),
    );
    expect(sheet.skillIds).not.toContain(skillId("shaon", 3));
  });
});

describe("review sheet replay of stored skills", () => {
  const replay = (gradeId: number, stored: { topicId: string; level: Level }[]): MixedSpec[] => {
    const taken = new Set<string>();
    return stored.flatMap((skill) => {
      const topic = getTopic(gradeId, skill.topicId);
      if (!topic) return [];
      const level = clampLevel(topic, skill.level);
      const key = `${topic.id}:${level}`;
      if (taken.has(key)) return [];
      taken.add(key);
      return [{ topicId: topic.id, generatorId: topic.generatorId, level, count: 4 }];
    });
  };

  it("degrades a stored skill whose level the topic no longer allows", () => {
    const specs = replay(1, [{ topicId: "shaon", level: 3 }]);
    expect(specs).toHaveLength(1);
    expect(specs[0].level).toBe(2);
    const sheet = buildMixedSheet(specs, 99);
    expect(sheet.problems).toHaveLength(4);
    expect(new Set(sheet.skillIds)).toEqual(new Set([skillId("shaon", 2)]));
  });

  it("collapses two stored levels that clamp to the same one instead of duplicating a lane", () => {
    const specs = replay(1, [
      { topicId: "shaon", level: 2 },
      { topicId: "shaon", level: 3 },
    ]);
    expect(specs).toHaveLength(1);
    const sheet = buildMixedSheet(specs, 5);
    const slices = sliceBySkill(specs, sheet.skillIds, [0]);
    expect(slices).toHaveLength(1);
    expect(slices[0]).toMatchObject({ topicId: "shaon", level: 2, count: 4 });
  });

  it("drops a stored skill whose topic left the grade", () => {
    expect(replay(1, [{ topicId: "achuzim", level: 1 }])).toEqual([]);
  });

  it("never replays an unsupported level for any grade or stored level", () => {
    for (const grade of grades) {
      for (const topic of grade.topics) {
        for (const level of ALL_LEVELS) {
          const specs = replay(grade.id, [{ topicId: topic.id, level }]);
          expect(specs).toHaveLength(1);
          expect(supportsLevel(topic, specs[0].level)).toBe(true);
        }
      }
    }
  });
});

describe("determinism is unaffected by clamping", () => {
  it("produces identical problems for the clamped level and that level asked for directly", () => {
    const topic = getTopic(1, "shaon");
    const generator = getGenerator(topic!.generatorId);
    const viaClamp = generator!.generate({
      seed: 777,
      count: 6,
      level: clampLevel(topic, 3),
    });
    const direct = generator!.generate({ seed: 777, count: 6, level: 2 });
    expect(viaClamp).toEqual(direct);
  });

  it("keeps defaultLevel as the easiest supported level", () => {
    expect(defaultLevel(getTopic(1, "shaon"))).toBe(1);
    expect(defaultLevel(capped([2, 3]))).toBe(2);
  });
});
