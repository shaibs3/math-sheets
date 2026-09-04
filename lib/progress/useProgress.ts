"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createProfile, deriveSkills, emptyProgress, eventsForProfile } from "./schedule";
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  browserStorage,
  parseProgress,
  saveProgress,
} from "./store";
import { migrateLegacy } from "./migrate";
import type { AttemptEvent, AttemptInput, ProgressState } from "./types";

const listeners = new Set<() => void>();
const serverState = emptyProgress();

let cachedRaw: string | null = null;
let cachedState: ProgressState = serverState;
let fallbackIds = 0;

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
  const storage = browserStorage();
  if (!storage) return serverState;

  const raw = storage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState =
      parseProgress(raw) ?? migrateLegacy(storage.getItem(LEGACY_STORAGE_KEY)) ?? emptyProgress();
  }
  return cachedState;
}

function getServerSnapshot(): ProgressState {
  return serverState;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  fallbackIds += 1;
  return `local-${Date.now()}-${fallbackIds}`;
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const persist = useCallback((next: ProgressState) => {
    const storage = browserStorage();
    if (storage) saveProgress(storage, next);
    notify();
  }, []);

  const activeProfile = useMemo(
    () => state.profiles.find((profile) => profile.id === state.activeProfileId),
    [state.profiles, state.activeProfileId],
  );

  const skills = useMemo(
    () => deriveSkills(activeProfile ? eventsForProfile(state, activeProfile.id) : []),
    [state, activeProfile],
  );

  const addProfile = useCallback(
    (nickname: string) => {
      const profile = createProfile(newId(), nickname, new Date().toISOString());
      persist({
        ...getSnapshot(),
        profiles: [...getSnapshot().profiles, profile],
        activeProfileId: profile.id,
      });
      return profile;
    },
    [persist],
  );

  const record = useCallback(
    (attempts: AttemptInput[], now = new Date()) => {
      const profileId = getSnapshot().activeProfileId || addProfile("ילד/ה").id;
      const latest = getSnapshot();

      const events: AttemptEvent[] = attempts.map((attempt) => ({
        id: newId(),
        profileId,
        at: now.toISOString(),
        ...attempt,
      }));

      persist({ ...latest, events: [...latest.events, ...events] });
    },
    [addProfile, persist],
  );

  const switchProfile = useCallback(
    (profileId: string) => {
      persist({ ...getSnapshot(), activeProfileId: profileId });
    },
    [persist],
  );

  const renameProfile = useCallback(
    (profileId: string, nickname: string) => {
      const current = getSnapshot();
      persist({
        ...current,
        profiles: current.profiles.map((profile) =>
          profile.id === profileId ? { ...profile, nickname: nickname.trim() || profile.nickname } : profile,
        ),
      });
    },
    [persist],
  );

  const removeProfile = useCallback(
    (profileId: string) => {
      const current = getSnapshot();
      const profiles = current.profiles.filter((profile) => profile.id !== profileId);
      persist({
        ...current,
        profiles,
        events: current.events.filter((event) => event.profileId !== profileId),
        activeProfileId:
          current.activeProfileId === profileId ? (profiles[0]?.id ?? "") : current.activeProfileId,
      });
    },
    [persist],
  );

  const replace = useCallback(
    (next: ProgressState) => {
      persist(next);
    },
    [persist],
  );

  return {
    state,
    mounted,
    skills,
    profiles: state.profiles,
    activeProfile,
    record,
    addProfile,
    switchProfile,
    renameProfile,
    removeProfile,
    replace,
  };
}
