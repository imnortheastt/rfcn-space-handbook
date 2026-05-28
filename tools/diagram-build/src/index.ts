import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

/** Walk up from cwd until we find a directory containing a `pnpm-workspace.yaml` (repo root). */
function findRepoRoot(start: string): string {
  let dir = start;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: return start so the tool still runs from wherever it's called
  return start;
}

async function main(): Promise<void> {
  const root = findRepoRoot(process.cwd());

  const mmdFiles = await glob('diagrams/**/*.mmd', { cwd: root, absolute: true });

  if (mmdFiles.length === 0) {
    console.log('No mermaid diagrams found, skipping.');
    process.exit(0);
  }

  let built = 0;
  let skipped = 0;
  let failed = 0;

  for (const mmdPath of mmdFiles) {
    const svgPath = mmdPath.replace(/\.mmd$/, '.svg');
    const relMmd = path.relative(root, mmdPath);
    const relSvg = path.relative(root, svgPath);

    // Skip if SVG is newer than the source .mmd file
    if (fs.existsSync(svgPath)) {
      const mmdMtime = fs.statSync(mmdPath).mtimeMs;
      const svgMtime = fs.statSync(svgPath).mtimeMs;
      if (svgMtime > mmdMtime) {
        console.log(`${relSvg}: up to date, skipping`);
        skipped++;
        continue;
      }
    }

    console.log(`${relMmd}: building -> ${relSvg}`);

    try {
      // execFileSync with argument array avoids shell interpolation — path comes from glob, not user input
      execFileSync('npx', ['mmdc', '-i', mmdPath, '-o', svgPath, '-t', 'neutral', '-b', 'transparent'], {
        stdio: 'inherit',
      });
      built++;
    } catch (err) {
      // Distinguish "mmdc not installed" from other build failures
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('not found') || errMsg.includes('Cannot find')) {
        console.error(
          `diagram-build: mmdc not found. Install with: pnpm add -Dw @mermaid-js/mermaid-cli`,
        );
      } else {
        console.error(`${relMmd}:1 — mmdc failed: ${errMsg}`);
      }
      failed++;
    }
  }

  const total = mmdFiles.length;
  console.log(`diagram-build: ${total} diagram(s) — ${built} built, ${skipped} skipped, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('diagram-build: unexpected error:', err);
  process.exit(1);
});
