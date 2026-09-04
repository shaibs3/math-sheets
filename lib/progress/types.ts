import type { Level } from "../types";

export type SkillId = string;

export type SkillState = {
  skillId: SkillId;
  topicId: string;
  level: Level;
  box: number;
  dueAt: string;
  lastSeenAt: string;
  seenCount: number;
  wrongCount: number;
};

export type Attempt = {
  at: string;
  topicId: string;
  level: Level;
  seed: number;
  count: number;
  wrong: number[];
};

export type ProgressState = {
  version: 1;
  childName?: string;
  skills: Record<SkillId, SkillState>;
  attempts: Attempt[];
};

export type SkillStatus = "new" | "due" | "learning" | "strong";

export type AttemptInput = {
  topicId: string;
  level: Level;
  seed: number;
  count: number;
  wrong: number[];
};
