# Session handoff

## Opening a session

1. `./init.sh` — confirm the tree is green before touching anything.
2. Read `progress.md` (top entry) and the active feature in `feature_list.json`.
3. `git status` — an uncommitted `AGENTS.md` change is often just `next dev` rewriting its
   own block; check the diff before assuming it is yours.
4. State the one thing you are doing this session before editing.

## Closing a session

1. `./init.sh` again. If it fails, say so plainly — do not leave a green-looking handoff.
2. Append an entry to the `## Log` in `progress.md` using the template there.
3. Update `## Current state` (active feature, last verified, next step).
4. Update the feature's `status` in `feature_list.json` if it changed. A feature only
   becomes `done` when every `doneCriteria` item has evidence in `progress.md`.
5. Leave changes in the working tree. Do not commit or push unless asked.

## Things that reliably go wrong here

- **Editing prompt text.** `answers.test.ts` parses prompt strings. Reword a prompt and the
  test breaks on purpose. Fix the parser, do not weaken the assertion.
- **Registering a generator.** Creating the file is not enough; it must be imported *and*
  pushed into the `generators` array in `lib/generators/index.ts`, and a topic in
  `lib/curriculum/grade6.ts` must point at its `id`.
- **`grade6Topics` has both a named and a default export.** Tests import the named one,
  `lib/curriculum/index.ts` imports the default. Keep both.
- **Reaching for `Math.random()`** inside a generator. Use `createRng(seed)`. `init.sh`
  blocks this.
- **Adding explanatory comments.** This repo forbids them. `init.sh` blocks this too.
- **Judging layout on screen.** The A4 print preview is the real check.
