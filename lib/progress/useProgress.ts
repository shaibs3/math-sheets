"use client";

import { useCallback, useSyncExternalStore } from "react";
import { emptyProgress, gradeAttempt } from "./schedule";
import { STORAGE_KEY, browserStorage, parseProgress, saveProgress } from "./store";
import type { AttemptInput, ProgressState } from "./types";

const listeners = new Set<() => void>();
const serverState = emptyProgress();

let cachedRaw: string | null = null;
let cachedState: ProgressState = serverState;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot(): ProgressState {
  const raw = browserStorage()?.getItem(STORAGE_KEY) ?? null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parseProgress(raw);
  }
  return cachedState;
}

function getServerSnapshot(): ProgressState {
  return serverState;
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const replace = useCallback((next: ProgressState) => {
    const storage = browserStorage();
    if (storage) saveProgress(storage, next);
    notify();
  }, []);

  const record = useCallback(
    (attempts: AttemptInput[], now = new Date()) => {
      replace(attempts.reduce((current, attempt) => gradeAttempt(current, attempt, now), getSnapshot()));
    },
    [replace],
  );

  return { state, mounted, record, replace };
}
