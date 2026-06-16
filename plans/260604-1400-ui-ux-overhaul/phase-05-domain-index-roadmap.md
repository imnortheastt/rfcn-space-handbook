---
phase: 5
title: "Domain Index & Roadmap"
status: completed
effort: "3h"
dependencies: ["phase-01"]
---

# Phase 5: Domain Index & Roadmap

## Overview

Enhance domain index pages with card-based track/unit display. Update roadmap SVG styling for dark theme compatibility. Add track progress indicators and improve lesson count displays. Make the roadmap visually appealing while maintaining zero-JS static rendering.

## Requirements

### Functional
- Roadmap SVG uses dark theme colors (dark background, light text, cyan accents)
- Track bands have subtle gradient or elevated surface styling
- Lesson nodes show level-based visual hierarchy
- Track labels are clearly readable
- Domain page shows track count and total lesson count
- Optional: progress indicators for future "completed lessons" feature

### Non-Functional
- SVG remains static (no client JS)
- Roadmap scroll container works on touch devices
- All text in SVG meets contrast requirements
- SVG renders correctly in all modern browsers

## Related Code Files

### Files to Modify
- `apps/web/src/pages/[lang]/[domain]/index.astro` — page layout and description
- `apps/web/src/components/roadmap-svg.astro` — SVG styling and colors
- `apps/web/src/lib/roadmap-layout.ts` — layout constants if needed
- `apps/web/src/styles/tokens.css` — add roadmap-specific tokens

### Files to Reference
- `data/curriculum.json` — track/unit/lesson structure

## Implementation Steps

### 5.1 Roadmap SVG Dark Theme (1.5h)
1. Update inline SVG styles in `roadmap-svg.astro`:
   ```css
   .roadmap-svg {
     font-family: var(--font-sans, system-ui, sans-serif);
     background: var(--color-bg, #0d1117);
   }
   .track-band {
     fill: var(--color-surface-elevated, #161b22);
     stroke: var(--color-border, #30363d);
     stroke-width: 1;
     rx: 6;
   }
   .track-band-shell {
     fill: var(--color-surface, #0d1117);
     stroke: var(--color-border, #30363d);
     stroke-width: 1;
     stroke-dasharray: 4 3;
   }
   .track-label {
     font-size: 11px;
     font-weight: 600;
     fill: var(--color-fg, #e6edf3);
   }
   .lesson-box {
     stroke: var(--color-border, #30363d);
     stroke-width: 1;
     rx: 4;
   }
   .lesson-box-draft {
     fill: var(--color-surface-elevated, #161b22);
   }
   .lesson-box-published {
     fill: var(--color-cyan-900, #164e63);
     stroke: var(--color-cyan-500, #88e1e6);
   }
   .lesson-text {
     font-size: 9px;
     fill: var(--color-muted, #8b949e);
     pointer-events: none;
   }
   .lesson-text-published {
     fill: var(--color-cyan-300, #7dd3fc);
   }
   .shell-label {
     font-size: 11px;
     fill: var(--color-muted, #8b949e);
     font-style: italic;
   }
   ```

2. Update scroll container styles:
   ```css
   .roadmap-scroll {
     overflow-x: auto;
     -webkit-overflow-scrolling: touch;
     max-width: 100%;
     border: 1px solid var(--color-border, #30363d);
     border-radius: 8px;
     padding: 1rem;
     background: var(--color-bg, #0d1117);
   }
   /* Custom scrollbar for dark theme */
   .roadmap-scroll::-webkit-scrollbar {
     height: 8px;
   }
   .roadmap-scroll::-webkit-scrollbar-track {
     background: var(--color-surface, #161b22);
     border-radius: 4px;
   }
   .roadmap-scroll::-webkit-scrollbar-thumb {
     background: var(--color-border, #30363d);
     border-radius: 4px;
   }
   .roadmap-scroll::-webkit-scrollbar-thumb:hover {
     background: var(--color-muted, #8b949e);
   }
   ```

3. Add hover effect for lesson boxes (CSS only):
   ```css
   .lesson-box {
     transition: stroke 0.15s, fill 0.15s;
   }
   .lesson-box:hover {
     stroke: var(--color-cyan-500, #88e1e6);
     fill: var(--color-surface-code, #1a1f2e);
   }
   ```

