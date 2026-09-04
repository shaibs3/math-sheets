import MathText from "./MathText";
import type { Problem } from "@/lib/types";

const columnClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const workHeights: Record<string, string> = {
  none: "h-6",
  lines: "h-16",
  vertical: "h-24",
  box: "h-20",
};

export default function ProblemList({
  problems,
  columns,
}: {
  problems: Problem[];
  columns: number;
}) {
  return (
    <ol className={`grid gap-x-8 gap-y-4 ${columnClasses[columns] ?? columnClasses[2]}`}>
      {problems.map((problem, index) => (
        <li key={index} className="print-keep border-b border-dashed border-slate-300 pb-2">
          <div className="flex gap-2">
            <span className="font-semibold text-slate-500">{index + 1}.</span>
            <span dir={problem.dir ?? "ltr"} className="grow text-lg leading-loose">
              <MathText text={problem.prompt} />
            </span>
          </div>
          <div className={workHeights[problem.work ?? "lines"]} />
        </li>
      ))}
    </ol>
  );
}
