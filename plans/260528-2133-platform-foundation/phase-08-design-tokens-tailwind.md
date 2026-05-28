---
phase: 8
title: Design Tokens + Tailwind
status: completed
priority: P1
effort: 2h
dependencies:
  - 3
---

# Phase 8: Design Tokens + Tailwind

## Context Links
- Blueprint: §6.3 (voice/tone), §6.4 (diagram standards — visual language consistency), §10 (open decisions: teal `#0b5351`, Inter + IBM Plex Sans, dark mode)
- Phase 7 has CSP `font-src 'self' data:` — fonts must be self-hosted, not Google Fonts CDN

## Overview
Tailwind 4 + design tokens layer in `packages/ui`. Teal accent, Inter for body, IBM Plex Sans Vietnamese for VI, IBM Plex Mono for code. Dark mode via `class` strategy OS-follow. Print stylesheet. Reduced-motion respected. Color palette is CV-deficiency-tuned per blueprint §6.4.

## Key Insights
- Tailwind 4 uses CSS-first config (`@theme` directive in CSS), not `tailwind.config.ts`. Tokens live as CSS custom properties on `:root`.
- Self-host fonts via `@fontsource/inter` + `@fontsource/ibm-plex-sans-vietnamese` + `@fontsource/ibm-plex-mono` packages — keeps CSP `font-src 'self'` clean.
- Vietnamese subset of IBM Plex Sans has the diacritic glyphs Inter lacks (đ ă ơ ư + tone marks). Apply via `:lang(vi)` selector or `<html lang>` propagation.
- CV-deficiency-tuned palette: use Wong's 8-color palette or Tol's qualitative scheme — both safe for deuteranopia, protanopia, tritanopia.

## Requirements
**Functional:** every UI element styled; dark mode toggles via OS pref (and optional manual override stored in localStorage); print stylesheet hides nav/footer/widgets and renders prose at serif body width; `prefers-reduced-motion: reduce` disables PolarPlot animations.
**Non-functional:** CLS < 0.1 on font load (use `font-display: optional` for body, or `swap` with size-adjust for layout stability).

## Architecture
```
packages/ui/
├── src/
│   ├── tokens.css            # @theme + custom properties
│   ├── base.css              # element resets, typography, focus rings
│   ├── print.css             # print-only rules
│   └── index.ts              # re-exports if needed
apps/web/
├── src/styles/global.css     # imports tokens + base + print + katex
└── tailwind.config (none — Tailwind 4 CSS-first)
```

## Related Code Files
- Modify: `packages/ui/src/tokens.css` (was placeholder Phase 4)
- Create: `packages/ui/src/base.css`
- Create: `packages/ui/src/print.css`
- Modify: `packages/ui/package.json` add `@fontsource/inter`, `@fontsource/ibm-plex-sans-vietnamese`, `@fontsource/ibm-plex-mono` deps; add `tailwindcss@^4` peer
- Modify: `apps/web/src/styles/global.css` to import token + base + print files and fontsource CSS
- Modify: `apps/web/astro.config.mjs` Tailwind integration config (`applyBaseStyles: false` — we own base)

## Implementation Steps

1. **`packages/ui/src/tokens.css`**:
   ```css
   @import 'tailwindcss';
   @import '@fontsource/inter/400.css';
   @import '@fontsource/inter/600.css';
   @import '@fontsource/inter/700.css';
   @import '@fontsource/ibm-plex-sans-vietnamese/400.css';
   @import '@fontsource/ibm-plex-sans-vietnamese/600.css';
   @import '@fontsource/ibm-plex-mono/400.css';

   @theme {
     /* Brand */
     --color-accent-50:  #e6f1f0;
     --color-accent-500: #0b5351;
     --color-accent-700: #073937;

     /* CV-safe qualitative (Wong 5-color subset) */
     --color-qual-1: #0072b2; /* blue */
     --color-qual-2: #d55e00; /* vermillion */
     --color-qual-3: #009e73; /* bluish-green */
     --color-qual-4: #f0e442; /* yellow */
     --color-qual-5: #cc79a7; /* reddish-purple */

     /* Neutral (light) */
     --color-bg:      #ffffff;
     --color-fg:      #0e1414;
     --color-muted:   #5b6766;

     /* Type */
     --font-sans:  'Inter', 'IBM Plex Sans Vietnamese', system-ui, sans-serif;
     --font-mono:  'IBM Plex Mono', ui-monospace, monospace;
     --font-size-base: 1rem;
     --leading-prose: 1.7;
     --measure: 70ch;
   }

   /* Dark mode token overrides */
   @media (prefers-color-scheme: dark) {
     :root:not(.theme-light) {
       --color-bg:    #0e1414;
       --color-fg:    #e9eded;
       --color-muted: #94a09f;
     }
   }
   :root.theme-dark {
     --color-bg:    #0e1414;
     --color-fg:    #e9eded;
     --color-muted: #94a09f;
   }
   ```

