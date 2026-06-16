---
phase: 2
title: Design tokens and global CSS
status: completed
effort: ''
---

# Phase 2: Design tokens and global CSS

## Overview

WS-A. Owns ALL of `packages/ui/` (`tokens.css`, `base.css`) + `apps/web/src/styles/global.css`. Blocking for phases 3–5; no other stream touches these files.

## Implementation Steps

1. Accent usability: add `--color-accent-link` (~#2c8a8f, AA on white) + `--color-accent-strong`; keep #88e1e6 decorative only. Dark counterparts in `.theme-dark`.
2. Lesson-tier text colors ≥4.5:1 light mode.
3. Global `prefers-reduced-motion` guard; `--focus-ring` token; `scroll-margin-top: 5rem` headings; prose measure 90ch → 68ch.
4. Self-hosted display webfont (one variable woff2, h1/hero only, swap + preload).
5. Publish class contract: card hover/focus states, skip-link, reading-progress bar styles.

## Success Criteria

- [ ] Contrast: accent-link ≥4.5:1 both themes; tiers ≥4.5:1 light
- [ ] Reduced-motion guard global; focus-ring token consumed
- [ ] Webfont loads via preload+swap, body stays system stack
