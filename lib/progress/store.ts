import { migrateLegacy } from "./migrate";
import { emptyProgress } from "./schedule";
import type { AttemptEvent, Profile, ProgressState } from "./types";

export const STORAGE_KEY = "math-sheets:v2";
export const LEGACY_STORAGE_KEY = "math-sheets:v1";

export type ProgressStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function isProgressState(value: unknown): value is ProgressState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ProgressState>;
  return (
    candidate.version === 2 &&
    Array.isArray(candidate.profiles) &&
    Array.isArray(candidate.events) &&
    typeof candidate.activeProfileId === "string"
  );
}

export function parseProgress(raw: string | null): ProgressState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function loadProgress(storage: ProgressStorage): ProgressState {
  return (
    parseProgress(storage.getItem(STORAGE_KEY)) ??
    migrateLegacy(storage.getItem(LEGACY_STORAGE_KEY)) ??
    emptyProgress()
  );
}

export function saveProgress(storage: ProgressStorage, state: ProgressState): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function unionById<T extends { id: string }>(local: T[], incoming: T[]): T[] {
  const merged = new Map(local.map((item) => [item.id, item]));
  for (const item of incoming) {
    if (!merged.has(item.id)) merged.set(item.id, item);
  }
  return [...merged.values()];
}

export function mergeProgress(local: ProgressState, incoming: ProgressState): ProgressState {
  const profiles: Profile[] = unionById(local.profiles, incoming.profiles);
  const events: AttemptEvent[] = unionById(local.events, incoming.events);

  return {
    version: 2,
    profiles,
    activeProfileId:
      profiles.some((profile) => profile.id === local.activeProfileId) && local.activeProfileId
        ? local.activeProfileId
        : (profiles[0]?.id ?? ""),
    events,
  };
}

export function browserStorage(): ProgressStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
