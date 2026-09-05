import { Suspense } from "react";
import { PROGRESS_ENABLED } from "@/lib/features";
import { notFound } from "next/navigation";
import ReviewSheet from "@/components/ReviewSheet";
import { getGrade } from "@/lib/curriculum";

export default async function ReviewPage({ params }: PageProps<"/review/[grade]">) {
  const { grade: gradeParam } = await params;
  const gradeId = Number(gradeParam);
  if (!PROGRESS_ENABLED) notFound();
  if (!getGrade(gradeId)?.available) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <Suspense>
        <ReviewSheet gradeId={gradeId} />
      </Suspense>
    </main>
  );
}
