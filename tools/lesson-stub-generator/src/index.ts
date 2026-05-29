import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Types mirroring curriculum.json shape
// ---------------------------------------------------------------------------

interface LessonEntry {
  id: string;
  title: { en: string; vi: string };
  level: string;
}

interface UnitEntry {
  id: string;
  title: { en: string; vi: string };
  lessons: LessonEntry[];
}

interface TrackEntry {
  id: string;
  title: { en: string; vi: string };
  levels: string[];
  units: UnitEntry[];
}

interface DomainEntry {
  title: { en: string; vi: string };
  tracks: TrackEntry[];
}

interface Curriculum {
  domains: Record<string, DomainEntry>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Walk up from cwd until we find the repo root (contains a content/ dir). */
function findRepoRoot(start: string): string {
  let dir = start;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'content'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Cannot find repo root with content/ dir (started: ${start})`);
}

/** Zero-pad a number to 2 digits. */
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Build the MDX frontmatter + body stub for one lesson/lang combo. */
function buildStub(opts: {
  domain: string;
  trackId: string;
  unitId: string;
  order: number;
  lesson: LessonEntry;
  lang: 'en' | 'vi';
}): string {
  const { domain, trackId, unitId, order, lesson, lang } = opts;
  const nn = pad2(order);
  const id = `${domain}-${trackId}-${unitId}-${nn}-${lesson.id}-${lang}`;
  const parityId = `${domain}-${trackId}-${unitId}-${nn}-${lesson.id}`;
  const title = lesson.title[lang];
  const isEn = lang === 'en';
  const description = isEn
    ? 'Draft — content forthcoming.'
    : 'Bản nháp — nội dung sẽ được bổ sung.';
  const bodyPlaceholder = isEn
    ? '_Draft — content forthcoming._'
    : '_Bản nháp — nội dung sẽ được bổ sung._';

  return `---
id: ${id}
slug: ${lesson.id}
lang: ${lang}
parityId: ${parityId}
domain: ${domain}
track: ${trackId}
unit: ${unitId}
order: ${order}
level: ${lesson.level}
estimatedReadingMinutes: 5
title: "${title.replace(/"/g, '\\"')}"
description: "${description}"
authors: ["tba"]
publishedAt: "2026-05-29"
lastVerified: "2026-05-29"
tags: []
license: CC-BY-SA-4.0
status: draft
---

# ${title}

${bodyPlaceholder}
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const root = findRepoRoot(process.cwd());
  const curriculumPath = path.join(root, 'data', 'curriculum.json');

  if (!fs.existsSync(curriculumPath)) {
    console.error(`curriculum.json not found at ${curriculumPath}`);
    process.exit(1);
  }

  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8')) as Curriculum;

  let generated = 0;
  let skipped = 0;

  for (const [domainId, domain] of Object.entries(curriculum.domains)) {
    for (const track of domain.tracks) {
      // Skip tracks with no units
      if (!track.units || track.units.length === 0) continue;

      for (const unit of track.units) {
        unit.lessons.forEach((lesson, lessonIndex) => {
          const order = lessonIndex + 1; // 1-based

          for (const lang of ['en', 'vi'] as const) {
            const nn = pad2(order);
            const relPath = path.join(
              'content',
              lang,
              domainId,
              unit.id,
              `${nn}-${lesson.id}.mdx`,
            );
            const absPath = path.join(root, relPath);

            // Idempotent — never overwrite existing files
            if (fs.existsSync(absPath)) {
              skipped++;
              continue;
            }

            const dir = path.dirname(absPath);
            fs.mkdirSync(dir, { recursive: true });

            const content = buildStub({
              domain: domainId,
              trackId: track.id,
              unitId: unit.id,
              order,
              lesson,
              lang,
            });

            fs.writeFileSync(absPath, content, 'utf-8');
            generated++;
          }
        });
      }
    }
  }

  console.log(`Generated ${generated} files, skipped ${skipped} existing.`);
}

main();
