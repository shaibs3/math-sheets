export type Fraction = { n: number; d: number };

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export function reduce({ n, d }: Fraction): Fraction {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export function formatFraction(f: Fraction): string {
  const { n, d } = reduce(f);
  if (d === 1) return String(n);
  if (n > d) {
    const whole = Math.floor(n / d);
    const rest = n % d;
    if (rest === 0) return String(whole);
    return `${whole} ${rest}/${d}`;
  }
  return `${n}/${d}`;
}

export function mixedToFraction(whole: number, n: number, d: number): Fraction {
  return { n: whole * d + n, d };
}

export function formatMixed(whole: number, n: number, d: number): string {
  return whole === 0 ? `${n}/${d}` : `${whole} ${n}/${d}`;
}

export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number, decimals = 2): string {
  return String(round(value, decimals));
}
