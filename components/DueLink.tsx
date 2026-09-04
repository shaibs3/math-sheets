"use client";

import Link from "next/link";
import { dueSkills } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";

const DEFAULT_GRADE = 6;

export default function DueLink() {
  const { state, mounted } = useProgress();
  if (!mounted) return null;

  const due = dueSkills(state, new Date());
  if (due.length === 0) return null;

  return (
    <Link
      href={`/review/${DEFAULT_GRADE}`}
      className="mr-auto flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
    >
      חזרה יומית
      <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
        {due.length}
      </span>
    </Link>
  );
}
