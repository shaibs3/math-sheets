# Progress

Append a new entry at the top of the log for every session. Never overwrite history.

## Current state

- **Active feature:** `review-loop` — code complete, awaiting a manual browser pass.
- **Last verified:** 2026-09-04 — `./init.sh` all checks passed (typecheck, lint, 97 tests in 6 files, determinism guard, comment guard).
- **Next step:** click the loop in a real browser (mark a sheet → reload → check the badge and `/review/6`), then print-preview the review sheet at A4.

## Entry template

```
### YYYY-MM-DD — <feature id>
Changed: <files and what>
Verified: <./init.sh result; determinism; answer-key check; print preview if UI changed>
Not done / known gaps: <be explicit, including anything skipped>
Next step: <the single next action>
```

## Log

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
