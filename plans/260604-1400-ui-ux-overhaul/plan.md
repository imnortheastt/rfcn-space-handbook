---
title: "UI/UX Overhaul - Unsloth/MDN Style"
description: "Dark-first theme with cyan accents, card layouts, modern docs aesthetic"
status: completed
priority: P2
branch: "main"
tags: [ui, design-system, tailwind, astro]
blockedBy: []
blocks: []
created: "2026-06-04T07:21:34.215Z"
createdBy: "ck:plan"
source: skill
completedAt: "2026-06-04T08:08:00.000Z"
---

# UI/UX Overhaul - Unsloth/MDN Style

## Overview

Redesigned rfcn-space-handbook from basic teal-accent light theme to polished dark-first design inspired by unsloth.ai. Dark backgrounds (#0e1414), cyan accent (#88e1e6), card-based content blocks, glassmorphism header, responsive mobile nav.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Design System Foundation](./phase-01-design-system-foundation.md) | ✅ Complete |
| 2 | [Navigation & Header](./phase-02-navigation-header.md) | ✅ Complete |
| 3 | [Homepage & Landing](./phase-03-homepage-landing.md) | ✅ Complete |
| 4 | [Lesson Pages](./phase-04-lesson-pages.md) | ✅ Complete |
| 5 | [Domain Index & Roadmap](./phase-05-domain-index-roadmap.md) | ✅ Complete |
| 6 | [Search & Interactions](./phase-06-search-interactions.md) | ✅ Complete |
| 7 | [Mobile & Polish](./phase-07-mobile-polish.md) | ✅ Complete |

## Key Deliverables

- **tokens.css**: Dark-first palette, cyan accent scale, system fonts, 4px spacing grid
- **Header.astro**: Sticky header with backdrop blur, domain nav, lang toggle
- **NavLink.astro**: Active state detection with `startsWith()`
- **Hero.astro**: Bilingual tagline + CTA with hover lift
- **DomainCard.astro**: Card hover effects with border accent
- **Footer.astro**: Global footer with nav, GitHub, license
- **HamburgerMenu.astro**: Mobile drawer with slide-in, backdrop, a11y
- **base.css**: ~1300 lines of component styles, lesson sections, Pagefind dark theme

## Known Issues

- **MDX curly braces**: 204 content files have LaTeX math with `{}` that MDX parses as JSX. Dev server works (lazy loading), but `pnpm build` fails. Requires content migration or custom remark plugin (out of scope for UI overhaul).

## Verification

```bash
pnpm dev  # Dev server works ✓
# Manual: Dark theme default, cyan accents, responsive nav, hamburger on mobile
```
