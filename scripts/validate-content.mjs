#!/usr/bin/env bun
/**
 * Content contract check that zod cannot express: the case-study body must
 * carry the required `##` headings, in the order the contract fixes.
 *
 * Run via `bun run validate:content` (part of `bun run build`). Frontmatter is
 * validated separately by the zod schema in `src/content/config.ts`.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'projects');

const REQUIRED_HEADINGS = [
  'Purpose',
  'The problem',
  'Architecture',
  'Technology',
  'Challenges & decisions',
];

const problems = [];

const files = (await readdir(CONTENT_DIR)).filter((file) => /\.(md|mdx)$/.test(file));

if (files.length === 0) {
  problems.push(`No project files found in ${path.relative(process.cwd(), CONTENT_DIR)}`);
}

for (const file of files) {
  const raw = await readFile(path.join(CONTENT_DIR, file), 'utf8');
  const frontmatter = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);

  if (!frontmatter) {
    problems.push(`${file}: missing YAML frontmatter block`);
    continue;
  }

  const body = raw.slice(frontmatter[0].length);
  const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1].trim());

  if (/^#\s+/m.test(body)) {
    problems.push(`${file}: body must not contain an h1 (the layout owns the page title)`);
  }

  let previousIndex = -1;
  for (const heading of REQUIRED_HEADINGS) {
    const index = headings.indexOf(heading);
    if (index === -1) {
      problems.push(`${file}: missing required heading "## ${heading}"`);
      continue;
    }
    if (index < previousIndex) {
      problems.push(`${file}: heading "## ${heading}" is out of order`);
    }
    previousIndex = index;
  }
}

if (problems.length > 0) {
  console.error(`\n✖ Content contract failed (${problems.length} problem(s)):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('');
  process.exit(1);
}

console.log(`✓ Content contract OK — ${files.length} project file(s) checked`);
