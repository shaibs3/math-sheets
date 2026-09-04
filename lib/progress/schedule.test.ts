import { describe, expect, it } from "vitest";
import {
  INTERVALS_IN_DAYS,
  MAX_ATTEMPTS,
  accuracyFor,
  daysUntil,
  dueSkills,
  emptyProgress,
  gradeAttempt,
  nextDueAt,
  skillId,
  skillStatus,
  topicStatus,
  weakestSkills,
} from "./schedule";
import type { AttemptInput, ProgressState } from "./types";

const start = new Date("2026-09-04T09:00:00.000Z");

function attempt(overrides: Partial<AttemptInput> = {}): AttemptInput {
  return {
    topicId: "kefel-shvarim",
    level: 2,
    seed: 1234,
    count: 10,
    wrong: [],
    ...overrides,
  };
}

function daysLater(days: number): Date {
  return new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
}

function boxOf(state: ProgressState, id = skillId("kefel-shvarim", 2)): number {
  return state.skills[id].box;
}

describe("gradeAttempt", () => {
  it("promotes the box when accuracy is at least 80%", () => {
    const state = gradeAttempt(emptyProgress(), attempt({ wrong: [1, 2] }), start);
    expect(boxOf(state)).toBe(1);
    expect(state.skills[skillId("kefel-shvarim", 2)].dueAt).toBe(daysLater(3).toISOString());
  });

  it("holds the box between 50% and 80%", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ wrong: [1, 2] }), start);
    state = gradeAttempt(state, attempt({ wrong: [1, 2, 3, 4] }), start);
    expect(boxOf(state)).toBe(1);
  });

  it("resets the box below 50%", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ wrong: [] }), start);
    state = gradeAttempt(state, attempt({ wrong: [] }), start);
    expect(boxOf(state)).toBe(2);
    state = gradeAttempt(state, attempt({ wrong: [1, 2, 3, 4, 5, 6] }), start);
    expect(boxOf(state)).toBe(0);
    expect(state.skills[skillId("kefel-shvarim", 2)].dueAt).toBe(daysLater(1).toISOString());
  });

  it("never promotes past the last interval", () => {
    let state = emptyProgress();
    for (let i = 0; i < 10; i++) state = gradeAttempt(state, attempt(), start);
    expect(boxOf(state)).toBe(INTERVALS_IN_DAYS.length - 1);
  });

  it("accumulates seen and wrong counts across attempts", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ wrong: [1] }), start);
    state = gradeAttempt(state, attempt({ wrong: [2, 3] }), start);
    const skill = state.skills[skillId("kefel-shvarim", 2)];
    expect(skill.seenCount).toBe(20);
    expect(skill.wrongCount).toBe(3);
  });

  it("tracks each level as its own skill", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ level: 1 }), start);
    state = gradeAttempt(state, attempt({ level: 3 }), start);
    expect(Object.keys(state.skills)).toEqual(["kefel-shvarim:1", "kefel-shvarim:3"]);
  });

  it("keeps attempts newest first and caps the history", () => {
    let state = emptyProgress();
    for (let i = 0; i < MAX_ATTEMPTS + 20; i++) {
      state = gradeAttempt(state, attempt({ seed: i }), daysLater(i));
    }
    expect(state.attempts).toHaveLength(MAX_ATTEMPTS);
    expect(state.attempts[0].seed).toBe(MAX_ATTEMPTS + 19);
  });

  it("does not mutate the state it is given", () => {
    const before = emptyProgress();
    gradeAttempt(before, attempt(), start);
    expect(before.skills).toEqual({});
    expect(before.attempts).toEqual([]);
  });
});

describe("dueSkills", () => {
  it("returns nothing until the interval has passed", () => {
    const state = gradeAttempt(emptyProgress(), attempt(), start);
    expect(dueSkills(state, daysLater(0.5))).toHaveLength(0);
    expect(dueSkills(state, daysLater(4))).toHaveLength(1);
  });

  it("orders the most overdue skill first", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ topicId: "achuzim", wrong: [1, 2, 3, 4, 5, 6] }), start);
    state = gradeAttempt(state, attempt({ topicId: "yachas" }), start);
    const due = dueSkills(state, daysLater(40));
    expect(due.map((skill) => skill.topicId)).toEqual(["achuzim", "yachas"]);
  });
});

describe("status", () => {
  it("reports new for an unseen skill", () => {
    expect(skillStatus(undefined, start)).toBe("new");
    expect(topicStatus(emptyProgress(), "yachas", start)).toBe("new");
  });

  it("reports due once the interval elapses, learning before that", () => {
    const state = gradeAttempt(emptyProgress(), attempt(), start);
    expect(topicStatus(state, "kefel-shvarim", daysLater(1))).toBe("learning");
    expect(topicStatus(state, "kefel-shvarim", daysLater(5))).toBe("due");
  });

  it("reports strong only at the last box", () => {
    let state = emptyProgress();
    for (let i = 0; i < 5; i++) state = gradeAttempt(state, attempt(), start);
    expect(topicStatus(state, "kefel-shvarim", start)).toBe("strong");
  });

  it("prefers due over strong when a topic has several levels", () => {
    let state = emptyProgress();
    for (let i = 0; i < 5; i++) state = gradeAttempt(state, attempt({ level: 1 }), start);
    state = gradeAttempt(state, attempt({ level: 3 }), start);
    expect(topicStatus(state, "kefel-shvarim", daysLater(5))).toBe("due");
  });
});

describe("weakestSkills", () => {
  it("ranks by wrong rate and ignores unseen skills", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ topicId: "achuzim", wrong: [1, 2, 3] }), start);
    state = gradeAttempt(state, attempt({ topicId: "yachas", wrong: [1] }), start);
    state = gradeAttempt(state, attempt({ topicId: "nefach", wrong: [1, 2, 3, 4, 5] }), start);

    expect(weakestSkills(state, 2).map((skill) => skill.topicId)).toEqual(["nefach", "achuzim"]);
  });

  it("returns nothing when no skill has been practised", () => {
    expect(weakestSkills(emptyProgress(), 5)).toEqual([]);
  });
});

describe("nextDueAt", () => {
  it("finds the soonest future due date and counts days up to it", () => {
    let state = gradeAttempt(emptyProgress(), attempt({ topicId: "achuzim", wrong: [1, 2, 3, 4, 5, 6] }), start);
    state = gradeAttempt(state, attempt({ topicId: "yachas" }), start);

    const next = nextDueAt(state, start);
    expect(next).not.toBeNull();
    expect(daysUntil(next as Date, start)).toBe(1);
  });

  it("is null once everything is already due", () => {
    const state = gradeAttempt(emptyProgress(), attempt(), start);
    expect(nextDueAt(state, daysLater(60))).toBeNull();
  });
});

describe("accuracyFor", () => {
  it("is null before any attempt and a ratio afterwards", () => {
    expect(accuracyFor(emptyProgress(), "yachas")).toBeNull();
    const state = gradeAttempt(emptyProgress(), attempt({ wrong: [1, 2] }), start);
    expect(accuracyFor(state, "kefel-shvarim")).toBeCloseTo(0.8, 10);
  });
});
