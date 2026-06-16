---
phase: 4
title: "Lesson Pages"
status: completed
effort: "4h"
dependencies: ["phase-01", "phase-02"]
---

# Phase 4: Lesson Pages

## Overview

Refine lesson page styling for dark theme consistency. Update section components (LessonHook, Intuition, Mechanism, Apply, Pitfalls) with dark-friendly borders and accent colors. Improve code block styling with syntax highlighting and copy button. Ensure KaTeX math blocks render properly on dark backgrounds. Polish breadcrumbs and metadata display.

## Requirements

### Functional
- Section components have distinct visual identity with left-border accent
- Code blocks have syntax highlighting compatible with dark theme
- Code blocks include copy-to-clipboard button
- KaTeX math renders with proper contrast on dark background
- Breadcrumbs use muted colors with hover states
- Lesson metadata (level, read time) styled consistently

### Non-Functional
- All text meets WCAG AA contrast (4.5:1 minimum)
- Code blocks support horizontal scroll on mobile
- Math blocks don't overflow container

## Related Code Files

### Files to Modify
- `apps/web/src/layouts/LessonLayout.astro` — header/footer/main styling
- `apps/web/src/components/LessonHook.astro` — hook section styling
- `apps/web/src/components/Intuition.astro` — intuition section styling
- `apps/web/src/components/Mechanism.astro` — mechanism section styling
- `apps/web/src/components/Apply.astro` — apply section styling
- `apps/web/src/components/Pitfalls.astro` — pitfalls section styling
- `apps/web/src/components/MathBlock.astro` — KaTeX wrapper styling
- `apps/web/src/components/Breadcrumbs.astro` — breadcrumb styling
- `apps/web/src/styles/tokens.css` — add lesson-specific tokens if needed

### Files to Create
- `apps/web/src/components/CodeBlock.astro` — code block wrapper with copy button (if not using remark plugin)

## Implementation Steps

### 4.1 Section Component Borders (1h)
1. Define section border colors using cyan accent variations:
   ```css
   --section-border-hook: var(--color-cyan-500);      /* #88e1e6 */
   --section-border-intuition: var(--color-cyan-400);
   --section-border-mechanism: var(--color-cyan-600);
   --section-border-apply: var(--color-cyan-500);
   --section-border-pitfalls: var(--color-warning-500); /* orange/amber for warnings */
   ```
2. Update each section component with scoped styles:
   ```astro
   <style>
     .lesson-hook {
       border-left: 3px solid var(--section-border-hook, #88e1e6);
       padding-left: 1rem;
       margin: 1.5rem 0;
       background: var(--color-surface-elevated, #1a1f2e);
       border-radius: 0 6px 6px 0;
       padding: 1rem 1rem 1rem 1.25rem;
     }
   </style>
   ```
3. Add subtle background tint to distinguish sections from main content

### 4.2 Code Block Styling (1.5h)
1. Configure Shiki/Expressive Code for dark theme in `astro.config.mjs`:
   ```js
   shikiConfig: {
     theme: 'github-dark',
     wrap: true,
   }
   ```
2. Add code block wrapper styles in `tokens.css`:
   ```css
   pre[class*="language-"],
   pre.astro-code {
     background: var(--color-surface-code, #0d1117);
     border: 1px solid var(--color-border, #30363d);
     border-radius: 6px;
     padding: 1rem;
     overflow-x: auto;
     font-size: 0.875rem;
     line-height: 1.5;
   }
   code {
     font-family: var(--font-mono);
     font-size: 0.875em;
   }
   :not(pre) > code {
     background: var(--color-surface-elevated, #1a1f2e);
     padding: 0.125rem 0.375rem;
     border-radius: 4px;
     color: var(--color-cyan-400, #7dd3fc);
   }
   ```
3. Add copy button via client-side script or rehype plugin:
   ```js
   // Copy button injection (client-side)
   document.querySelectorAll('pre').forEach(pre => {
     const btn = document.createElement('button');
     btn.className = 'copy-btn';
     btn.textContent = 'Copy';
     btn.onclick = () => navigator.clipboard.writeText(pre.textContent);
     pre.style.position = 'relative';
     pre.appendChild(btn);
   });
   ```
