# דפי עבודה במתמטיקה

Printable Hebrew maths worksheets for the Israeli school curriculum, with an answer key for
the parent. Pick a grade, pick a topic, print. The child works on paper, not on a screen.

[**Live site**](https://math-sheets-jade.vercel.app) ·
[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## Why this exists

Plenty of sites generate worksheets. None of them know what your child got wrong last week.

After a sheet is done, the parent taps the numbers that were missed — about fifteen seconds —
and those skills come back on a spaced schedule (1, 3, 7, 14, 30 days), mixed with other
topics rather than drilled in a block. That is what the research on spacing and interleaving
says actually makes maths stick, and it is the part every other worksheet site skips.

Topics follow the Ministry of Education programme (`תכנית לימודים במתמטיקה`), taken from the
published curriculum documents rather than from memory.

## The design decision worth knowing

**A worksheet is a pure function of `(topic, seed, count, level)`**, and all four live in the
URL:

```
/sheet/6/kefel-shvarim?seed=48213&count=20&level=2&answers=1
```

Consequences that fall out of that, for free:

- The answer key is the same URL with `answers=1`, so it cannot drift from the printed sheet.
- Reprinting a lost sheet, or bookmarking the one your child struggled with, just works.
- Recording "she missed 3, 7 and 11" costs a handful of numbers rather than a copy of the sheet.
- No AI at runtime, no API cost, no wrong answers: exercises come from small deterministic
  generators, and every answer is verified by a test that recomputes it independently.

Progress lives in the browser's `localStorage`. There are no accounts, no server, and no
child's data leaving the device.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test
./init.sh          # everything CI runs: typecheck, lint, tests, determinism, comment guard
```

Requires Node 22 or later.

## Layout

| Path | What lives there |
|---|---|
| `lib/rng.ts` | The only source of randomness. Seeded, so sheets are reproducible. |
| `lib/generators/` | One file per topic, each exporting a `Generator`. |
| `lib/curriculum/` | Topics per grade, mapped to generator ids. |
| `lib/progress/` | Spaced-repetition scheduling and browser-local progress. |
| `lib/mixed.ts` | Interleaved multi-topic sheets for review and diagnostics. |
| `app/` | Next.js App Router pages, including the printable sheet. |
| `docs/agents/` | Working notes from agent-assisted development. |

Adding a topic means one generator file, one line in the registry, and one curriculum entry —
see [CONTRIBUTING.md](CONTRIBUTING.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind · Vitest. No backend, no database, no auth.
Deployed on Vercel.

## License

MIT — see [LICENSE](LICENSE).
