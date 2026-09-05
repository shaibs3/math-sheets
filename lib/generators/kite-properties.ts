import { createRng } from "../rng";
import type { Generator, Problem } from "../types";

const kiteProperties: Generator = {
  id: "kite-properties",
  columns: 1,
  defaultCount: 8,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const maxSide = level === 1 ? 12 : level === 2 ? 20 : 40;

    for (let i = 0; i < count; i++) {
      const kind = level === 1 ? rng.int(1, 2) : rng.int(1, 4);

      if (kind === 1) {
        const short = rng.int(3, maxSide);
        const long = rng.int(short + 1, short + maxSide);
        problems.push({
          prompt: `בדלתון שתי צלעות סמוכות שוות ל-${short} ס"מ ושתי הצלעות האחרות שוות ל-${long} ס"מ. מהו היקף הדלתון?`,
          answer: `${2 * (short + long)} ס"מ`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 2) {
        const head = 2 * rng.int(15, level === 3 ? 80 : 55);
        const tail = 2 * rng.int(15, Math.max(16, 170 - head));
        problems.push({
          prompt: `בדלתון זווית הראש היא ${head}° וזווית הזנב היא ${tail}°. שתי הזוויות הנותרות שוות זו לזו. מה גודלה של כל אחת מהן?`,
          answer: `${(360 - head - tail) / 2}°`,
          work: "lines",
          dir: "rtl",
        });
      } else if (kind === 3) {
        const first = 2 * rng.int(2, maxSide);
        const second = rng.int(Math.max(3, Math.floor(first / 3)), first + 4);
        problems.push({
          prompt: `בדלתון אלכסוניו מאונכים זה לזה ואורכיהם ${first} ס"מ ו-${second} ס"מ. מהו שטח הדלתון?`,
          answer: `${(first * second) / 2} סמ"ר`,
          work: "lines",
          dir: "rtl",
        });
      } else {
        const head = 2 * rng.int(15, 84);
        problems.push({
          prompt: `בדלתון האלכסון הראשי חוצה את זווית הראש שגודלה ${head}°. מהי הזווית שבין האלכסון הראשי לצלע?`,
          answer: `${head / 2}°`,
          work: "lines",
          dir: "rtl",
        });
      }
    }

    return problems;
  },
};

export default kiteProperties;
