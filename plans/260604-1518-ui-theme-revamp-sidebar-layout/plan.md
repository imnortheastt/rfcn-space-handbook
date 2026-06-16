---
title: "UI Theme Revamp - Light Default + Sidebar Layout"
description: "Fix critical black blocks bug in roadmap SVG, switch to light-first theme with toggle, and implement sidebar documentation layout like unsloth.ai"
status: pending
priority: P1
branch: "main"
tags: [ui, ux, theme, accessibility, critical-bug]
blockedBy: []
blocks: []
created: "2026-06-04T08:21:46.225Z"
createdBy: "ck:plan"
source: skill
---

# UI Theme Revamp - Light Default + Sidebar Layout

## Overview

Critical UI/UX overhaul addressing:
1. **Black blocks bug** - Roadmap SVG content invisible due to opacity + dark fills
2. **Dark-first default** - Switch to light theme as default for better accessibility
3. **No theme toggle** - Users cannot switch themes manually
4. **Missing sidebar layout** - Documentation pages need sidebar navigation like unsloth.ai

## Root Cause Analysis

### Black Blocks Bug
- `roadmap-svg.astro` applies opacity (0.30-0.80) to `<g>` elements
- Fill color `#242c2c` at 30% opacity on `#0e1414` background creates near-invisible boxes
- CSS variables inside SVG `<style>` may not inherit from `:root` correctly
- Fix: Remove opacity approach, use explicit color tiers instead

### Theme Architecture Issues
- `tokens.css` uses `@theme {}` (Tailwind 4) which doesn't auto-expose `:root` vars
- `dark-mode-init.js` defaults to dark when no preference stored
- No `.theme-light` class added by default - relies on OS `prefers-color-scheme`
- Fix: Make light the default, add explicit `:root` declarations

## Phases

| Phase | Name | Status | Effort |
|-------|------|--------|--------|
| 1 | [Fix Black Blocks Bug](./phase-01-fix-black-blocks-bug.md) | Pending | 1h |
| 2 | [Light Theme Default](./phase-02-light-theme-default.md) | Pending | 1h |
| 3 | [Theme Toggle Component](./phase-03-theme-toggle-component.md) | Pending | 2h |
| 4 | [Sidebar Documentation Layout](./phase-04-sidebar-documentation-layout.md) | Pending | 4h |
| 5 | [Integration Testing](./phase-05-integration-testing.md) | Pending | 1h |

## Key Files

| File | Purpose |
|------|---------|
| `packages/ui/src/tokens.css` | CSS variables, theme tokens |
| `packages/ui/src/base.css` | Component styles |
| `apps/web/public/dark-mode-init.js` | Theme initialization script |
| `apps/web/src/components/roadmap-svg.astro` | SVG roadmap component |
| `apps/web/src/layouts/BaseLayout.astro` | Main layout |
| `apps/web/src/layouts/DocsLayout.astro` | NEW: Sidebar layout |

## Dependencies

- Prior research: `plans/reports/researcher-260604-1414-*.md`
- Design system: Tailwind 4 CSS-first configuration
