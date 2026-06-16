---
title: UI/UX Overhaul + Lesson 404 Fix + Content Deepening
description: ''
status: in-progress
priority: P2
branch: main
tags: []
blockedBy: []
blocks: []
created: '2026-06-04T10:03:44.514Z'
createdBy: 'ck:plan'
source: skill
---

# UI/UX Overhaul + Lesson 404 Fix + Content Deepening

## Overview

Three workstreams: (1) fix sidebar lesson 404 (sidebar built hierarchical hrefs, route is flat — flat wins; all 263 curriculum IDs match content slugs); (2) UI/UX overhaul via 4 workstreams with strict file ownership (WS-A tokens blocks WS-B/C/D); (3) content deepening — RF 72 thin lessons to full depth, CN/Space quality passes, EN+VI parity mandatory.

DAG: P1 → P2 → (P3 ‖ P4 ‖ P5) → P8; P6 (3 parallel domain agents, `content/` only) runs alongside P2–P5 → P7 → P8.

Full approved plan: `/Users/imnortheast/.claude/plans/investigate-and-use-ui-ux-pro-max-giggly-ritchie.md`

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Fix lesson 404](./phase-01-fix-lesson-404.md) | Completed |
| 2 | [Design tokens and global CSS](./phase-02-design-tokens-and-global-css.md) | Completed |
| 3 | [Navigation and a11y](./phase-03-navigation-and-a11y.md) | In Progress |
| 4 | [Lesson reading experience](./phase-04-lesson-reading-experience.md) | In Progress |
| 5 | [Visual polish](./phase-05-visual-polish.md) | In Progress |
| 6 | [Content deepening RF CN Space](./phase-06-content-deepening-rf-cn-space.md) | In Progress |
| 7 | [Content QA](./phase-07-content-qa.md) | Pending |
| 8 | [Verification and integration](./phase-08-verification-and-integration.md) | Pending |

## Dependencies

- Supersedes `plans/260604-1518-ui-theme-revamp-sidebar-layout/` — phases 1–3 verified already implemented in code; phase 4 remainder (tablet sidebar collapse) absorbed into Phase 3 here; phase 5 (testing) absorbed into Phase 8.
- Design research reused: `plans/reports/researcher-260604-1414-*.md`
