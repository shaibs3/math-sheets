import Link from "next/link";
import { notFound } from "next/navigation";
import TopicIcon from "@/components/TopicIcon";
import { getGrade, grades } from "@/lib/curriculum";

export function generateStaticParams() {
  return grades.filter((grade) => grade.available).map((grade) => ({ grade: String(grade.id) }));
}

export default async function GradePage({ params }: PageProps<"/grade/[grade]">) {
  const { grade: gradeParam } = await params;
  const grade = getGrade(Number(gradeParam));
  if (!grade?.available) notFound();

  const strands = [...new Set(grade.topics.map((topic) => topic.strand))];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold">{grade.name} — נושאים</h1>
      <p className="mt-2 text-slate-600">בחרו נושא כדי ליצור דף תרגול להדפסה.</p>

      {strands.map((strand) => (
        <section key={strand} className="mt-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
            {strand}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {grade.topics
              .filter((topic) => topic.strand === strand)
              .map((topic) => (
                <li key={topic.id}>
                  <Link
                    href={`/sheet/${grade.id}/${topic.id}`}
                    className="group flex h-full cursor-pointer items-center gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                  >
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[var(--color-muted)] text-[var(--color-primary)] transition-colors duration-200 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                      <TopicIcon topicId={topic.id} className="size-9" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold">{topic.name}</span>
                      <span className="mt-0.5 block text-sm text-slate-600">
                        {topic.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
