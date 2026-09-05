import MathText from "./MathText";
import type { Problem } from "@/lib/types";

export default function AnswerKey({ problems, title }: { problems: Problem[]; title: string }) {
  return (
    <section className="print-page-break mt-12 border-t-2 border-black pt-6">
      <h2 className="mb-4 text-xl font-bold">פתרונות ל{title}</h2>
      <ol className="grid grid-cols-2 gap-x-8 gap-y-2 leading-loose sm:grid-cols-3">
        {problems.map((problem, index) => (
          <li key={index} className="print-keep flex items-baseline gap-2">
            <span className="font-semibold text-slate-500">{index + 1}.</span>
            <span dir={problem.dir ?? "ltr"}>
              <MathText text={problem.answer} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
