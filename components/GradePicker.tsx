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
  { label: "יסודי", range: "א׳–ו׳", ids: [1, 2, 3, 4, 5, 6], primary: true, sheets: 1 },
  { label: "חטיבת ביניים", range: "ז׳–ט׳", ids: [7, 8, 9], primary: false, sheets: 2 },
  { label: "תיכון", range: "י׳–י״ב", ids: [10, 11, 12], primary: false, sheets: 3 },
];

function BandIcon({ sheets }: { sheets: number }) {
  const bars = [
    { x: 17, y: 14, height: 7 },
    { x: 10, y: 9, height: 12 },
    { x: 3, y: 4, height: 17 },
  ];

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 shrink-0 text-[var(--color-primary)]"
      fill="currentColor"
    >
      {bars.map((bar, index) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={4}
          height={bar.height}
          rx={1.5}
          opacity={index < sheets ? 1 : 0.2}
        />
      ))}
    </svg>
  );
}

function sampleTopics(grade: Grade): string {
  return grade.topics
    .slice(0, 3)
    .map((topic) => topic.name)
    .join(" · ");
}

function GradeTile({ grade, primary }: { grade: Grade; primary: boolean }) {
  return (
    <li>
      <Link
        href={`/grade/${grade.id}`}
        title={sampleTopics(grade)}
        aria-label={`${grade.name} — ${grade.topics.length} נושאים`}
        className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white transition-colors duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
          primary
            ? "min-h-20 border-[var(--color-primary)]/25"
            : "min-h-16 border-[var(--color-border)]"
        }`}
      >
        <span aria-hidden="true" className={primary ? "text-2xl font-extrabold" : "text-xl font-bold"}>
          {gradeLetters[grade.id]}
        </span>
        <span aria-hidden="true" className="text-[11px] text-[var(--color-subtle)]">
          {grade.topics.length} נושאים
        </span>
      </Link>
    </li>
  );
}

export default function GradePicker({ heading }: { heading: string }) {
  return (
    <section>
      <h2 className="mb-5 text-xl font-bold">{heading}</h2>
      <div className="flex flex-col gap-6">
        {bands.map((band) => (
          <div key={band.label}>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <BandIcon sheets={band.sheets} />
              {band.label}{" "}
              <span className="text-sm font-normal text-[var(--color-subtle)]" dir="rtl">
                ({band.range})
              </span>
            </h3>
            <ul
              className={`grid gap-3 ${
                band.primary ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-3 sm:max-w-md"
              }`}
            >
              {band.ids.map((id) => {
                const grade = grades.find((candidate) => candidate.id === id);
                return grade ? (
                  <GradeTile key={id} grade={grade} primary={band.primary} />
                ) : null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
