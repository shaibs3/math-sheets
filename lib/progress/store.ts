import { emptyProgress } from "./schedule";
import type { ProgressState } from "./types";

export const STORAGE_KEY = "math-sheets:v1";

export type ProgressStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function isProgressState(value: unknown): value is ProgressState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ProgressState>;
  return (
    candidate.version === 1 &&
    typeof candidate.skills === "object" &&
    candidate.skills !== null &&
    Array.isArray(candidate.attempts)
  );
}

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return emptyProgress();
  try {
    const parsed: unknown = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function loadProgress(storage: ProgressStorage): ProgressState {
  return parseProgress(storage.getItem(STORAGE_KEY));
}

export function saveProgress(storage: ProgressStorage, state: ProgressState): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function browserStorage(): ProgressStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
