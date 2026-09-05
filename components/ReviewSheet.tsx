"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MixedSheet from "./MixedSheet";
import PrintControls from "./PrintControls";
import { getTopic } from "@/lib/curriculum";
import { clampLevel } from "@/lib/levels";
import { buildMixedSheet, type MixedSpec } from "@/lib/mixed";
import { dueSkills, daysUntil, nextDueAt, weakestSkills } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";

const MAX_SKILLS = 5;
const PROBLEMS_PER_SKILL = 4;

export function seedForDay(now: Date): number {
  return (now.getFullYear() % 100) * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export default function ReviewSheet({ gradeId }: { gradeId: number }) {
  const { skills, mounted } = useProgress();
  const searchParams = useSearchParams();
  const [practiceEarly, setPracticeEarly] = useState(false);

  if (!mounted) return null;

  const now = new Date();
  const answers = searchParams.get("answers") === "1";
  const seedParam = Number(searchParams.get("seed"));
  const seed = Number.isFinite(seedParam) && seedParam > 0 ? seedParam : seedForDay(now);

  const due = dueSkills(skills, now);
  const selected = due.length > 0 ? due : practiceEarly ? weakestSkills(skills, MAX_SKILLS) : [];

  const taken = new Set<string>();
  const specs: MixedSpec[] = selected.slice(0, MAX_SKILLS).flatMap((skill) => {
    const topic = getTopic(gradeId, skill.topicId);
    if (!topic) return [];
    const level = clampLevel(topic, skill.level);
    const key = `${topic.id}:${level}`;
    if (taken.has(key)) return [];
    taken.add(key);
    return [
      {
        topicId: topic.id,
        generatorId: topic.generatorId,
        level,
        count: PROBLEMS_PER_SKILL,
      },
    ];
  });

  if (specs.length === 0) {
    const upcoming = nextDueAt(skills, now);
    const tracked = Object.keys(skills).length > 0;

    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">אין נושאים לחזרה היום</h1>
        <p className="mt-2 text-slate-600">
          {upcoming
            ? `החזרה הבאה בעוד ${daysUntil(upcoming, now)} ימים. הרווח בין התרגולים הוא מה שגורם לחומר להישאר, ולכן נושא שסומן היום חוזר רק מחר.`
            : "דף החזרה נבנה מהנושאים שסימנתם בהם טעויות. אפשר להתחיל ממבדק קצר שיראה על מה כדאי לעבוד."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {tracked && (
            <button
              type="button"
              onClick={() => setPracticeEarly(true)}
              className="min-h-11 cursor-pointer rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-on-primary)] transition-colors duration-200 hover:bg-blue-700"
            >
              תרגול עכשיו בכל זאת
            </button>
          )}
          <Link
            href={`/mivdak/${gradeId}`}
            className={`flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors duration-200 ${
              tracked
                ? "border border-[var(--color-border)] hover:bg-[var(--color-muted)]"
                : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-blue-700"
            }`}
          >
            למבדק
          </Link>
          <Link
            href={`/grade/${gradeId}`}
            className="flex min-h-11 items-center rounded-lg border border-[var(--color-border)] px-4 text-sm font-medium transition-colors duration-200 hover:bg-[var(--color-muted)]"
          >
            לרשימת הנושאים
          </Link>
        </div>
      </div>
    );
  }

  const sheet = buildMixedSheet(specs, seed);
  const topicNames = specs
    .map((spec) => getTopic(gradeId, spec.topicId)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PrintControls answers={answers} seed={seed} />
      <MixedSheet
        gradeId={gradeId}
        title={due.length > 0 ? "דף חזרה" : "תרגול מוקדם"}
        subtitle={
          due.length > 0
            ? `נושאים לחזרה היום: ${topicNames}`
            : `הנושאים החלשים ביותר כרגע: ${topicNames}`
        }
        seed={seed}
        sheet={sheet}
        specs={specs}
        answers={answers}
      />
    </>
  );
}
