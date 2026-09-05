import Link from "next/link";
import GradePicker from "@/components/GradePicker";
import SheetPreview from "@/components/SheetPreview";
import TopicIcon from "@/components/TopicIcon";
import { getGrade, getTopic } from "@/lib/curriculum";
import { getGenerator } from "@/lib/generators";

const PREVIEW = { grade: 3, topic: "kefel-bemeunach" };

const SAMPLERS = [
  { grade: 4, topic: "shetach-vehekef-malben" },
  { grade: 6, topic: "hibur-hisur-shvarim" },
  { grade: 7, topic: "mishvaot-maala-rishona" },
];

function sample(gradeId: number, topicId: string, count: number) {
  const topic = getTopic(gradeId, topicId);
  const generator = topic ? getGenerator(topic.generatorId) : undefined;
  if (!topic || !generator) return null;
  return { topic, problems: generator.generate({ seed: 20260905, count, level: 2 }) };
}

export default function HomePage() {
  const preview = sample(PREVIEW.grade, PREVIEW.topic, 6);
  const samplers = SAMPLERS.map((entry) => ({ ...entry, data: sample(entry.grade, entry.topic, 2) }));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="paper-rule grid items-center gap-10 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <p className="text-sm font-bold tracking-wide text-[var(--color-primary)]">על הנייר</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            דף תרגול מוכן להדפסה, בפחות מדקה
          </h1>
          <p className="mt-4 max-w-md text-lg text-[var(--color-subtle)]">
            בוחרים כיתה ונושא, ומקבלים דף A4 עם פתרונות להורה. בלי הרשמה, בלי תשלום.
          </p>
          <Link
            href={`/sheet/${PREVIEW.grade}/${PREVIEW.topic}?seed=20260905&count=20`}
            className="mt-7 inline-flex min-h-14 items-center rounded-lg bg-[var(--color-primary)] px-6 text-base font-bold text-[var(--color-on-primary)] transition-colors duration-150 hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            לדף לדוגמה
          </Link>
        </div>

        {preview ? (
          <div className="order-last flex justify-center lg:order-none lg:justify-end">
            <SheetPreview title={preview.topic.name} problems={preview.problems} />
          </div>
        ) : null}
      </section>

      <GradePicker heading="באיזו כיתה הילד/ה?" />

      <section className="mt-16">
        <h2 className="mb-5 text-xl font-bold">מה יש בפנים</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {samplers.map((entry) =>
            entry.data ? (
              <li
                key={`${entry.grade}-${entry.topic}`}
                className="rounded-xl border border-[var(--color-border)] bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <TopicIcon topicId={entry.topic} className="size-8 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{entry.data.topic.name}</p>
                    <p className="text-xs text-[var(--color-subtle)]">
                      {getGrade(entry.grade)?.name}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-subtle)]">
                  {entry.data.problems.map((problem, index) => (
                    <li key={index} dir={problem.dir ?? "ltr"} className="truncate">
                      {problem.prompt.split("\n")[0]}
                    </li>
                  ))}
                </ul>
              </li>
            ) : null,
          )}
        </ul>
      </section>

      <p className="mt-12 text-center text-sm text-[var(--color-subtle)]">
        94 נושאים, מכיתה א׳ ועד י״ב.
      </p>
    </main>
  );
}
