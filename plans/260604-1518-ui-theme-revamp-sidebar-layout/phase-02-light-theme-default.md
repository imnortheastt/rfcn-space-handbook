---
phase: 2
title: "Light Theme Default"
status: pending
priority: P1
effort: "1h"
dependencies: [1]
---

# Phase 2: Light Theme Default

## Overview

Switch from dark-first to light-first theme architecture:
- Light theme becomes the default (no class needed)
- Dark theme activates via `.theme-dark` class or `prefers-color-scheme: dark`
- Stored preference in localStorage takes priority

## Requirements

- Functional: Site loads in light mode by default
- Functional: OS dark mode preference still respected
- Functional: User preference persisted and honored
- Non-functional: No FOUC (flash of unstyled/wrong-themed content)

## Architecture

Current flow:
```
dark-mode-init.js → check localStorage → add .theme-light OR .theme-dark
tokens.css → dark tokens in @theme (default), light in :root.theme-light
```

New flow:
```
dark-mode-init.js → check localStorage → check OS pref → add .theme-dark if needed
tokens.css → light tokens in @theme (default), dark in :root.theme-dark + @media
```

## Related Code Files

- Modify: `packages/ui/src/tokens.css`
- Modify: `apps/web/public/dark-mode-init.js`
- Modify: `packages/ui/src/base.css` (header backdrop, any hardcoded dark values)

## Implementation Steps

1. **Restructure tokens.css - Light-first**
   ```css
   @theme {
     /* Light theme surface tokens (DEFAULT) */
     --color-bg:               #ffffff;
     --color-surface:          #f7f8f8;
     --color-surface-elevated: #eef0f0;
     --color-surface-code:     #f6f8fa;
     --color-border:           #d4d9d9;
     --color-fg:               #0e1414;
     --color-muted:            #5b6766;
     
     /* Accent palette stays the same */
     --color-accent-500: #88e1e6;
     /* ... other tokens ... */
   }
   
   /* Dark theme via class or media query */
   :root.theme-dark,
   @media (prefers-color-scheme: dark) {
     :root:not(.theme-light) {
       --color-bg:               #0e1414;
       --color-surface:          #1a2020;
       --color-surface-elevated: #242c2c;
       --color-surface-code:     #0d1117;
       --color-border:           #2e3b3b;
       --color-fg:               #e9eded;
       --color-muted:            #94a09f;
     }
   }
   ```

2. **Update dark-mode-init.js - Light default**
   ```javascript
   (function () {
     try {
       var stored = localStorage.getItem('theme');
       if (stored === 'dark') {
         document.documentElement.classList.add('theme-dark');
       } else if (stored === 'light') {
         document.documentElement.classList.add('theme-light');
       } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
         // OS prefers dark, no stored preference
         document.documentElement.classList.add('theme-dark');
       }
       // Default: no class = light theme
     } catch (_) {}
   })();
   ```

3. **Update base.css hardcoded dark values**
   - `.site-header` backdrop: `rgba(255, 255, 255, 0.85)` for light
   - Add dark override in `.theme-dark .site-header`
   - Review all `rgba(14, 20, 20, ...)` and similar hardcoded values

4. **Add light theme lesson tier colors**
   Already in Phase 1, ensure they're in the light section.

## Success Criteria

- [ ] Fresh visit (no localStorage) shows light theme
- [ ] `localStorage.theme = 'dark'` shows dark theme on reload
- [ ] OS dark mode + no localStorage shows dark theme
- [ ] OS dark mode + `localStorage.theme = 'light'` shows light theme
- [ ] No FOUC on page load
- [ ] All components readable in both themes

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| FOUC during theme detection | Script runs in `<head>` before CSS paint |
| Existing dark-mode users surprised | localStorage preference honored |
| CSS cascade issues with @media + class | Use `:root:not(.theme-light)` pattern |
