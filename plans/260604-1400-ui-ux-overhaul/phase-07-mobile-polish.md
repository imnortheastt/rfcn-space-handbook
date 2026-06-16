---
phase: 7
title: "Mobile & Polish"
status: completed
effort: "3h"
dependencies: ["phase-01", "phase-02", "phase-03", "phase-04", "phase-05", "phase-06"]
---

# Phase 7: Mobile & Polish

## Overview

Final responsive design pass and quality assurance. Implement hamburger menu for mobile navigation. Ensure all breakpoints work correctly (sm: 640px, md: 768px, lg: 1024px). Verify touch-friendly tap targets (44px min). Update print stylesheet for lessons. Run Lighthouse audits and fix issues. Cross-browser testing.

## Requirements

### Functional
- Hamburger menu toggles navigation on mobile
- Navigation collapses at md breakpoint (768px)
- All content readable at 320px viewport width
- Print stylesheet hides navigation, optimizes lesson content
- Smooth transitions for menu open/close

### Non-Functional
- Lighthouse Performance >= 90
- Lighthouse Accessibility >= 95
- Lighthouse Best Practices >= 90
- Lighthouse SEO >= 90
- Touch targets >= 44x44px
- No horizontal scroll at any breakpoint
- Works in Chrome, Firefox, Safari, Edge

## Related Code Files

### Files to Modify
- `apps/web/src/layouts/BaseLayout.astro` — mobile nav structure
- `apps/web/src/components/Header.astro` (or nav section in BaseLayout)
- `apps/web/src/styles/tokens.css` — responsive utilities, print styles
- `apps/web/src/layouts/LessonLayout.astro` — print-specific adjustments

### Files to Create
- `apps/web/src/components/MobileMenu.astro` — hamburger menu component (optional, can be inline)

## Implementation Steps

### 7.1 Hamburger Menu (1h)
1. Add hamburger button markup in header:
   ```astro
   <button
     class="hamburger"
     aria-label="Toggle navigation menu"
     aria-expanded="false"
     aria-controls="mobile-nav"
   >
     <span class="hamburger-line"></span>
     <span class="hamburger-line"></span>
     <span class="hamburger-line"></span>
   </button>
   ```

2. Style hamburger button:
   ```css
   .hamburger {
     display: none;
     flex-direction: column;
     justify-content: center;
     gap: 4px;
     width: 44px;
     height: 44px;
     padding: 10px;
     background: transparent;
     border: none;
     cursor: pointer;
   }
   .hamburger-line {
     width: 24px;
     height: 2px;
     background: var(--color-fg, #e6edf3);
     border-radius: 1px;
     transition: transform 0.2s, opacity 0.2s;
   }
   /* Animated X when open */
   .hamburger[aria-expanded="true"] .hamburger-line:nth-child(1) {
     transform: translateY(6px) rotate(45deg);
   }
   .hamburger[aria-expanded="true"] .hamburger-line:nth-child(2) {
     opacity: 0;
   }
   .hamburger[aria-expanded="true"] .hamburger-line:nth-child(3) {
     transform: translateY(-6px) rotate(-45deg);
   }

   @media (max-width: 767px) {
     .hamburger {
       display: flex;
     }
   }
   ```

3. Mobile navigation panel:
   ```css
   .mobile-nav {
     display: none;
     position: fixed;
     top: var(--header-height, 60px);
     left: 0;
     right: 0;
     bottom: 0;
     background: var(--color-bg, #0d1117);
     padding: 1.5rem;
     z-index: 40;
     overflow-y: auto;
   }
   .mobile-nav.open {
     display: block;
     animation: slideIn 0.2s ease;
   }
   @keyframes slideIn {
     from {
       opacity: 0;
       transform: translateY(-10px);
     }
     to {
       opacity: 1;
       transform: translateY(0);
     }
   }
   .mobile-nav a {
     display: block;
     padding: 0.875rem 0;
     font-size: 1.125rem;
     color: var(--color-fg, #e6edf3);
     border-bottom: 1px solid var(--color-border, #30363d);
     text-decoration: none;
   }
   .mobile-nav a:hover,
   .mobile-nav a:focus {
     color: var(--color-cyan-400, #88e1e6);
   }

   @media (min-width: 768px) {
     .mobile-nav {
       display: none !important;
     }
   }
   ```

