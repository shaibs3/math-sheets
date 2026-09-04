import type { Level } from "../types";
import type {
  AttemptEvent,
  Profile,
  ProgressState,
  SkillId,
  SkillState,
  SkillStatus,
  Skills,
} from "./types";

export const INTERVALS_IN_DAYS = [1, 3, 7, 14, 30];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function skillId(topicId: string, level: Level): SkillId {
  return `${topicId}:${level}`;
}

export function emptyProgress(): ProgressState {
  return { version: 2, profiles: [], activeProfileId: "", events: [] };
}

export function createProfile(id: string, nickname: string, createdAt: string): Profile {
  return { id, nickname: nickname.trim() || "ילד/ה", createdAt };
}

function addDays(from: Date, days: number): string {
  return new Date(from.getTime() + days * DAY_IN_MS).toISOString();
}

function nextBox(box: number, accuracy: number): number {
  if (accuracy >= 0.8) return Math.min(box + 1, INTERVALS_IN_DAYS.length - 1);
  if (accuracy >= 0.5) return box;
  return 0;
}

function applyEvent(skills: Skills, event: AttemptEvent): Skills {
  const id = skillId(event.topicId, event.level);
  const previous = skills[id];
  const accuracy = event.count > 0 ? 1 - event.wrong.length / event.count : 0;
  const box = nextBox(previous?.box ?? 0, accuracy);
  const at = new Date(event.at);

  return {
    ...skills,
    [id]: {
      skillId: id,
      topicId: event.topicId,
      level: event.level,
      box,
      dueAt: addDays(at, INTERVALS_IN_DAYS[box]),
      lastSeenAt: event.at,
      seenCount: (previous?.seenCount ?? 0) + event.count,
      wrongCount: (previous?.wrongCount ?? 0) + event.wrong.length,
    },
  };
}

export function deriveSkills(events: AttemptEvent[]): Skills {
  return [...events]
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .reduce(applyEvent, {} as Skills);
}

export function eventsForProfile(state: ProgressState, profileId: string): AttemptEvent[] {
  return state.events.filter((event) => event.profileId === profileId);
}

export function dueSkills(skills: Skills, now: Date): SkillState[] {
  return Object.values(skills)
    .filter((skill) => new Date(skill.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function skillStatus(skill: SkillState | undefined, now: Date): SkillStatus {
  if (!skill) return "new";
  if (new Date(skill.dueAt).getTime() <= now.getTime()) return "due";
  return skill.box >= INTERVALS_IN_DAYS.length - 1 ? "strong" : "learning";
}

export function topicStatus(skills: Skills, topicId: string, now: Date): SkillStatus {
  const statuses = Object.values(skills)
    .filter((skill) => skill.topicId === topicId)
    .map((skill) => skillStatus(skill, now));

  if (statuses.length === 0) return "new";
  if (statuses.includes("due")) return "due";
  if (statuses.every((status) => status === "strong")) return "strong";
  return "learning";
}

export function weakestSkills(skills: Skills, limit: number): SkillState[] {
  return Object.values(skills)
    .filter((skill) => skill.seenCount > 0)
    .sort((a, b) => {
      const byWrongRate = b.wrongCount / b.seenCount - a.wrongCount / a.seenCount;
      if (byWrongRate !== 0) return byWrongRate;
      return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    })
    .slice(0, limit);
}

export function nextDueAt(skills: Skills, now: Date): Date | null {
  const upcoming = Object.values(skills)
    .map((skill) => new Date(skill.dueAt))
    .filter((date) => date.getTime() > now.getTime())
    .sort((a, b) => a.getTime() - b.getTime());
  return upcoming[0] ?? null;
}

export function daysUntil(target: Date, now: Date): number {
  return Math.max(1, Math.ceil((target.getTime() - now.getTime()) / DAY_IN_MS));
}

export function accuracyFor(skills: Skills, topicId: string): number | null {
  const forTopic = Object.values(skills).filter((skill) => skill.topicId === topicId);
  const seen = forTopic.reduce((total, skill) => total + skill.seenCount, 0);
  if (seen === 0) return null;
  const wrong = forTopic.reduce((total, skill) => total + skill.wrongCount, 0);
  return 1 - wrong / seen;
}
