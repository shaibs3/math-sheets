import type { StudyLevel } from "@/lib/types";

export default function StudyLevelBadge({ level }: { level: StudyLevel }) {
  return (
    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-subtle)] print:border-black print:text-black">
      {level} יח״ל
    </span>
  );
}