4. Add toggle script:
   ```astro
   <script>
     const hamburger = document.querySelector('.hamburger');
     const mobileNav = document.querySelector('.mobile-nav');

     hamburger?.addEventListener('click', () => {
       const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
       hamburger.setAttribute('aria-expanded', String(!isOpen));
       mobileNav?.classList.toggle('open', !isOpen);
       document.body.style.overflow = isOpen ? '' : 'hidden';
     });

     // Close on escape key
     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
         hamburger?.click();
       }
     });

     // Close on link click
     mobileNav?.querySelectorAll('a').forEach(link => {
       link.addEventListener('click', () => {
         hamburger?.click();
       });
     });
   </script>
   ```

### 7.2 Responsive Breakpoints (0.75h)
1. Verify/add responsive utility classes:
   ```css
   /* Breakpoint reference:
      sm: 640px  - larger phones
      md: 768px  - tablets
      lg: 1024px - desktops
      xl: 1280px - large desktops
   */

   /* Hide/show utilities */
   .hide-mobile { display: none; }
   .hide-desktop { display: block; }

   @media (min-width: 768px) {
     .hide-mobile { display: block; }
     .hide-desktop { display: none; }
   }

   /* Container widths */
   .container {
     width: 100%;
     max-width: 100%;
     padding-left: 1rem;
     padding-right: 1rem;
   }
   @media (min-width: 640px) {
     .container {
       padding-left: 1.5rem;
       padding-right: 1.5rem;
     }
   }
   @media (min-width: 1024px) {
     .container {
       max-width: 1024px;
       margin-left: auto;
       margin-right: auto;
     }
   }

   /* Typography scaling */
   h1 {
     font-size: 1.5rem;
   }
   @media (min-width: 640px) {
     h1 { font-size: 1.75rem; }
   }
   @media (min-width: 1024px) {
     h1 { font-size: 2rem; }
   }
   ```

2. Fix any overflow issues:
   ```css
   /* Prevent horizontal scroll */
   html, body {
     overflow-x: hidden;
   }
   img, video, iframe, pre, table {
     max-width: 100%;
   }
   pre {
     overflow-x: auto;
   }
   ```

### 7.3 Touch Targets & Accessibility (0.5h)
1. Audit and fix tap targets:
   ```css
   /* Minimum touch target size */
   a, button, input, select, textarea,
   [role="button"], [role="link"] {
     min-height: 44px;
     min-width: 44px;
   }

   /* For inline links, use padding instead */
   .prose a,
   main p a {
     min-height: auto;
     min-width: auto;
     padding: 0.25rem 0;
     margin: -0.25rem 0;
   }

   /* Nav links with proper spacing */
   nav a {
     padding: 0.75rem 1rem;
   }
   ```

2. Verify focus indicators work on touch:
   ```css
   /* Focus-visible for keyboard, not touch */
   :focus:not(:focus-visible) {
     outline: none;
   }
   :focus-visible {
     outline: 2px solid var(--color-cyan-500);
     outline-offset: 2px;
   }
   ```

### 7.4 Print Stylesheet (0.25h)
1. Add print styles:
   ```css
   @media print {
     /* Hide non-essential elements */
     .hamburger,
     .mobile-nav,
     .search-box,
     nav[aria-label="Main"],
     .lang-switcher,
     footer,
     .lesson-footer {
       display: none !important;
     }

     /* Reset colors for print */
     body {
       background: white !important;
       color: black !important;
     }
     h1, h2, h3, h4, h5, h6 {
       color: black !important;
       page-break-after: avoid;
     }
     a {
       color: black !important;
       text-decoration: underline !important;
     }
     a[href]::after {
       content: " (" attr(href) ")";
       font-size: 0.8em;
       color: #666;
     }
     a[href^="#"]::after,
     a[href^="javascript"]::after {
       content: "";
     }

     /* Code blocks */
     pre, code {
       background: #f5f5f5 !important;
       border: 1px solid #ddd !important;
       color: black !important;
     }

     /* Page breaks */
     .lesson-hook,
     .lesson-intuition,
     .lesson-mechanism,
     .lesson-apply,
     .lesson-pitfalls {
       page-break-inside: avoid;
     }

     /* Math blocks */
     .lesson-math-block {
       background: white !important;
       border: 1px solid #ddd !important;
     }
   }
   ```

