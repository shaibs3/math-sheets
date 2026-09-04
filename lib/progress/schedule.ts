import type { Level } from "../types";
import type { AttemptInput, ProgressState, SkillId, SkillState, SkillStatus } from "./types";

export const INTERVALS_IN_DAYS = [1, 3, 7, 14, 30];
export const MAX_ATTEMPTS = 200;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function skillId(topicId: string, level: Level): SkillId {
  return `${topicId}:${level}`;
}

export function emptyProgress(): ProgressState {
  return { version: 1, skills: {}, attempts: [] };
}

function addDays(now: Date, days: number): string {
  return new Date(now.getTime() + days * DAY_IN_MS).toISOString();
}

function nextBox(box: number, accuracy: number): number {
  if (accuracy >= 0.8) return Math.min(box + 1, INTERVALS_IN_DAYS.length - 1);
  if (accuracy >= 0.5) return box;
  return 0;
}

export function gradeAttempt(
  state: ProgressState,
  attempt: AttemptInput,
  now: Date,
): ProgressState {
  const id = skillId(attempt.topicId, attempt.level);
  const previous = state.skills[id];
  const accuracy = attempt.count > 0 ? 1 - attempt.wrong.length / attempt.count : 0;
  const box = nextBox(previous?.box ?? 0, accuracy);

  const skill: SkillState = {
    skillId: id,
    topicId: attempt.topicId,
    level: attempt.level,
    box,
    dueAt: addDays(now, INTERVALS_IN_DAYS[box]),
    lastSeenAt: now.toISOString(),
    seenCount: (previous?.seenCount ?? 0) + attempt.count,
    wrongCount: (previous?.wrongCount ?? 0) + attempt.wrong.length,
  };

  return {
    ...state,
    skills: { ...state.skills, [id]: skill },
    attempts: [{ at: now.toISOString(), ...attempt }, ...state.attempts].slice(0, MAX_ATTEMPTS),
  };
}

export function dueSkills(state: ProgressState, now: Date): SkillState[] {
  return Object.values(state.skills)
    .filter((skill) => new Date(skill.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function skillStatus(skill: SkillState | undefined, now: Date): SkillStatus {
  if (!skill) return "new";
  if (new Date(skill.dueAt).getTime() <= now.getTime()) return "due";
  return skill.box >= INTERVALS_IN_DAYS.length - 1 ? "strong" : "learning";
}

export function topicStatus(state: ProgressState, topicId: string, now: Date): SkillStatus {
  const statuses = Object.values(state.skills)
    .filter((skill) => skill.topicId === topicId)
    .map((skill) => skillStatus(skill, now));

  if (statuses.length === 0) return "new";
  if (statuses.includes("due")) return "due";
  if (statuses.every((status) => status === "strong")) return "strong";
  return "learning";
}

export function weakestSkills(state: ProgressState, limit: number): SkillState[] {
  return Object.values(state.skills)
    .filter((skill) => skill.seenCount > 0)
    .sort((a, b) => {
      const byWrongRate = b.wrongCount / b.seenCount - a.wrongCount / a.seenCount;
      if (byWrongRate !== 0) return byWrongRate;
      return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    })
    .slice(0, limit);
}

export function nextDueAt(state: ProgressState, now: Date): Date | null {
  const upcoming = Object.values(state.skills)
    .map((skill) => new Date(skill.dueAt))
    .filter((date) => date.getTime() > now.getTime())
    .sort((a, b) => a.getTime() - b.getTime());
  return upcoming[0] ?? null;
}

export function daysUntil(target: Date, now: Date): number {
  return Math.max(1, Math.ceil((target.getTime() - now.getTime()) / DAY_IN_MS));
}

export function accuracyFor(state: ProgressState, topicId: string): number | null {
  const skills = Object.values(state.skills).filter((skill) => skill.topicId === topicId);
  const seen = skills.reduce((total, skill) => total + skill.seenCount, 0);
  if (seen === 0) return null;
  const wrong = skills.reduce((total, skill) => total + skill.wrongCount, 0);
  return 1 - wrong / seen;
}
