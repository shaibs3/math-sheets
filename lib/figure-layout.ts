import type { Figure, Measure } from "./figure";

export type Vec = { x: number; y: number };

export type Segment = { from: Vec; to: Vec };

export type LabelBox = {
  text: string;
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
};

export type Arc = { vertex: Vec; from: Vec; to: Vec; radius: number };

export type ViewBox = { minX: number; minY: number; width: number; height: number };

export type FigureLayout = {
  points: Vec[];
  segments: Segment[];
  labels: LabelBox[];
  arcs: Arc[];
  viewBox: ViewBox;
  maxWidth: number;
};

export function unitVector(from: Vec, to: Vec): Vec {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

export function segmentIntersectsBox(segment: Segment, label: LabelBox): boolean {
  const minX = label.x - label.halfWidth;
  const maxX = label.x + label.halfWidth;
  const minY = label.y - label.halfHeight;
  const maxY = label.y + label.halfHeight;

  const dx = segment.to.x - segment.from.x;
  const dy = segment.to.y - segment.from.y;

  let enter = 0;
  let exit = 1;

  const clip = (direction: number, distance: number): boolean => {
    if (direction === 0) return distance >= 0;
    const t = distance / direction;
    if (direction < 0) {
      if (t > exit) return false;
      if (t > enter) enter = t;
    } else {
      if (t < enter) return false;
      if (t < exit) exit = t;
    }
    return true;
  };

  return (
    clip(-dx, segment.from.x - minX) &&
    clip(dx, maxX - segment.from.x) &&
    clip(-dy, segment.from.y - minY) &&
    clip(dy, maxY - segment.from.y)
  );
}

export function pointInPolygon(point: Vec, polygon: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const intersects =
      polygon[i].y > point.y !== polygon[j].y > point.y &&
      point.x <
        ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) /
          (polygon[j].y - polygon[i].y) +
          polygon[i].x;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function labelsAreClear(layout: FigureLayout): boolean {
  return layout.labels.every((label) =>
    layout.segments.every((segment) => !segmentIntersectsBox(segment, label)),
  );
}

export function labelsAreInsideViewBox(layout: FigureLayout): boolean {
  const { minX, minY, width, height } = layout.viewBox;
  return layout.labels.every(
    (label) =>
      label.x - label.halfWidth >= minX &&
      label.x + label.halfWidth <= minX + width &&
      label.y - label.halfHeight >= minY &&
      label.y + label.halfHeight <= minY + height,
  );
}

export type Primitive =
  | { kind: "polygon"; points: Vec[]; dashed?: boolean; thin?: boolean }
  | { kind: "line"; from: Vec; to: Vec; dashed?: boolean; thin?: boolean }
  | { kind: "ellipse"; centre: Vec; rx: number; ry: number }
  | { kind: "semicircle"; centre: Vec; radius: number }
  | { kind: "arc"; vertex: Vec; from: Vec; to: Vec; radius: number };

export type ShapeLayout = {
  primitives: Primitive[];
  labels: LabelBox[];
  viewBox: ViewBox;
  maxWidth: number;
};

const HALF_CHAR = 2.5;

export function labelBox(text: string, x: number, y: number): LabelBox {
  return { text, x, y, halfWidth: text.length * HALF_CHAR, halfHeight: LABEL_HALF_HEIGHT };
}

function sampleArc(centre: Vec, rx: number, ry: number, from: number, to: number): Vec[] {
  const steps = 24;
  return Array.from({ length: steps + 1 }, (_, index) => {
    const theta = from + ((to - from) * index) / steps;
    return { x: centre.x + rx * Math.cos(theta), y: centre.y + ry * Math.sin(theta) };
  });
}

function chain(points: Vec[], close: boolean): Segment[] {
  const segments: Segment[] = [];
  for (let index = 0; index < points.length - 1; index++) {
    segments.push({ from: points[index], to: points[index + 1] });
  }
  if (close && points.length > 1) {
    segments.push({ from: points[points.length - 1], to: points[0] });
  }
  return segments;
}

export function primitiveSegments(primitive: Primitive): Segment[] {
  switch (primitive.kind) {
    case "polygon":
      return chain(primitive.points, true);
    case "line":
      return [{ from: primitive.from, to: primitive.to }];
    case "ellipse":
      return chain(sampleArc(primitive.centre, primitive.rx, primitive.ry, 0, Math.PI * 2), true);
    case "semicircle":
      return chain(
        sampleArc(primitive.centre, primitive.radius, primitive.radius, Math.PI, Math.PI * 2),
        false,
      );
    case "arc": {
      const start = Math.atan2(primitive.from.y, primitive.from.x);
      const end = Math.atan2(primitive.to.y, primitive.to.x);
      return chain(sampleArc(primitive.vertex, primitive.radius, primitive.radius, start, end), false);
    }
  }
}

export function shapeSegments(layout: ShapeLayout): Segment[] {
  return layout.primitives.flatMap(primitiveSegments);
}

export function shapeLabelsAreClear(layout: ShapeLayout): boolean {
  const segments = shapeSegments(layout);
  return layout.labels.every((label) =>
    segments.every((segment) => !segmentIntersectsBox(segment, label)),
  );
}

export function shapeLabelsAreInsideViewBox(layout: ShapeLayout): boolean {
  return labelsAreInsideViewBox({
    points: [],
    segments: [],
    arcs: [],
    labels: layout.labels,
    viewBox: layout.viewBox,
    maxWidth: layout.maxWidth,
  });
}

export function fit(primitives: Primitive[], labels: LabelBox[]): { viewBox: ViewBox; maxWidth: number } {
  const points: Vec[] = [
    ...primitives.flatMap(primitiveSegments).flatMap((segment) => [segment.from, segment.to]),
    ...labels.flatMap((label) => [
      { x: label.x - label.halfWidth, y: label.y - label.halfHeight },
      { x: label.x + label.halfWidth, y: label.y + label.halfHeight },
    ]),
  ];

  const pad = 4;
  const minX = Math.min(...points.map((point) => point.x)) - pad;
  const minY = Math.min(...points.map((point) => point.y)) - pad;
  const width = Math.max(...points.map((point) => point.x)) + pad - minX;
  const height = Math.max(...points.map((point) => point.y)) + pad - minY;

  return {
    viewBox: { minX, minY, width, height },
    maxWidth: Math.min(Math.max(150, width * 1.5), 280),
  };
}

export function angleLabels(
  points: Vec[],
  texts: (string | null)[],
): { labels: LabelBox[]; arcs: Primitive[] } {
  const labels: LabelBox[] = [];
  const arcs: Primitive[] = [];

  points.forEach((point, index) => {
    const text = texts[index];
    if (text === null) return;

    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const toPrevious = unitVector(point, previous);
    const toNext = unitVector(point, next);

    const cosine = toPrevious.x * toNext.x + toPrevious.y * toNext.y;
    const interior = Math.acos(Math.max(-1, Math.min(1, cosine)));

    const bisector = { x: toPrevious.x + toNext.x, y: toPrevious.y + toNext.y };
    const length = Math.hypot(bisector.x, bisector.y) || 1;

    const shortest = Math.min(
      Math.hypot(previous.x - point.x, previous.y - point.y),
      Math.hypot(next.x - point.x, next.y - point.y),
    );
    const radius = Math.min(shortest * 0.28, 11);

    const half = text.length * HALF_CHAR;
    const clearOfEdges = (half + LABEL_MARGIN) / Math.max(Math.sin(interior / 2), 0.08);
    const distance = Math.max(clearOfEdges, radius + LABEL_HALF_HEIGHT + LABEL_MARGIN);

    labels.push(
      labelBox(text, point.x + (bisector.x / length) * distance, point.y + (bisector.y / length) * distance),
    );
    arcs.push({ kind: "arc", vertex: point, from: toPrevious, to: toNext, radius });
  });

  return { labels, arcs };
}

const MAX_GROWTH = 3;
const LABEL_MARGIN = 5;
const LABEL_HALF_HEIGHT = 5.5;

function halfWidthOf(text: string): number {
  return text === "?" ? 4.5 : 8;
}

export function triangleAnglesLayout(first: number, second: number): FigureLayout {
  const third = 180 - first - second;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;

  const side = Math.sin(toRad(second)) / Math.sin(toRad(third));
  const corners = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: side * Math.cos(toRad(first)), y: side * Math.sin(toRad(first)) },
  ];

  const texts = [`${first}°`, `${second}°`, "?"];
  const vertexAngles = [first, second, third];

  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanY = Math.max(...ys) - Math.min(...ys);
  const base = Math.min(86 / spanX, 52 / (spanY || 1));

  const build = (scale: number) => {
    const points = corners.map((corner) => ({
      x: (corner.x - Math.min(...xs)) * scale,
      y: -(corner.y - Math.min(...ys)) * scale,
    }));

    const entries = points.map((point, index) => {
      const others = points.filter((_, other) => other !== index);
      const directions = others.map((other) => unitVector(point, other));
      const shortest = Math.min(
        ...others.map((other) => Math.hypot(other.x - point.x, other.y - point.y)),
      );

      const bisector = {
        x: directions[0].x + directions[1].x,
        y: directions[0].y + directions[1].y,
      };
      const length = Math.hypot(bisector.x, bisector.y) || 1;
      const arc = Math.min(shortest * 0.3, 11);
      const clearOfEdges =
        (halfWidthOf(texts[index]) + LABEL_MARGIN) / Math.sin(toRad(vertexAngles[index] / 2));
      const clearOfArc = arc + LABEL_HALF_HEIGHT + LABEL_MARGIN;
      const needed = Math.max(clearOfEdges, clearOfArc);

      return {
        point,
        directions,
        needed,
        room: shortest * 0.45,
        arc,
        label: {
          text: texts[index],
          x: point.x + (bisector.x / length) * needed,
          y: point.y + (bisector.y / length) * needed,
          halfWidth: halfWidthOf(texts[index]),
          halfHeight: LABEL_HALF_HEIGHT,
        },
      };
    });

    return { points, entries };
  };

  const trial = build(base);
  const growth = Math.min(
    Math.max(...trial.entries.map((entry) => entry.needed / entry.room), 1),
    MAX_GROWTH,
  );
  const { points, entries } = build(base * growth);

  const segments: Segment[] = [
    { from: points[0], to: points[1] },
    { from: points[1], to: points[2] },
    { from: points[2], to: points[0] },
  ];

  const labels = entries.map((entry) => entry.label);
  const arcs: Arc[] = entries.map((entry) => ({
    vertex: entry.point,
    from: entry.directions[0],
    to: entry.directions[1],
    radius: entry.arc,
  }));

  const extents = [
    ...points,
    ...labels.flatMap((label) => [
      { x: label.x - label.halfWidth, y: label.y - label.halfHeight },
      { x: label.x + label.halfWidth, y: label.y + label.halfHeight },
    ]),
  ];

  const minX = Math.min(...extents.map((point) => point.x)) - 5;
  const minY = Math.min(...extents.map((point) => point.y)) - 5;
  const width = Math.max(...extents.map((point) => point.x)) + 5 - minX;
  const height = Math.max(...extents.map((point) => point.y)) + 5 - minY;

  return {
    points,
    segments,
    labels,
    arcs,
    viewBox: { minX, minY, width, height },
    maxWidth: Math.min(150 + width * 0.8, 280),
  };
}

