import { createProfile, emptyProgress } from "./schedule";
import type { AttemptEvent, LegacyProgressState, ProgressState } from "./types";

export const LEGACY_PROFILE_ID = "legacy";

function isLegacyState(value: unknown): value is LegacyProgressState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<LegacyProgressState>;
  return candidate.version === 1 && Array.isArray(candidate.attempts);
}

export function migrateLegacy(raw: string | null): ProgressState | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isLegacyState(parsed)) return null;

  const oldestFirst = [...parsed.attempts].reverse();
  const events: AttemptEvent[] = oldestFirst.map((attempt, index) => ({
    id: `legacy-${index}`,
    profileId: LEGACY_PROFILE_ID,
    at: attempt.at,
    topicId: attempt.topicId,
    level: attempt.level,
    seed: attempt.seed,
    count: attempt.count,
    wrong: attempt.wrong,
  }));

  const createdAt = events[0]?.at ?? new Date(0).toISOString();

  return {
    ...emptyProgress(),
    profiles: [createProfile(LEGACY_PROFILE_ID, parsed.childName ?? "ילד/ה", createdAt)],
    activeProfileId: LEGACY_PROFILE_ID,
    events,
  };
}
