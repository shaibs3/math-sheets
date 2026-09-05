export type TextSegment = { text: string; isolated: boolean };

const patterns = [
  /\(\s*[-−]?\d+(?:\.\d+)?\s*,\s*[-−]?\d+(?:\.\d+)?\s*\)/,
  /[a-z]\s*=\s*[-−]?\d*(?:\.\d+)?x?(?:\s*[+-−]\s*\d+(?:\.\d+)?)?/,
  /\([^()֐-׿]{2,24}\)(?:\s*\([^()֐-׿]{2,24}\))?/,
  /(?<![\d.֐-׿])[-−]\d+(?:\.\d+)?/,
  /\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?/,
];

const mathSegment = new RegExp(patterns.map((pattern) => pattern.source).join("|"), "g");

export function splitMathSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(mathSegment)) {
    const start = match.index ?? 0;
    if (start > cursor) segments.push({ text: text.slice(cursor, start), isolated: false });
    segments.push({ text: match[0], isolated: true });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), isolated: false });

  return segments;
}
