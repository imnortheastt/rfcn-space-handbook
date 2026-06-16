---
phase: 6
title: "Search & Interactions"
status: completed
effort: "3h"
dependencies: ["phase-01", "phase-02"]
---

# Phase 6: Search & Interactions

## Overview

Polish interactive elements for dark theme consistency. Customize Pagefind search UI styling. Add button hover/focus states with cyan glow effects. Implement link underline animations. Style form inputs and loading states. Ensure all interactive elements feel cohesive and responsive.

## Requirements

### Functional
- Pagefind search modal/dropdown uses dark theme
- Search results highlight matches with cyan accent
- Buttons have visible hover and focus states
- Links have animated underline on hover
- Form inputs (if any) styled for dark theme
- Loading states use subtle animations

### Non-Functional
- Focus states meet WCAG 2.1 focus-visible requirements
- Animations respect prefers-reduced-motion
- Touch targets are minimum 44x44px
- No layout shift during interactions

## Related Code Files

### Files to Modify
- `apps/web/src/components/SearchBox.astro` — Pagefind UI customization
- `apps/web/src/styles/tokens.css` — global interactive styles
- `apps/web/src/layouts/BaseLayout.astro` — global link/button styles

### Files to Reference
- `/pagefind/pagefind-ui.css` — default Pagefind styles to override

## Implementation Steps

### 6.1 Pagefind UI Dark Theme (1.5h)
1. Override Pagefind CSS variables in `tokens.css`:
   ```css
   /* Pagefind UI Dark Theme Overrides */
   :root {
     --pagefind-ui-scale: 1;
     --pagefind-ui-primary: var(--color-cyan-500, #88e1e6);
     --pagefind-ui-text: var(--color-fg, #e6edf3);
     --pagefind-ui-background: var(--color-surface-elevated, #161b22);
     --pagefind-ui-border: var(--color-border, #30363d);
     --pagefind-ui-tag: var(--color-surface-code, #1a1f2e);
     --pagefind-ui-border-width: 1px;
     --pagefind-ui-border-radius: 6px;
     --pagefind-ui-image-border-radius: 4px;
     --pagefind-ui-image-box-ratio: 3 / 2;
     --pagefind-ui-font: var(--font-sans);
   }
   ```

2. Override specific Pagefind elements:
   ```css
   /* Search input */
   .pagefind-ui__search-input {
     background: var(--color-bg, #0d1117) !important;
     border-color: var(--color-border, #30363d) !important;
     color: var(--color-fg, #e6edf3) !important;
   }
   .pagefind-ui__search-input:focus {
     border-color: var(--color-cyan-500, #88e1e6) !important;
     box-shadow: 0 0 0 3px rgba(136, 225, 230, 0.2) !important;
     outline: none !important;
   }
   .pagefind-ui__search-input::placeholder {
     color: var(--color-muted, #8b949e) !important;
   }

   /* Search results */
   .pagefind-ui__result {
     background: var(--color-surface-elevated, #161b22) !important;
     border: 1px solid var(--color-border, #30363d) !important;
     border-radius: 6px !important;
     padding: 1rem !important;
     margin-bottom: 0.75rem !important;
   }
   .pagefind-ui__result:hover {
     border-color: var(--color-cyan-500, #88e1e6) !important;
   }
   .pagefind-ui__result-link {
     color: var(--color-cyan-400, #7dd3fc) !important;
     text-decoration: none !important;
   }
   .pagefind-ui__result-link:hover {
     text-decoration: underline !important;
   }
   .pagefind-ui__result-excerpt {
     color: var(--color-muted, #8b949e) !important;
   }

   /* Highlight matches */
   .pagefind-ui__result-excerpt mark,
   .pagefind-ui mark {
     background: rgba(136, 225, 230, 0.3) !important;
     color: var(--color-cyan-300, #7dd3fc) !important;
     padding: 0.125rem 0.25rem !important;
     border-radius: 2px !important;
   }

   /* Search clear button */
   .pagefind-ui__search-clear {
     background: var(--color-surface-code, #1a1f2e) !important;
     color: var(--color-muted, #8b949e) !important;
   }
   .pagefind-ui__search-clear:hover {
     color: var(--color-fg, #e6edf3) !important;
   }

   /* Loading state */
   .pagefind-ui__loading {
     color: var(--color-muted, #8b949e) !important;
   }
   ```

3. Update SearchBox.astro wrapper:
   ```css
   .search-box {
     width: 100%;
     max-width: 400px;
   }
   #pagefind-search {
     --pagefind-ui-scale: 0.9;
   }
   ```

