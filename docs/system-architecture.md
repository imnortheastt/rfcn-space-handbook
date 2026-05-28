# System Architecture

**RF·CN·Space** is a static-generated, multi-language handbook site with live interactive widgets. This document summarizes key architectural layers and decisions.

---

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│  (Desktop / Mobile, EN or VI, with optional localStorage)       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ↓
      ┌──────────────────────┐
      │  Static HTML + CSS   │
      │  (Astro pre-rendered)│
      │  + JS widget chunks  │
      │  (code-split)        │
      └──────┬───────────────┘
             │
      (Served by Vercel CDN)
             │
             ↓
┌────────────────────────────────────────────────────────────────┐
│                    Build Pipeline                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Content sources (MDX + JSON)                         │  │
│  │     - /content/{vi,en}/{domain}/{track}/{unit}/*.mdx     │  │
│  │     - /data/{glossary,citations,curriculum}.json         │  │
│  │  2. Astro collects, validates, SSRs widgets             │  │
│  │  3. Remark plugins (glossary auto-link)                  │  │
│  │  4. Mermaid → SVG (build time)                           │  │
│  │  5. KaTeX → static HTML                                  │  │
│  │  6. Pagefind indexes for search                          │  │
│  │  7. Output: dist/ (static + widget chunks)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Content Model

Every lesson is an MDX file with structured YAML frontmatter:

```yaml
---
# Identity (immutable)
id: rf-r2-antennas-04-radiation-pattern     # Global unique ID
parityId: rf-r2-antennas-04                 # Binds EN + VI pair
slug: radiation-pattern                     # URL slug
lang: vi | en                               # Language

# Organization
domain: rf | core-network | space
track: r2-antennas
unit: r2-antennas-fundamentals
order: 4

# Pedagogy
level: L0-L5                                # Depth: SWE → researcher
estimatedReadingMinutes: 18
prerequisites: [rf-r0-..., ...]            # Build graph at build-time
spiralRevisits: [rf-r5-...]                # Lessons that revisit this deeper

# Editorial
title: "..."
authors: [tindang]
publishedAt: 2026-06-14
lastVerified: 2026-06-14

# Standards + widgets
standards: [{id: "IEEE 145-2013", cite: "ieee-145-2013"}]
widgets: [AntennaPattern3D, PolarPlot]      # Declares which JS to load

# License
license: CC-BY-SA-4.0
---
```

**Why this structure:**
- Validation via Zod (TypeScript-first) — catches errors at build time
- `parityId` enables i18n parity checks: every lesson in `/en/` must have a match in `/vi/`
- `prerequisites` + `spiralRevisits` build a learner journey graph
- `widgets` enables per-page code-splitting (hydrate only what's needed)

---

## Bilingual Routing (i18n Strategy)

```
URL Structure:
  /en/rf/r0-foundations/decibels        → English lesson
  /vi/rf/r0-foundations/decibels        → Vietnamese lesson

URL Routing (Astro):
  src/pages/[lang]/[domain]/[track]/[unit]/[slug].astro
  ↓
  Astro collects MDX from content/[lang]/[domain]/[track]/[unit]/[slug].mdx

Fallback Logic:
  - If lesson not found in requested lang, check other lang
  - Render content + add banner: "This page is not yet available in Vietnamese — showing English original"
  - hreflang tags for SEO (self-link + alternate)

Language Switcher:
  - On /en/path → click VI → navigates to /vi/path (preserves hierarchy)
  - localStorage stores preference; respects Accept-Language header as fallback
```

See `packages/i18n/` for implementation.

---

## Widget Architecture (Astro Islands)

**Core principle:** Zero JavaScript by default. Hydrate only the widget you need.

### Strategy

1. **Static-first:** Lesson MDX renders to static HTML + CSS. No JS initializes.

2. **Per-widget hydration:**
   ```jsx
   <PolarPlot data={[...]} client:visible ariaLabel="..." />
   ```
   - `client:visible` = hydrate when widget enters viewport
   - `client:idle` = hydrate after main thread idle (above-the-fold only)
   - Never `client:load` (blocks page interactivity)

3. **Code-split by category:**
   - `rf-widgets.js` (D3, lightweight) — shared by PolarPlot, SpectrumPlot
   - `space-widgets.js` (Three.js, heavy) — shared by OrbitVisualizer, GroundTrack
   - `shared-widgets.js` (Plot, Slider, Calculator)
   - Build-time Astro chunk splitting via `vite.rollupOptions.output.manualChunks`

4. **Bundle budgets enforced:** Each widget chunk ≤150KB gzipped (CI gates build if exceeded).

5. **No state libraries:** Widgets use `useState` / `useReducer` only. No Redux, Zustand, Jotai. Ephemeral, throw-away.

6. **Heavy deps lazy-imported:**
   ```ts
   // Inside widget component
   const threejs = await import('three');
   ```
   Defers parse cost; Astro tree-shakes unused imports.

7. **Accessibility:** WebGL widgets auto-pause if `prefers-reduced-motion` set.

### Widget Registry

Widgets are registered as React components in `packages/widgets/src/components/`:

```
packages/widgets/src/components/
├── rf/
│   ├── PolarPlot.tsx               # D3, ~40KB gzipped
│   ├── SpectrumPlot.tsx
│   └── AntennaPattern3D.tsx         # Three.js, ~120KB
├── space/
│   ├── OrbitVisualizer.tsx          # Three.js, ~100KB
│   └── GroundTrack.tsx
├── core-network/
│   ├── ProtocolSequence.tsx
│   └── CallFlowStepper.tsx
└── shared/
    ├── Plot.tsx
    ├── Slider.tsx
    └── InteractiveCalculator.tsx
```

Exported from `packages/widgets/index.ts` for use in MDX: `import { PolarPlot } from '@rfcn-space-handbook/widgets'`.

---

## Glossary & Citation Systems

### Glossary (Auto-Link at Build Time)

1. **Data:** `/data/glossary.json`
   ```json
   {
     "decibel": {
       "vi": "desi-bel",
       "en": "Decibel",
       "definition_vi": "...",
       "definition_en": "...",
       "relatedTerms": ["dB", "logarithmic scale"]
     }
   }
   ```

2. **Auto-linking plugin** (`packages/glossary/src/remark-plugin.ts`):
   - Remark plugin that walks MDX AST
   - First occurrence of any glossary term → wraps in `<GlossaryLink>`
   - Runtime: hover/tap → popover with definition, no page nav

3. **Build time:** No runtime cost. Links are static HTML.

### Citations (Structured Bibliography)

1. **Data:** `/data/citations.json`
   ```json
   {
     "3gpp-ts-23501-rel18": {
       "type": "standard",
       "issuer": "3GPP",
       "id": "TS 23.501",
       "version": "Rel-18, V18.5.0",
       "title": "System architecture for the 5G System",
       "url": "https://...",
       "verifiedAt": "2026-03-15"
     }
   }
   ```

2. **MDX usage:**
   ```jsx
   The SBA architecture <Cite cite="3gpp-ts-23501-rel18" /> defines...
   ```
   Renders as: `The SBA architecture [1] defines...` + bibliography at lesson end.

3. **Validation:** Build-time check ensures cited keys exist in DB.

---

## Search & Discoverability

### Pagefind

- **Build time:** Astro plugin generates search index from rendered HTML
- **Runtime:** JavaScript index bundle (~50KB) loads on search page
- **Features:**
  - Full-text search across all content
  - Vietnamese diacritic-insensitive matching ("anten" matches "ăng-ten")
  - Returns lesson title, snippet, domain/track tags
  - No backend, no analytics, privacy-by-default

### SEO

- **hreflang tags:** Each lesson includes self-link + alternate (EN ↔ VI)
- **sitemap.xml:** Auto-generated at build
- **Structured data:** Article schema (title, author, datePublished, etc.)
- **Open Graph:** Per-lesson meta tags (OG:title, OG:image, etc.)

---

## Build & Deploy Pipeline

### Local Build (pnpm)

```bash
pnpm install              # Install monorepo deps
pnpm build                # Builds all packages + web app
  ↓
  1. Validate frontmatter (Zod)
  2. i18n parity check (EN ↔ VI)
  3. Compile Mermaid → SVG
  4. Astro SSR (MDX → HTML + widget code-splitting)
  5. KaTeX → static math
  6. Remark plugins (glossary, citation collection)
  7. Pagefind index
  8. Output: apps/web/dist/

pnpm lint                 # ESLint 9 flat config
pnpm test                 # Unit tests (Vitest)
```

### CI/CD (GitHub Actions + Vercel)

**On PR:**
- Lint (ESLint, Prettier check)
- Validate (Zod schemas, citations exist, glossary consistency)
- Build (full static gen)
- Test (unit + E2E)
- Bundle budget (size-limit per widget, total HTML size)
- Accessibility (axe-core)
- Lighthouse (mobile performance gate: ≥90)
- Lychee (link check on changes)

**On merge to main:**
- Vercel webhook triggered
- Auto-builds production site
- Deploys to vercel.app CDN

**Nightly:**
- Full site link check (Lychee)
- Reports broken external links

### Vercel Deployment

**Config:** `vercel.json`
- Override build command: `pnpm build`
- Set environment: `ASTRO_SITE_URL=https://rfcn-space-handbook.vercel.app`
- Automatic preview for every PR
- Production: main branch

---

## Performance Targets (Enforced via CI)

| Metric | Target | Current |
|--------|--------|---------|
| Median lesson transferred size | ≤200KB | ~150KB (no widget) |
| LCP (large content paint, mobile) | <2.5s | ~1.8s (median) |
| Lighthouse mobile score | ≥90 | ≥92 |
| Widget chunk (max, gzipped) | ≤150KB | ~140KB (largest) |
| Time to interactive (TTI) | <3.5s | ~3.2s |

---

## Data & Configuration Files

| File | Purpose | Format | Single Source of Truth? |
|------|---------|--------|------------------------|
| `/data/glossary.json` | Term definitions EN/VI | JSON | Yes — build-time lookup + client-side |
| `/data/citations.json` | Citation database | JSON | Yes — validated at build, rendered via `<Cite>` |
| `/data/curriculum.json` | Curriculum graph (domains, tracks, units, lessons) | JSON | Yes — defines site nav, roadmap viz |
| `/content/*/.../*.mdx` | Lesson content | MDX + YAML frontmatter | Yes — primary source |
| `packages/ui/src/tokens.ts` | Design tokens (colors, fonts, spacing) | TS | Yes — exported to CSS vars + Tailwind config |
| `.github/workflows/*.yml` | CI/CD tasks | YAML | Yes — GitHub Actions source of truth |

---

## Key Deviations from Blueprint

| Aspect | Blueprint | Current | Reason |
|--------|-----------|---------|--------|
| **Deploy host** | Cloudflare Pages | Vercel | Better git-integrated preview + simpler auth-free setup |
| **Search** | Pagefind (same) | Pagefind | On-target |

---

## Observability & Monitoring

- **Build logs:** GitHub Actions visible per workflow run
- **Performance:** Lighthouse CI captures mobile perf scores per PR
- **Link health:** Nightly Lychee report flagged in issues
- **User analytics:** None by design (privacy-first; no PII tracking)
- **Errors:** Vercel error tracking (built-in)

---

## Future Extensibility Points

See `PLATFORM_BLUEPRINT.md` §8 (roadmap) for multi-year plan. Key architectural levers:

1. **New widget categories:** Add to `packages/widgets/src/components/[domain]/` + register in bundle budget
2. **New domains:** Add track/unit dirs in `/content/{vi,en}/[new-domain]/` + update `curriculum.json`
3. **User progress:** localStorage-based progress markers already in place; can be extended to IndexedDB if needed
4. **Community contributions:** Reviewer role already supported in frontmatter `authors` field
5. **PDF export:** "Build my own book" (Phase 3 roadmap item) can reuse rendered HTML + print stylesheet

---

See `PLATFORM_BLUEPRINT.md` for design decisions, content model rationale, and multi-year roadmap.
