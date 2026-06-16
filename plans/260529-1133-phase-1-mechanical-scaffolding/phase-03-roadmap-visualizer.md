---
phase: 3
title: "Roadmap Visualizer"
status: completed
priority: P1
effort: "2h"
dependencies: [1]
---

# Phase 3: Roadmap Visualizer

## Context Links
- Blueprint §4.4 (per-domain visual roadmap, "you are here" map, context strip)
- Depends on: Phase 1 (curriculum.json populated)

## Overview
Per-domain SVG roadmap showing tracks → units → lessons as a DAG. Renders at `/{lang}/{domain}/`. Static SVG (zero JS). Highlights lessons with `status: published` vs `draft`. Optional localStorage "visited" marker overlay (post-MVP).

## Key Insights
- Build-time SVG, not client-side. Render in an Astro page using a layout algorithm — keep it simple: vertical lanes per track, horizontal flow within track for units, lessons as small boxes within units.
- D3 force layout would be overkill and ship JS we don't need. Use `dagre` (graph layout lib) at build time inside an Astro page's script — output static SVG. Or simpler: hand-laid CSS grid with track headers.
- Color: status `published` = teal accent fill, `draft` = muted grey outline. Level (L0-L5) = saturation gradient.
- Accessibility: every lesson box has `<title>` with full ID, link goes to lesson page, focus ring per design tokens.

## Requirements
**Functional:** visit `/en/rf/` → see SVG roadmap of all 11 RF tracks with units and lessons; clicking any published lesson navigates to it; draft lessons render as un-clickable greyed boxes. Same for `/vi/rf/`, `/en/core-network/`, etc.
**Non-functional:** SVG < 100KB transferred; renders correctly at mobile width (responsive).

## Architecture
- New page: `apps/web/src/pages/[lang]/[domain]/index.astro` (replaces nothing; currently only `[lang]/index.astro` exists at one level up)
- Helper: `apps/web/src/lib/roadmap-layout.ts` — takes the domain slice of curriculum.json, returns positioned nodes + edges
- Render: pure Astro template with inline SVG; each `<rect>` is a lesson box, `<text>` is the title (truncated), `<a href>` wraps published ones
- Reuses design tokens from packages/ui

## Related Code Files
- Create: `apps/web/src/pages/[lang]/[domain]/index.astro`
- Create: `apps/web/src/lib/roadmap-layout.ts`
- Create: `apps/web/src/components/RoadmapSvg.astro`
- Modify: `apps/web/src/pages/[lang]/index.astro` — add links to the 3 domain roadmaps

## Implementation Steps
1. `roadmap-layout.ts`: input = `{ tracks: Track[] }` slice of curriculum.json for one domain; output = `{ nodes: { id, x, y, w, h, title, status, level, href }[], edges: { from, to }[] }`. Simple grid: tracks vertically stacked, units in horizontal rows, lessons as small inline boxes within unit rows. Pure math, no DOM.
2. `RoadmapSvg.astro`: takes `{ layout }` prop, renders viewBox-sized SVG. Use CSS for hover (no JS). Lesson boxes get `class="lesson-box lesson-{status}"`.
3. `[lang]/[domain]/index.astro`: `getStaticPaths` over locales × ['rf', 'core-network', 'space'], loads domain slice, calls RoadmapSvg, wraps in BaseLayout with localized page title.
4. Verify in dev: `/en/rf/`, `/en/core-network/`, `/en/space/` + VI mirrors all render readable SVG roadmaps.

## Todo List
- [x] roadmap-layout.ts (pure layout fn)
- [x] RoadmapSvg.astro
- [x] [lang]/[domain]/index.astro
- [x] Homepage links to 3 domain roadmaps
- [x] Mobile responsive check
- [x] No JS shipped on roadmap pages

## Success Criteria
- [x] All 6 routes (`/{en,vi}/{rf,core-network,space}/`) render valid SVG
- [x] Published vs draft lessons visually distinct
- [x] Published lesson clicks navigate correctly
- [x] SVG file size < 100KB per page
- [x] Zero client-side JS on these routes

## Risk Assessment
- **Layout ugly with 290+ lessons per domain** (medium): a brute grid will be unreadable. Mitigation: collapse to track-level + units; lessons render as small dots that expand on hover via CSS only. Drill-in to a per-track page later if needed (out of scope).
- **dagre dep** (low): if we use it, it's a build-time-only dep — never ships to browser.

## Security Considerations
- None — static SVG generated at build time from validated curriculum.json.

## Next Steps
Phase 4 scaffolds 4 more flagship widget components.