### 6.2 Button Styles (0.75h)
1. Define global button styles in `tokens.css`:
   ```css
   /* Primary Button */
   .btn,
   button[type="submit"] {
     display: inline-flex;
     align-items: center;
     justify-content: center;
     gap: 0.5rem;
     padding: 0.625rem 1.25rem;
     font-size: 0.875rem;
     font-weight: 500;
     font-family: var(--font-sans);
     color: var(--color-bg, #0d1117);
     background: var(--color-cyan-500, #88e1e6);
     border: none;
     border-radius: 6px;
     cursor: pointer;
     transition: all 0.15s ease;
     min-height: 44px;
     min-width: 44px;
   }
   .btn:hover,
   button[type="submit"]:hover {
     background: var(--color-cyan-400, #7dd3fc);
     box-shadow: 0 0 12px rgba(136, 225, 230, 0.4);
   }
   .btn:focus-visible,
   button[type="submit"]:focus-visible {
     outline: 2px solid var(--color-cyan-500, #88e1e6);
     outline-offset: 2px;
   }
   .btn:active,
   button[type="submit"]:active {
     transform: translateY(1px);
   }

   /* Secondary/Ghost Button */
   .btn-secondary,
   .btn-ghost {
     background: transparent;
     color: var(--color-fg, #e6edf3);
     border: 1px solid var(--color-border, #30363d);
   }
   .btn-secondary:hover,
   .btn-ghost:hover {
     background: var(--color-surface-elevated, #161b22);
     border-color: var(--color-cyan-500, #88e1e6);
     color: var(--color-cyan-400, #7dd3fc);
     box-shadow: 0 0 8px rgba(136, 225, 230, 0.2);
   }

   /* Disabled state */
   .btn:disabled,
   button:disabled {
     opacity: 0.5;
     cursor: not-allowed;
     box-shadow: none;
   }
   .btn:disabled:hover {
     transform: none;
   }
   ```

2. Add reduced motion support:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .btn,
     button {
       transition: none;
     }
     .btn:hover {
       box-shadow: none;
     }
   }
   ```

### 6.3 Link Animations (0.5h)
1. Define animated underline for content links:
   ```css
   /* Animated underline for prose links */
   .prose a,
   main a:not(.btn):not(.nav-link) {
     color: var(--color-cyan-400, #7dd3fc);
     text-decoration: none;
     position: relative;
     transition: color 0.15s ease;
   }
   .prose a::after,
   main a:not(.btn):not(.nav-link)::after {
     content: '';
     position: absolute;
     bottom: -1px;
     left: 0;
     width: 0;
     height: 1px;
     background: var(--color-cyan-500, #88e1e6);
     transition: width 0.2s ease;
   }
   .prose a:hover::after,
   main a:not(.btn):not(.nav-link):hover::after {
     width: 100%;
   }
   .prose a:hover,
   main a:not(.btn):not(.nav-link):hover {
     color: var(--color-cyan-300, #67e8f9);
   }

   /* Focus state for links */
   a:focus-visible {
     outline: 2px solid var(--color-cyan-500, #88e1e6);
     outline-offset: 2px;
     border-radius: 2px;
   }

   @media (prefers-reduced-motion: reduce) {
     .prose a::after,
     main a:not(.btn)::after {
       transition: none;
       width: 100%;
       opacity: 0;
     }
     .prose a:hover::after,
     main a:not(.btn):hover::after {
       opacity: 1;
     }
   }
   ```

### 6.4 Form Inputs & Loading States (0.25h)
1. Style form inputs (for future forms):
   ```css
   input[type="text"],
   input[type="email"],
   input[type="search"],
   textarea,
   select {
     background: var(--color-bg, #0d1117);
     border: 1px solid var(--color-border, #30363d);
     border-radius: 6px;
     padding: 0.625rem 0.875rem;
     font-size: 0.875rem;
     font-family: var(--font-sans);
     color: var(--color-fg, #e6edf3);
     transition: border-color 0.15s, box-shadow 0.15s;
     min-height: 44px;
   }
   input:focus,
   textarea:focus,
   select:focus {
     border-color: var(--color-cyan-500, #88e1e6);
     box-shadow: 0 0 0 3px rgba(136, 225, 230, 0.2);
     outline: none;
   }
   input::placeholder,
   textarea::placeholder {
     color: var(--color-muted, #8b949e);
   }
   ```

2. Add loading spinner utility:
   ```css
   .loading {
     position: relative;
     pointer-events: none;
   }
   .loading::after {
     content: '';
     position: absolute;
     top: 50%;
     left: 50%;
     width: 1rem;
     height: 1rem;
     margin: -0.5rem 0 0 -0.5rem;
     border: 2px solid var(--color-border, #30363d);
     border-top-color: var(--color-cyan-500, #88e1e6);
     border-radius: 50%;
     animation: spin 0.6s linear infinite;
   }
   @keyframes spin {
     to { transform: rotate(360deg); }
   }
   @media (prefers-reduced-motion: reduce) {
     .loading::after {
       animation: none;
       border-top-color: var(--color-muted);
     }
   }
   ```

## Success Criteria

- [ ] Pagefind search input styled with dark background
- [ ] Pagefind results have dark card styling with cyan border on hover
- [ ] Search match highlights use cyan background tint
- [ ] Primary buttons have cyan background with glow on hover
- [ ] Secondary/ghost buttons have border and transparent background
- [ ] Button focus states show cyan outline
- [ ] Content links have animated underline on hover
- [ ] All focus states visible for keyboard navigation
- [ ] prefers-reduced-motion disables animations
- [ ] All touch targets >= 44x44px
- [ ] Loading spinner animation works

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pagefind CSS specificity conflicts | High | Medium | Use !important selectively, test thoroughly |
| Link ::after pseudo-element conflicts | Medium | Low | Scope to .prose and main, exclude nav/btn |
| Glow effects too subtle on some monitors | Low | Low | Test on multiple displays, adjust opacity |
| Focus outline not visible on dark bg | Low | High | Use bright cyan with offset, test contrast |
