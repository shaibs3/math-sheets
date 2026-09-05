import { Fragment } from "react";

const fractionToken = /^(\d+)\/(\d+)([.,?!:;)]*)$/;
const mathSegment = /\(-?\d+,\s*-?\d+\)|y\s*=\s*-?\d*x(?:\s*[+-]\s*\d+)?/g;

function StackedFraction({ numerator, denominator }: { numerator: string; denominator: string }) {
  return (
    <span
      className="inline-flex flex-col items-center align-middle leading-none"
      style={{ direction: "ltr" }}
    >
      <span className="px-1 pb-0.5">{numerator}</span>
      <span className="w-full border-t border-current" />
      <span className="px-1 pt-0.5">{denominator}</span>
    </span>
  );
}

function Plain({ text }: { text: string }) {
  const tokens = text.split(" ");

  return (
    <>
      {tokens.map((token, index) => {
        const match = fractionToken.exec(token);
        const separator = index > 0 ? " " : "";

        if (!match) {
          return <Fragment key={index}>{`${separator}${token}`}</Fragment>;
        }

        const [, numerator, denominator, trailing] = match;
        return (
          <Fragment key={index}>
            {separator}
            <StackedFraction numerator={numerator} denominator={denominator} />
            {trailing}
          </Fragment>
        );
      })}
    </>
  );
}

export default function MathText({ text }: { text: string }) {
  const parts: { text: string; isolated: boolean }[] = [];
  let cursor = 0;

  for (const match of text.matchAll(mathSegment)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push({ text: text.slice(cursor, start), isolated: false });
    parts.push({ text: match[0], isolated: true });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor), isolated: false });

  return (
    <>
      {parts.map((part, index) =>
        part.isolated ? (
          <span key={index} dir="ltr" style={{ unicodeBidi: "isolate" }}>
            {part.text}
          </span>
        ) : (
          <Plain key={index} text={part.text} />
        ),
      )}
    </>
  );
}