### 5.2 Domain Page Layout (1h)
1. Update page header styling in `[lang]/[domain]/index.astro`:
   ```css
   main {
     padding: 1.5rem;
     max-width: 100%;
     background: var(--color-bg, #0d1117);
     min-height: 100vh;
   }
   h1 {
     font-size: var(--font-size-2xl, 1.75rem);
     font-weight: 700;
     color: var(--color-fg, #e6edf3);
     margin: 0.75rem 0 0.5rem;
   }
   .domain-description {
     color: var(--color-muted, #8b949e);
     font-size: var(--font-size-base, 1rem);
     margin-bottom: 1.5rem;
     max-width: 60ch;
   }
   ```

2. Add track/lesson count badges:
   ```astro
   <div class="domain-stats">
     <span class="stat-badge">
       <span class="stat-number">{tracks.length}</span>
       <span class="stat-label">{lang === 'en' ? 'tracks' : 'nhom'}</span>
     </span>
     <span class="stat-badge">
       <span class="stat-number">{totalLessons}</span>
       <span class="stat-label">{lang === 'en' ? 'lessons' : 'bai hoc'}</span>
     </span>
   </div>
   ```
   ```css
   .domain-stats {
     display: flex;
     gap: 1rem;
     margin-bottom: 1.5rem;
   }
   .stat-badge {
     display: flex;
     align-items: baseline;
     gap: 0.375rem;
     background: var(--color-surface-elevated, #161b22);
     padding: 0.5rem 0.75rem;
     border-radius: 6px;
     border: 1px solid var(--color-border, #30363d);
   }
   .stat-number {
     font-size: 1.25rem;
     font-weight: 700;
     color: var(--color-cyan-400, #88e1e6);
   }
   .stat-label {
     font-size: 0.875rem;
     color: var(--color-muted, #8b949e);
   }
   ```

3. Style breadcrumb navigation:
   ```css
   nav[aria-label="Breadcrumb"] {
     font-size: var(--font-size-sm, 0.875rem);
     color: var(--color-muted, #8b949e);
     margin-bottom: 0.75rem;
   }
   nav a {
     color: var(--color-muted);
     text-decoration: none;
     transition: color 0.15s;
   }
   nav a:hover {
     color: var(--color-cyan-400, #88e1e6);
     text-decoration: underline;
   }
   ```

### 5.3 Progress Indicators (0.5h)
1. Add optional progress bar to track bands (for future use):
   ```astro
   {/* Progress bar - hidden until progress tracking implemented */}
   {track.progress !== undefined && (
     <rect
       x={SVG_PAD_X + LABEL_W + 8}
       y={tl.y + tl.height - 6}
       width={(width - SVG_PAD_X * 2 - LABEL_W - 16) * (track.progress / 100)}
       height={3}
       rx={1.5}
       fill="var(--color-cyan-500, #88e1e6)"
       opacity={0.6}
     />
   )}
   ```

2. Add level legend below roadmap:
   ```astro
   <div class="roadmap-legend">
     <span class="legend-item">
       <span class="legend-dot" style="opacity: 0.3"></span>
       L0-L1
     </span>
     <span class="legend-item">
       <span class="legend-dot" style="opacity: 0.5"></span>
       L2-L3
     </span>
     <span class="legend-item">
       <span class="legend-dot" style="opacity: 0.8"></span>
       L4-L5
     </span>
   </div>
   ```
   ```css
   .roadmap-legend {
     display: flex;
     gap: 1.5rem;
     justify-content: center;
     margin-top: 1rem;
     font-size: 0.75rem;
     color: var(--color-muted);
   }
   .legend-item {
     display: flex;
     align-items: center;
     gap: 0.375rem;
   }
   .legend-dot {
     width: 12px;
     height: 12px;
     background: var(--color-surface-elevated);
     border: 1px solid var(--color-border);
     border-radius: 2px;
   }
   ```

## Success Criteria

- [ ] Roadmap SVG uses dark background (#0d1117 or similar)
- [ ] Track bands have elevated surface color with visible borders
- [ ] Lesson boxes have subtle level-based opacity (L0=dim, L5=bright)
- [ ] Track labels are white/light colored and readable
- [ ] Scroll container has styled scrollbar matching dark theme
- [ ] Domain page shows track count badge
- [ ] Domain page shows total lesson count badge
- [ ] Breadcrumb links have cyan hover state
- [ ] SVG hover states work (CSS transitions)
- [ ] Legend explains level opacity system

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CSS variables not working in inline SVG | Medium | High | Use fallback hex values in SVG styles |
| Scrollbar styling not supported (Firefox) | Medium | Low | Firefox uses standard scrollbar, acceptable |
| Progress bar adds complexity | Low | Low | Keep hidden until feature is needed |
| Total lesson count calculation error | Low | Medium | Verify count logic against curriculum.json |
