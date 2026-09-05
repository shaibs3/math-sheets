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
    case "axes":
      return (
        <Axes min={figure.min} max={figure.max} points={figure.points} line={figure.line} />
      );
  }
}
