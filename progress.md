# Progress

Append a new entry at the top of the log for every session. Never overwrite history.

## Current state

- **Active feature:** `grades-7-12` — all twelve grades are now `available`.
- **Last verified:** 2026-09-05 — `./init.sh` ALL CHECKS PASSED (typecheck, lint, 739 tests in 6 files, determinism guard, comment guard) and `npx next build` succeeds with 12 static `/grade/N` pages.
- **Next step:** A4 print preview of the new algebra sheets at high `count` with `?answers=1` — the 2-column bare-expression generators carry longer prompts than any existing topic.

## Entry template

```
### YYYY-MM-DD — <feature id>
Changed: <files and what>
Verified: <./init.sh result; determinism; answer-key check; print preview if UI changed>
Not done / known gaps: <be explicit, including anything skipped>
Next step: <the single next action>
```

## Log

### 2026-09-05 — grades-7-12

Changed: `lib/curriculum/grade7.ts`–`grade12.ts` (new, 70 topics), `lib/curriculum/index.ts` (imports them, all twelve grades `available: true`), `lib/algebra.ts` (new — polynomial and signed-number formatters shared by the algebra generators), 34 new generators in `lib/generators/` all registered in `lib/generators/index.ts`, `lib/generators/answers.test.ts` (a prompt-expression evaluator plus independent recompute checks for every algebra generator), `components/TopicIcon.tsx` (icons for מספרים מכוונים, זוויות, פיתגורס, גליל, פונקציה קווית, פרבולה, טריגונומטריה, הסתברות, מדדי מרכז), `app/page.tsx` (grade letters ז–י"ב for the home grid badge, which was rendering blank for grades 7–12).

Curriculum source: כיתה ז `https://meyda.education.gov.il/files/Tochniyot_Limudim/Math/Hatab/7.pdf` and כיתה ח `.../Hatab/8.pdf` both resolve. `.../Hatab/9.pdf` is a **404** — כיתה ט came from the combined ז–ט book at `https://meyda.education.gov.il/files/Curriculum/math_7_9.pdf` (grade ט starts at p.101). Grades י–י"ב are the 3-יחידות program at `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/` (`mavo-math.pdf`, `eshkol_madaei_10.pdf`, `eshkol_merhav_10.pdf`, `eshkol_financi_10.pdf`, `11th-social.pdf`, `yud_alef_02.pdf`, `11th-financial.pdf`, `geometry-merhav-12.pdf`, `linear-12.pdf`, `analitic-geometry-12.pdf`, `model-ribuei-12.pdf`, `itpalgut-normalit-12.pdf`).

Reused rather than duplicated: `order-of-operations`, `area-shapes`, `circle`, `box-volume-surface` (grade 7); `scale` (grades 8 and 11); `decimal-units`, `statistics-center`, `probability-basic`, `linear-equation-brackets`, `linear-system`, `line-from-points` (grade 10); `ratio`, `similar-triangles`, `pythagoras`, `conditional-probability`, `consumer-percent` (grade 11); `line-from-points`, `linear-system`, `quadratic-equation`, `parabola`, `quadratic-optimum`, `right-triangle-trig` (grade 12).

Verified: `./init.sh` ALL CHECKS PASSED — 739 tests in 6 files (was 368). Answers are recomputed from the prompt string, never asserted against a hardcoded array: `answers.test.ts` now carries a small recursive-descent evaluator for the prompt language (precedence, implicit multiplication, unary minus, `²`/`^`, `×`/`·`/`÷`), and every equation generator is checked by substituting the stated solution back into the parsed prompt. Equations additionally assert that x±1 does *not* satisfy them; quadratics assert both roots vanish and the midpoint does not; identity generators (כינוס איברים, פתיחת סוגריים, כפל מקוצר, פירוק לגורמים, טרינום, שברים אלגבריים) are checked by evaluating prompt and answer at four non-integer sample points; the inequality generator is checked at the boundary and one step past it, including the sign flip on a negative coefficient. `npx next build` prerenders all 12 `/grade/N` pages.

Not done / known gaps:
- Print preview of the new sheets at A4 is **not** checked.
- Grades י–י"ב cover the **3-יחידות track only**. The `Topic` type has no unit-level concept, so 4/5 יח"ל were deliberately not attempted rather than smuggled in.
- Deliberately skipped, because none yields an answer recomputable from a text-only prompt: all of the grade-ט deductive geometry (חפיפה, דמיון, דלתון/טרפז/מקבילית proofs, הוכחה על דרך השלילה), בניות בסרגל ומחוגה, שרטוט וקריאת גרפים ודיאגרמות, תחומי עלייה/ירידה וחיוביות/שליליות of a parabola (interval answers, not a value), תכנון ליניארי (needs a feasible-region drawing), and the literacy wrapper of the 3-יח"ל program (הסקת מסקנות, השוואת כדאיות והנמקה). רבעונים ועשירונים was dropped because the quartile convention is ambiguous enough that a "correct" answer would be arbitrary.

Next step: A4 print preview of the new algebra sheets at high `count` with `?answers=1`.

### 2026-09-04 — grades-1-5

Changed: `lib/curriculum/grade1.ts`–`grade5.ts` (new), `lib/curriculum/index.ts` (imports them, all six grades `available: true`), 31 new generators in `lib/generators/` all registered in `lib/generators/index.ts`, `lib/generators/generators.test.ts` (registry test now iterates every grade instead of only grade 6, and checks unique topic ids and availability), `lib/generators/answers.test.ts` (independent recompute checks for the new arithmetic-heavy generators), `components/TopicIcon.tsx` (icons for שעון, כסף, ישר המספרים, לוח הכפל, שטח והיקף מלבן, נפח תיבה, שטח משולש ומקבילית).

Curriculum source: Ministry of Education *תכנית לימודים במתמטיקה לכיתות א-ו*, the strand tables at doc pages 17 / 33 / 53 / 75 / 97. Grade 1 is **not** at `.../Yesodi/kita1.pdf` (404) — it is at `https://meyda.education.gov.il/files/Tochniyot_Limudim/Math/Yesodi/kita1_1204762245.pdf`. Grades 2–5 are at `.../Yesodi/kita<N>.pdf`.

Reused rather than duplicated: `fraction-of-quantity` (grade 4 השבר הפשוט), `fractions-add-subtract` and `decimals-operations` (grade 5), `add-sub-100` / `add-sub-vertical` / `multiply-table` / `multiply-vertical` / `order-of-operations` / `divisibility` / `clock` / `word-add-sub-basic` across adjacent grades at different levels.

Verified: `./init.sh` ALL CHECKS PASSED — 355 tests in 6 files (was 101). Every registered generator goes through the automatic count/level/determinism checks. Answers are recomputed from the prompt string (never asserted against a hardcoded array) for add-sub-20/100/vertical, multiply-table/vertical/powers-ten, long-division, divide-two-digit, divide-remainder, order-of-operations, powers, compare-numbers, even-odd, number-line-missing, place-value, divisibility, divisibility-369, primes, unit-fraction, fraction-simplify, improper-mixed, fraction-to-decimal, average, rectangle-area, area-shapes, box-volume-surface, clock, money and word-add-sub-basic. Home page renders six cards with topic counts 7/9/9/9/8/11 and no `בקרוב` placeholders; `/grade/1`, `/grade/3`, `/grade/5`, `/sheet/1/shaon` and `/mivdak/5` all return 200 in dev. The home grid (`grid-cols-2 sm:grid-cols-3`) and `app/grade/[grade]/page.tsx` needed no changes — both were already generic over available grades.

Not done / known gaps:
- Print preview of the new sheets at A4 is **not** checked. The grade 1–3 bare-arithmetic generators use `columns: 3`, which is new territory for long prompts like `9999 − 1234 =`.
- `length-units` and `time-units` have no independent answer check — their answers carry Hebrew unit words rather than a bare number, so a prompt-only recompute would just re-encode the conversion table.
- Deliberately skipped subtopics, because none of them yields an answer recomputable from a text-only prompt (which the answer-key invariant requires) — these were **considered and rejected**, not forgotten: drawing/visual geometry (מצולעים, מרובעים, זוויות, שיקוף והזזה, סימטרייה, ריצוף, גבהים), חקר נתונים וניתוח סיכויים, ערכי האותיות ושיטת האלף-בית, אומדן תוצאות, and לוח השנה.
- Known harness bug, not introduced here: on a fresh worktree `./init.sh` typecheck fails with `Cannot find name 'PageProps'/'LayoutProps'` because `.next/types` does not exist yet. `npx next build` once fixes it. Being fixed separately on main.

Next step: A4 print preview of the new grade 1–5 sheets at high `count` with `?answers=1`.

### 2026-09-04 — review-loop verification and empty-state fix
Changed: `lib/progress/schedule.ts` (`weakestSkills`, `nextDueAt`, `daysUntil`), `components/ReviewSheet.tsx` (empty state explains the spacing gap, offers early practice on the weakest skills), `lib/progress/schedule.test.ts`.
Verified: `./init.sh` ALL CHECKS PASSED (101 tests). User confirmed on production that a marked topic shows `בתהליך` after reload — marking persists and the client components hydrate cleanly.
Not done / known gaps: print preview of `/review` and `/mivdak` at A4 still unchecked.
Next step: print preview, then close out `review-loop`.

### 2026-09-04 — review-loop
Changed: `lib/progress/` (types, `schedule.ts` Leitner scheduling over 1/3/7/14/30 days, `store.ts` with injectable storage, `useProgress` via `useSyncExternalStore`), `lib/mixed.ts` (round-robin interleaved multi-topic sheets + `sliceBySkill`), `components/` (`MarkResults`, `MixedSheet`, `PrintControls`, `ReviewSheet`, `DueBanner`, `DueLink`, `TopicStatusBadge`, `ProgressBackup`), routes `app/mivdak/[grade]` and `app/review/[grade]`, wiring in the sheet and grade pages and the navbar.
Verified: `./init.sh` ALL CHECKS PASSED (97 tests). Scheduling, mixed-sheet interleaving/determinism/`skillIds` alignment, store round-trip and corrupt-input recovery, and a diagnostic→review loop test all covered. All routes return 200 in dev.
Not done / known gaps: no browser verification of the client-side loop — marking, persistence across reload, and hydration are untested outside unit tests (the Chrome extension was declined this session). Print preview of `/review` and `/mivdak` at A4 not checked. Progress is per-browser with no sync.
Next step: manual browser pass on the loop, then print preview.

### 2026-09-04 — harness setup
Changed: `AGENTS.md` (project rules, determinism invariant, done criteria), `init.sh`, `feature_list.json`, `progress.md`, `session-handoff.md`. No application code touched.
Verified: `./init.sh` — ALL CHECKS PASSED.
Not done / known gaps: `review-loop` is unstarted and has open design questions.
Next step: resolve `review-loop` open questions with the user.
