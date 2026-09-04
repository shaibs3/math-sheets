"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { randomSeed } from "@/lib/rng";

const buttonClass =
  "min-h-11 cursor-pointer rounded-lg px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

export default function PrintControls({ answers, seed }: { answers: boolean; seed: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="no-print mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => update({ seed: String(randomSeed()) })}
        className={`${buttonClass} border border-[var(--color-border)] bg-[var(--color-muted)] hover:bg-[var(--color-border)]`}
      >
        דף חדש
      </button>

      <button
        type="button"
        onClick={() => update({ answers: answers ? "0" : "1" })}
        aria-pressed={answers}
        className={`${buttonClass} border border-[var(--color-border)] hover:bg-[var(--color-muted)]`}
      >
        {answers ? "הסתרת פתרונות" : "הצגת פתרונות"}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className={`${buttonClass} bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-blue-700`}
      >
        הדפסה
      </button>

      <span className="text-xs text-slate-500">דף מס׳ {seed}</span>
    </div>
  );
}
