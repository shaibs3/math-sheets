<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# math-sheets

Hebrew RTL site that generates printable math worksheets for the Israeli 6th-grade
curriculum. A parent prints an A4 sheet; a child solves it on paper. The printed page —
not the screen — is the deliverable.

## Start here

1. Read `progress.md` for the active feature and the last verified state.
2. Read `feature_list.json` for scope and done criteria of that feature.
3. Run `./init.sh` before your first edit. It must pass before you change anything, so a
   later failure is provably yours.
4. Work one feature at a time. Do not start a second one.

## The determinism invariant

A worksheet is a pure function of `(topic, seed, count, level)`. Those four values live
in the URL (`/sheet/[grade]/[topic]?seed=&count=&level=&answers=`), and nothing else may
influence output. This is what makes the answer key provably match the printed sheet: a
parent can reprint the same URL and get the same problems.

Rules that follow from it, and that a change must never break:

- Generators draw randomness **only** from `createRng(seed)` in `lib/rng.ts`. Never
  `Math.random()`, `Date`, `crypto`, locale, environment, or module-level mutable state.
  `randomSeed()` exists for UI seed rolls only and must not be called inside `generate`.
- `generate(options)` called twice with the same options returns deep-equal output.
- The answer must be derivable from the prompt string alone. `answers.test.ts` re-parses
  prompts to check answers independently — it does not trust the generator.
- No new state may be smuggled into a worksheet outside the URL params. localStorage may
  hold review/progress data, but must never change which problems a sheet renders.

## Layout

| Path | What lives there |
|---|---|
| `lib/rng.ts` | The only randomness source. `createRng`, `Rng`. |
| `lib/types.ts` | `Generator`, `Problem`, `GeneratorOptions`, `Level`, `Topic`, `Grade`. |
| `lib/math.ts` | Fraction/number helpers and formatters (`formatFraction`, `formatMixed`, `formatNumber`, `gcd`, `lcm`, `reduce`). Use these — do not hand-roll formatting. |
| `lib/generators/*.ts` | One topic per file, `export default` a `Generator`. |
| `lib/generators/index.ts` | The registry. A generator that is not imported *and* added to the `generators` array does not exist. |
| `lib/curriculum/grade6.ts` | Topics; each `generatorId` must resolve in the registry. |
| `app/sheet/[grade]/[topic]/page.tsx` | Parses and clamps the URL params, calls the generator. |
| `components/` | Presentation only. No problem generation here. |
| `design-system/math-sheets/MASTER.md` | Tokens and component rules. `app/globals.css` defines the CSS variables. |

## Adding a generator

1. New file in `lib/generators/`, default-exporting a `Generator` with a unique `id`.
2. Import it in `lib/generators/index.ts` and add it to the `generators` array.
3. Add a `Topic` in `lib/curriculum/grade6.ts` whose `generatorId` matches.
4. Add an independent answer check in `lib/generators/answers.test.ts` — parse the prompt,
   recompute the answer, compare. Do not assert against a hardcoded expected array.
5. Hebrew problems set `dir: "rtl"`; bare arithmetic expressions set `dir: "ltr"` so digits
   and operators do not reorder. Pick `work` (`"none" | "lines" | "vertical" | "box"`) to
   match how much room the child needs on paper.

`generators.test.ts` runs every registered generator through count/level/determinism checks
automatically — a new generator is covered the moment it is in the array.

## Prompt strings are an API

`answers.test.ts` parses prompt text (splitting on `" × "`, `" = "`, and similar) to verify
answers. Changing a prompt's wording or spacing will break those tests **by design**. That
is a signal, not a nuisance: update the parser in the test in the same change, and confirm
it still recomputes the answer independently rather than being loosened to pass.

## Print correctness

The screen is a preview. Before claiming a visual change is done, verify against print:

- `.no-print` hides controls; `.print-keep` prevents a problem splitting across pages;
  `.print-page-break` starts the answer key on its own page. Defined in `app/globals.css`.
- `@page` is A4 with a 12mm margin. Content must fit that width at every supported `count`
  (4–60) and column setting (1–4).
- Check with the browser's print preview at `?answers=1` and a high `count`. Screenshots of
  the on-screen layout are not evidence about the printed page.

## House rules

- **No code comments.** Express intent through naming and structure. Machine-readable
  directives (build tags, `eslint-disable`, license headers) are the only exception.
- Hebrew UI copy stays in the component or generator that renders it; there is no i18n layer
  and none should be introduced without being asked.
- No new dependencies without asking. The stack is deliberately Next + React + Tailwind +
  Vitest and nothing else.

## Definition of done

A feature is done only when all of these hold, and `progress.md` records the evidence:

- [ ] `./init.sh` passes (typecheck, lint, tests), with output summarized in `progress.md`.
- [ ] Determinism: same `(topic, seed, count, level)` still yields identical problems.
- [ ] Answer key matches the sheet — verified by a test that recomputes, not by eye.
- [ ] Print preview checked if any rendering changed.
- [ ] No comments added; no new dependencies.
- [ ] `progress.md` updated with what changed, what was verified, and the next step.

Do not report a feature complete with failing or skipped checks. Report what failed instead.

## Out of scope unless asked

Auth, a backend or database, payments, analytics, other grades (1–5 are `available: false`
placeholders), non-Hebrew locales, and rewriting the design system. The upcoming review-loop
work is localStorage-first with no auth — see `feature_list.json`.