function measured(value: Measure, unit?: string): string {
  if (value === "?") return "?";
  return unit ? `${value} ${unit}` : String(value);
}

function sizeOf(value: Measure, fallback: number): number {
  return value === "?" ? fallback : value;
}

const GAP = 6;

function below(text: string, x: number, y: number): LabelBox {
  return labelBox(text, x, y + GAP + LABEL_HALF_HEIGHT);
}

function above(text: string, x: number, y: number): LabelBox {
  return labelBox(text, x, y - GAP - LABEL_HALF_HEIGHT);
}

function leftOf(text: string, x: number, y: number): LabelBox {
  return labelBox(text, x - GAP - text.length * HALF_CHAR, y);
}

function rightOf(text: string, x: number, y: number): LabelBox {
  return labelBox(text, x + GAP + text.length * HALF_CHAR, y);
}

function assemble(primitives: Primitive[], labels: LabelBox[]): ShapeLayout {
  return { primitives, labels, ...fit(primitives, labels) };
}

export function rectLayout(width: Measure, height: Measure, unit?: string): ShapeLayout {
  const scale = Math.min(90 / sizeOf(width, 10), 54 / sizeOf(height, 6));
  const w = sizeOf(width, 10) * scale;
  const h = sizeOf(height, 6) * scale;
  const points = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];

  return assemble(
    [{ kind: "polygon", points }],
    [below(measured(width, unit), w / 2, h), leftOf(measured(height, unit), 0, h / 2)],
  );
}

