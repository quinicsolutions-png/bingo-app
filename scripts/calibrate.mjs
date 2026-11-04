// Calibration analysis: do the model's confidence buckets mean what they claim?
//
// Reads public/data/history.json (or a path given as argv[2]) and reports
// hit-rate per confidence bucket, per pick, and overall, plus the average
// model-assigned probability of the picked outcome. A well-calibrated model's
// hit-rate in a bucket should be close to its average predicted probability.
//
// Usage: node scripts/calibrate.mjs [path-to-history.json]

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const historyPath = process.argv[2] ?? join(ROOT, "public/data/history.json");

const BUCKETS = ["HIGH", "MEDIUM", "LOW", "DRAW_ALERT"];

function loadSettledMatches(path) {
  let history;
  try {
    history = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`No history file at ${path}`);
    throw error;
  }
  const weeks = Array.isArray(history?.weeks) ? history.weeks : [];
  return weeks.flatMap((week) =>
    (Array.isArray(week?.matches) ? week.matches : [])
      .filter((match) => match?.result && match?.prediction)
      .map((match) => ({
        week: week.id,
        pick: match.prediction.pick,
        confidence: match.prediction.confidence ?? "UNKNOWN",
        confidenceScore: Number(match.prediction.confidenceScore ?? 0),
        correct: match.result.correct === true,
      })),
  );
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function summarize(rows, label) {
  if (rows.length === 0) return `  ${label}: (no matches)`;
  const hits = rows.filter((row) => row.correct).length;
  const avgProb = rows.reduce((sum, row) => sum + row.confidenceScore, 0) / rows.length;
  const gap = hits / rows.length - avgProb;
  return (
    `  ${label}: n=${rows.length}  hit-rate=${pct(hits / rows.length)}` +
    `  avg-model-prob=${pct(avgProb)}  gap=${gap >= 0 ? "+" : ""}${pct(gap)}`
  );
}

const matches = loadSettledMatches(historyPath);
if (matches.length === 0) {
  console.log(`No settled matches in ${historyPath} — nothing to calibrate yet.`);
  process.exit(0);
}

console.log(`Calibration — ${matches.length} settled predictions from ${historyPath}\n`);

console.log("By confidence bucket (hit-rate should track avg model probability):");
for (const bucket of BUCKETS) {
  console.log(summarize(matches.filter((m) => m.confidence === bucket), bucket));
}
console.log(summarize(matches.filter((m) => !BUCKETS.includes(m.confidence)), "UNKNOWN"));

console.log("\nBy pick (1 = home, X = draw, 2 = away):");
for (const pick of ["1", "X", "2"]) {
  console.log(summarize(matches.filter((m) => m.pick === pick), `pick ${pick}`));
}

console.log("\nOverall:");
console.log(summarize(matches, "all"));

const draws = matches.filter((m) => m.pick === "X").length;
console.log(
  `\nDraw picks are ${pct(draws / matches.length)} of all predictions` +
    ` (bookmaker baselines: home ~45%, draw ~25%, away ~30%).`,
);
