export type Point = { x: number; y: number };

export type Measure = number | "?";

export type Figure =
  | { kind: "rect"; width: Measure; height: Measure; unit?: string }
  | { kind: "parallelogram"; base: Measure; height: Measure; unit?: string }
  | { kind: "triangle"; base: Measure; height: Measure; unit?: string }
  | { kind: "right-triangle"; a: Measure; b: Measure; c: Measure; markAngle?: boolean; unit?: string }
  | { kind: "circle"; value: Measure; label: "radius" | "diameter"; unit?: string }
  | { kind: "rect-semicircle"; width: Measure; height: Measure; unit?: string }
  | { kind: "rect-cutout"; width: Measure; height: Measure; cut: Measure; unit?: string }
  | { kind: "box"; a: Measure; b: Measure; c: Measure; unit?: string }
  | { kind: "cylinder"; radius: Measure; height: Measure; unit?: string }
  | { kind: "cone"; radius: Measure; height: Measure; unit?: string }
  | { kind: "pyramid"; base: Measure; height: Measure; unit?: string }
  | { kind: "triangle-angles"; angles: [number, number] }
  | { kind: "parallelogram-angle"; angle: number }
  | { kind: "isosceles-apex"; apex: number }
  | { kind: "quad-angles"; angles: number[] }
  | { kind: "trapezoid-angle"; angle: number }
  | { kind: "adjacent-angles"; angle: number }
  | { kind: "parallel-lines"; angle: number }
  | { kind: "polygon"; sides: number }
  | {
      kind: "axes";
      min: number;
      max: number;
      points?: Point[];
      line?: { m: number; b: number };
    };

function stated(...values: Measure[]): number[] {
  return values.filter((value): value is number => typeof value === "number");
}

export function figureValues(figure: Figure): number[] {
  switch (figure.kind) {
    case "rect":
    case "rect-semicircle":
      return stated(figure.width, figure.height);
    case "rect-cutout":
      return stated(figure.width, figure.height, figure.cut);
    case "parallelogram":
    case "triangle":
      return stated(figure.base, figure.height);
    case "right-triangle":
      return stated(figure.a, figure.b, figure.c);
    case "circle":
      return stated(figure.value);
    case "box":
      return stated(figure.a, figure.b, figure.c);
    case "cylinder":
    case "cone":
      return stated(figure.radius, figure.height);
    case "pyramid":
      return stated(figure.base, figure.height);
    case "triangle-angles":
      return figure.angles;
    case "quad-angles":
      return figure.angles;
    case "parallelogram-angle":
    case "trapezoid-angle":
    case "adjacent-angles":
    case "parallel-lines":
      return [figure.angle];
    case "isosceles-apex":
      return [figure.apex];
    case "polygon":
      return [figure.sides];
    case "axes":
      return [
        ...(figure.points ?? []).flatMap((point) => [point.x, point.y]),
        ...(figure.line ? [figure.line.m, figure.line.b] : []),
      ];
  }
}

const numberToken = /-?\d+(?:\.\d+)?/g;
const hebrewLetter = /[֐-׿]/;

export function promptNumbers(prompt: string): number[] {
  return [...prompt.matchAll(numberToken)].map((match) => {
    const start = match.index ?? 0;
    const negated = match[0].startsWith("-") && hebrewLetter.test(prompt[start - 1] ?? "");
    return Number(negated ? match[0].slice(1) : match[0]);
  });
}

export function figureMatchesPrompt(figure: Figure, prompt: string): boolean {
  const values = new Set(promptNumbers(prompt));
  return figureValues(figure).every((value) => values.has(value) || values.has(Math.abs(value)));
}
