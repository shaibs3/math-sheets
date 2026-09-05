import type { Level, Topic } from "./types";

export const ALL_LEVELS: readonly Level[] = [1, 2, 3];

type LevelAware = Pick<Topic, "levels">;

function isLevel(value: unknown): value is Level {
  return value === 1 || value === 2 || value === 3;
}

export function topicLevels(topic: LevelAware | undefined): Level[] {
  const declared = topic?.levels?.filter(isLevel) ?? [];
  const unique = [...new Set(declared)].sort((a, b) => a - b);
  return unique.length > 0 ? unique : [...ALL_LEVELS];
}

export function defaultLevel(topic: LevelAware | undefined): Level {
  return topicLevels(topic)[0];
}

export function clampLevel(topic: LevelAware | undefined, requested: unknown): Level {
  const allowed = topicLevels(topic);
  if (isLevel(requested) && allowed.includes(requested)) return requested;

  const rounded = Math.round(Number(requested));
  if (!Number.isFinite(rounded)) return allowed[0];

  return allowed.reduce((best, current) =>
    Math.abs(current - rounded) < Math.abs(best - rounded) ? current : best,
  );
}

export function supportsLevel(topic: LevelAware | undefined, level: Level): boolean {
  return topicLevels(topic).includes(level);
}