export function parallelogramLayout(base: Measure, height: Measure, unit?: string): ShapeLayout {
  const scale = Math.min(74 / sizeOf(base, 10), 48 / sizeOf(height, 6));
  const w = sizeOf(base, 10) * scale;
  const h = sizeOf(height, 6) * scale;
  const skew = Math.min(20, w * 0.35);

  const points = [
    { x: 0, y: h },
    { x: w, y: h },
    { x: w + skew, y: 0 },
    { x: skew, y: 0 },
  ];

  return assemble(
    [
      { kind: "polygon", points },
      { kind: "line", from: { x: skew, y: 0 }, to: { x: skew, y: h }, dashed: true, thin: true },
    ],
    [below(measured(base, unit), w / 2, h), leftOf(measured(height, unit), 0, h / 2)],
  );
}

export function triangleLayout(base: Measure, height: Measure, unit?: string): ShapeLayout {
  const scale = Math.min(84 / sizeOf(base, 10), 50 / sizeOf(height, 6));
  const w = sizeOf(base, 10) * scale;
  const h = sizeOf(height, 6) * scale;

  const points = [
    { x: 0, y: h },
    { x: w, y: h },
    { x: 0, y: 0 },
  ];

  return assemble(
    [{ kind: "polygon", points }],
    [below(measured(base, unit), w / 2, h), leftOf(measured(height, unit), 0, h / 2)],
  );
}

