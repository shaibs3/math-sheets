import {
  shapeLayoutFor,
  triangleAnglesLayout,
  type Primitive,
  type ShapeLayout,
} from "@/lib/figure-layout";
import type { Figure as FigureData, Measure, Point } from "@/lib/figure";

const stroke = { stroke: "currentColor", fill: "none", strokeWidth: 1.5 } as const;
const labelProps = {
  fill: "currentColor",
  fontSize: 9,
  fontFamily: "inherit",
  style: { direction: "ltr" as const, unicodeBidi: "isolate" as const },
};

function withUnit(value: Measure, unit?: string): string {
  if (value === "?") return "?";
  return unit ? `${value} ${unit}` : String(value);
}

function span(value: Measure, fallback: number): number {
  return value === "?" ? fallback : value;
}

type Vector = { x: number; y: number };

function unitVector(from: Vector, to: Vector): Vector {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

function angleArc(vertex: Vector, first: Vector, second: Vector, radius: number): string {
  const start = { x: vertex.x + first.x * radius, y: vertex.y + first.y * radius };
  const end = { x: vertex.x + second.x * radius, y: vertex.y + second.y * radius };
  const sweep = first.x * second.y - first.y * second.x > 0 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweep} ${end.x} ${end.y}`;
}

function dashFor(primitive: Primitive): string | undefined {
  return "dashed" in primitive && primitive.dashed ? "3 3" : undefined;
}

function widthFor(primitive: Primitive): number {
  return "thin" in primitive && primitive.thin ? 1 : 1.5;
}

function Shape({ primitive }: { primitive: Primitive }) {
  const common = { ...stroke, strokeWidth: widthFor(primitive), strokeDasharray: dashFor(primitive) };

  switch (primitive.kind) {
    case "polygon":
      return <polygon points={primitive.points.map((p) => `${p.x},${p.y}`).join(" ")} {...common} />;
    case "line":
      return (
        <line
          x1={primitive.from.x}
          y1={primitive.from.y}
          x2={primitive.to.x}
          y2={primitive.to.y}
          {...common}
        />
      );
    case "ellipse":
      return (
        <ellipse
          cx={primitive.centre.x}
          cy={primitive.centre.y}
          rx={primitive.rx}
          ry={primitive.ry}
          {...common}
        />
      );
    case "semicircle":
      return (
        <path
          d={`M ${primitive.centre.x - primitive.radius} ${primitive.centre.y} A ${primitive.radius} ${primitive.radius} 0 0 1 ${primitive.centre.x + primitive.radius} ${primitive.centre.y}`}
          {...common}
        />
      );
    case "arc":
      return (
        <path
          d={angleArc(primitive.vertex, primitive.from, primitive.to, primitive.radius)}
          {...common}
        />
      );
  }
}

function LaidOut({ layout }: { layout: ShapeLayout }) {
  const { minX, minY, width, height } = layout.viewBox;

  return (
    <svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="w-full"
      style={{ maxWidth: layout.maxWidth }}
    >
      {layout.primitives.map((primitive, index) => (
        <Shape key={index} primitive={primitive} />
      ))}
      {layout.labels.map((label, index) => (
        <text
          key={index}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...labelProps}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}

function TriangleAngles({ angles }: { angles: [number, number] }) {
  const layout = triangleAnglesLayout(angles[0], angles[1]);
  const { minX, minY, width, height } = layout.viewBox;

  return (
    <svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="w-full"
      style={{ maxWidth: layout.maxWidth }}
    >
      <polygon points={layout.points.map((point) => `${point.x},${point.y}`).join(" ")} {...stroke} />
      {layout.arcs.map((arc, index) => (
        <path
          key={`arc${index}`}
          d={angleArc(arc.vertex, arc.from, arc.to, arc.radius)}
          {...stroke}
          strokeWidth={1}
        />
      ))}
      {layout.labels.map((label, index) => (
        <text
          key={index}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...labelProps}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}

export function Axes({
  min,
  max,
  points,
  line,
  size = 150,
}: {
  min: number;
  max: number;
  points?: Point[];
  line?: { m: number; b: number };
  size?: number;
}) {
  const span = max - min;
  const pad = 12;
  const box = 120;
  const unit = (box - pad * 2) / span;
  const toX = (x: number) => pad + (x - min) * unit;
  const toY = (y: number) => box - pad - (y - min) * unit;

  const ticks = [];
  for (let value = min; value <= max; value += 1) ticks.push(value);

  const clamp = (y: number) => Math.max(min, Math.min(max, y));
  const lineStart = line ? { x: min, y: clamp(line.m * min + line.b) } : null;
  const lineEnd = line ? { x: max, y: clamp(line.m * max + line.b) } : null;

  return (
    <svg viewBox={`0 0 ${box} ${box}`} className="w-full" style={{ maxWidth: size }}>
      <g stroke="currentColor" strokeWidth={0.4} opacity={0.35}>
        {ticks.map((value) => (
          <line key={`v${value}`} x1={toX(value)} y1={toY(min)} x2={toX(value)} y2={toY(max)} />
        ))}
        {ticks.map((value) => (
          <line key={`h${value}`} x1={toX(min)} y1={toY(value)} x2={toX(max)} y2={toY(value)} />
        ))}
      </g>

      <g stroke="currentColor" strokeWidth={1.2}>
        <line x1={toX(min)} y1={toY(0)} x2={toX(max)} y2={toY(0)} />
        <line x1={toX(0)} y1={toY(min)} x2={toX(0)} y2={toY(max)} />
      </g>

      <g {...labelProps} fontSize={4.5}>
        {ticks
          .filter((value) => value !== 0 && value !== min && value !== max)
          .map((value) => (
            <text key={`lx${value}`} x={toX(value)} y={toY(0) + 5.5} textAnchor="middle">
              {value}
            </text>
          ))}
        {ticks
          .filter((value) => value !== 0 && value !== min && value !== max)
          .map((value) => (
            <text key={`ly${value}`} x={toX(0) - 2} y={toY(value) + 1.6} textAnchor="end">
              {value}
            </text>
          ))}
        <text x={toX(0) - 2} y={toY(0) + 5.5} textAnchor="end">
          0
        </text>
      </g>

      <text x={toX(max) - 1} y={toY(0) - 3} textAnchor="end" {...labelProps} fontSize={7}>
        x
      </text>
      <text x={toX(0) + 3} y={toY(max) + 6} {...labelProps} fontSize={7}>
        y
      </text>

      {lineStart && lineEnd ? (
        <line
          x1={toX(lineStart.x)}
          y1={toY(lineStart.y)}
          x2={toX(lineEnd.x)}
          y2={toY(lineEnd.y)}
          {...stroke}
        />
      ) : null}

      {(points ?? []).map((point, index) => (
        <g key={index}>
          <circle cx={toX(point.x)} cy={toY(point.y)} r={2.4} fill="currentColor" />
          <text x={toX(point.x) + 4} y={toY(point.y) - 4} {...labelProps} fontSize={7}>
            {`(${point.x}, ${point.y})`}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Figure({ figure }: { figure: FigureData }) {
  if (figure.kind === "triangle-angles") return <TriangleAngles angles={figure.angles} />;
  if (figure.kind === "axes") {
    return <Axes min={figure.min} max={figure.max} points={figure.points} line={figure.line} />;
  }

  const layout = shapeLayoutFor(figure);
  return layout ? <LaidOut layout={layout} /> : null;
}
