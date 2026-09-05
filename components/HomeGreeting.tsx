"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { gradeForTopic } from "@/lib/curriculum";
import { dueSkills, eventsForProfile } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";

const FALLBACK_GRADE = 6;

export default function HomeGreeting({ children }: { children: ReactNode }) {
  const { state, skills, activeProfile, mounted } = useProgress();

  if (!mounted || !activeProfile) return <>{children}</>;

  const events = eventsForProfile(state, activeProfile.id);
  const latest = events[events.length - 1];
  const grade = latest ? gradeForTopic(latest.topicId) : undefined;
  const gradeId = grade?.id ?? FALLBACK_GRADE;
  const due = dueSkills(skills, new Date());

  return (
    <>
      <section className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
        <p className="text-sm text-[var(--color-subtle)]">
          שלום, {activeProfile.nickname}
          {grade ? ` · ${grade.name}` : ""}
        </p>

        <Link
          href={due.length > 0 ? `/review/${gradeId}` : `/grade/${gradeId}`}
          className="mt-3 flex min-h-14 w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-base font-bold text-[var(--color-on-primary)] transition-colors duration-150 hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          {due.length > 0
            ? `הדפיסו את דף החזרה של ${activeProfile.nickname}`
            : `הדפיסו דף תרגול ל${grade ? grade.name : "כיתה"}`}
        </Link>

        <p className="mt-2 text-center text-sm text-[var(--color-subtle)]">
          {due.length > 0 ? (
            <>
              <span dir="ltr">{due.length}</span>{" "}
              {due.length === 1 ? "נושא לתרגול היום" : "נושאים לתרגול היום"}
            </>
          ) : (
            "אין נושאים לחזרה היום"
          )}
        </p>
      </section>

      <details className="mt-8 rounded-xl border border-[var(--color-border)] bg-white/60 p-5">
        <summary className="cursor-pointer font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]">
          כיתה אחרת
        </summary>
        <div className="mt-5">{children}</div>
      </details>
    </>
  );
}