export function rightTriangleLayout(
  a: Measure,
  b: Measure,
  c: Measure,
  markAngle: boolean,
  unit?: string,
): ShapeLayout {
  const scale = Math.min(80 / sizeOf(b, 8), 50 / sizeOf(a, 6));
  const w = sizeOf(b, 8) * scale;
  const h = sizeOf(a, 6) * scale;

  const corner = { x: 0, y: h };
  const right = { x: w, y: h };
  const top = { x: 0, y: 0 };
  const mark = Math.min(8, w * 0.2, h * 0.2);

  const primitives: Primitive[] = [
    { kind: "polygon", points: [corner, right, top] },
    {
      kind: "polygon",
      points: [
        { x: mark, y: h },
        { x: mark, y: h - mark },
        { x: 0, y: h - mark },
      ],
      thin: true,
    },
  ];

  const middle = { x: w / 2, y: h / 2 };
  const along = unitVector(top, right);
  const centroid = { x: w / 3, y: (2 * h) / 3 };
  const candidate = { x: -along.y, y: along.x };
  const away = (middle.x - centroid.x) * candidate.x + (middle.y - centroid.y) * candidate.y;
  const outward = away >= 0 ? candidate : { x: -candidate.x, y: -candidate.y };

  const hypotenuse = measured(c, unit);
  const reach =
    GAP +
    hypotenuse.length * HALF_CHAR * Math.abs(outward.x) +
    LABEL_HALF_HEIGHT * Math.abs(outward.y);

  const labels = [
    below(measured(b, unit), w / 2, h),
    leftOf(measured(a, unit), 0, h / 2),
    labelBox(hypotenuse, middle.x + outward.x * reach, middle.y + outward.y * reach),
  ];

  if (markAngle) {
    const alpha = angleLabels([right, top, corner], ["α", null, null]);
    labels.push(...alpha.labels);
    primitives.push(...alpha.arcs);
  }

  return assemble(primitives, labels);
}

