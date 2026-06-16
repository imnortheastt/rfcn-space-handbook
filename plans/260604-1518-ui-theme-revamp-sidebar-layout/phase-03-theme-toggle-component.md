---
phase: 3
title: "Theme Toggle Component"
status: pending
priority: P2
effort: "2h"
dependencies: [2]
---

# Phase 3: Theme Toggle Component

## Overview

Add a theme toggle button in the header allowing users to switch between light/dark themes. Persists choice to localStorage and applies immediately without page reload.

## Requirements

- Functional: Toggle button visible in header actions area
- Functional: Click toggles between light ↔ dark
- Functional: Preference saved to localStorage
- Functional: Visual feedback (sun/moon icons)
- Non-functional: 44x44px minimum touch target
- Non-functional: Accessible with keyboard and screen readers

## Architecture

```
ThemeToggle.astro (static HTML + inline script)
  └─ <button> with sun/moon SVG icons
  └─ Click handler toggles .theme-dark on <html>
  └─ Updates localStorage
  └─ ARIA: aria-label updates based on current state
```

## Related Code Files

- Create: `apps/web/src/components/ThemeToggle.astro`
- Modify: `apps/web/src/components/Header.astro` (add toggle to header-actions)
- Modify: `packages/ui/src/base.css` (toggle button styles)

## Implementation Steps

1. **Create ThemeToggle.astro component**
   ```astro
   ---
   // ThemeToggle.astro — client-side theme switcher
   ---
   <button
     id="theme-toggle"
     type="button"
     class="theme-toggle"
     aria-label="Toggle dark mode"
   >
     <svg class="icon-sun" ...><!-- sun icon --></svg>
     <svg class="icon-moon" ...><!-- moon icon --></svg>
   </button>

   <script>
     const btn = document.getElementById('theme-toggle');
     const html = document.documentElement;
     
     function updateIcon() {
       const isDark = html.classList.contains('theme-dark');
       btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
     }
     
     btn.addEventListener('click', () => {
       const isDark = html.classList.toggle('theme-dark');
       html.classList.remove('theme-light');
       localStorage.setItem('theme', isDark ? 'dark' : 'light');
       updateIcon();
     });
     
     updateIcon();
   </script>
   ```

2. **Add sun/moon SVG icons (inline, no external deps)**
   - Sun: 24x24 heroicons/outline sun
   - Moon: 24x24 heroicons/outline moon
   - Show sun when dark mode active (indicates "click for light")
   - Show moon when light mode active (indicates "click for dark")

3. **Style theme toggle button in base.css**
   ```css
   .theme-toggle {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 44px;
     height: 44px;
     padding: 10px;
     background: transparent;
     border: none;
     border-radius: 6px;
     cursor: pointer;
     color: var(--color-muted);
     transition: color 0.15s ease, background-color 0.15s ease;
   }
   
   .theme-toggle:hover {
     color: var(--color-accent-500);
     background-color: rgba(136, 225, 230, 0.08);
   }
   
   .theme-toggle:focus-visible {
     outline: 2px solid var(--color-accent-500);
     outline-offset: 2px;
   }
   
   /* Icon visibility based on theme */
   .theme-toggle .icon-sun { display: none; }
   .theme-toggle .icon-moon { display: block; }
   
   .theme-dark .theme-toggle .icon-sun { display: block; }
   .theme-dark .theme-toggle .icon-moon { display: none; }
   ```

4. **Add ThemeToggle to Header.astro**
   - Import component
   - Place in `.header-actions` between search and lang toggle
   - Ensure proper spacing with gap

5. **Handle system preference changes**
   - Listen to `matchMedia('(prefers-color-scheme: dark)').addListener`
   - Only apply if no localStorage preference set

## Success Criteria

- [ ] Toggle button visible in header on all pages
- [ ] Click switches theme immediately (no reload)
- [ ] Correct icon shown (sun in dark mode, moon in light mode)
- [ ] Preference persisted across page navigations
- [ ] Preference persisted across browser sessions
- [ ] Keyboard accessible (Tab + Enter/Space)
- [ ] Screen reader announces current action
- [ ] 44x44px touch target on mobile

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Icon flash on load | CSS hides wrong icon by default |
| Script error blocks toggle | Graceful degradation - theme still works via OS pref |
