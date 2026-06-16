---
phase: 1
title: "Fix Black Blocks Bug"
status: pending
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Fix Black Blocks Bug

## Overview

The roadmap SVG displays completely black/invisible blocks because:
1. Opacity (0.30-0.80) applied to `<g>` elements wrapping lesson boxes
2. Dark fill colors (`#242c2c`) at low opacity on dark background (`#0e1414`) = invisible
3. CSS variables in inline SVG `<style>` may not cascade from `:root`

## Requirements

- Functional: All roadmap lesson boxes must be visible with readable text
- Non-functional: Support both light and dark themes with proper contrast

## Architecture

Replace opacity-based visibility tiers with explicit color tiers:
- L0-L1: Lightest fill, lowest visual prominence
- L2-L3: Medium fill
- L4-L5: Darkest fill, highest visual prominence

## Related Code Files

- Modify: `apps/web/src/components/roadmap-svg.astro`
- Modify: `packages/ui/src/tokens.css` (add tier colors)

## Implementation Steps

1. **Add lesson tier color tokens to tokens.css**
   ```css
   /* Dark theme lesson tiers */
   --color-lesson-tier-0: #1e2626;  /* L0-L1: subtle */
   --color-lesson-tier-1: #2a3434;  /* L2-L3: medium */
   --color-lesson-tier-2: #364040;  /* L4-L5: prominent */
   
   /* Light theme lesson tiers (in .theme-light) */
   --color-lesson-tier-0: #e8ebeb;
   --color-lesson-tier-1: #d4d9d9;
   --color-lesson-tier-2: #c0c7c7;
   ```

2. **Update roadmap-svg.astro - Remove opacity, use tier classes**
   - Replace `opacity={...}` on `<g>` with tier-specific CSS classes
   - Add `.lesson-box-tier-0`, `.lesson-box-tier-1`, `.lesson-box-tier-2` classes
   - Map levelIndex to tier: 0-1 → tier-0, 2-3 → tier-1, 4-5 → tier-2

3. **Update SVG inline styles to use tier fills**
   ```css
   .lesson-box-tier-0 { fill: var(--color-lesson-tier-0, #1e2626); }
   .lesson-box-tier-1 { fill: var(--color-lesson-tier-1, #2a3434); }
   .lesson-box-tier-2 { fill: var(--color-lesson-tier-2, #364040); }
   ```

4. **Ensure text contrast**
   - Verify `.lesson-text` fill (`#94a09f`) has 4.5:1 ratio against all tier fills
   - Adjust if needed for WCAG AA compliance

5. **Add CSS variables to SVG root for theme inheritance**
   - Add explicit CSS custom property declarations in SVG `<style>` that read from document

## Success Criteria

- [ ] All lesson boxes visible in dark theme
- [ ] All lesson boxes visible in light theme  
- [ ] Text readable on all tier backgrounds (4.5:1 contrast)
- [ ] Level hierarchy visually distinguishable (L0 subtle → L5 prominent)
- [ ] No opacity attributes on lesson `<g>` elements
- [ ] Screenshot verification: no black blocks

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| CSS vars not inheriting in SVG | Use fallback values in all var() calls |
| Theme switch not updating SVG | Ensure vars are on elements that re-render |
