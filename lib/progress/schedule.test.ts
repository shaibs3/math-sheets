import { describe, expect, it } from "vitest";
import {
  INTERVALS_IN_DAYS,
  accuracyFor,
  daysUntil,
  deriveSkills,
  dueSkills,
  emptyProgress,
  eventsForProfile,
  nextDueAt,
  skillId,
  skillStatus,
  topicStatus,
  weakestSkills,
} from "./schedule";
import type { AttemptEvent, ProgressState, Skills } from "./types";

const start = new Date("2026-09-04T09:00:00.000Z");
const day = 24 * 60 * 60 * 1000;

function daysLater(days: number): Date {
  return new Date(start.getTime() + days * day);
}

let nextId = 0;

function event(overrides: Partial<AttemptEvent> = {}): AttemptEvent {
  nextId += 1;
  return {
    id: `e${nextId}`,
    profileId: "p1",
    at: start.toISOString(),
    topicId: "kefel-shvarim",
    level: 2,
    seed: 1234,
    count: 10,
    wrong: [],
    ...overrides,
  };
}

function boxOf(skills: Skills, id = skillId("kefel-shvarim", 2)): number {
  return skills[id].box;
}

describe("deriveSkills", () => {
  it("promotes the box when accuracy is at least 80%", () => {
    const skills = deriveSkills([event({ wrong: [1, 2] })]);
    expect(boxOf(skills)).toBe(1);
    expect(skills[skillId("kefel-shvarim", 2)].dueAt).toBe(daysLater(3).toISOString());
  });

  it("holds the box between 50% and 80%", () => {
    const skills = deriveSkills([event({ wrong: [1, 2] }), event({ wrong: [1, 2, 3, 4] })]);
    expect(boxOf(skills)).toBe(1);
  });

  it("resets the box below 50%", () => {
    const skills = deriveSkills([event(), event(), event({ wrong: [1, 2, 3, 4, 5, 6] })]);
    expect(boxOf(skills)).toBe(0);
    expect(skills[skillId("kefel-shvarim", 2)].dueAt).toBe(daysLater(1).toISOString());
  });

  it("never promotes past the last interval", () => {
    const skills = deriveSkills(Array.from({ length: 10 }, () => event()));
    expect(boxOf(skills)).toBe(INTERVALS_IN_DAYS.length - 1);
  });

  it("replays events in chronological order regardless of array order", () => {
    const first = event({ at: start.toISOString(), wrong: [] });
    const second = event({ at: daysLater(1).toISOString(), wrong: [1, 2, 3, 4, 5, 6] });

    expect(deriveSkills([second, first])).toEqual(deriveSkills([first, second]));
    expect(boxOf(deriveSkills([second, first]))).toBe(0);
  });

  it("schedules from the event time, not from replay time", () => {
    const skills = deriveSkills([event({ at: daysLater(10).toISOString() })]);
    expect(skills[skillId("kefel-shvarim", 2)].dueAt).toBe(daysLater(13).toISOString());
  });

  it("accumulates seen and wrong counts", () => {
    const skills = deriveSkills([event({ wrong: [1] }), event({ wrong: [2, 3] })]);
    const skill = skills[skillId("kefel-shvarim", 2)];
    expect(skill.seenCount).toBe(20);
    expect(skill.wrongCount).toBe(3);
  });

  it("tracks each level as its own skill", () => {
    const skills = deriveSkills([event({ level: 1 }), event({ level: 3 })]);
    expect(Object.keys(skills).sort()).toEqual(["kefel-shvarim:1", "kefel-shvarim:3"]);
  });

  it("is a pure function of its events", () => {
    const events = [event({ wrong: [1] }), event()];
    expect(deriveSkills(events)).toEqual(deriveSkills(events));
    expect(events).toHaveLength(2);
  });
});

describe("eventsForProfile", () => {
  it("returns only the requested profile's events", () => {
    const state: ProgressState = {
      ...emptyProgress(),
      events: [event({ profileId: "p1" }), event({ profileId: "p2" }), event({ profileId: "p1" })],
    };
    expect(eventsForProfile(state, "p1")).toHaveLength(2);
    expect(eventsForProfile(state, "p2")).toHaveLength(1);
    expect(eventsForProfile(state, "missing")).toEqual([]);
  });
});

describe("dueSkills", () => {
  it("returns nothing until the interval has passed", () => {
    const skills = deriveSkills([event()]);
    expect(dueSkills(skills, daysLater(0.5))).toHaveLength(0);
    expect(dueSkills(skills, daysLater(4))).toHaveLength(1);
  });

  it("orders the most overdue skill first", () => {
    const skills = deriveSkills([
      event({ topicId: "achuzim", wrong: [1, 2, 3, 4, 5, 6] }),
      event({ topicId: "yachas" }),
    ]);
    expect(dueSkills(skills, daysLater(40)).map((skill) => skill.topicId)).toEqual([
      "achuzim",
      "yachas",
    ]);
  });
});

describe("status", () => {
  it("reports new for an unseen skill", () => {
    expect(skillStatus(undefined, start)).toBe("new");
    expect(topicStatus({}, "yachas", start)).toBe("new");
  });

  it("reports due once the interval elapses, learning before that", () => {
    const skills = deriveSkills([event()]);
    expect(topicStatus(skills, "kefel-shvarim", daysLater(1))).toBe("learning");
    expect(topicStatus(skills, "kefel-shvarim", daysLater(5))).toBe("due");
  });

  it("reports strong only at the last box", () => {
    const skills = deriveSkills(Array.from({ length: 5 }, () => event()));
    expect(topicStatus(skills, "kefel-shvarim", start)).toBe("strong");
  });

  it("prefers due over strong when a topic has several levels", () => {
    const skills = deriveSkills([
      ...Array.from({ length: 5 }, () => event({ level: 1 })),
      event({ level: 3 }),
    ]);
    expect(topicStatus(skills, "kefel-shvarim", daysLater(5))).toBe("due");
  });
});

describe("weakestSkills", () => {
  it("ranks by wrong rate and ignores unseen skills", () => {
    const skills = deriveSkills([
      event({ topicId: "achuzim", wrong: [1, 2, 3] }),
      event({ topicId: "yachas", wrong: [1] }),
      event({ topicId: "nefach", wrong: [1, 2, 3, 4, 5] }),
    ]);
    expect(weakestSkills(skills, 2).map((skill) => skill.topicId)).toEqual(["nefach", "achuzim"]);
  });

  it("returns nothing when no skill has been practised", () => {
    expect(weakestSkills({}, 5)).toEqual([]);
  });
});

describe("nextDueAt", () => {
  it("finds the soonest future due date and counts days up to it", () => {
    const skills = deriveSkills([
      event({ topicId: "achuzim", wrong: [1, 2, 3, 4, 5, 6] }),
      event({ topicId: "yachas" }),
    ]);
    const next = nextDueAt(skills, start);
    expect(next).not.toBeNull();
    expect(daysUntil(next as Date, start)).toBe(1);
  });

  it("is null once everything is already due", () => {
    expect(nextDueAt(deriveSkills([event()]), daysLater(60))).toBeNull();
  });
});

describe("accuracyFor", () => {
  it("is null before any attempt and a ratio afterwards", () => {
    expect(accuracyFor({}, "yachas")).toBeNull();
    expect(accuracyFor(deriveSkills([event({ wrong: [1, 2] })]), "kefel-shvarim")).toBeCloseTo(
      0.8,
      10,
    );
  });
});
