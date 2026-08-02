/**
 * Q-305: Export story registry JSON from the single source of truth.
 *
 * Source (edit only this): demo/data/storyRegistry.ts
 * Output (generated):     docs/stories/story_registry.json
 *
 * Usage (from demo/):
 *   node scripts/export-story-registry.mjs
 *   npm run registry:export
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const demoRoot = join(__dirname, '..');
const repoRoot = join(demoRoot, '..');
const sourcePath = join(demoRoot, 'data', 'storyRegistry.ts');
const outPath = join(repoRoot, 'docs', 'stories', 'story_registry.json');

const source = readFileSync(sourcePath, 'utf8');
const arrayMatch = source.match(/export const storyRegistry[^=]*=\s*\[([\s\S]*)\];\s*$/m);
if (!arrayMatch) {
  console.error('Could not find export const storyRegistry = [...] in', sourcePath);
  process.exit(1);
}

const body = arrayMatch[1];
// Split on top-level object starts: lines that are "  {" after optional comments
const chunks = body.split(/(?=\n\s*\{\s*\n)/);
const entries = [];

for (const chunk of chunks) {
  if (!/id\s*:/.test(chunk)) continue;
  const getStr = (key) => {
    const m = chunk.match(new RegExp(`${key}\\s*:\\s*'((?:\\\\'|[^'])*)'`));
    return m ? m[1].replace(/\\'/g, "'") : undefined;
  };
  const getNum = (key) => {
    const m = chunk.match(new RegExp(`${key}\\s*:\\s*(\\d+)`));
    return m ? Number(m[1]) : undefined;
  };

  const id = getStr('id');
  if (!id) continue;

  const entry = {
    id,
    domain: getStr('domain'),
    title: getStr('title'),
    role: getStr('role'),
    status: getStr('status'),
    problem: getStr('problem'),
    screen: getStr('screen'),
    transparency_focus: getStr('transparency_focus'),
    acceptance_criteria_count: getNum('acceptance_criteria_count'),
    implemented_criteria: getNum('implemented_criteria'),
    route: getStr('route'),
    source_file: getStr('source_file'),
  };

  // Drop undefined optional fields for cleaner JSON
  for (const k of Object.keys(entry)) {
    if (entry[k] === undefined) delete entry[k];
  }
  entries.push(entry);
}

if (entries.length === 0) {
  console.error('No stories parsed from', sourcePath);
  process.exit(1);
}

const ids = entries.map((e) => e.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) {
  console.error('Duplicate IDs:', [...new Set(dupes)].join(', '));
  process.exit(1);
}

const header = {
  _generated: true,
  _source: 'demo/data/storyRegistry.ts',
  _generator: 'demo/scripts/export-story-registry.mjs',
  _note: 'DO NOT EDIT BY HAND. Regenerate: cd demo && npm run registry:export',
  _count: entries.length,
  _exported_at: new Date().toISOString().slice(0, 10),
};

const payload = {
  ...header,
  stories: entries,
};

writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${entries.length} stories → ${outPath}`);
console.log(`IDs: ${ids.join(', ')}`);
