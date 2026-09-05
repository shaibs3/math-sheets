import {
  shapeLayoutFor,
  triangleAnglesLayout,
  type Primitive,
  type ShapeLayout,
} from "@/lib/figure-layout";
import type { Figure as FigureData } from "@/lib/figure";

const stroke = { stroke: "currentColor", fill: "none", strokeWidth: 1.5 } as const;
const labelProps = {
  fill: "currentColor",
  fontSize: 9,
  fontFamily: "inherit",
  style: { direction: "ltr" as const, unicodeBidi: "isolate" as const },
};



type Vector = { x: number; y: number };


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

function Shape({ primitive, decoration }: { primitive: Primitive; decoration?: boolean }) {
  const common = {
    ...stroke,
    strokeWidth: decoration && "thin" in primitive && primitive.thin ? 0.4 : widthFor(primitive),
    strokeDasharray: dashFor(primitive),
    opacity: decoration && "thin" in primitive && primitive.thin ? 0.35 : undefined,
  };

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
      {(layout.decorations ?? []).map((primitive, index) => (
        <Shape key={`d${index}`} primitive={primitive} decoration />
      ))}
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

export default function Figure({ figure }: { figure: FigureData }) {
  if (figure.kind === "triangle-angles") return <TriangleAngles angles={figure.angles} />;
  const layout = shapeLayoutFor(figure);
  return layout ? <LaidOut layout={layout} /> : null;
}