2. **`packages/ui/src/base.css`** — element resets, focus rings (`:focus-visible { outline: 2px solid var(--color-accent-500); outline-offset: 2px }`), prose width, link underline, table styling, code block padding, KaTeX inline alignment, reduced-motion override.

3. **`packages/ui/src/print.css`**:
   ```css
   @media print {
     header, footer, nav, .lang-switcher, [data-widget] { display: none !important; }
     body { color: #000; background: #fff; font-family: 'IBM Plex Serif', Georgia, serif; }
     a[href]::after { content: ' (' attr(href) ')'; font-size: 0.85em; color: #555; }
     main { max-width: 100%; }
   }
   ```

4. **`apps/web/src/styles/global.css`**:
   ```css
   @import '@rfcn-space-handbook/ui/src/tokens.css';
   @import '@rfcn-space-handbook/ui/src/base.css';
   @import '@rfcn-space-handbook/ui/src/print.css';
   @import 'katex/dist/katex.min.css';
   ```

5. Update `apps/web/src/layouts/BaseLayout.astro` to load `global.css` once; add `<html lang={lang}>` + dark-mode class toggle script (`<script is:inline>` reading localStorage on first paint to avoid FOUC).

6. Update `LangSwitcher.astro` styling, `LessonLayout.astro` typography classes, lesson section components with semantic classes (`.lesson-hook`, `.lesson-intuition`, etc.).

7. Smoke: dev server `/en/rf/r0-foundations/decibels` looks polished. Toggle OS dark mode → site flips. Force `prefers-reduced-motion` in DevTools → PolarPlot static. Print preview → clean prose, widgets hidden.

## Todo List
- [ ] tokens.css with @theme + colors + fonts + dark mode
- [ ] base.css with resets + focus rings + reduced-motion override
- [ ] print.css
- [ ] global.css imports everything
- [ ] @fontsource packages installed
- [ ] BaseLayout loads global.css + dark-mode toggle script
- [ ] LessonLayout + section components styled
- [ ] LangSwitcher styled
- [ ] Smoke: dark mode, reduced-motion, print preview, Vietnamese diacritics render correctly

## Success Criteria
- [ ] Pilot lesson renders with polished typography (Inter body, IBM Plex Mono for code, KaTeX math sized correctly)
- [ ] Vietnamese page shows correct diacritics in IBM Plex Sans Vietnamese
- [ ] Dark mode follows OS pref, no FOUC
- [ ] `prefers-reduced-motion: reduce` disables widget animation
- [ ] Print preview shows clean prose, widgets/nav hidden, links footnoted
- [ ] CLS < 0.1 (verified by LHCI in Phase 7)
- [ ] WCAG AA contrast on body text + accent on bg + muted on bg (verify with axe)

## Risk Assessment
- **Font payload size** (medium): Inter + IBM Plex Sans VN + Plex Mono ≈ 300-400KB even subsetted. Mitigation: only load weights 400 + 600 + 700; `font-display: swap`; defer mono variants to lessons with code blocks via per-page `<link rel="preload">`.
- **Tailwind 4 maturity** (low/medium): CSS-first config is stable as of Tailwind 4. Document version pin.
- **Dark mode FOUC** (medium): without an inline script, first paint flashes light theme. The `<script is:inline>` reading localStorage before body renders is the standard fix.

## Security Considerations
- All fonts self-hosted → CSP `font-src 'self'` works (Phase 7 vercel.json).
- No third-party CSS / fonts / icons.
- Inline dark-mode script must be on CSP allowlist via `'self'` + `'unsafe-inline'` only for the boot script (or use a nonce — defer to follow-up).

## Next Steps
After Phase 8 the platform is feature-complete for Phase 0 acceptance. Verification (Task #5), code review (#6), docs population (#7), and first commit (#8) follow.
