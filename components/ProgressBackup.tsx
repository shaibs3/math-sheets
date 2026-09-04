"use client";

import { useRef, useState } from "react";
import { parseProgress } from "@/lib/progress/store";
import { emptyProgress } from "@/lib/progress/schedule";
import { useProgress } from "@/lib/progress/useProgress";

const buttonClass =
  "min-h-11 cursor-pointer rounded-lg border border-[var(--color-border)] px-4 text-sm font-medium transition-colors duration-200 hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

export default function ProgressBackup() {
  const { state, mounted, replace } = useProgress();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  if (!mounted) return null;

  const attempts = state.attempts.length;

  const download = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "math-sheets-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (file: File) => {
    const imported = parseProgress(await file.text());
    if (imported.attempts.length === 0 && Object.keys(imported.skills).length === 0) {
      setMessage("הקובץ לא מכיל נתוני התקדמות.");
      return;
    }
    replace(imported);
    setMessage(`נטענו ${imported.attempts.length} תרגולים.`);
  };

  const reset = () => {
    replace(emptyProgress());
    setMessage("ההתקדמות נמחקה.");
  };

  return (
    <section className="no-print mt-10 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">התקדמות</h2>
      <p className="mt-1 text-sm text-slate-600">
        הנתונים נשמרים בדפדפן הזה בלבד ולא נשלחים לשום מקום. {attempts} תרגולים נשמרו. כדאי לשמור
        גיבוי לפני ניקוי היסטוריית הדפדפן.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={download} className={buttonClass}>
          שמירת גיבוי
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className={buttonClass}>
          טעינת גיבוי
        </button>
        <button type="button" onClick={reset} className={`${buttonClass} text-red-700`}>
          מחיקת ההתקדמות
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
        {message && <span className="text-sm text-slate-600">{message}</span>}
      </div>
    </section>
  );
}
