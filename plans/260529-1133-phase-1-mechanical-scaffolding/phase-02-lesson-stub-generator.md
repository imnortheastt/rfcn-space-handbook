---
phase: 2
title: "Lesson Stub Generator"
status: completed
priority: P1
effort: "2h"
dependencies: [1]
---

# Phase 2: Lesson Stub Generator

## Context Links
- Blueprint §3.3 (frontmatter contract), §3.5 (i18n parity)
- Depends on: Phase 1 (`data/curriculum.json` populated)

## Overview
Script that reads `data/curriculum.json` and produces ~2,000 MDX stub files (one EN + one VI per lesson). Each stub has minimum-valid frontmatter (status: draft) and a 1-line body placeholder. Tests Phase 0 validators at scale.

## Key Insights
- Adding `status: 'draft' | 'published' | 'review'` to the lessons Zod schema (apps/web/src/content/config.ts AND tools/frontmatter-validator/src/index.ts) is a one-line change but critical — without it, 2,000 drafts pollute the published lesson list.
- Astro routes: filter `getCollection('lessons')` by `data.status === 'published'` so drafts don't show in navigation. Pilot decibels lesson needs `status: 'published'` added explicitly (otherwise it disappears).
- Run the generator as a one-shot script, not a runtime watcher. Idempotent: re-running should not overwrite existing files unless `--force`.

## Requirements
**Functional:** running `pnpm gen:stubs` creates EN+VI stub for every lesson in curriculum.json that doesn't already exist. After: parity-check passes on ~1,000 parityIds, frontmatter-validator passes on ~2,000 files.
**Non-functional:** generation completes in <30s. Output is deterministic (same input → same output).

## Architecture
- New workspace package: `tools/lesson-stub-generator/`
- Reads: `data/curriculum.json`, existing `content/{en,vi}/**/*.mdx`
- Writes: `content/{en,vi}/{domain}/{track}/{unit}/{order}-{slug}.mdx` for each missing file
- Frontmatter: id, slug, lang, parityId, domain, track, unit, order, level, title (from curriculum.json), description (placeholder), authors (["tba"]), publishedAt (today), lastVerified (today), tags ([]), license ("CC-BY-SA-4.0"), **status: "draft"**

## Related Code Files
- Create: `tools/lesson-stub-generator/{package.json, tsconfig.json, src/index.ts}`
- Modify: `apps/web/src/content/config.ts` — add `status: z.enum(['draft','published','review']).default('draft')`
- Modify: `tools/frontmatter-validator/src/index.ts` — mirror the status field
- Modify: `apps/web/src/pages/[lang]/[domain]/[...slug].astro` — filter `getStaticPaths` by status
- Modify: `content/{en,vi}/rf/r0-foundations/01-decibels.mdx` — add `status: published`
- Modify: root `package.json` — add `"gen:stubs": "pnpm --filter @rfcn-space-handbook/tool-lesson-stub-generator exec tsx src/index.ts"`

## Implementation Steps
1. Add `status` field to Zod schema (both places). Default `draft`. Update decibels pilot lesson to `published`.
2. Update Astro lesson route's getStaticPaths to filter `data.status === 'published'` (draft lessons don't generate HTML pages — they exist for parity tracking only).
3. Build the generator:
   - Load curriculum.json
   - For each domain → track → unit → lesson:
     - Build EN path: `content/en/{domain}/{track-with-suffix}/{unit-id}/{order}-{slug}.mdx`
     - Build VI path: mirror
     - If either exists: skip (idempotent)
     - Else: write stub with frontmatter (per Architecture above) + body `"_Draft — content forthcoming._"`
4. Run generator.
5. Run validators — expect ~1,000 parityIds matched + ~2,000 files passing frontmatter.

## Todo List
- [ ] status field added to schema (both places)
- [ ] decibels pilot marked published
- [ ] Astro route filters by status
- [ ] generator scaffolded + implemented
- [ ] gen:stubs script in root package.json
- [ ] Generator produces ~2,000 files
- [ ] Validators pass at scale

## Success Criteria
- [ ] `pnpm validate:parity` reports ~1,000 parityIds matched
- [ ] `pnpm validate:frontmatter` reports ~2,000 files passed
- [ ] `pnpm --filter web build` exits 0 — only published lessons generate HTML
- [ ] decibels lesson still renders at /en/ and /vi/

## Risk Assessment
- **Build time blowup** (medium): 2,000 stubs * MDX compile = potentially slow. Mitigation: drafts excluded from getStaticPaths → no HTML generated → build time unaffected. Verify.
- **Disk usage** (low): 2,000 files × ~500 bytes = 1MB. Trivial.
- **Idempotency bug** (medium): if generator overwrites existing pilot lesson, we lose content. Mitigation: explicit `if (existsSync) continue` and a unit test on the generator.

## Security Considerations
- Script only writes inside `content/`. Path constructed from validated curriculum.json IDs — no path traversal.

## Next Steps
Phase 3 builds the roadmap visualizer that consumes the same curriculum.json.
