import Link from "next/link";
import { grades } from "@/lib/curriculum";
import type { Grade } from "@/lib/types";

const gradeLetters: Record<number, string> = {
  1: "א",
  2: "ב",
  3: "ג",
  4: "ד",
  5: "ה",
  6: "ו",
  7: "ז",
  8: "ח",
  9: "ט",
  10: "י",
  11: "י\"א",
  12: "י\"ב",
};

const bands = [
  { label: "יסודי", range: "א׳–ו׳", ids: [1, 2, 3, 4, 5, 6] },
  { label: "חטיבת ביניים", range: "ז׳–ט׳", ids: [7, 8, 9] },
  { label: "תיכון", range: "י׳–י״ב", ids: [10, 11, 12] },
];

function sampleTopics(grade: Grade): string {
  return grade.topics
    .slice(0, 3)
    .map((topic) => topic.name)
    .join(" · ");
}

const chipSize = "size-14 text-xl";

function GradeChip({ grade }: { grade: Grade }) {
  if (!grade.available) {
    return (
      <li
        title="בקרוב"
        className={`flex ${chipSize} items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] font-bold text-[var(--color-subtle)] opacity-60`}
      >
        <span aria-hidden="true">{gradeLetters[grade.id]}</span>
        <span className="sr-only">{grade.name} — בקרוב</span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/grade/${grade.id}`}
        title={sampleTopics(grade)}
        aria-label={grade.name}
        className={`flex ${chipSize} items-center justify-center rounded-lg border border-[var(--color-border)] bg-white font-bold text-[var(--color-foreground)] transition-colors duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]`}
      >
        <span aria-hidden="true">{gradeLetters[grade.id]}</span>
      </Link>
    </li>
  );
}

export default function GradePicker({ heading }: { heading: string }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">{heading}</h2>
      <div className="flex flex-col gap-5">
        {bands.map((band) => (
          <div key={band.label}>
            <h3 className="mb-2 text-sm font-medium text-[var(--color-subtle)]">
              {band.label}{" "}
              <span className="font-normal" dir="rtl">
                ({band.range})
              </span>
            </h3>
            <ul className="flex flex-wrap gap-3">
              {band.ids.map((id) => {
                const grade = grades.find((candidate) => candidate.id === id);
                return grade ? <GradeChip key={id} grade={grade} /> : null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
