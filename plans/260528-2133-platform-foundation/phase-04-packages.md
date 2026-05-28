---
phase: 4
title: Packages
status: completed
priority: P1
effort: 4h
dependencies:
  - 3
---

# Phase 4: Packages

## Context Links
- Blueprint: §3.2 (packages/ structure), §3.4 (widget categories + bundle budget), §4.2 (lesson sections)

## Overview
5 workspace packages under `packages/*`, each scoped `@rfcn-space-handbook/*`. One demo widget (`PolarPlot`, D3-based) proves the React-island pipeline end-to-end. Each package is independently testable.

## Key Insights
- Each package exports a clean `src/index.ts` barrel so `apps/web` imports stay stable across refactors.
- `packages/widgets` is the only package that ships *runtime JS to the browser* — bundle budget applies here, not to the others.
- `packages/glossary` ships a *remark plugin* (build-time), not runtime JS.
- `packages/citations` ships both: a build-time collector and a runtime `<Cite>` component (small, ~5KB).
- `packages/i18n` is build-time helpers only (used by Astro pages and remark plugins).
- D3 chosen for PolarPlot over Plotly because PolarPlot is non-interactive in v1 (per §3.4 table). Bundle cost ~30KB.

## Requirements
**Functional:** `apps/web` can import from each package via package name; PolarPlot renders inside an MDX file.
**Non-functional:** widget bundle ≤150KB gz (size-limit asserts this Phase 7).

## Architecture
```
packages/
├── widgets/         @rfcn-space-handbook/widgets         (React, runtime)
├── ui/              @rfcn-space-handbook/ui              (Astro, chrome)
├── glossary/        @rfcn-space-handbook/glossary        (remark plugin + JSON loader)
├── citations/       @rfcn-space-handbook/citations       (Cite component + schema)
└── i18n/            @rfcn-space-handbook/i18n            (helpers)
```

Each package: `package.json` (name, version 0.0.0, type module, main `./src/index.ts`, types `./src/index.ts`, exports map), `tsconfig.json` extending base.

## Related Code Files

**packages/widgets/**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/index.ts` (barrel)
- Create: `src/rf/polar-plot.tsx` (D3-based, accepts `data: number[]`, `radial?: boolean`, renders to SVG with `<title>` for a11y)
- Create: `src/rf/polar-plot.test.tsx` (Vitest + React Testing Library smoke test)
- Create: `src/shared/use-reduced-motion.ts` (hook)

**packages/ui/**
- Create: `package.json`, `tsconfig.json`
- Create: `src/index.ts`
- Create: `src/header.astro`, `src/footer.astro`, `src/breadcrumbs.astro`, `src/lang-switcher.astro` (Phase 3 references these — move from `apps/web` if already created there, or keep in apps for now and migrate later — **decision: keep chrome in `apps/web` for Phase 0, this package only ships `tokens.css` for now**, expand later)
- Create: `src/tokens.css` (placeholder, real content in Phase 8)

**packages/glossary/**
- Create: `package.json`, `tsconfig.json`
- Create: `src/index.ts` — exports `loadGlossary(path)`, `lookupTerm(term, lang)`, `remarkGlossaryAutoLink({ glossaryPath })` plugin that wraps first occurrence per file in `<GlossaryTerm>` MDX component
- Create: `src/glossary-term.astro` (popover component — `<dfn>` with `<aside>` on hover/focus, no JS in v1 — pure CSS `:hover` + `:focus-within`)
- Create: `src/index.test.ts`

**packages/citations/**
- Create: `package.json`, `tsconfig.json`
- Create: `src/index.ts` — exports `Cite` React component (takes `id`, looks up in passed citation map, renders numbered marker), `BibliographyCollector` (collects per-page Cite calls, renders at lesson end), `citationsSchema` (Zod for `data/citations.json`)
- Create: `src/cite.tsx`
- Create: `src/bibliography.astro`
- Create: `src/index.test.ts`

**packages/i18n/**
- Create: `package.json`, `tsconfig.json`
- Create: `src/index.ts` — exports `getOppositeLang`, `resolveParitySibling(allLessons, parityId, targetLang)`, `LANG_LABELS = { en: 'English', vi: 'Tiếng Việt' }`, `UI_STRINGS = { en: {...}, vi: {...} }`
- Create: `src/index.test.ts`

## Implementation Steps
1. Scaffold all 5 package dirs with `package.json` + `tsconfig.json` + `src/index.ts`.
2. Write each package's exports per Related Code Files above.
3. Add `@rfcn-space-handbook/widgets`, `/ui`, `/glossary`, `/citations`, `/i18n` as workspace deps in `apps/web/package.json` (`"@rfcn-space-handbook/widgets": "workspace:*"`).
4. Write `polar-plot.tsx` — D3 import inside the component body (dynamic), draw polar SVG of input radii, `prefers-reduced-motion` → static frame.
5. Wire `remarkGlossaryAutoLink` into `astro.config.mjs` markdown plugins.
6. Wire `bibliography` rendering into `LessonLayout.astro`.
7. Vitest configs at workspace level: `pnpm test` runs all `*.test.ts(x)` across packages.
8. Run `pnpm -r build`, expect all packages compile (TS check only, no actual bundling — Astro/Vite consumes sources directly).

## Todo List
- [ ] packages/widgets scaffold + PolarPlot + test
- [ ] packages/ui scaffold + tokens.css placeholder
- [ ] packages/glossary scaffold + remark plugin + GlossaryTerm component + test
- [ ] packages/citations scaffold + Cite component + bibliography collector + schema + test
- [ ] packages/i18n scaffold + helpers + test
- [ ] apps/web depends on all 5 via workspace:*
- [ ] vitest configured + all tests pass

## Success Criteria
- [ ] `pnpm -r build` exits 0
- [ ] `pnpm test` runs and passes all package tests
- [ ] Imports `import { PolarPlot } from '@rfcn-space-handbook/widgets'` resolve in apps/web
- [ ] PolarPlot renders in dev when mounted in a test MDX file with sample data

## Risk Assessment
- **D3 SSR-safe import** (low): D3 has no DOM access at import time; safe to ship.
- **Astro Vue/Svelte conflict** (n/a — we use React only)
- **Remark plugin order** (medium): glossary auto-link must run *before* MDX expression evaluation; document the order in astro.config.mjs.

## Security Considerations
- No external data fetch in any widget at runtime.
- Citations schema validates URLs against `https?://` only.

## Next Steps
Phase 5 creates the pilot lesson that imports `PolarPlot`, references a glossary term, and uses `<Cite>` — proving all 4 packages work together.
