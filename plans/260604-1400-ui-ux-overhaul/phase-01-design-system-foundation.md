---
phase: 1
title: "Design System Foundation"
status: completed
effort: "4h"
dependencies: []
---

# Phase 1: Design System Foundation

## Overview

Establish dark-first design tokens with Unsloth-style cyan accent (#88e1e6). Replace current teal palette, switch to system fonts for performance, and align spacing to 4px grid. Focus states get cyan glow for visual consistency.

## Requirements

### Functional
- Dark theme as default (not media-query dependent)
- Cyan accent replaces teal throughout
- System font stack (remove @fontsource dependencies)
- 4px-aligned spacing scale
- Cyan glow focus states

### Non-Functional
- No web font network requests (performance)
- WCAG 2.1 AA contrast ratios maintained
- Backwards compatible with existing component classes

## Related Code Files

### Modify
| File | Purpose |
|------|---------|
| `packages/ui/src/tokens.css` | Design tokens - colors, fonts, spacing |
| `packages/ui/src/base.css` | Focus ring styles, link colors |
| `packages/ui/package.json` | Remove @fontsource dependencies |

### Delete
- None

### Create
- None

## Implementation Steps

1. **Update color tokens in tokens.css**
   - Change `--color-accent-*` from teal (#0b5351) to cyan (#88e1e6)
   - Add accent scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
   - Set dark theme values as `:root` defaults (not media-query gated)
   - Move light theme to `.theme-light` class only

2. **Replace font stack**
   - Remove @fontsource imports
   - Set `--font-sans` to system stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
   - Set `--font-mono` to: `ui-monospace, 'SF Mono', Menlo, Monaco, 'Cascadia Code', monospace`

3. **Align spacing to 4px grid**
   - Add explicit spacing tokens: `--space-1: 0.25rem` through `--space-16: 4rem`
   - Update `--space-section` and `--space-block` to use new scale
   - Ensure all values are multiples of 4px (0.25rem)

4. **Update surface tokens for Unsloth style**
   ```css
   --color-bg: #0e1414;
   --color-surface: #1a2020;
   --color-surface-elevated: #242c2c;
   --color-border: #2e3b3b;
   --color-fg: #e9eded;
   --color-muted: #94a09f;
   ```

5. **Update focus states in base.css**
   - Change outline color to cyan accent
   - Add box-shadow glow: `0 0 0 3px rgba(136, 225, 230, 0.3)`
   - Update `:focus-visible` selector

6. **Update link colors in base.css**
   - Change `a` color to cyan accent
   - Ensure hover state has lighter/brighter cyan

7. **Remove @fontsource from package.json**
   - Delete `@fontsource/inter`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`

8. **Test color contrast**
   - Verify cyan on dark bg meets 4.5:1 for body text
   - Verify muted text meets 3:1 minimum

## Success Criteria

- [ ] Dark theme renders by default without `prefers-color-scheme` media query
- [ ] Cyan accent (#88e1e6) visible in links, focus rings, accent borders
- [ ] No network requests for fonts (verify in DevTools Network tab)
- [ ] All spacing values are multiples of 4px
- [ ] Focus states show cyan glow effect
- [ ] Existing lesson section styles (`.lesson-hook`, etc.) still render correctly
- [ ] WCAG AA contrast ratios pass for body text and interactive elements

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cyan insufficient contrast on dark bg | Low | High | Test #88e1e6 on #0e1414 = 9.4:1 contrast (passes AAA) |
| Existing components break | Medium | Medium | Keep CSS custom property names identical; only values change |
| Vietnamese diacritics rendering | Low | Medium | System fonts (San Francisco, Segoe UI) support Vietnamese; test sample text |
| Light theme users affected | Low | Low | Light theme still available via `.theme-light` class toggle |

## Notes

- Current tokens.css already has dark mode values; we're just making them the default
- The qualitative palette (Wong colors) remains unchanged for data visualization
- KaTeX styling unaffected (uses font-size relative to parent)
