---
title: "Phase 1.0 Mechanical Scaffolding"
description: "Phase 1 mechanical pieces only: full curriculum DAG, ~2,000 empty MDX stubs (EN+VI per lesson, status:draft), roadmap visualizer, 4 more flagship widget scaffolds, expanded glossary + citations. NO lesson body content (authored separately by humans)."
status: completed
priority: P2
branch: "main"
tags: [phase-1, scaffolding, automation]
blockedBy: []
blocks: []
created: "2026-05-29T04:46:44.958Z"
createdBy: "ck:plan"
source: skill
---

# Phase 1.0 Mechanical Scaffolding

## Overview

Phase 0 shipped the platform; Phase 1 is the curriculum-authoring grind. This plan covers ONLY the mechanical pieces of Phase 1 that can be honestly automated. Lesson body content is **explicitly out of scope** — that's blueprint §6.3 veteran-engineer-voice work, multi-year, human-led, no auto-generation (§6.1 Tier D, §7.1 risk).

**What this delivers:**
- Full curriculum DAG (~1,000 lesson IDs across RF/CN/Space tracks/units per blueprint §5)
- Empty MDX stubs for every lesson in both EN and VI (~2,000 files) with `status: draft` frontmatter — exercises parity validator + frontmatter validator at scale
- Roadmap visualizer (SVG, per-domain, renders the DAG with current-lesson highlighting)
- 4 more flagship widget scaffolds (LinkBudget, OrbitVisualizer, FiveGCallFlow, ModulationVisualizer) — code structure + a11y wrappers + placeholder math, NOT polished/verified physics
- Glossary expanded to ~50 bilingual terms from blueprint vocabulary
- Citations expanded to ~20 standards from blueprint references

**What this does NOT deliver:**
- Any lesson body prose
- Verified-accurate widget physics (orbital propagation, link-budget atmospherics, etc.)
- Vietnamese translation of lesson content
- Cross-domain bridges B1/B2/B3 (those are content)

## User-locked decisions

- Lesson stubs use `status: draft` in frontmatter (new field — added to Zod schema in Phase 1) so they don't appear in published navigation
- A new `tools/lesson-stub-generator/` script generates the 2,000 stubs from `data/curriculum.json` (single source of truth)
- Widget scaffolds compile + pass smoke tests but are flagged `experimental: true` in their package exports

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Curriculum DAG](./phase-01-curriculum-dag.md) | ✅ Completed |
| 2 | [Lesson Stub Generator](./phase-02-lesson-stub-generator.md) | ✅ Completed |
| 3 | [Roadmap Visualizer](./phase-03-roadmap-visualizer.md) | ✅ Completed |
| 4 | [Widget Scaffolds](./phase-04-widget-scaffolds.md) | ✅ Completed |
| 5 | [Glossary + Citations Expansion](./phase-05-glossary-citations-expansion.md) | ✅ Completed |
| 6 | [Verify + Commit](./phase-06-verify-commit.md) | ✅ Completed |

## Dependency chain

```
1 → 2 → 6
1 → 3 → 6
4 → 6
5 → 6
```

Phases 1, 4, 5 are independent. Phase 2 depends on 1. Phase 3 depends on 1. Phase 6 verifies everything together.

## End-state verification

- `pnpm validate:parity` → "~1,000 parityIds matched"
- `pnpm validate:frontmatter` → "~2,000 files passed"
- `pnpm --filter @rfcn-space-handbook/web build` → exits 0, builds ~2,000 lesson pages (each is just a "draft" placeholder rendering)
- `pnpm test` → all green; new widget package tests pass smoke
- Roadmap visualizer renders at `/{lang}/{domain}/` showing the full DAG

## Out of scope

- Lesson body authoring (human work, multi-year)
- Widget physics correctness verification (placeholder math)
- Cross-domain bridges (need content)
- llms.txt regeneration (defer to first real-lessons batch)
- 50+ flagship widgets (only 4 added here; rest deferred)
