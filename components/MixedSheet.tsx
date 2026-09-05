import AnswerKey from "./AnswerKey";
import MarkResults from "./MarkResults";
import ProblemList from "./ProblemList";
import type { MixedSheet as MixedSheetData, MixedSpec } from "@/lib/mixed";

type Props = {
  gradeId: number;
  title: string;
  subtitle: string;
  seed: number;
  sheet: MixedSheetData;
  specs: MixedSpec[];
  answers: boolean;
};

export default function MixedSheet({
  gradeId,
  title,
  subtitle,
  seed,
  sheet,
  specs,
  answers,
}: Props) {
  return (
    <>
      <article className="rounded-xl border border-[var(--color-border)] bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="mb-6 border-b-2 border-black pb-3">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-slate-600 print:text-black">{subtitle}</p>
        </header>

        <ProblemList problems={sheet.problems} columns={sheet.columns} />
        {answers && <AnswerKey problems={sheet.problems} title={title} />}
      </article>

      <MarkResults gradeId={gradeId} specs={specs} skillIds={sheet.skillIds} seed={seed} />
    </>
  );
}
