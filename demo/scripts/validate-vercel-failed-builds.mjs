/**
 * Schema check for docs/delivery/VERCEL_FAILED_BUILDS.md.
 * Reads the real list. Every data row must have Date, Deployment (dpl_), Error, Solution.
 *
 * Usage (from demo/):
 *   node scripts/validate-vercel-failed-builds.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const listPath = join(repoRoot, "docs", "delivery", "VERCEL_FAILED_BUILDS.md");
const text = readFileSync(listPath, "utf8");

const rows = text
  .split(/\r?\n/)
  .filter((line) => /^\| \d{4}-\d{2}-\d{2} \|/.test(line));

if (rows.length < 1) {
  throw new Error(`No dated entries in ${listPath}`);
}

const issues = [];
for (const line of rows) {
  const cells = line
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());
  const [date, deployment, error, solution] = cells;
  if (!date || !deployment || !error || !solution) {
    issues.push(`incomplete row: ${line}`);
    continue;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    issues.push(`bad date: ${date}`);
  }
  if (!/`dpl_[A-Za-z0-9]+`/.test(deployment)) {
    issues.push(`missing dpl_ id: ${deployment}`);
  }
}

if (issues.length > 0) {
  throw new Error(issues.join("\n"));
}

const newest = rows[0];
process.stdout.write(
  `ok ${rows.length} entries; newest: ${newest.slice(0, 80)}\n`,
);
