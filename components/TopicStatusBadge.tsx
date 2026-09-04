"use client";

import { topicStatus } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";
import type { SkillStatus } from "@/lib/progress/types";

const labels: Record<SkillStatus, string> = {
  new: "",
  due: "לחזרה",
  learning: "בתהליך",
  strong: "חזק",
};

const styles: Record<SkillStatus, string> = {
  new: "",
  due: "bg-[var(--color-accent)] text-white",
  learning: "bg-[var(--color-secondary)]/20 text-amber-800",
  strong: "bg-emerald-100 text-emerald-800",
};

export default function TopicStatusBadge({ topicId }: { topicId: string }) {
  const { skills, mounted } = useProgress();
  if (!mounted) return null;

  const status = topicStatus(skills, topicId, new Date());
  if (status === "new") return null;

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
