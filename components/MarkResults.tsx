"use client";

import Link from "next/link";
import { useState } from "react";
import { sliceBySkill, type MixedSpec } from "@/lib/mixed";
import { INTERVALS_IN_DAYS, skillId } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";
import type { AttemptInput } from "@/lib/progress/types";

type Props = {
  gradeId: number;
  specs: MixedSpec[];
  skillIds: string[];
  seed: number;
};

function nextReviewLabel(days: number): string {
  if (days === 1) return "מחר";
  if (days === 7) return "בעוד שבוע";
  if (days === 30) return "בעוד חודש";
  return `בעוד ${days} ימים`;
}

export default function MarkResults({ gradeId, specs, skillIds, seed }: Props) {
  const { skills, mounted, record, activeProfile } = useProgress();
  const [wrong, setWrong] = useState<number[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  if (!mounted) return null;

  const toggle = (index: number) => {
    setSavedAt(null);
    setWrong((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  const save = () => {
    const attempts: AttemptInput[] = sliceBySkill(specs, skillIds, wrong).map((slice) => ({
      topicId: slice.topicId,
      level: slice.level,
      seed,
      count: slice.count,
      wrong: slice.wrong,
    }));
    record(attempts);
    setSavedAt(Date.now());
  };

  const savedSkill =
    savedAt && specs.length === 1
      ? skills[skillId(specs[0].topicId, specs[0].level)]
      : undefined;

  return (
    <section className="no-print mt-6 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">סימון תוצאות</h2>
        {activeProfile && (
          <span className="text-sm text-slate-600">
            נשמר עבור <span className="font-semibold">{activeProfile.nickname}</span>
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        סמנו את מספרי התרגילים שהיא טעתה בהם. הנושאים שיסומנו יחזרו בדף חזרה בעוד כמה ימים.
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {skillIds.map((_, index) => {
          const isWrong = wrong.includes(index);
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={isWrong}
                aria-label={`תרגיל ${index + 1}${isWrong ? " — סומן כטעות" : ""}`}
                className={`size-11 cursor-pointer rounded-lg border text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                  isWrong
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] bg-white hover:bg-[var(--color-muted)]"
                }`}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          className="min-h-11 cursor-pointer rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-on-primary)] transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          שמירה
        </button>
        <span className="text-sm text-slate-600">
          {wrong.length === 0 ? "הכול נכון" : `${wrong.length} טעויות`}
        </span>
      </div>

      {savedAt && (
        <p role="status" className="mt-3 text-sm text-slate-700">
          נשמר.{" "}
          {savedSkill
            ? `חזרה על הנושא ${nextReviewLabel(INTERVALS_IN_DAYS[savedSkill.box])}.`
            : ""}{" "}
          <Link href={`/review/${gradeId}`} className="text-[var(--color-primary)] underline">
            לדף החזרה
          </Link>
        </p>
      )}
    </section>
  );
}
