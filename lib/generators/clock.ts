import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const minuteStepByLevel: Record<number, number> = { 1: 60, 2: 30, 3: 15 };

function formatTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 720) + 720) % 720;
  const hour = Math.floor(wrapped / 60) === 0 ? 12 : Math.floor(wrapped / 60);
  const minutes = wrapped % 60;
  return `${hour}:${String(minutes).padStart(2, "0")}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} דקות`;
  if (rest === 0) return hours === 1 ? "שעה אחת" : `${hours} שעות`;
  return `${hours} שעות ו‑${rest} דקות`;
}

const clock: Generator = {
  id: "clock",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const step = minuteStepByLevel[level];

    for (let i = 0; i < count; i++) {
      const start = rng.int(1, 11) * 60 + rng.int(0, 60 / step - 1) * step;
      const gap = rng.int(1, 8) * step;

      if (rng.bool()) {
        problems.push({
          prompt: `השעה ${formatTime(start)}. מה תהיה השעה בעוד ${formatDuration(gap)}?`,
          answer: formatTime(start + gap),
          work: "none",
          dir: "rtl",
        });
      } else {
        problems.push({
          prompt: `כמה זמן עובר מהשעה ${formatTime(start)} עד השעה ${formatTime(start + gap)}?`,
          answer: formatDuration(gap),
          work: "none",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default clock;
