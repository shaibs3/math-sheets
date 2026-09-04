"use client";

import Link from "next/link";
import { dueSkills } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";

export default function DueBanner({ gradeId }: { gradeId: number }) {
  const { state, mounted } = useProgress();
  if (!mounted) return null;

  const due = dueSkills(state, new Date());
  if (due.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-primary)] bg-white p-4 shadow-sm">
      <p className="font-medium">
        לתרגול היום: {due.length} {due.length === 1 ? "נושא" : "נושאים"}
      </p>
      <Link
        href={`/review/${gradeId}`}
        className="flex min-h-11 items-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-on-primary)] transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
      >
        לדף החזרה
      </Link>
    </div>
  );
}
