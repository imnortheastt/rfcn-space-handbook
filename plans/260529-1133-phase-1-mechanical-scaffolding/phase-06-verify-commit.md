---
phase: 6
title: "Verify + Commit"
status: completed
priority: P1
effort: "1h"
dependencies: [1, 2, 3, 4, 5]
---

# Phase 6: Verify + Commit

## Context Links
- Depends on all prior phases

## Overview
End-to-end verification of Phases 1-5, then atomic commits (split by phase for git archaeology). Stop at user gate per `--auto` rule before push.

## Key Insights
- 2,000 new files is large but ~95% of content is identical structure; diff is mostly mechanical.
- Split commits make rollback feasible if any phase needs reversion (e.g. curriculum DAG rename).
- Build time matters: with 2,000 stubs (drafts excluded from getStaticPaths), build should stay near current ~30s. If it bloats, that's a signal the draft-filter isn't working.

## Requirements
**Functional:** every pre-Phase-0 success criterion still passes (no regressions) + every Phase 1.0 success criterion passes.
**Non-functional:** build time ≤ 90s (current: ~30s, budget room for incremental work).

## Architecture
N/A — this phase only runs validators + commits.

## Related Code Files
None new; modifies plan status files via `ck plan check`.

## Implementation Steps

1. **Full verification battery**:
   - `pnpm install --frozen-lockfile` — exit 0
   - `pnpm lint` — exit 0
   - `pnpm validate:parity` — expect "~1,000 parityIds matched"
   - `pnpm validate:frontmatter` — expect "~2,000 files passed"
   - `pnpm -r build` — exit 0
   - `pnpm test` — all green (29 from Phase 0 + 4 widget smokes + 1 stub-generator + 1 curriculum-schema = ~35)
   - `pnpm --filter @rfcn-space-handbook/widgets size-limit` — all 5 widgets within budget
   - `time pnpm --filter @rfcn-space-handbook/web build` — record build time, fail if > 90s
   - Manual smoke: preview server, hit `/en/` (placeholder home), `/en/rf/` (roadmap SVG), `/en/rf/r0-foundations/decibels` (pilot still works), confirm draft lessons return 404 (not published, not in getStaticPaths)

2. **Atomic commits** (5 commits, ordered):
   a. `feat(curriculum): full track/unit/lesson DAG` — data/curriculum.json + packages/curriculum-schema
   b. `feat(content): 2000 lesson stubs in EN+VI` — tools/lesson-stub-generator + content/{en,vi}/**/*.mdx + schema status field
   c. `feat(web): per-domain roadmap visualizer` — apps/web/src/pages/[lang]/[domain]/index.astro + lib + component
   d. `feat(widgets): 4 flagship widget scaffolds` — packages/widgets/src/{rf,network,space}/* + size-limit
   e. `chore(data): expand glossary + citations baseline` — data/glossary.json + data/citations.json + sidecars

3. **Stop at push gate per `--auto`**: present commit list to user; let them push or amend.

4. **Update docs/development-roadmap.md** — Phase 1 status "in progress: mechanical scaffolding complete YYYY-MM-DD; content authoring in progress".

5. **Update docs/project-changelog.md** — new unreleased entry summarizing the 5 commits.

## Todo List
- [x] Full validator + test + build sweep
- [x] Build time < 90s confirmed
- [x] 5 atomic commits staged
- [x] Stop at push gate
- [x] Roadmap + changelog updated

## Success Criteria
- [x] All validators green
- [x] All tests green
- [x] Build < 90s
- [x] 5 commits on local main, no push without user confirmation
- [x] docs/ reflects new state

## Risk Assessment
- **Build time blowup** (medium): 2,000 MDX stubs even excluded from getStaticPaths still get parsed by content collection loader. Mitigation: if > 90s, add `draft: true` filter at the loader level (Astro 5 content layer supports it), not just the route level. If still slow, investigate Astro's per-entry caching.
- **Roadmap SVG too big** (medium): rendering 290 lessons in one SVG might exceed 100KB. Mitigation per Phase 3 risk: collapse to track-level and show units as expandable.
- **Commit split mistake** (low): each commit must be self-contained and build green. If commit (a) lands without commit (b), the lesson stubs don't exist but the curriculum.json references them in roadmap → 404s. Mitigation: commit (c) depends on (a)+(b), so document the order and verify build after each.

## Security Considerations
- Each commit message scanned for accidentally-leaked file paths or secrets.

## Next Steps
Push to remote (user gate). Then human-led Phase 1 content authoring begins.
