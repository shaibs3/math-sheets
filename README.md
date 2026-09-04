# דפי עבודה במתמטיקה

Printable Hebrew math worksheet generator for parents. Pick a grade, pick a topic from the
Israeli Ministry of Education curriculum, print a worksheet — the child works on paper.

## Run

```bash
npm run dev     # http://localhost:3000
npm test        # generator determinism + answer correctness
npm run build
```

## How it works

A worksheet is a pure function of `(topic, seed, count, level)`, all of which live in the URL:

```
/sheet/6/kefel-shvarim?seed=48213&count=20&level=2&answers=1
```

The same URL always produces the same sheet, so the answer key (`answers=1`) is guaranteed to
match the printed page, and a sheet can be re-printed or bookmarked.

## Adding a topic

1. Add a generator in `lib/generators/` implementing the `Generator` type from `lib/types.ts`.
   Draw randomness only from `createRng(seed)` — never `Math.random`.
2. Register it in `lib/generators/index.ts`.
3. Add a `Topic` entry in `lib/curriculum/grade6.ts` pointing at the generator id.

Adding a grade means one more file under `lib/curriculum/` plus its generators, and flipping
`available` in `lib/curriculum/index.ts`.

## Curriculum source

Topics follow the Ministry of Education program for grade 6:
`meyda.education.gov.il/files/Tochniyot_Limudim/Math/Yesodi/kita6.pdf`
