import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.PRINT_BASE ?? "http://localhost:3117";
const OUT = process.env.PRINT_OUT ?? ".print-check";

const CONTENT_WIDTH = Math.round(((210 - 24) * 96) / 25.4);
const CONTENT_HEIGHT = Math.round(((297 - 24) * 96) / 25.4);

const pages = [
  { name: "arithmetic-60-3col", path: "/sheet/2/hibur-hisur-bemeuzan?seed=7&count=60&answers=1" },
  { name: "figures-rect-60", path: "/sheet/4/shetach-vehekef-malben?seed=7&count=60&answers=1" },
  { name: "figures-solids", path: "/sheet/12/gufim-bemerchav?seed=7&count=20&answers=1" },
  { name: "figures-angles", path: "/sheet/7/zaviot?seed=7&count=20&answers=1" },
  { name: "grid-plotting", path: "/sheet/7/maarechet-tzirim?seed=7&count=12&answers=1" },
  { name: "grid-linear", path: "/sheet/7/graf-funktsia-kavit?seed=7&count=12&answers=1" },
  { name: "circle-figures", path: "/sheet/6/maagal-veigul?seed=7&count=30&answers=1" },
  { name: "word-money-measure-40", path: "/sheet/4/beayot-miluliot-kesef-umidot?seed=7&count=40&level=3&answers=1" },
  { name: "word-rate-average-40", path: "/sheet/5/beayot-miluliot-ketzev-umemutza?seed=7&count=40&level=3&answers=1" },
  { name: "word-fractions-decimals-40", path: "/sheet/5/beayot-miluliot-shvarim-veasroniim?seed=7&count=40&level=3&answers=1" },
  { name: "quadrilaterals-trapezoid-30", path: "/sheet/9/trapez?seed=7&count=30&answers=1" },
  { name: "quadrilaterals-kite-30", path: "/sheet/9/daltton?seed=7&count=30&answers=1" },
  { name: "congruent-triangles-30", path: "/sheet/8/meshulashim-hofefim?seed=7&count=30&answers=1" },
  { name: "decimals-mult-div-60", path: "/sheet/6/kefel-hiluk-asroniim?seed=7&count=60&level=3&answers=1" },
];

function countPdfPages(buffer) {
  const matches = buffer.toString("latin1").match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

async function measure(page) {
  return page.evaluate(
    ({ contentWidth, contentHeight }) => {
      const overflowing = [];
      for (const element of document.querySelectorAll("main *")) {
        const box = element.getBoundingClientRect();
        if (box.right > contentWidth + 1 || box.left < -1) {
          overflowing.push({
            tag: element.tagName.toLowerCase(),
            className: String(element.className).slice(0, 60),
            width: Math.round(box.width),
          });
        }
      }

      const tall = [];
      for (const element of document.querySelectorAll(".print-keep")) {
        const box = element.getBoundingClientRect();
        if (box.height > contentHeight) {
          tall.push({ text: (element.textContent ?? "").trim().slice(0, 50), height: Math.round(box.height) });
        }
      }

      return {
        documentWidth: Math.round(document.documentElement.scrollWidth),
        bodyWidth: Math.round(document.body.scrollWidth),
        overflowing: overflowing.slice(0, 5),
        overflowCount: overflowing.length,
        tall,
        problems: document.querySelectorAll(".print-keep").length,
        hasAnswerKey: Boolean(document.querySelector(".print-page-break")),
        figures: document.querySelectorAll("main svg").length,
      };
    },
    { contentWidth: CONTENT_WIDTH, contentHeight: CONTENT_HEIGHT },
  );
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: CONTENT_WIDTH, height: CONTENT_HEIGHT } });
const page = await context.newPage();
await mkdir(OUT, { recursive: true });

const failures = [];
const rows = [];

for (const target of pages) {
  const response = await page.goto(`${BASE}${target.path}`, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    failures.push(`${target.name}: HTTP ${response ? response.status() : "no response"}`);
    continue;
  }

  await page.emulateMedia({ media: "print" });
  const measured = await measure(page);

  const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  await writeFile(`${OUT}/${target.name}.pdf`, pdf);
  const pdfPages = countPdfPages(pdf);

  if (measured.documentWidth > CONTENT_WIDTH + 1) {
    failures.push(
      `${target.name}: content is ${measured.documentWidth}px wide, the A4 printable width is ${CONTENT_WIDTH}px`,
    );
  }
  if (measured.overflowCount > 0) {
    const worst = measured.overflowing[0];
    failures.push(
      `${target.name}: ${measured.overflowCount} element(s) wider than the ${CONTENT_WIDTH}px column, worst ${worst.tag}.${worst.className} at ${worst.width}px`,
    );
  }
  if (measured.tall.length > 0) {
    failures.push(
      `${target.name}: ${measured.tall.length} problem block(s) taller than one page, first "${measured.tall[0].text}" at ${measured.tall[0].height}px`,
    );
  }
  if (!measured.hasAnswerKey) {
    failures.push(`${target.name}: no .print-page-break, so the answer key does not start its own page`);
  }
  if (pdfPages === 0) {
    failures.push(`${target.name}: produced a PDF with no pages`);
  }

  rows.push(
    `${target.name.padEnd(20)} ${String(pdfPages).padStart(3)}p  ${String(measured.problems).padStart(3)} problems  ${String(measured.figures).padStart(3)} svg  width ${measured.documentWidth}`,
  );

  await page.emulateMedia({ media: "screen" });
}

await browser.close();

console.log("\nA4 print check\n");
for (const row of rows) console.log("  " + row);

if (failures.length > 0) {
  console.log("\nFAILURES\n");
  for (const failure of failures) console.log("  - " + failure);
  console.log(`\nPDFs written to ${OUT}/\n`);
  process.exit(1);
}

console.log(`\nAll print checks passed. PDFs written to ${OUT}/\n`);
