// One-off smoke test: loads the built app, captures console errors and
// screenshots of each tab. Run: node scripts/smoke.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:4173/";
const browser = await chromium.launch({
  executablePath: "/home/qunicspc/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(`PAGEERROR: ${err.message}`));

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// Empty state (no slate published yet) — dashboard
await page.screenshot({ path: "/tmp/smoke-dashboard.png" });

// Each tab via bottom nav
for (const [label, idx] of [["predict", 1], ["history", 2], ["settings", 3]]) {
  await page.click(`nav button:nth-child(${idx + 1})`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/tmp/smoke-${label}.png` });
}

// ?tab= deep link
await page.goto(`${base}?tab=history`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const historyActive = await page.getAttribute("nav button:nth-child(3)", "aria-current");
console.log("deep-link ?tab=history aria-current:", historyActive);
await page.screenshot({ path: "/tmp/smoke-deeplink.png" });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
