import { describe, expect, it } from "vitest";
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  loadProgress,
  mergeProgress,
  parseProgress,
  saveProgress,
  type ProgressStorage,
} from "./store";
import { LEGACY_PROFILE_ID, migrateLegacy } from "./migrate";
import { deriveSkills, emptyProgress, skillId } from "./schedule";
import type { AttemptEvent, ProgressState } from "./types";

function fakeStorage(
  initial: Record<string, string> = {},
): ProgressStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

function event(overrides: Partial<AttemptEvent> = {}): AttemptEvent {
  return {
    id: "e1",
    profileId: "p1",
    at: "2026-09-04T09:00:00.000Z",
    topicId: "achuzim",
    level: 2,
    seed: 42,
    count: 10,
    wrong: [3, 7],
    ...overrides,
  };
}

function stateWith(events: AttemptEvent[], activeProfileId = "p1"): ProgressState {
  return {
    version: 2,
    profiles: [{ id: "p1", nickname: "נועה", createdAt: "2026-09-01T00:00:00.000Z" }],
    activeProfileId,
    events,
  };
}

const legacyBlob = JSON.stringify({
  version: 1,
  skills: {
    "achuzim:2": {
      skillId: "achuzim:2",
      topicId: "achuzim",
      level: 2,
      box: 3,
      dueAt: "2026-09-18T09:00:00.000Z",
      lastSeenAt: "2026-09-04T09:00:00.000Z",
      seenCount: 20,
      wrongCount: 2,
    },
  },
  attempts: [
    { at: "2026-09-04T09:00:00.000Z", topicId: "achuzim", level: 2, seed: 2, count: 10, wrong: [1] },
    { at: "2026-09-03T09:00:00.000Z", topicId: "achuzim", level: 2, seed: 1, count: 10, wrong: [] },
  ],
});

describe("progress store", () => {
  it("round-trips state through storage", () => {
    const storage = fakeStorage();
    const state = stateWith([event()]);

    saveProgress(storage, state);

    expect(storage.data[STORAGE_KEY]).toBeDefined();
    expect(loadProgress(storage)).toEqual(state);
  });

  it("returns empty progress for a missing key", () => {
    expect(loadProgress(fakeStorage())).toEqual(emptyProgress());
  });

  it("rejects corrupt or foreign values", () => {
    expect(parseProgress("not json at all")).toBeNull();
    expect(parseProgress('{"version":99,"profiles":[],"events":[]}')).toBeNull();
    expect(parseProgress('{"version":2,"profiles":[]}')).toBeNull();
    expect(parseProgress("null")).toBeNull();
  });
});

describe("legacy migration", () => {
  it("folds v1 progress into one profile with oldest-first stable ids", () => {
    const migrated = migrateLegacy(legacyBlob) as ProgressState;

    expect(migrated.version).toBe(2);
    expect(migrated.profiles).toHaveLength(1);
    expect(migrated.activeProfileId).toBe(LEGACY_PROFILE_ID);
    expect(migrated.events.map((item) => item.id)).toEqual(["legacy-0", "legacy-1"]);
    expect(migrated.events.map((item) => item.at)).toEqual([
      "2026-09-03T09:00:00.000Z",
      "2026-09-04T09:00:00.000Z",
    ]);
    expect(migrated.events.every((item) => item.profileId === LEGACY_PROFILE_ID)).toBe(true);
  });

  it("re-derives skills from the migrated events", () => {
    const migrated = migrateLegacy(legacyBlob) as ProgressState;
    const skills = deriveSkills(migrated.events);
    expect(skills[skillId("achuzim", 2)].seenCount).toBe(20);
    expect(skills[skillId("achuzim", 2)].wrongCount).toBe(1);
  });

  it("is stable when run twice", () => {
    expect(migrateLegacy(legacyBlob)).toEqual(migrateLegacy(legacyBlob));
  });

  it("ignores anything that is not v1 progress", () => {
    expect(migrateLegacy(null)).toBeNull();
    expect(migrateLegacy("garbage")).toBeNull();
    expect(migrateLegacy('{"version":2,"profiles":[],"events":[]}')).toBeNull();
  });

  it("loads legacy data when no v2 key exists, and leaves the v1 key alone", () => {
    const storage = fakeStorage({ [LEGACY_STORAGE_KEY]: legacyBlob });
    const loaded = loadProgress(storage);

    expect(loaded.events).toHaveLength(2);
    expect(storage.data[LEGACY_STORAGE_KEY]).toBe(legacyBlob);
  });

  it("prefers v2 data over legacy data once it exists", () => {
    const storage = fakeStorage({
      [LEGACY_STORAGE_KEY]: legacyBlob,
      [STORAGE_KEY]: JSON.stringify(stateWith([event({ id: "new" })])),
    });
    expect(loadProgress(storage).events.map((item) => item.id)).toEqual(["new"]);
  });
});

describe("mergeProgress", () => {
  it("unions events by id without duplicating", () => {
    const local = stateWith([event({ id: "a" }), event({ id: "b" })]);
    const incoming = stateWith([event({ id: "b" }), event({ id: "c" })]);

    const merged = mergeProgress(local, incoming);
    expect(merged.events.map((item) => item.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("is idempotent — importing the same file twice adds nothing", () => {
    const local = stateWith([event({ id: "a" })]);
    const incoming = stateWith([event({ id: "a" }), event({ id: "b" })]);

    const once = mergeProgress(local, incoming);
    expect(mergeProgress(once, incoming)).toEqual(once);
  });

  it("keeps profiles from both sides and preserves the local active profile", () => {
    const local = stateWith([event({ id: "a" })]);
    const incoming: ProgressState = {
      version: 2,
      profiles: [{ id: "p2", nickname: "יואב", createdAt: "2026-09-02T00:00:00.000Z" }],
      activeProfileId: "p2",
      events: [event({ id: "b", profileId: "p2" })],
    };

    const merged = mergeProgress(local, incoming);
    expect(merged.profiles.map((profile) => profile.id).sort()).toEqual(["p1", "p2"]);
    expect(merged.activeProfileId).toBe("p1");
  });

  it("falls back to the first profile when the local active one is gone", () => {
    const local = { ...stateWith([]), profiles: [], activeProfileId: "" };
    const incoming = stateWith([event({ id: "a" })]);
    expect(mergeProgress(local, incoming).activeProfileId).toBe("p1");
  });
});
