---
phase: 5
title: Visual polish
status: in-progress
effort: ''
---

# Phase 5: Visual polish

## Overview

WS-D (after Phase 2). Owns `DomainCard.astro`, `FeatureHighlight.astro`, `Hero.astro`, `roadmap-svg.astro`.

## Implementation Steps

1. Cards: hover/focus-visible/active states (150ms ease, translateY(-2px), focus ring, reduced-motion honored).
2. Hero: display font, subtle cyan signal-grid texture, refined CTA.
3. Roadmap SVG: keyboard-focusable lesson nodes linking via flat lessonPath, tier-text contrast bump, reduced-motion.

## Success Criteria

- [ ] All interactive elements have visible hover + focus states
- [ ] Roadmap nodes keyboard-navigable and link to lessons
