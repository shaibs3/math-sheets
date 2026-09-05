"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { randomSeed } from "@/lib/rng";
import type { Level } from "@/lib/types";

type Props = {
  seed: number;
  count: number;
  level: Level;
  levels: Level[];
  answers: boolean;
};

const fieldClass =
  "mt-1 min-h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

const buttonClass =
  "min-h-11 cursor-pointer rounded-lg px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

const levelNames: Record<Level, string> = { 1: "קל", 2: "בינוני", 3: "מאתגר" };

export default function SheetControls({ seed, count, level, levels, answers }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="no-print mb-6 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm">
          מספר תרגילים
          <input
            type="number"
            min={4}
            max={60}
            value={count}
            onChange={(event) => update({ count: event.target.value })}
            className={`${fieldClass} w-24`}
          />
        </label>

        {levels.length > 1 && (
          <label className="flex flex-col text-sm">
            רמת קושי
            <select
              value={level}
              onChange={(event) => update({ level: event.target.value })}
              className={`${fieldClass} cursor-pointer`}
            >
              {levels.map((option) => (
                <option key={option} value={option}>
                  {levelNames[option]}
                </option>
              ))}
            </select>
          </label>
        )}

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
      </div>

      <p className="mt-3 text-xs text-slate-500">
        דף מס׳ {seed} — אותה כתובת תיצור תמיד את אותו דף, כך שאפשר להדפיס אותו שוב.
      </p>
    </div>
  );
}
