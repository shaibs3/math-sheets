import { Suspense } from "react";
import { notFound } from "next/navigation";
import AnswerKey from "@/components/AnswerKey";
import MarkResults from "@/components/MarkResults";
import ProblemList from "@/components/ProblemList";
import SheetControls from "@/components/SheetControls";
import WorksheetHeader from "@/components/WorksheetHeader";
import { getTopic } from "@/lib/curriculum";
import { getGenerator } from "@/lib/generators";
import { skillId } from "@/lib/progress/schedule";
import type { Level } from "@/lib/types";

function defaultSeed(topicId: string): number {
  let hash = 0;
  for (const char of topicId) hash = (hash * 31 + char.charCodeAt(0)) % 900000;
  return hash + 100000;
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export default async function SheetPage({
  params,
  searchParams,
}: PageProps<"/sheet/[grade]/[topic]">) {
  const { grade: gradeParam, topic: topicParam } = await params;
  const query = await searchParams;

  const gradeId = Number(gradeParam);
  const topic = getTopic(gradeId, topicParam);
  const generator = topic && getGenerator(topic.generatorId);
  if (!topic || !generator) notFound();

  const seed = clamp(Number(query.seed), 1, 9999999, defaultSeed(topic.id));
  const count = clamp(Number(query.count), 4, 60, generator.defaultCount);
  const level = clamp(Number(query.level), 1, 3, 1) as Level;
  const answers = query.answers === "1";

  const problems = generator.generate({ seed, count, level });
  const specs = [{ topicId: topic.id, generatorId: topic.generatorId, level, count }];
  const skillIds = problems.map(() => skillId(topic.id, level));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
      <Suspense>
        <SheetControls seed={seed} count={count} level={level} answers={answers} />
      </Suspense>

      <article className="rounded-xl border border-[var(--color-border)] bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <WorksheetHeader
          topicId={topic.id}
          title={topic.name}
          strand={topic.strand}
          seed={seed}
        />
        <ProblemList problems={problems} columns={generator.columns} />
        {answers && <AnswerKey problems={problems} title={topic.name} />}
      </article>

      <MarkResults gradeId={gradeId} specs={specs} skillIds={skillIds} seed={seed} />
    </main>
  );
}
