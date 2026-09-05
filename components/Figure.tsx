import type { Figure as FigureData, Point } from "@/lib/figure";

const stroke = { stroke: "currentColor", fill: "none", strokeWidth: 1.5 } as const;
const labelProps = {
  fill: "currentColor",
  fontSize: 9,
  fontFamily: "inherit",
  style: { direction: "ltr" as const, unicodeBidi: "isolate" as const },
};

function withUnit(value: number, unit?: string): string {
  return unit ? `${value} ${unit}` : String(value);
}

function Rect({ width, height, unit }: { width: number; height: number; unit?: string }) {
  const scale = Math.min(74 / width, 46 / height);
  const w = width * scale;
  const h = height * scale;

  return (
    <svg viewBox="0 0 120 78" className="w-full max-w-[150px]">
      <rect x={28} y={10} width={w} height={h} {...stroke} />
      <text x={28 + w / 2} y={10 + h + 14} textAnchor="middle" {...labelProps}>
        {withUnit(width, unit)}
      </text>
      <text x={22} y={10 + h / 2 + 3} textAnchor="end" {...labelProps}>
        {withUnit(height, unit)}
      </text>
    </svg>
  );
}

function Triangle({ base, height, unit }: { base: number; height: number; unit?: string }) {
  const scale = Math.min(74 / base, 46 / height);
  const w = base * scale;
  const h = height * scale;
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

function Circle({ value, label, unit }: { value: number; label: string; unit?: string }) {
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
  const raw = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: side * Math.cos(toRad(a)), y: side * Math.sin(toRad(a)) },
  ];

  const xs = raw.map((point) => point.x);
  const ys = raw.map((point) => point.y);
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanY = Math.max(...ys) - Math.min(...ys);
  const scale = Math.min(84 / spanX, 46 / spanY);

  const points = raw.map((point) => ({
    x: 18 + (point.x - Math.min(...xs)) * scale,
    y: 62 - (point.y - Math.min(...ys)) * scale,
  }));

  const centroid = {
    x: (points[0].x + points[1].x + points[2].x) / 3,
    y: (points[0].y + points[1].y + points[2].y) / 3,
  };

  const labels = [`${a}°`, `${b}°`, "?"];

  return (
    <svg viewBox="0 0 120 74" className="w-full max-w-[170px]">
      <polygon points={points.map((point) => `${point.x},${point.y}`).join(" ")} {...stroke} />
      {points.map((point, index) => (
        <text
          key={index}
          x={point.x + (centroid.x - point.x) * 0.32}
          y={point.y + (centroid.y - point.y) * 0.32 + 3}
          textAnchor="middle"
          {...labelProps}
          fontSize={8}
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

  return (
    <svg viewBox="0 0 120 68" className="w-full max-w-[170px]">
      <line x1={vertex.x - reach} y1={vertex.y} x2={vertex.x + reach} y2={vertex.y} {...stroke} />
      <line x1={vertex.x} y1={vertex.y} x2={ray.x} y2={ray.y} {...stroke} />
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
      <text x={topX + 7} y={topY - 3} {...labelProps} fontSize={8}>
        {`${angle}°`}
      </text>
      <text x={bottomX + 7} y={bottomY - 3} {...labelProps} fontSize={8}>
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
