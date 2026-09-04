import { getGenerator } from "./generators";
import { skillId } from "./progress/schedule";
import type { Level, Problem } from "./types";

export type MixedSpec = {
  topicId: string;
  generatorId: string;
  level: Level;
  count: number;
};

export type MixedSheet = {
  problems: Problem[];
  skillIds: string[];
  columns: 1 | 2 | 3 | 4;
};

export type SkillSlice = {
  topicId: string;
  level: Level;
  count: number;
  wrong: number[];
};

const SEED_STRIDE = 7919;

export function buildMixedSheet(specs: MixedSpec[], seed: number): MixedSheet {
  const lanes = specs.flatMap((spec, index) => {
    const generator = getGenerator(spec.generatorId);
    if (!generator || spec.count < 1) return [];
    return [
      {
        spec,
        columns: generator.columns,
        problems: generator.generate({
          seed: seed + index * SEED_STRIDE,
          count: spec.count,
          level: spec.level,
        }),
      },
    ];
  });

  const problems: Problem[] = [];
  const skillIds: string[] = [];
  const longest = Math.max(0, ...lanes.map((lane) => lane.problems.length));

  for (let round = 0; round < longest; round++) {
    for (const lane of lanes) {
      const problem = lane.problems[round];
      if (!problem) continue;
      problems.push(problem);
      skillIds.push(skillId(lane.spec.topicId, lane.spec.level));
    }
  }

  const columns = lanes.length
    ? (Math.min(...lanes.map((lane) => lane.columns)) as 1 | 2 | 3 | 4)
    : 1;

  return { problems, skillIds, columns };
}

export function sliceBySkill(specs: MixedSpec[], skillIds: string[], wrong: number[]): SkillSlice[] {
  const wrongSet = new Set(wrong);

  return specs
    .map((spec) => {
      const id = skillId(spec.topicId, spec.level);
      const indexes = skillIds.flatMap((current, index) => (current === id ? [index] : []));
      return {
        topicId: spec.topicId,
        level: spec.level,
        count: indexes.length,
        wrong: indexes.filter((index) => wrongSet.has(index)),
      };
    })
    .filter((slice) => slice.count > 0);
}
