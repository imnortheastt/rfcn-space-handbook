---
phase: 1
title: Fix lesson 404
status: completed
effort: ''
---

# Phase 1: Fix lesson 404

## Overview

Sidebar lesson links 404: `DocsSidebar.astro` built `/{lang}/{domain}/{unit.id}/{lesson.id}/` but the only route is flat `/{lang}/{domain}/{slug}` (`[...slug].astro`). Fix: use `lessonPath()`.

## Implementation Steps

1. `DocsSidebar.astro`: import `lessonPath` from `../lib/content-paths`, replace href builder, normalize active check.
2. Repo-grep other hierarchical builders — verified clean: `roadmap-layout.ts:134` already flat; Breadcrumbs uses anchors.
3. `pnpm build` + sidebar click-through.

## Success Criteria

- [x] Sidebar hrefs use lessonPath()
- [ ] Build passes; lesson pages resolve from sidebar
