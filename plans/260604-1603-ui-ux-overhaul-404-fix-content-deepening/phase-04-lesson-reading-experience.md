---
phase: 4
title: Lesson reading experience
status: in-progress
effort: ''
---

# Phase 4: Lesson reading experience

## Overview

WS-C (after Phase 2). Owns NEW `TableOfContents.astro`, `LessonPager.astro`, `lib/lesson-order.ts`; MODIFY `LessonLayout.astro`, `[lang]/[domain]/[...slug].astro`, `astro.config.mjs`.

## Implementation Steps

1. rehype-slug in astro.config for stable heading IDs.
2. Sticky right-rail TOC (≥1024px) from `entry.render()` headings, IntersectionObserver scroll-spy; mobile `<details>` "On this page"; bilingual labels via i18n.
3. `lib/lesson-order.ts`: flatten curriculum.json → prev/next; `LessonPager.astro` at lesson foot reusing `lessonPath()`.
4. Top reading-progress bar (CSS scroll-timeline + JS fallback, reduced-motion aware).
5. Anchored heading links; KaTeX display blocks horizontal-scroll on mobile.

## Success Criteria

- [ ] TOC scroll-spy works both languages
- [ ] Prev/next follows curriculum order across unit/track boundaries
- [ ] Progress bar honors reduced-motion
