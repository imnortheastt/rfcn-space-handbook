import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

// Mirror of apps/web/src/content/config.ts — keep in sync.
// Duplicated intentionally to avoid coupling the tools package to the Astro app
// (which pulls in astro:content virtual module that cannot resolve outside the app).
const lessonFrontmatterSchema = z.object({
  // ── Identity ──────────────────────────────────────────────────────────
  id: z.string(),
  slug: z.string(),
  lang: z.enum(['en', 'vi']),
  parityId: z.string(),
  domain: z.enum(['rf', 'core-network', 'space']),
  track: z.string(),
  unit: z.string(),
  order: z.number().int().nonnegative(),

  // ── Pedagogical metadata ──────────────────────────────────────────────
  level: z.enum(['L0', 'L1', 'L2', 'L3', 'L4', 'L5']),
  estimatedReadingMinutes: z.number().int().positive(),
  prerequisites: z.array(z.string()).default([]),
  spiralRevisits: z.array(z.string()).default([]),

  // ── Editorial ─────────────────────────────────────────────────────────
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  authors: z.array(z.string()),
  reviewers: z.array(z.string()).optional(),
  publishedAt: z.coerce.date(),
  lastVerified: z.coerce.date(),
  lastReviewedAt: z.coerce.date().optional(),

  // ── Standards & citations ─────────────────────────────────────────────
  standards: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        cite: z.string(),
      }),
    )
    .optional(),

  // ── Frontier flag ─────────────────────────────────────────────────────
  researchFrontier: z.boolean().default(false),

  // ── Discoverability ───────────────────────────────────────────────────
  tags: z.array(z.string()),
  keywords: z.array(z.string()).optional(),

  // ── Widget bundle hints ───────────────────────────────────────────────
  widgets: z.array(z.string()).optional(),

  // ── License ───────────────────────────────────────────────────────────
  license: z.literal('CC-BY-SA-4.0'),

  // ── Publication status ────────────────────────────────────────────────
  status: z.enum(['draft', 'published', 'review']).default('draft'),

  // ── i18n exception ────────────────────────────────────────────────────
  parityException: z.literal('vi-only').optional(),
});

interface FieldError {
  file: string;
  field: string;
  message: string;
}

/** Walk up from cwd until we find a directory containing a `content/` folder. */
function findRepoRoot(start: string): string {
  let dir = start;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'content'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }
  throw new Error(`Could not locate repo root with a content/ directory (started from ${start})`);
}

async function main(): Promise<void> {
  const root = findRepoRoot(process.cwd());

  const files = await glob('content/**/*.mdx', { cwd: root, absolute: true });

  if (files.length === 0) {
    console.log('No .mdx files found under content/');
    process.exit(0);
  }

  const failures: FieldError[] = [];

  for (const absPath of files) {
    const relPath = path.relative(root, absPath);
    const raw = fs.readFileSync(absPath, 'utf-8');
    const { data } = matter(raw);

    const result = lessonFrontmatterSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        failures.push({
          file: relPath,
          field: issue.path.join('.') || '(root)',
          message: issue.message,
        });
      }
    }
  }

  const passCount = files.length - new Set(failures.map((f) => f.file)).size;

  if (failures.length === 0) {
    console.log(`${files.length} file(s) passed frontmatter validation.`);
    process.exit(0);
  }

  console.error(`Frontmatter validation failed — ${failures.length} error(s) in ${files.length - passCount} file(s):`);
  console.error('');
  // grep-friendly file:field — message format
  for (const { file, field, message } of failures) {
    console.error(`${file}:1 [${field}] — ${message}`);
  }
  process.exit(1);
}

main().catch((err: unknown) => {
  console.error('frontmatter-validator: unexpected error:', err);
  process.exit(1);
});
