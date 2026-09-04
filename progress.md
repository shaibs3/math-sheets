# Progress

Append a new entry at the top of the log for every session. Never overwrite history.

## Current state

- **Active feature:** `review-loop` — shipped and confirmed working in a browser.
- **Last verified:** 2026-09-04 — `./init.sh` all checks passed (typecheck, lint, 101 tests in 6 files, determinism guard, comment guard). Marking confirmed by the user on production: a marked topic shows the `בתהליך` badge after reload, so persistence and hydration both work.
- **Next step:** print-preview `/review/6` and `/mivdak/6` at A4 — the only remaining unchecked done-criterion.

## Entry template

```
### YYYY-MM-DD — <feature id>
Changed: <files and what>
Verified: <./init.sh result; determinism; answer-key check; print preview if UI changed>
Not done / known gaps: <be explicit, including anything skipped>
Next step: <the single next action>
```

## Log

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
