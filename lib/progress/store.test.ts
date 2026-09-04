import { describe, expect, it } from "vitest";
import { STORAGE_KEY, loadProgress, parseProgress, saveProgress, type ProgressStorage } from "./store";
import { emptyProgress, gradeAttempt } from "./schedule";

function fakeStorage(initial: Record<string, string> = {}): ProgressStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

const attempt = {
  topicId: "achuzim",
  level: 2 as const,
  seed: 42,
  count: 10,
  wrong: [3, 7],
};

describe("progress store", () => {
  it("round-trips state through storage", () => {
    const storage = fakeStorage();
    const state = gradeAttempt(emptyProgress(), attempt, new Date("2026-09-04T09:00:00.000Z"));

    saveProgress(storage, state);

    expect(storage.data[STORAGE_KEY]).toBeDefined();
    expect(loadProgress(storage)).toEqual(state);
  });

  it("returns empty progress for a missing key", () => {
    expect(loadProgress(fakeStorage())).toEqual(emptyProgress());
  });

  it("recovers from corrupt or foreign values instead of throwing", () => {
    expect(parseProgress("not json at all")).toEqual(emptyProgress());
    expect(parseProgress('{"version":99,"skills":{},"attempts":[]}')).toEqual(emptyProgress());
    expect(parseProgress('{"skills":{}}')).toEqual(emptyProgress());
    expect(parseProgress("null")).toEqual(emptyProgress());
  });
});