### 7.5 Lighthouse Audit & Fixes (0.5h)
1. Run Lighthouse audit:
   ```bash
   # Build and serve
   pnpm build && pnpm preview
   # Open Chrome DevTools > Lighthouse
   # Run audit for Performance, Accessibility, Best Practices, SEO
   ```

2. Common fixes to apply:
   - **Performance**: Ensure images have width/height, lazy-load below-fold images
   - **Accessibility**: Add missing aria-labels, ensure color contrast, fix heading hierarchy
   - **Best Practices**: Add `rel="noopener"` to external links, use HTTPS
   - **SEO**: Verify meta descriptions, canonical URLs, structured data

3. Specific checks:
   ```astro
   <!-- External links -->
   <a href="..." target="_blank" rel="noopener noreferrer">...</a>

   <!-- Images with dimensions -->
   <img src="..." alt="..." width="800" height="600" loading="lazy" />

   <!-- Skip to content link -->
   <a href="#main-content" class="skip-link">Skip to content</a>
   ```
   ```css
   .skip-link {
     position: absolute;
     top: -40px;
     left: 0;
     background: var(--color-cyan-500);
     color: var(--color-bg);
     padding: 0.5rem 1rem;
     z-index: 100;
     transition: top 0.2s;
   }
   .skip-link:focus {
     top: 0;
   }
   ```

### 7.6 Cross-Browser Testing (0.25h)
1. Test checklist:
   - [ ] Chrome (latest) — primary target
   - [ ] Firefox (latest) — scrollbar styling, CSS grid
   - [ ] Safari (latest) — backdrop-filter, focus-visible
   - [ ] Edge (latest) — should match Chrome
   - [ ] iOS Safari — touch targets, fixed positioning
   - [ ] Android Chrome — touch targets, viewport

2. Known browser-specific fixes:
   ```css
   /* Safari focus-visible fallback */
   @supports not selector(:focus-visible) {
     a:focus,
     button:focus {
       outline: 2px solid var(--color-cyan-500);
       outline-offset: 2px;
     }
   }

   /* Firefox scrollbar fallback (already standard) */
   * {
     scrollbar-width: thin;
     scrollbar-color: var(--color-border) var(--color-surface);
   }
   ```

## Success Criteria

- [ ] Hamburger menu visible at < 768px viewport
- [ ] Hamburger animates to X when open
- [ ] Mobile nav panel slides in smoothly
- [ ] Escape key closes mobile menu
- [ ] Body scroll locked when mobile menu open
- [ ] No horizontal scroll at 320px viewport
- [ ] All touch targets >= 44x44px
- [ ] Print stylesheet hides nav, shows content legibly
- [ ] Lighthouse Performance >= 90
- [ ] Lighthouse Accessibility >= 95
- [ ] Lighthouse Best Practices >= 90
- [ ] Lighthouse SEO >= 90
- [ ] Skip-to-content link works
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on iOS Safari, Android Chrome

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Mobile menu z-index conflicts | Medium | Medium | Use high z-index (40+), test with all components |
| Body scroll lock issues on iOS | Medium | Medium | Test thoroughly, consider overscroll-behavior |
| Lighthouse scores vary by network | Medium | Low | Run multiple times, use throttled settings |
| Print stylesheet breaks layout | Low | Low | Test actual print preview, not just media query |
| Safari CSS differences | Medium | Medium | Test early, add -webkit- prefixes if needed |
