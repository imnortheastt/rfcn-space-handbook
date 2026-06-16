---
phase: 2
title: "Navigation & Header"
status: completed
effort: "3h"
dependencies: ["phase-01"]
---

# Phase 2: Navigation & Header

## Overview

Create a global navigation component with sticky header behavior. Site branding on left, domain navigation in center, search and language switcher on right. Header uses backdrop blur for modern glassmorphism effect. Mobile hamburger menu deferred to Phase 7.

## Requirements

### Functional
- Site logo/title positioned left
- Domain links (RF, Core Network, Space) centered
- Search box and language switcher on right
- Sticky positioning with backdrop blur
- Links highlight active domain based on current route

### Non-Functional
- Header height: 64px (16 * 4px grid)
- Blur intensity: `backdrop-filter: blur(12px)`
- Responsive: hide center nav on mobile (hamburger in Phase 7)
- Accessible: proper landmark roles, skip link

## Related Code Files

### Create
| File | Purpose |
|------|---------|
| `apps/web/src/components/Header.astro` | Global header component |
| `apps/web/src/components/NavLink.astro` | Reusable nav link with active state |

### Modify
| File | Purpose |
|------|---------|
| `apps/web/src/layouts/BaseLayout.astro` | Import and render Header |
| `packages/ui/src/base.css` | Add header/nav utility styles |
| `apps/web/src/components/SearchBox.astro` | Style updates for header placement |
| `apps/web/src/components/LangSwitcher.astro` | Compact mode for header |

### Delete
- None

## Implementation Steps

1. **Create Header.astro component**
   ```
   <header class="site-header">
     <div class="header-inner">
       <a href="/{lang}/" class="site-brand">
         <span class="site-title">RFCN Space</span>
       </a>
       
       <nav class="domain-nav" aria-label="Domain navigation">
         <NavLink href="/{lang}/rf/" label="RF" />
         <NavLink href="/{lang}/core-network/" label="Core Network" />
         <NavLink href="/{lang}/space/" label="Space" />
       </nav>
       
       <div class="header-actions">
         <SearchBox compact />
         <LangSwitcher compact />
       </div>
     </div>
   </header>
   ```

2. **Create NavLink.astro component**
   - Props: `href`, `label`
   - Compare `Astro.url.pathname` with href to determine active state
   - Apply `.nav-link--active` class when current route starts with href

3. **Add header styles to base.css**
   ```css
   .site-header {
     position: sticky;
     top: 0;
     z-index: 100;
     height: 4rem; /* 64px */
     background-color: rgba(14, 20, 20, 0.85);
     backdrop-filter: blur(12px);
     border-bottom: 1px solid var(--color-border);
   }
   
   .header-inner {
     max-width: var(--measure-wide);
     margin: 0 auto;
     padding: 0 var(--space-4);
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: space-between;
   }
   
   .site-brand {
     font-weight: 700;
     font-size: var(--font-size-lg);
     color: var(--color-fg);
     text-decoration: none;
   }
   
   .domain-nav {
     display: flex;
     gap: var(--space-6);
   }
   
   .nav-link {
     color: var(--color-muted);
     text-decoration: none;
     font-weight: 500;
     padding: var(--space-2) var(--space-3);
     border-radius: 4px;
     transition: color 0.15s ease;
   }
   
   .nav-link:hover {
     color: var(--color-fg);
   }
   
   .nav-link--active {
     color: var(--color-accent-500);
     background-color: rgba(136, 225, 230, 0.1);
   }
   
   .header-actions {
     display: flex;
     align-items: center;
     gap: var(--space-4);
   }
   ```

4. **Update LangSwitcher.astro**
   - Add `compact` prop for header mode
   - When compact: horizontal layout, smaller padding
   - Remove banner text in compact mode

5. **Update SearchBox.astro**
   - Add `compact` prop
   - When compact: icon-only collapsed state, expands on focus

6. **Update BaseLayout.astro**
   - Import Header component
   - Render `<Header lang={lang} />` at top of body
   - Add skip link before header: `<a href="#main" class="skip-link">Skip to content</a>`
   - Add `id="main"` to main content area

7. **Add skip link styles**
   ```css
   .skip-link {
     position: absolute;
     top: -100%;
     left: var(--space-4);
     padding: var(--space-2) var(--space-4);
     background-color: var(--color-accent-500);
     color: var(--color-bg);
     z-index: 200;
     border-radius: 4px;
   }
   
   .skip-link:focus {
     top: var(--space-2);
   }
   ```

8. **Hide domain nav on mobile**
   ```css
   @media (max-width: 768px) {
     .domain-nav {
       display: none; /* Hamburger added in Phase 7 */
     }
   }
   ```

## Success Criteria

- [x] Header visible on all pages
- [x] Header sticks to top on scroll
- [x] Backdrop blur visible when content scrolls behind
- [x] Domain links show active state for current section
- [x] Language switcher works in header (simplified root-level toggle; full parity switcher remains in lesson layouts)
- [ ] Search box present (deferred — SearchBox requires pagefind build; Phase 6 scope)
- [x] Skip link accessible via keyboard (Tab from page load)
- [x] Domain nav hidden on viewports < 768px

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backdrop blur not supported (old browsers) | Low | Low | Fallback to solid background via `@supports` |
| Active state detection fails for nested routes | Medium | Low | Use `startsWith()` comparison, not exact match |
| Header overlaps content on short pages | Low | Medium | Add min-height to main content area |
| Search/LangSwitcher prop conflicts | Low | Low | Compact prop is additive, not breaking |

## Notes

- Mobile hamburger menu and drawer are Phase 7 scope
- Search functionality (actual search) is Phase 6 scope
- Current SearchBox.astro exists but may need styling adjustment
