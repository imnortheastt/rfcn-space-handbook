---
phase: 3
title: Navigation and a11y
status: in-progress
effort: ''
---

# Phase 3: Navigation and a11y

## Overview

WS-B (after Phase 2). Owns `HamburgerMenu.astro`, `DocsSidebar.astro`, `DocsLayout.astro`, `Header.astro`.

## Implementation Steps

1. Mobile drawer: focus trap, `inert` background, autofocus close, restore focus on dismiss.
2. Skip-link: dedupe `id="main"`, add DocsLayout skip-to-content.
3. Tablet (769–1024px) collapsible sidebar (off-canvas toggle); persist `<details>` open state to localStorage.

## Success Criteria

- [ ] Keyboard-only drawer fully operable, focus never escapes
- [ ] Skip link reaches content in DocsLayout
- [ ] Sidebar collapsible on tablet, state persists
