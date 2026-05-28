---
title: Phase 0 Platform Foundation
description: >-
  Monorepo + Astro 5 + bilingual i18n scaffold for the RF·CN·Space handbook.
  Platform only — no curriculum content beyond 1 pilot EN/VI lesson parity pair.
status: completed
priority: P1
branch: main
tags:
  - bootstrap
  - astro
  - monorepo
  - i18n
  - vercel
blockedBy: []
blocks: []
created: '2026-05-28T14:43:41.225Z'
createdBy: 'ck:plan'
source: skill
---

# Phase 0 Platform Foundation

## Overview

Stand up the platform scaffold described in `docs/PLATFORM_BLUEPRINT.md` (locked at ~96% confidence) so that `pnpm dev` serves `/en/` and `/vi/` with one parity-paired pilot lesson rendering MDX + KaTeX + a React-island widget, and CI passes on a draft PR. This is the foundation; curriculum authoring (~1,000 lessons over multiple years) is downstream of this plan.

**Source of truth (read first):** `docs/PLATFORM_BLUEPRINT.md`
**Bootstrap scope (approved):** `/Users/imnortheast/.claude/plans/you-must-gather-information-dazzling-whale.md`

## User-locked decisions

1. **Package scope:** `@rfcn-space-handbook/*` for every workspace package
2. **Deploy target:** **Vercel** (overrides blueprint §3.7 Cloudflare Pages) — `@astrojs/vercel/static` adapter, `vercel.json` for headers/redirects, Vercel git integration handles deploy (no `deploy.yml`), Vercel Web Analytics replaces Cloudflare Web Analytics
3. **Mode:** `--full` interactive — every phase gets a review gate before next phase starts

## Hard constraints (from blueprint, non-negotiable)

- Zero JavaScript by default; React islands hydrate `client:visible` or `client:idle` only, never `client:load`
- Per-widget bundle ≤150KB gzipped, enforced by `size-limit` in CI
- Bilingual parity at lesson level enforced at CI (`tools/i18n-parity-check`)
- Lighthouse mobile perf ≥90 on median, ≥85 on widget-heavy
- WCAG 2.2 AA target (KaTeX `htmlAndMathml`, `aria-label` on widgets, keyboard nav, reduced-motion)
- No backend, no DB, no auth, no payments
- Content license CC-BY-SA 4.0
- Static-only — `@astrojs/vercel/static`, no Vercel Functions

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Repo Hygiene](./phase-01-repo-hygiene.md) | Completed |
| 2 | [Monorepo Scaffold](./phase-02-monorepo-scaffold.md) | Completed |
| 3 | [Astro App](./phase-03-astro-app.md) | Completed |
| 4 | [Packages](./phase-04-packages.md) | Completed |
| 5 | [Content + Data Seeds](./phase-05-content-data-seeds.md) | Completed |
| 6 | [Tools Validators](./phase-06-tools-validators.md) | Completed |
| 7 | [CI + Vercel](./phase-07-ci-vercel.md) | Completed |
| 8 | [Design Tokens + Tailwind](./phase-08-design-tokens-tailwind.md) | Completed |

## Dependency chain (linear, mostly)

```
1 → 2 → 3 → 4 → 5 → 6 → 7
              ↘  8 (can parallelize with 5+6 once 4 done)
```

Phase 8 (design tokens) can land in parallel with 5+6 once Phase 4 packages exist, but for `--full` review-gated mode we execute sequentially.

## End-state verification

```bash
pnpm install
pnpm -r build                           # all workspaces compile
pnpm --filter web dev                   # /  → /en/, /en/rf/r0-foundations/decibels renders, lang switcher → /vi/...
pnpm --filter web build                 # SSG to dist/
pnpm test                               # vitest across packages
node tools/i18n-parity-check/index.js   # exit 0
pnpm lhci autorun                       # mobile perf ≥85
```

CI green on a draft PR with the full scaffold staged.

## Dependencies

No cross-plan dependencies. This is the founding plan for the project.

## Out of scope (explicit, deferred to later plans)

- Curriculum content beyond 1 pilot parity pair (covered Phase 1 of blueprint §8)
- Roadmap visualizer (Phase 1 of blueprint §8)
- The 5 flagship widgets (Phase 1) — only one `PolarPlot` demo here
- All 3 cross-domain bridges (Phase 1)
- Standards-versioning UI banner (Phase 1)
- "Build my own book" PDF export (Phase 3)
- Newsletter, Sentry, domain registration, Vercel project creation (manual user steps documented in README)
