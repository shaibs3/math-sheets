export type Point = { x: number; y: number };

export type Figure =
  | { kind: "rect"; width: number; height: number; unit?: string }
  | { kind: "triangle"; base: number; height: number; unit?: string }
  | { kind: "circle"; value: number; label: "radius" | "diameter"; unit?: string }
  | { kind: "triangle-angles"; angles: [number, number] }
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

export function figureValues(figure: Figure): number[] {
  switch (figure.kind) {
    case "rect":
      return [figure.width, figure.height];
    case "triangle":
      return [figure.base, figure.height];
    case "circle":
      return [figure.value];
    case "triangle-angles":
      return figure.angles;
    case "adjacent-angles":
    case "parallel-lines":
      return [figure.angle];
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
  const stated = new Set(promptNumbers(prompt));
  return figureValues(figure).every((value) => stated.has(value) || stated.has(Math.abs(value)));
}