export function circleLayout(value: Measure, label: string, unit?: string): ShapeLayout {
  const radius = 30;
  const centre = { x: 0, y: 0 };
  const isDiameter = label === "diameter";
  const from = { x: isDiameter ? -radius : 0, y: 0 };

  return assemble(
    [
      { kind: "ellipse", centre, rx: radius, ry: radius },
      { kind: "line", from, to: { x: radius, y: 0 }, thin: true },
    ],
    [rightOf(measured(value, unit), radius, 0)],
  );
}

export function rectSemicircleLayout(width: Measure, height: Measure, unit?: string): ShapeLayout {
  const scale = Math.min(70 / sizeOf(width, 10), 40 / sizeOf(height, 6));
  const w = sizeOf(width, 10) * scale;
  const h = sizeOf(height, 6) * scale;

  return assemble(
    [
      {
        kind: "polygon",
        points: [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: h },
          { x: 0, y: h },
        ],
      },
      { kind: "semicircle", centre: { x: w / 2, y: 0 }, radius: w / 2 },
    ],
    [below(measured(width, unit), w / 2, h), leftOf(measured(height, unit), 0, h / 2)],
  );
}

export function rectCutoutLayout(
  width: Measure,
  height: Measure,
  cut: Measure,
  unit?: string,
): ShapeLayout {
  const w0 = sizeOf(width, 10);
  const h0 = sizeOf(height, 6);
  const c0 = Math.min(sizeOf(cut, 3), w0 * 0.6, h0 * 0.6);
  const scale = Math.min(80 / w0, 48 / h0);
  const w = w0 * scale;
  const h = h0 * scale;
  const c = c0 * scale;

  return assemble(
    [
      {
        kind: "polygon",
        points: [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: h - c },
          { x: w - c, y: h - c },
          { x: w - c, y: h },
          { x: 0, y: h },
        ],
      },
    ],
    [
      below(measured(width, unit), w / 2, h),
      leftOf(measured(height, unit), 0, h / 2),
      rightOf(measured(cut, unit), w, h - c / 2),
    ],
  );
}

export function boxLayout(a: Measure, b: Measure, c: Measure, unit?: string): ShapeLayout {
  const w = 62;
  const h = 38;
  const depth = 20;

  const front = [
    { x: 0, y: depth },
    { x: w, y: depth },
    { x: w, y: depth + h },
    { x: 0, y: depth + h },
  ];
  const top = [
    { x: 0, y: depth },
    { x: depth, y: 0 },
    { x: w + depth, y: 0 },
    { x: w, y: depth },
  ];
  const side = [
    { x: w, y: depth },
    { x: w + depth, y: 0 },
    { x: w + depth, y: h },
    { x: w, y: depth + h },
  ];

  return assemble(
    [
      { kind: "polygon", points: front },
      { kind: "polygon", points: top },
      { kind: "polygon", points: side },
    ],
    [
      below(measured(a, unit), w / 2, depth + h),
      leftOf(measured(b, unit), 0, depth + h / 2),
      rightOf(measured(c, unit), w + depth, h / 2),
    ],
  );
}