4. Style copy button:
   ```css
   .copy-btn {
     position: absolute;
     top: 0.5rem;
     right: 0.5rem;
     background: var(--color-surface-elevated);
     border: 1px solid var(--color-border);
     border-radius: 4px;
     padding: 0.25rem 0.5rem;
     font-size: 0.75rem;
     color: var(--color-muted);
     cursor: pointer;
     opacity: 0;
     transition: opacity 0.2s;
   }
   pre:hover .copy-btn { opacity: 1; }
   .copy-btn:hover { color: var(--color-cyan-400); border-color: var(--color-cyan-400); }
   ```

### 4.3 KaTeX Dark Theme (0.5h)
1. Override KaTeX colors in `tokens.css`:
   ```css
   .katex { color: var(--color-fg, #e6edf3); }
   .katex .mord,
   .katex .mbin,
   .katex .mrel,
   .katex .mopen,
   .katex .mclose,
   .katex .mpunct { color: inherit; }
   ```
2. Style MathBlock wrapper:
   ```css
   .lesson-math-block {
     background: var(--color-surface-elevated, #1a1f2e);
     border: 1px solid var(--color-border, #30363d);
     border-radius: 6px;
     padding: 1rem;
     margin: 1.5rem 0;
     overflow-x: auto;
   }
   .math-label {
     font-size: 0.875rem;
     color: var(--color-muted);
     margin-top: 0.5rem;
     text-align: center;
   }
   ```

### 4.4 Breadcrumbs & Metadata (1h)
1. Update Breadcrumbs.astro styles:
   ```css
   .breadcrumbs {
     font-size: 0.875rem;
     color: var(--color-muted, #8b949e);
     display: flex;
     flex-wrap: wrap;
     gap: 0.25rem;
     align-items: center;
   }
   .breadcrumbs a {
     color: var(--color-muted);
     text-decoration: none;
     transition: color 0.15s;
   }
   .breadcrumbs a:hover {
     color: var(--color-cyan-400, #88e1e6);
     text-decoration: underline;
   }
   .breadcrumbs .separator {
     color: var(--color-border);
     margin: 0 0.25rem;
   }
   ```
2. Style lesson metadata in LessonLayout:
   ```css
   .lesson-meta {
     display: flex;
     gap: 1rem;
     font-size: 0.875rem;
     color: var(--color-muted);
     margin-bottom: 0.5rem;
   }
   .lesson-level {
     background: var(--color-surface-elevated);
     padding: 0.125rem 0.5rem;
     border-radius: 4px;
     font-weight: 500;
   }
   .lesson-time {
     display: flex;
     align-items: center;
     gap: 0.25rem;
   }
   ```
3. Style standards banner and frontier badge:
   ```css
   .standards-banner {
     background: var(--color-surface-elevated);
     border-left: 3px solid var(--color-cyan-500);
     padding: 0.75rem 1rem;
     margin-bottom: 1rem;
     border-radius: 0 6px 6px 0;
     font-size: 0.875rem;
   }
   .frontier-badge {
     display: inline-block;
     background: var(--color-warning-900);
     color: var(--color-warning-300);
     padding: 0.25rem 0.75rem;
     border-radius: 4px;
     font-size: 0.75rem;
     font-weight: 600;
     text-transform: uppercase;
     margin-bottom: 1rem;
   }
   ```

## Success Criteria

- [ ] All 5 section components have distinct left-border colors
- [ ] Section backgrounds use elevated surface color
- [ ] Code blocks have dark background with proper syntax highlighting
- [ ] Copy button appears on code block hover, copies content
- [ ] KaTeX math is legible on dark background (white/light text)
- [ ] Breadcrumbs show hover state with cyan accent
- [ ] Lesson level badge styled consistently
- [ ] Standards banner and frontier badge visible and styled
- [ ] No horizontal overflow on mobile for math/code
- [ ] All text passes WCAG AA contrast check

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shiki theme conflicts with custom tokens | Medium | Medium | Test theme output, override specific selectors |
| KaTeX styles have high specificity | Medium | Low | Use `!important` sparingly or increase selector specificity |
| Copy button JS fails silently | Low | Low | Add fallback visual feedback, test clipboard API availability |
| Section borders clash visually | Low | Medium | Test all sections together, adjust opacity if needed |
