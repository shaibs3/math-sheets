import { Fragment } from "react";

const fractionToken = /^(\d+)\/(\d+)([.,?!:;)]*)$/;

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

export default function MathText({ text }: { text: string }) {
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
