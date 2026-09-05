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

function Rect({ width, height, unit }: { width: Measure; height: Measure; unit?: string }) {
  const w0 = span(width, 10);
  const h0 = span(height, 6);
  const scale = Math.min(70 / w0, 42 / h0);
  const w = w0 * scale;
  const h = h0 * scale;

  return (
    <svg viewBox="0 0 120 78" className="w-full max-w-[150px]">
      <rect x={30} y={12} width={w} height={h} {...stroke} />
      <text x={30 + w / 2} y={12 + h + 13} textAnchor="middle" {...labelProps}>
        {withUnit(width, unit)}
      </text>
      <text x={25} y={12 + h / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function Parallelogram({ base, height, unit }: { base: Measure; height: Measure; unit?: string }) {
  const b0 = span(base, 10);
  const h0 = span(height, 6);
  const scale = Math.min(60 / b0, 40 / h0);
  const w = b0 * scale;
  const h = h0 * scale;
  const skew = Math.min(18, w * 0.35);
  const top = 12;
  const bottom = top + h;

  return (
    <svg viewBox="0 0 120 78" className="w-full max-w-[150px]">
      <polygon
        points={`24,${bottom} ${24 + w},${bottom} ${24 + w + skew},${top} ${24 + skew},${top}`}
        {...stroke}
      />
      <line x1={24 + skew} y1={top} x2={24 + skew} y2={bottom} {...stroke} strokeWidth={1} strokeDasharray="3 3" />
      <text x={24 + w / 2} y={bottom + 13} textAnchor="middle" {...labelProps}>
        {withUnit(base, unit)}
      </text>
      <text x={24 + skew - 4} y={top + h / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function RightTriangle({
  a,
  b,
  c,
  markAngle,
  unit,
}: {
  a: Measure;
  b: Measure;
  c: Measure;
  markAngle?: boolean;
  unit?: string;
}) {
  const a0 = span(a, 6);
  const b0 = span(b, 8);
  const scale = Math.min(62 / b0, 40 / a0);
  const w = b0 * scale;
  const h = a0 * scale;
  const left = 30;
  const bottom = 56;

  return (
    <svg viewBox="0 0 120 78" className="w-full max-w-[160px]">
      <polygon points={`${left},${bottom} ${left + w},${bottom} ${left},${bottom - h}`} {...stroke} />
      <path
        d={`M ${left + 7} ${bottom} L ${left + 7} ${bottom - 7} L ${left} ${bottom - 7}`}
        {...stroke}
        strokeWidth={1}
      />
      {markAngle ? (
        <>
          <path
            d={angleArc(
              { x: left + w, y: bottom },
              { x: -1, y: 0 },
              unitVector({ x: left + w, y: bottom }, { x: left, y: bottom - h }),
              11,
            )}
            {...stroke}
            strokeWidth={1}
          />
          <text x={left + w - 16} y={bottom - 6} textAnchor="middle" {...labelProps} fontSize={8}>
            α
          </text>
        </>
      ) : null}
      <text x={left + w / 2} y={bottom + 13} textAnchor="middle" {...labelProps}>
        {withUnit(b, unit)}
      </text>
      <text x={left - 5} y={bottom - h / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(a, unit)}
      </text>
      <text
        x={left + w / 2 + 6}
        y={bottom - h / 2 - 6}
        textAnchor="start"
        dominantBaseline="middle"
        {...labelProps}
      >
        {withUnit(c, unit)}
      </text>
    </svg>
  );
}

function RectSemicircle({ width, height, unit }: { width: Measure; height: Measure; unit?: string }) {
  const w0 = span(width, 10);
  const h0 = span(height, 6);
  const scale = Math.min(56 / w0, 30 / h0);
  const w = w0 * scale;
  const h = h0 * scale;
  const left = 34;
  const top = 30;
  const radius = w / 2;

  return (
    <svg viewBox="0 0 120 82" className="w-full max-w-[150px]">
      <path
        d={`M ${left} ${top + h} L ${left} ${top} A ${radius} ${radius} 0 0 1 ${left + w} ${top} L ${left + w} ${top + h} Z`}
        {...stroke}
      />
      <line x1={left} y1={top} x2={left + w} y2={top} {...stroke} strokeWidth={1} strokeDasharray="3 3" />
      <text x={left + w / 2} y={top + h + 13} textAnchor="middle" {...labelProps}>
        {withUnit(width, unit)}
      </text>
      <text x={left - 5} y={top + h / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function RectCutout({
  width,
  height,
  cut,
  unit,
}: {
  width: Measure;
  height: Measure;
  cut: Measure;
  unit?: string;
}) {
  const w0 = span(width, 10);
  const h0 = span(height, 6);
  const c0 = Math.min(span(cut, 3), w0 * 0.6, h0 * 0.6);
  const scale = Math.min(66 / w0, 40 / h0);
  const w = w0 * scale;
  const h = h0 * scale;
  const c = c0 * scale;
  const left = 30;
  const top = 12;

  return (
    <svg viewBox="0 0 120 82" className="w-full max-w-[155px]">
      <path
        d={`M ${left} ${top} L ${left + w} ${top} L ${left + w} ${top + h - c} L ${left + w - c} ${top + h - c} L ${left + w - c} ${top + h} L ${left} ${top + h} Z`}
        {...stroke}
      />
      <text x={left + w / 2} y={top + h + 13} textAnchor="middle" {...labelProps}>
        {withUnit(width, unit)}
      </text>
      <text x={left - 5} y={top + h / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
      <text x={left + w - c / 2} y={top + h - c - 4} textAnchor="middle" {...labelProps} fontSize={8}>
        {withUnit(cut, unit)}
      </text>
    </svg>
  );
}

function Triangle({ base, height, unit }: { base: Measure; height: Measure; unit?: string }) {
  const scale = Math.min(74 / span(base, 10), 46 / span(height, 6));
  const w = span(base, 10) * scale;
  const h = span(height, 6) * scale;
  const left = 28;
  const bottom = 10 + h;

  return (
    <svg viewBox="0 0 120 78" className="w-full max-w-[150px]">
      <polygon points={`${left},${bottom} ${left + w},${bottom} ${left},${10}`} {...stroke} />
      <path d={`M ${left + 6} ${bottom} L ${left + 6} ${bottom - 6} L ${left} ${bottom - 6}`} {...stroke} strokeWidth={1} />
      <text x={left + w / 2} y={bottom + 14} textAnchor="middle" {...labelProps}>
        {withUnit(base, unit)}
      </text>
      <text x={left - 6} y={10 + h / 2 + 3} textAnchor="end" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function Circle({ value, label, unit }: { value: Measure; label: string; unit?: string }) {
  const cx = 60;
  const cy = 38;
  const r = 28;
  const isDiameter = label === "diameter";

  return (
    <svg viewBox="0 0 120 78" className="w-full max-w-[150px]">
      <circle cx={cx} cy={cy} r={r} {...stroke} />
      <line
        x1={isDiameter ? cx - r : cx}
        y1={cy}
        x2={cx + r}
        y2={cy}
        {...stroke}
        strokeWidth={1}
      />
      <circle cx={cx} cy={cy} r={1.5} fill="currentColor" />
      <text x={cx + (isDiameter ? 0 : r / 2)} y={cy - 5} textAnchor="middle" {...labelProps}>
        {withUnit(value, unit)}
      </text>
    </svg>
  );
}

function TriangleAngles({ angles }: { angles: [number, number] }) {
  const [a, b] = angles;
  const third = 180 - a - b;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const side = Math.sin(toRad(b)) / Math.sin(toRad(third));
  const corners = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: side * Math.cos(toRad(a)), y: side * Math.sin(toRad(a)) },
  ];

  const labels = [`${a}°`, `${b}°`, "?"];
  const vertexAngles = [a, b, third];
  const halfLabels = labels.map((label) => (label === "?" ? 4.5 : 8));

  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const base = Math.min(86 / (Math.max(...xs) - Math.min(...xs)), 52 / (Math.max(...ys) - Math.min(...ys)));

  const layout = (scale: number) => {
    const points = corners.map((corner) => ({
      x: (corner.x - Math.min(...xs)) * scale,
      y: -(corner.y - Math.min(...ys)) * scale,
    }));

    return points.map((point, index) => {
      const others = points.filter((_, other) => other !== index);
      const directions = others.map((other) => unitVector(point, other));
      const shortest = Math.min(...others.map((other) => Math.hypot(other.x - point.x, other.y - point.y)));

      const bisector = { x: directions[0].x + directions[1].x, y: directions[0].y + directions[1].y };
      const length = Math.hypot(bisector.x, bisector.y) || 1;
      const needed = (halfLabels[index] + 5) / Math.sin(toRad(vertexAngles[index] / 2));

      return {
        point,
        directions,
        needed,
        room: shortest * 0.45,
        label: {
          x: point.x + (bisector.x / length) * needed,
          y: point.y + (bisector.y / length) * needed,
        },
        arc: Math.min(shortest * 0.3, 11),
      };
    });
  };

  const trial = layout(base);
  const growth = Math.min(Math.max(...trial.map((entry) => entry.needed / entry.room), 1), 2.6);
  const placements = layout(base * growth);

  const bounds = placements.flatMap((entry) => [
    { x: entry.point.x, y: entry.point.y },
    { x: entry.label.x - 10, y: entry.label.y - 6 },
    { x: entry.label.x + 10, y: entry.label.y + 6 },
  ]);
  const minX = Math.min(...bounds.map((point) => point.x)) - 6;
  const minY = Math.min(...bounds.map((point) => point.y)) - 6;
  const width = Math.max(...bounds.map((point) => point.x)) + 6 - minX;
  const height = Math.max(...bounds.map((point) => point.y)) + 6 - minY;

  return (
    <svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="w-full"
      style={{ maxWidth: Math.min(150 + width * 0.8, 280) }}
    >
      <polygon
        points={placements.map((entry) => `${entry.point.x},${entry.point.y}`).join(" ")}
        {...stroke}
      />
      {placements.map((entry, index) => (
        <path
          key={`arc${index}`}
          d={angleArc(entry.point, entry.directions[0], entry.directions[1], entry.arc)}
          {...stroke}
          strokeWidth={1}
        />
      ))}
      {placements.map((entry, index) => (
        <text
          key={index}
          x={entry.label.x}
          y={entry.label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...labelProps}
          fontSize={9}
        >
          {labels[index]}
        </text>
      ))}
    </svg>
  );
}

function AdjacentAngles({ angle }: { angle: number }) {
  const vertex = { x: 60, y: 54 };
  const reach = 44;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const ray = {
    x: vertex.x + reach * Math.cos(toRad(angle)),
    y: vertex.y - reach * Math.sin(toRad(angle)),
  };
  const label = (deg: number, text: string) => ({
    x: vertex.x + 24 * Math.cos(toRad(deg)),
    y: vertex.y - 24 * Math.sin(toRad(deg)) + 3,
    text,
  });

  const marks = [label(angle / 2, `${angle}°`), label((180 + angle) / 2, "?")];

  const right = { x: 1, y: 0 };
  const left = { x: -1, y: 0 };
  const along = unitVector(vertex, ray);

  return (
    <svg viewBox="0 0 120 68" className="w-full max-w-[170px]">
      <line x1={vertex.x - reach} y1={vertex.y} x2={vertex.x + reach} y2={vertex.y} {...stroke} />
      <line x1={vertex.x} y1={vertex.y} x2={ray.x} y2={ray.y} {...stroke} />
      <path d={angleArc(vertex, right, along, 13)} {...stroke} strokeWidth={1} />
      <path d={angleArc(vertex, along, left, 13)} {...stroke} strokeWidth={1} />
      {marks.map((mark, index) => (
        <text key={index} x={mark.x} y={mark.y} textAnchor="middle" {...labelProps} fontSize={8}>
          {mark.text}
        </text>
      ))}
    </svg>
  );
}

function ParallelLines({ angle }: { angle: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const topY = 16;
  const bottomY = 58;
  const shift = (bottomY - topY) / Math.tan(toRad(angle));
  const topX = 54;
  const bottomX = topX + shift;
  const top = { x: topX, y: topY };
  const bottom = { x: bottomX, y: bottomY };
  const right = { x: 1, y: 0 };

  return (
    <svg viewBox="0 0 120 74" className="w-full max-w-[170px]">
      <line x1={10} y1={topY} x2={110} y2={topY} {...stroke} />
      <line x1={10} y1={bottomY} x2={110} y2={bottomY} {...stroke} />
      <line
        x1={topX - shift * 0.55}
        y1={topY - 12}
        x2={bottomX + shift * 0.55}
        y2={bottomY + 12}
        {...stroke}
      />
      <path d={angleArc(top, right, unitVector(top, bottom), 11)} {...stroke} strokeWidth={1} />
      <path d={angleArc(bottom, unitVector(bottom, top), right, 11)} {...stroke} strokeWidth={1} />
      <text x={topX + 14} y={topY + 11} {...labelProps} fontSize={8}>
        {`${angle}°`}
      </text>
      <text x={bottomX + 14} y={bottomY - 6} {...labelProps} fontSize={8}>
        ?
      </text>
    </svg>
  );
}

function Polygon({ sides }: { sides: number }) {
  const radius = 30;
  const center = { x: 60, y: 38 };
  const points = Array.from({ length: sides }, (_, index) => {
    const theta = (index / sides) * 2 * Math.PI - Math.PI / 2;
    return `${center.x + radius * Math.cos(theta)},${center.y + radius * Math.sin(theta)}`;
  });

  return (
    <svg viewBox="0 0 120 76" className="w-full max-w-[150px]">
      <polygon points={points.join(" ")} {...stroke} />
    </svg>
  );
}

function Box({ a, b, c, unit }: { a: Measure; b: Measure; c: Measure; unit?: string }) {
  const w = 58;
  const h = 34;
  const d = 18;
  const left = 22;
  const top = 20;

  return (
    <svg viewBox="0 0 120 82" className="w-full max-w-[155px]">
      <rect x={left} y={top + d} width={w} height={h} {...stroke} />
      <polygon points={`${left},${top + d} ${left + d},${top} ${left + w + d},${top} ${left + w},${top + d}`} {...stroke} />
      <polygon
        points={`${left + w},${top + d} ${left + w + d},${top} ${left + w + d},${top + h} ${left + w},${top + d + h}`}
        {...stroke}
      />
      <text x={left + w / 2} y={top + d + h + 13} textAnchor="middle" {...labelProps}>
        {withUnit(a, unit)}
      </text>
      <text x={left - 4} y={top + d + h / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(b, unit)}
      </text>
      <text x={left + w + d + 3} y={top + h / 2 + 2} textAnchor="start" dominantBaseline="middle" {...labelProps}>
        {withUnit(c, unit)}
      </text>
    </svg>
  );
}

function Cylinder({ radius, height, unit }: { radius: Measure; height: Measure; unit?: string }) {
  const cx = 56;
  const rx = 26;
  const ry = 8;
  const top = 20;
  const bottom = 60;

  return (
    <svg viewBox="0 0 120 82" className="w-full max-w-[150px]">
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} {...stroke} />
      <path d={`M ${cx - rx} ${top} L ${cx - rx} ${bottom}`} {...stroke} />
      <path d={`M ${cx + rx} ${top} L ${cx + rx} ${bottom}`} {...stroke} />
      <path d={`M ${cx - rx} ${bottom} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bottom}`} {...stroke} />
      <line x1={cx} y1={top} x2={cx + rx} y2={top} {...stroke} strokeWidth={1} strokeDasharray="3 3" />
      <text x={cx + rx / 2} y={top - 4} textAnchor="middle" {...labelProps} fontSize={8}>
        {withUnit(radius, unit)}
      </text>
      <text x={cx + rx + 4} y={(top + bottom) / 2} textAnchor="start" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function Cone({ radius, height, unit }: { radius: Measure; height: Measure; unit?: string }) {
  const cx = 54;
  const rx = 24;
  const ry = 7;
  const apex = 16;
  const base = 60;

  return (
    <svg viewBox="0 0 120 82" className="w-full max-w-[150px]">
      <path d={`M ${cx - rx} ${base} L ${cx} ${apex} L ${cx + rx} ${base}`} {...stroke} />
      <ellipse cx={cx} cy={base} rx={rx} ry={ry} {...stroke} />
      <line x1={cx} y1={apex} x2={cx} y2={base} {...stroke} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={cx} y1={base} x2={cx + rx} y2={base} {...stroke} strokeWidth={1} strokeDasharray="3 3" />
      <text x={cx + rx / 2} y={base + 13} textAnchor="middle" {...labelProps} fontSize={8}>
        {withUnit(radius, unit)}
      </text>
      <text x={cx - 4} y={(apex + base) / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function Pyramid({ base, height, unit }: { base: Measure; height: Measure; unit?: string }) {
  const cx = 54;
  const half = 26;
  const ry = 8;
  const apex = 16;
  const bottom = 58;

  return (
    <svg viewBox="0 0 120 82" className="w-full max-w-[150px]">
      <polygon points={`${cx - half},${bottom} ${cx + half},${bottom} ${cx},${apex}`} {...stroke} />
      <path d={`M ${cx - half} ${bottom} L ${cx} ${bottom + ry} L ${cx + half} ${bottom}`} {...stroke} />
      <line x1={cx} y1={apex} x2={cx} y2={bottom + ry / 2} {...stroke} strokeWidth={1} strokeDasharray="3 3" />
      <text x={cx} y={bottom + ry + 12} textAnchor="middle" {...labelProps} fontSize={8}>
        {withUnit(base, unit)}
      </text>
      <text x={cx - 4} y={(apex + bottom) / 2} textAnchor="end" dominantBaseline="middle" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function ParallelogramAngle({ angle }: { angle: number }) {
  const top = 18;
  const bottom = 54;
  const left = 26;
  const w = 52;
  const skew = 16;

  return (
    <svg viewBox="0 0 120 74" className="w-full max-w-[160px]">
      <polygon
        points={`${left},${bottom} ${left + w},${bottom} ${left + w + skew},${top} ${left + skew},${top}`}
        {...stroke}
      />
      <text x={left + 15} y={bottom - 7} textAnchor="middle" {...labelProps} fontSize={8}>
        {`${angle}°`}
      </text>
      <text x={left + w - 9} y={bottom - 7} textAnchor="middle" {...labelProps} fontSize={8}>
        ?
      </text>
    </svg>
  );
}

function IsoscelesApex({ apex }: { apex: number }) {
  const cx = 58;
  const top = 14;
  const bottom = 56;
  const half = 30;

  return (
    <svg viewBox="0 0 120 74" className="w-full max-w-[155px]">
      <polygon points={`${cx},${top} ${cx - half},${bottom} ${cx + half},${bottom}`} {...stroke} />
      <text x={cx} y={top + 14} textAnchor="middle" {...labelProps} fontSize={8}>
        {`${apex}°`}
      </text>
      <text x={cx - half + 11} y={bottom - 5} textAnchor="middle" {...labelProps} fontSize={8}>
        ?
      </text>
    </svg>
  );
}

function QuadAngles({ angles }: { angles: number[] }) {
  const corners = [
    { x: 26, y: 16 },
    { x: 94, y: 20 },
    { x: 86, y: 58 },
    { x: 32, y: 54 },
  ];
  const inward = [
    { x: 12, y: 12 },
    { x: -14, y: 11 },
    { x: -11, y: -12 },
    { x: 13, y: -11 },
  ];

  return (
    <svg viewBox="0 0 120 74" className="w-full max-w-[160px]">
      <polygon points={corners.map((corner) => `${corner.x},${corner.y}`).join(" ")} {...stroke} />
      {corners.map((corner, index) => (
        <text
          key={index}
          x={corner.x + inward[index].x}
          y={corner.y + inward[index].y}
          textAnchor="middle"
          dominantBaseline="middle"
          {...labelProps}
          fontSize={8}
        >
          {index < angles.length ? `${angles[index]}°` : "?"}
        </text>
      ))}
    </svg>
  );
}

function TrapezoidAngle({ angle }: { angle: number }) {
  const top = 18;
  const bottom = 56;

  return (
    <svg viewBox="0 0 120 74" className="w-full max-w-[160px]">
      <polygon points={`22,${bottom} 98,${bottom} 84,${top} 36,${top}`} {...stroke} />
      <text x={38} y={bottom - 7} textAnchor="middle" {...labelProps} fontSize={8}>
        {`${angle}°`}
      </text>
      <text x={42} y={top + 12} textAnchor="middle" {...labelProps} fontSize={8}>
        ?
      </text>
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
  switch (figure.kind) {
    case "rect":
      return <Rect width={figure.width} height={figure.height} unit={figure.unit} />;
    case "triangle":
      return <Triangle base={figure.base} height={figure.height} unit={figure.unit} />;
    case "circle":
      return <Circle value={figure.value} label={figure.label} unit={figure.unit} />;
    case "parallelogram":
      return <Parallelogram base={figure.base} height={figure.height} unit={figure.unit} />;
    case "right-triangle":
      return (
        <RightTriangle
          a={figure.a}
          b={figure.b}
          c={figure.c}
          markAngle={figure.markAngle}
          unit={figure.unit}
        />
      );
    case "rect-semicircle":
      return <RectSemicircle width={figure.width} height={figure.height} unit={figure.unit} />;
    case "rect-cutout":
      return (
        <RectCutout
          width={figure.width}
          height={figure.height}
          cut={figure.cut}
          unit={figure.unit}
        />
      );
    case "box":
      return <Box a={figure.a} b={figure.b} c={figure.c} unit={figure.unit} />;
    case "cylinder":
      return <Cylinder radius={figure.radius} height={figure.height} unit={figure.unit} />;
    case "cone":
      return <Cone radius={figure.radius} height={figure.height} unit={figure.unit} />;
    case "pyramid":
      return <Pyramid base={figure.base} height={figure.height} unit={figure.unit} />;
    case "parallelogram-angle":
      return <ParallelogramAngle angle={figure.angle} />;
    case "isosceles-apex":
      return <IsoscelesApex apex={figure.apex} />;
    case "quad-angles":
      return <QuadAngles angles={figure.angles} />;
    case "trapezoid-angle":
      return <TrapezoidAngle angle={figure.angle} />;
    case "triangle-angles":
      return <TriangleAngles angles={figure.angles} />;
    case "adjacent-angles":
      return <AdjacentAngles angle={figure.angle} />;
    case "parallel-lines":
      return <ParallelLines angle={figure.angle} />;
    case "polygon":
      return <Polygon sides={figure.sides} />;
    case "axes":
      return (
        <Axes min={figure.min} max={figure.max} points={figure.points} line={figure.line} />
      );
  }
}