export function cylinderLayout(radius: Measure, height: Measure, unit?: string): ShapeLayout {
  const rx = 26;
  const ry = 8;
  const h = 44;

  return assemble(
    [
      { kind: "ellipse", centre: { x: 0, y: 0 }, rx, ry },
      { kind: "ellipse", centre: { x: 0, y: h }, rx, ry },
      { kind: "line", from: { x: -rx, y: 0 }, to: { x: -rx, y: h } },
      { kind: "line", from: { x: rx, y: 0 }, to: { x: rx, y: h } },
      { kind: "line", from: { x: 0, y: 0 }, to: { x: rx, y: 0 }, dashed: true, thin: true },
    ],
    [above(measured(radius, unit), rx / 2, -ry), rightOf(measured(height, unit), rx, h / 2)],
  );
}

export function coneLayout(radius: Measure, height: Measure, unit?: string): ShapeLayout {
  const rx = 26;
  const ry = 8;
  const h = 48;

  return assemble(
    [
      { kind: "ellipse", centre: { x: 0, y: h }, rx, ry },
      { kind: "line", from: { x: -rx, y: h }, to: { x: 0, y: 0 } },
      { kind: "line", from: { x: rx, y: h }, to: { x: 0, y: 0 } },
      { kind: "line", from: { x: 0, y: 0 }, to: { x: 0, y: h }, dashed: true, thin: true },
      { kind: "line", from: { x: 0, y: h }, to: { x: rx, y: h }, dashed: true, thin: true },
    ],
    [below(measured(radius, unit), rx / 2, h + ry), leftOf(measured(height, unit), -rx, h / 2)],
  );
}

export function pyramidLayout(base: Measure, height: Measure, unit?: string): ShapeLayout {
  const half = 28;
  const ry = 9;
  const h = 46;

  return assemble(
    [
      {
        kind: "polygon",
        points: [
          { x: -half, y: h },
          { x: half, y: h },
          { x: 0, y: 0 },
        ],
      },
      { kind: "line", from: { x: -half, y: h }, to: { x: 0, y: h + ry } },
      { kind: "line", from: { x: half, y: h }, to: { x: 0, y: h + ry } },
      { kind: "line", from: { x: 0, y: 0 }, to: { x: 0, y: h + ry / 2 }, dashed: true, thin: true },
    ],
    [below(measured(base, unit), 0, h + ry), leftOf(measured(height, unit), -half, h / 2)],
  );
}

export function polygonLayout(sides: number): ShapeLayout {
  const radius = 32;
  const points = Array.from({ length: sides }, (_, index) => {
    const theta = (index / sides) * 2 * Math.PI - Math.PI / 2;
    return { x: radius * Math.cos(theta), y: radius * Math.sin(theta) };
  });

  return assemble([{ kind: "polygon", points }], []);
}

function angledPolygon(points: Vec[], texts: (string | null)[]): ShapeLayout {
  const { labels, arcs } = angleLabels(points, texts);
  return assemble([{ kind: "polygon", points }, ...arcs], labels);
}

export function parallelogramAngleLayout(angle: number): ShapeLayout {
  const h = 40;
  const w = 60;
  const skew = 18;
  return angledPolygon(
    [
      { x: 0, y: h },
      { x: w, y: h },
      { x: w + skew, y: 0 },
      { x: skew, y: 0 },
    ],
    [`${angle}°`, "?", null, null],
  );
}

export function isoscelesApexLayout(apex: number): ShapeLayout {
  const h = 46;
  const half = 32;
  return angledPolygon(
    [
      { x: 0, y: 0 },
      { x: half, y: h },
      { x: -half, y: h },
    ],
    [`${apex}°`, null, "?"],
  );
}

export function quadAnglesLayout(angles: number[]): ShapeLayout {
  return angledPolygon(
    [
      { x: 0, y: 0 },
      { x: 72, y: 6 },
      { x: 64, y: 48 },
      { x: 6, y: 44 },
    ],
    [...angles.map((angle) => `${angle}°`), "?"].slice(0, 4),
  );
}

