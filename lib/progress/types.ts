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

export type Skills = Record<SkillId, SkillState>;

export type Profile = {
  id: string;
  nickname: string;
  createdAt: string;
};

export type AttemptEvent = {
  id: string;
  profileId: string;
  at: string;
  topicId: string;
  level: Level;
  seed: number;
  count: number;
  wrong: number[];
};

export type ProgressState = {
  version: 2;
  profiles: Profile[];
  activeProfileId: string;
  events: AttemptEvent[];
};

export type SkillStatus = "new" | "due" | "learning" | "strong";

export type AttemptInput = {
  topicId: string;
  level: Level;
  seed: number;
  count: number;
  wrong: number[];
};

export type LegacyAttempt = {
  at: string;
  topicId: string;
  level: Level;
  seed: number;
  count: number;
  wrong: number[];
};

export type LegacyProgressState = {
  version: 1;
  childName?: string;
  skills: Record<SkillId, SkillState>;
  attempts: LegacyAttempt[];
};
