import Link from "next/link";
import HeroIllustration from "@/components/HeroIllustration";
import { grades } from "@/lib/curriculum";

const gradeLetters: Record<number, string> = {
  1: "א",
  2: "ב",
  3: "ג",
  4: "ד",
  5: "ה",
  6: "ו",
};

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <section className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:max-w-md">
          <h1 className="text-3xl font-bold sm:text-4xl">דפי עבודה במתמטיקה</h1>
          <p className="mt-3 text-slate-600">
            בוחרים כיתה, בוחרים נושא, ומדפיסים דף תרגול עם פתרון להורה. הנושאים לפי תכנית הלימודים
            של משרד החינוך. הילדה עובדת על נייר, לא מול המסך.
          </p>
        </div>
        <HeroIllustration className="w-40 shrink-0 sm:w-48" />
      </section>

      <h2 className="mt-10 mb-4 text-sm font-semibold tracking-wide text-slate-500 uppercase">
        בחרו כיתה
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {grades.map((grade) =>
          grade.available ? (
            <li key={grade.id}>
              <Link
                href={`/grade/${grade.id}`}
                className="group flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-full bg-[var(--color-muted)] text-2xl font-bold text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-[var(--color-primary)] group-hover:text-white"
                >
                  {gradeLetters[grade.id]}
                </span>
                <span className="text-lg font-semibold">{grade.name}</span>
                <span className="text-sm text-slate-500">{grade.topics.length} נושאים</span>
              </Link>
            </li>
          ) : (
            <li
              key={grade.id}
              className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] p-5 text-slate-400"
            >
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-full bg-white/70 text-2xl font-bold text-slate-300"
              >
                {gradeLetters[grade.id]}
              </span>
              <span className="text-lg font-semibold text-slate-500">{grade.name}</span>
              <span className="text-sm">בקרוב</span>
            </li>
          ),
        )}
      </ul>
    </main>
  );
}
