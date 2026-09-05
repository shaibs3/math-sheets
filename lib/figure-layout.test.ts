import { describe, expect, it } from "vitest";
import generators from "./generators";
import type { Level } from "./types";
import {
  labelsAreClear,
  labelsAreInsideViewBox,
  pointInPolygon,
  segmentIntersectsBox,
  shapeLabelsAreClear,
  shapeLabelsAreInsideViewBox,
  shapeLayoutFor,
  triangleAnglesLayout,
} from "./figure-layout";

const box = { text: "50°", x: 0, y: 0, halfWidth: 8, halfHeight: 5.5 };

describe("segmentIntersectsBox", () => {
  it("detects a segment cutting straight through the label", () => {
    expect(segmentIntersectsBox({ from: { x: -20, y: 0 }, to: { x: 20, y: 0 } }, box)).toBe(true);
  });

  it("detects a segment clipping only a corner", () => {
    expect(segmentIntersectsBox({ from: { x: 4, y: -20 }, to: { x: 6, y: 0 } }, box)).toBe(true);
  });

  it("passes a segment that stops short of the label", () => {
    expect(segmentIntersectsBox({ from: { x: -40, y: 0 }, to: { x: -12, y: 0 } }, box)).toBe(false);
  });

  it("passes a segment running clear of the label", () => {
    expect(segmentIntersectsBox({ from: { x: -20, y: 30 }, to: { x: 20, y: 30 } }, box)).toBe(false);
  });
});

describe("triangleAnglesLayout", () => {
  const cases: [number, number][] = [];
  for (let first = 20; first <= 100; first += 1) {
    for (let second = 20; second <= 170 - first; second += 1) {
      cases.push([first, second]);
    }
  }

  it("covers the whole range the angles generator can produce", () => {
    expect(cases.length).toBeGreaterThan(5000);
  });

  it("never lets an angle label touch a drawn edge", () => {
    for (const [first, second] of cases) {
      const layout = triangleAnglesLayout(first, second);
      expect(labelsAreClear(layout), `${first}° ${second}°`).toBe(true);
    }
  });

  it("keeps every angle label inside the viewBox", () => {
    for (const [first, second] of cases) {
      const layout = triangleAnglesLayout(first, second);
      expect(labelsAreInsideViewBox(layout), `${first}° ${second}°`).toBe(true);
    }
  });

  it("keeps every angle label clear of its own arc", () => {
    for (const [first, second] of cases) {
      const layout = triangleAnglesLayout(first, second);
      layout.labels.forEach((label, index) => {
        const arc = layout.arcs[index];
        const distance = Math.hypot(label.x - arc.vertex.x, label.y - arc.vertex.y);
        expect(distance, `${first}° ${second}° label ${index}`).toBeGreaterThan(
          arc.radius + label.halfHeight,
        );
      });
    }
  });

  it("keeps every angle label inside the triangle", () => {
    for (const [first, second] of cases) {
      const layout = triangleAnglesLayout(first, second);
      for (const label of layout.labels) {
        expect(pointInPolygon(label, layout.points), `${first}° ${second}° ${label.text}`).toBe(
          true,
        );
      }
    }
  });
});

describe("every figure a generator emits", () => {
  const seeds = [7, 1234, 98765];
  const levels: Level[] = [1, 2, 3];

  const layouts = generators.flatMap((generator) =>
    levels.flatMap((level) =>
      seeds.flatMap((seed) =>
        generator
          .generate({ seed, count: 12, level })
          .flatMap((problem) => {
            if (!problem.figure) return [];
            const layout = shapeLayoutFor(problem.figure);
            return layout ? [{ id: generator.id, kind: problem.figure.kind, layout }] : [];
          }),
      ),
    ),
  );

  it("covers every shape kind that has a layout", () => {
    expect(new Set(layouts.map((entry) => entry.kind)).size).toBeGreaterThanOrEqual(11);
  });

  it("never lets a label touch the drawn shape", () => {
    for (const entry of layouts) {
      expect(shapeLabelsAreClear(entry.layout), `${entry.id} / ${entry.kind}`).toBe(true);
    }
  });

  it("keeps every label inside the viewBox", () => {
    for (const entry of layouts) {
      expect(shapeLabelsAreInsideViewBox(entry.layout), `${entry.id} / ${entry.kind}`).toBe(true);
    }
  });

  it("never lets two labels overlap", () => {
    for (const entry of layouts) {
      const labels = entry.layout.labels;
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const overlaps =
            Math.abs(labels[i].x - labels[j].x) < labels[i].halfWidth + labels[j].halfWidth &&
            Math.abs(labels[i].y - labels[j].y) < labels[i].halfHeight + labels[j].halfHeight;
          expect(overlaps, `${entry.id} / ${entry.kind}: "${labels[i].text}" vs "${labels[j].text}"`).toBe(
            false,
          );
        }
      }
    }
  });
});
