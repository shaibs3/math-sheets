import { Suspense } from "react";
import { PROGRESS_ENABLED } from "@/lib/features";
import { notFound } from "next/navigation";
import MixedSheet from "@/components/MixedSheet";
import PrintControls from "@/components/PrintControls";
import { getGrade } from "@/lib/curriculum";
import { clampLevel } from "@/lib/levels";
import { buildMixedSheet, type MixedSpec } from "@/lib/mixed";
import type { Level } from "@/lib/types";

const PROBLEMS_PER_TOPIC = 2;
const DEFAULT_SEED = 240601;

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export default async function MivdakPage({
  params,
  searchParams,
}: PageProps<"/mivdak/[grade]">) {
  const { grade: gradeParam } = await params;
  const query = await searchParams;

  const gradeId = Number(gradeParam);
  const grade = getGrade(gradeId);
  if (!PROGRESS_ENABLED) notFound();
  if (!grade?.available) notFound();

  const seed = clamp(Number(query.seed), 1, 9999999, DEFAULT_SEED);
  const level = clamp(Number(query.level), 1, 3, 1) as Level;
  const answers = query.answers === "1";

  const specs: MixedSpec[] = grade.topics.map((topic) => ({
    topicId: topic.id,
    generatorId: topic.generatorId,
    level: clampLevel(topic, level),
    count: PROBLEMS_PER_TOPIC,
  }));

  const sheet = buildMixedSheet(specs, seed);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <Suspense>
        <PrintControls answers={answers} seed={seed} />
      </Suspense>

      <MixedSheet
        gradeId={gradeId}
        title={`מבדק — ${grade.name}`}
        subtitle={`${sheet.problems.length} תרגילים מכל נושאי הכיתה. סמנו את התוצאות כדי לדעת על מה לעבוד.`}
        seed={seed}
        sheet={sheet}
        specs={specs}
        answers={answers}
      />
    </main>
  );
}
