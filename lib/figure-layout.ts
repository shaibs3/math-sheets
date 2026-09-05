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
