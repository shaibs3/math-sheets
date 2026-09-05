import { describe, expect, it } from "vitest";
import {
  labelsAreClear,
  labelsAreInsideViewBox,
  pointInPolygon,
  segmentIntersectsBox,
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
