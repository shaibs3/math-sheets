import { gcd } from "./math";

export function formatTerm(coefficient: number, symbol: string): string {
  const magnitude = Math.abs(coefficient);
  if (!symbol) return String(magnitude);
  return `${magnitude === 1 ? "" : magnitude}${symbol}`;
}

export function leadingTerm(coefficient: number, symbol: string): string {
  return `${coefficient < 0 ? "−" : ""}${formatTerm(coefficient, symbol)}`;
}

export function signedTerm(coefficient: number, symbol: string): string {
  return `${coefficient < 0 ? "−" : "+"} ${formatTerm(coefficient, symbol)}`;
}

export function formatPolynomial(terms: [number, string][]): string {
  const present = terms.filter(([coefficient]) => coefficient !== 0);
  if (present.length === 0) return "0";
  const [first, ...rest] = present;
  return [leadingTerm(first[0], first[1]), ...rest.map(([c, s]) => signedTerm(c, s))].join(" ");
}

export function formatLinear(xCoefficient: number, constant: number): string {
  return formatPolynomial([
    [xCoefficient, "x"],
    [constant, ""],
  ]);
}

export function formatQuadratic(a: number, b: number, c: number): string {
  return formatPolynomial([
    [a, "x²"],
    [b, "x"],
    [c, ""],
  ]);
}

export function formatRatio(numerator: number, denominator: number): string {
  const common = gcd(numerator, denominator);
  const orientation = denominator < 0 ? -1 : 1;
  const bottom = (denominator / common) * orientation;
  const top = (numerator / common) * orientation;
  const magnitude = bottom === 1 ? String(Math.abs(top)) : `${Math.abs(top)}/${bottom}`;
  return top < 0 ? `−${magnitude}` : magnitude;
}

export function formatSignedNumber(value: number): string {
  return value < 0 ? `−${Math.abs(value)}` : String(value);
}
