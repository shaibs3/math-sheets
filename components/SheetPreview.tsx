import MathText from "./MathText";
import type { Problem } from "@/lib/types";

export default function SheetPreview({
  title,
  problems,
}: {
  title: string;
  problems: Problem[];
}) {
  return (
    <div
      aria-hidden="true"
      className="aspect-[210/297] w-full max-w-[300px] rotate-2 rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-lg sm:max-w-[340px]"
    >
      <div className="mb-3 border-b-2 border-[var(--color-foreground)] pb-2">
        <p className="text-sm font-bold">{title}</p>
      </div>
      <ol className="space-y-3">
        {problems.map((problem, index) => (
          <li key={index} className="flex gap-2 text-sm">
            <span className="font-semibold text-[var(--color-subtle)]">{index + 1}.</span>
            <span dir={problem.dir ?? "ltr"} className="grow">
              <MathText text={problem.prompt} />
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 space-y-2">
        <div className="h-px bg-[var(--color-rule)]" />
        <div className="h-px bg-[var(--color-rule)]" />
        <div className="h-px bg-[var(--color-rule)]" />
      </div>
    </div>
  );
}
