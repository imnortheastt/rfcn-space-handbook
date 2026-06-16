---
phase: 8
title: "Verification and integration"
status: pending
effort: ""
---

# Phase 8: Verification and integration

## Overview

Final serial gate. Absorbs superseded plan 260604-1518 phase-05 testing.

## Implementation Steps

1. `pnpm build` clean; sidebar → lesson click-through, 3 domains × 2 langs.
2. axe-core pass (home/domain/lesson); keyboard-only walkthrough (drawer, sidebar, TOC, pager); contrast verification of new tokens; Pagefind works; Lighthouse perf budget held with webfont.
3. Mark plan 260604-1518 phases 1–3 complete + superseded note pointing here.
4. Update `docs/project-changelog.md` + `docs/development-roadmap.md`.

## Success Criteria

- [ ] Zero 404s from sidebar
- [ ] No serious/critical axe violations
- [ ] Docs + superseded plan updated
