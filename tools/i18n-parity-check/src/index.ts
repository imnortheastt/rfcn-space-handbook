import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

interface FileMeta {
  parityId: string;
  parityException?: 'vi-only' | 'en-only';
  filePath: string;
}

function parseMdxFrontmatter(filePath: string): FileMeta | null {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);

  const parityId = data['parityId'] as string | undefined;
  if (!parityId) {
    console.error(`${filePath}:1 — missing parityId field, skipping`);
    return null;
  }

  return {
    parityId,
    parityException: data['parityException'] as 'vi-only' | 'en-only' | undefined,
    filePath,
  };
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

  const [enFiles, viFiles] = await Promise.all([
    glob('content/en/**/*.mdx', { cwd: root, absolute: true }),
    glob('content/vi/**/*.mdx', { cwd: root, absolute: true }),
  ]);

  // Build maps: parityId -> filePath, plus exception sets
  const enMap = new Map<string, string>();
  const viMap = new Map<string, string>();
  const enOnlyIds = new Set<string>(); // parityException: 'en-only' (no VI expected)
  const viOnlyIds = new Set<string>(); // parityException: 'vi-only' (no EN expected)

  for (const f of enFiles) {
    const meta = parseMdxFrontmatter(f);
    if (!meta) continue;
    enMap.set(meta.parityId, path.relative(root, meta.filePath));
    if (meta.parityException === 'en-only') enOnlyIds.add(meta.parityId);
    if (meta.parityException === 'vi-only') viOnlyIds.add(meta.parityId);
  }

  for (const f of viFiles) {
    const meta = parseMdxFrontmatter(f);
    if (!meta) continue;
    viMap.set(meta.parityId, path.relative(root, meta.filePath));
    if (meta.parityException === 'en-only') enOnlyIds.add(meta.parityId);
    if (meta.parityException === 'vi-only') viOnlyIds.add(meta.parityId);
  }

  const mismatches: string[] = [];

  // EN ids missing in VI (unless en-only exception)
  for (const [parityId, filePath] of enMap) {
    if (enOnlyIds.has(parityId)) continue; // explicitly en-only
    if (!viMap.has(parityId)) {
      mismatches.push(`${filePath}:1 — parityId "${parityId}" exists in EN but missing in VI`);
    }
  }

  // VI ids missing in EN (unless vi-only exception)
  for (const [parityId, filePath] of viMap) {
    if (viOnlyIds.has(parityId)) continue; // explicitly vi-only
    if (!enMap.has(parityId)) {
      mismatches.push(`${filePath}:1 — parityId "${parityId}" exists in VI but missing in EN`);
    }
  }

  const totalMatched = [...enMap.keys()].filter(
    (id) => !enOnlyIds.has(id) && !viOnlyIds.has(id) && viMap.has(id),
  ).length;

  if (mismatches.length === 0) {
    console.log(`All ${totalMatched} parityId(s) matched across locales.`);
    process.exit(0);
  } else {
    console.error(`i18n parity check failed — ${mismatches.length} mismatch(es):`);
    for (const msg of mismatches) {
      console.error(`  ${msg}`);
    }
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('i18n-parity-check: unexpected error:', err);
  process.exit(1);
});
