# Contributing

Thanks for considering it. This project generates printable Hebrew maths worksheets for the
Israeli curriculum. The printed A4 page is the product — the screen is a preview.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
./init.sh          # the one gate: typecheck, lint, tests, determinism, comment guard
```

`./init.sh` must pass before you open a PR. CI runs exactly the same script, so a green run
locally means a green run there.

## The one rule that matters

**A worksheet is a pure function of `(topic, seed, count, level)`**, and those four values
live in the URL. Nothing else may influence which problems a sheet renders.

This is what lets a parent reprint a URL and get the same sheet, and it is what makes the
answer key provably correct rather than merely plausible. Concretely:

- Generators draw randomness **only** from `createRng(seed)` in `lib/rng.ts`. Never
  `Math.random()`, `Date`, `crypto`, locale, or module-level mutable state. `init.sh` greps
  for these and fails the build.
- `generate(options)` called twice with the same options returns deep-equal output.
- The answer must be derivable from the prompt string alone, because `answers.test.ts`
  re-parses prompts and recomputes answers independently rather than trusting the generator.

A topic whose answer cannot be recomputed from its text — geometric constructions, proofs,
graph sketching — does not belong here. That exclusion is deliberate, not an oversight.

## Adding a curriculum topic

1. Create `lib/generators/<topic>.ts` exporting a `Generator` (see `lib/types.ts`). Copy the
   shape of an existing one, e.g. `lib/generators/percent.ts`.
2. Register it in `lib/generators/index.ts`. A generator that is not in that array does not
   exist.
3. Add a `Topic` entry in the right `lib/curriculum/grade<N>.ts` whose `generatorId` matches.
4. Add an independent answer check in `lib/generators/answers.test.ts` — parse the prompt,
   recompute, compare. Never assert against a hardcoded expected array.
5. Optionally add an icon in `components/TopicIcon.tsx`. The fallback icon is fine.

`generators.test.ts` picks up every registered generator automatically for count, level and
determinism checks.

Some notes that will save you a review round:

- Hebrew word problems set `dir: "rtl"`; bare arithmetic sets `dir: "ltr"`, or digits and
  operators reorder inside the RTL page.
- Answers should be clean for pen and paper. No repeating decimals unless the topic is about
  them; no negatives in grades where negatives are not taught yet.
- Pick `work` and `columns` for how much room a child needs on paper, not for how it looks
  on screen.

## Prompt strings are an API

`answers.test.ts` splits prompt text on `" × "`, `" = "` and similar. Changing a prompt's
wording or spacing will break those tests **by design**. Update the parser in the same
change, and keep it recomputing the answer independently rather than loosening it to pass.

## Print correctness

If you change rendering, check the print preview — not a screenshot of the screen.

- `.no-print` hides controls, `.print-keep` stops a problem splitting across pages,
  `.print-page-break` starts the answer key on its own page. All in `app/globals.css`.
- `@page` is A4 with a 12mm margin. Content must fit at every supported `count` (4–60).
- Check at a high `count` with `?answers=1`.

## House style

- **No code comments.** Express intent through naming and structure. Machine-readable
  directives (`eslint-disable`, build tags, license headers) are the only exception, and
  `init.sh` enforces this.
- Hebrew UI copy lives in the component that renders it. There is no i18n layer, and one
  should not be added without discussion.
- No new dependencies without asking first. The stack is Next, React, Tailwind and Vitest,
  deliberately and nothing else.

## Pull requests

PR titles follow [Conventional Commits](https://www.conventionalcommits.org/), because the
title becomes the squashed commit message:

```
feat: add grade 7 linear equations
fix: stop percent generator producing fractional students
docs: explain the determinism invariant
chore: bump vitest
```

A CI check enforces the prefix. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`,
`perf`, `test`, `build`, `ci`, `chore`.

In the description, say what you actually verified. "Should work" is not verification, and
a PR that honestly lists a known gap is more useful than one that quietly leaves it out.

## Agent-assisted contributions

Much of this repo was written with a coding agent, and that is fine here. `AGENTS.md` holds
the machine-readable version of these rules; keep the two in step if you change either. The
same bar applies to agent-written code as to hand-written code: `./init.sh` green, answer
keys verified by tests, no comments, and an honest account of what was not checked.