export function trapezoidAngleLayout(angle: number): ShapeLayout {
  const h = 64;
  return angledPolygon(
    [
      { x: 0, y: h },
      { x: 104, y: h },
      { x: 82, y: 0 },
      { x: 24, y: 0 },
    ],
    [`${angle}°`, null, null, "?"],
  );
}

export function adjacentAnglesLayout(angle: number): ShapeLayout {
  const reach = 46;
  const vertex = { x: 0, y: 0 };
  const radians = (angle * Math.PI) / 180;
  const ray = { x: reach * Math.cos(radians), y: -reach * Math.sin(radians) };
  const left = { x: -reach, y: 0 };
  const right = { x: reach, y: 0 };

  const { labels, arcs } = angleLabels([ray, vertex, right], [null, `${angle}°`, null]);
  const second = angleLabels([left, vertex, ray], [null, "?", null]);

  return assemble(
    [
      { kind: "line", from: left, to: right },
      { kind: "line", from: vertex, to: ray },
      ...arcs,
      ...second.arcs,
    ],
    [...labels, ...second.labels],
  );
}

export function parallelLinesLayout(angle: number): ShapeLayout {
  const radians = (angle * Math.PI) / 180;
  const gap = 44;
  const shift = gap / Math.tan(radians);
  const top = { x: 0, y: 0 };
  const bottom = { x: shift, y: gap };

  const upper = angleLabels(
    [{ x: 60, y: 0 }, top, bottom],
    [null, `${angle}°`, null],
  );
  const lower = angleLabels(
    [top, bottom, { x: shift + 60, y: gap }],
    [null, "?", null],
  );

  return assemble(
    [
      { kind: "line", from: { x: -50, y: 0 }, to: { x: 60, y: 0 } },
      { kind: "line", from: { x: shift - 50, y: gap }, to: { x: shift + 60, y: gap } },
      {
        kind: "line",
        from: { x: top.x - shift * 0.4, y: -18 },
        to: { x: bottom.x + shift * 0.4, y: gap + 18 },
      },
      ...upper.arcs,
      ...lower.arcs,
    ],
    [...upper.labels, ...lower.labels],
  );
}

export function shapeLayoutFor(figure: Figure): ShapeLayout | null {
  switch (figure.kind) {
    case "rect":
      return rectLayout(figure.width, figure.height, figure.unit);
    case "parallelogram":
      return parallelogramLayout(figure.base, figure.height, figure.unit);
    case "triangle":
      return triangleLayout(figure.base, figure.height, figure.unit);
    case "right-triangle":
      return rightTriangleLayout(figure.a, figure.b, figure.c, figure.markAngle ?? false, figure.unit);
    case "circle":
      return circleLayout(figure.value, figure.label, figure.unit);
    case "rect-semicircle":
      return rectSemicircleLayout(figure.width, figure.height, figure.unit);
    case "rect-cutout":
      return rectCutoutLayout(figure.width, figure.height, figure.cut, figure.unit);
    case "box":
      return boxLayout(figure.a, figure.b, figure.c, figure.unit);
    case "cylinder":
      return cylinderLayout(figure.radius, figure.height, figure.unit);
    case "cone":
      return coneLayout(figure.radius, figure.height, figure.unit);
    case "pyramid":
      return pyramidLayout(figure.base, figure.height, figure.unit);
    case "polygon":
      return polygonLayout(figure.sides);
    case "parallelogram-angle":
      return parallelogramAngleLayout(figure.angle);
    case "isosceles-apex":
      return isoscelesApexLayout(figure.apex);
    case "quad-angles":
      return quadAnglesLayout(figure.angles);
    case "trapezoid-angle":
      return trapezoidAngleLayout(figure.angle);
    case "adjacent-angles":
      return adjacentAnglesLayout(figure.angle);
    case "parallel-lines":
      return parallelLinesLayout(figure.angle);
    case "triangle-angles":
    case "axes":
      return null;
  }
}
