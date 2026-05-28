# RF·CN·Space Codebase Summary

**Project:** Bilingual (EN/VI) open handbook for RF, core network, and space engineering.

**Built with:** Astro 5, React islands, TypeScript, Tailwind CSS, pnpm + Turborepo monorepo.

---

## Tech Stack at a Glance

| Layer | Tech | Purpose |
|-------|------|---------|
| **Content** | MDX + Zod-validated frontmatter | Lesson authoring with live React widgets |
| **App** | Astro 5 + React | Multi-page app with content collections + hydrated widget islands |
| **Styling** | Tailwind CSS v4 + design tokens | Dark mode, reduced-motion, print stylesheets |
| **Math** | KaTeX SSR | Inline and display math rendering |
| **Diagrams** | Mermaid (build-time), SVG | Flowcharts, sequences, architecture diagrams |
| **Search** | Pagefind | Client-side full-text search, Vietnamese diacritic-insensitive |
| **Glossary** | Auto-link remark plugin | First occurrence of glossary terms auto-link with popovers |
| **Citations** | Custom `<Cite>` component + JSON DB | Structured bibliography, IEEE-ish format |
| **Build** | Turborepo + pnpm | Monorepo task orchestration, caching |
| **CI/CD** | GitHub Actions | Lint, validate, build, test, bundle budget, Lighthouse, link check |
| **Deploy** | Vercel | Git-integrated preview + production deploys |

---

## Repository Layout

```
.
├── apps/web/                       # Astro app (the main site)
│   ├── src/
│   │   ├── components/             # Reusable Astro + React components
│   │   ├── content/                # Astro content collections config
│   │   ├── layouts/                # Page layout templates
│   │   ├── lib/                    # Utilities (i18n, formatting, etc.)
│   │   ├── pages/                  # Astro file-based routing
│   │   │   └── [lang]/
│   │   │       └── [domain]/       # Dynamic content routes
│   │   └── styles/                 # Global styles, tokens
│   ├── astro.config.ts
│   └── package.json
│
├── packages/
│   ├── widgets/                    # React widget components (island code)
│   │   ├── src/components/
│   │   │   ├── rf/                 # RF domain widgets (PolarPlot, etc.)
│   │   │   ├── core-network/       # Core network widgets
│   │   │   ├── space/              # Space widgets (OrbitVisualizer, etc.)
│   │   │   └── shared/             # Shared (Plot, Slider, etc.)
│   │   ├── .size-limit.json        # Bundle budget per widget
│   │   └── package.json
│   ├── ui/                         # Design tokens, shared chrome components
│   │   ├── src/
│   │   │   ├── tokens.ts           # Color, typography, spacing
│   │   │   ├── components/         # Header, footer, nav
│   │   │   └── styles/
│   │   └── package.json
│   ├── glossary/                   # Glossary lookup + remark auto-link plugin
│   │   ├── src/
│   │   │   ├── index.ts            # Lookup API
│   │   │   └── remark-plugin.ts    # Auto-links glossary terms
│   │   └── package.json
│   ├── citations/                  # Citation rendering + build-time validation
│   │   ├── src/
│   │   │   ├── Cite.tsx            # React component for inline citations
│   │   │   └── validate.ts         # Build-time citation DB check
│   │   └── package.json
│   └── i18n/                       # Translation + fallback utilities
│       ├── src/
│       │   ├── index.ts            # Locale detection, language switching
│       │   └── fallback.ts         # Fallback logic (EN if VI missing)
│       └── package.json
│
├── content/                        # All lesson MDX + metadata (NO code)
│   ├── vi/                         # Vietnamese lessons
│   │   ├── rf/                     # RF domain
│   │   │   ├── _track.json         # Track metadata
│   │   │   ├── r0-foundations/     # Unit directory
│   │   │   │   ├── _unit.json      # Unit metadata
│   │   │   │   ├── 01-*.mdx        # Lessons
│   │   │   │   └── ...
│   │   │   ├── r1-transmission-lines/
│   │   │   └── ...
│   │   ├── core-network/
│   │   └── space/
│   └── en/                         # English (mirror structure)
│       ├── rf/
│       ├── core-network/
│       └── space/
│
├── data/                           # Structured data (single source of truth)
│   ├── glossary.json               # Term definitions in VI + EN
│   ├── citations.json              # Citation database (standards, textbooks, etc.)
│   ├── curriculum.json             # Full curriculum graph (domains, tracks, units, lessons)
│   └── prerequisites.json          # Cross-lesson prerequisite graph (optional)
│
├── diagrams/                       # Diagram sources (Mermaid, SVG, Blender, etc.)
│   ├── vi/                         # Vietnamese diagram assets
│   └── en/                         # English diagram assets
│
├── tools/                          # Build + validation scripts
│   ├── content-lint/               # Custom MDX linter
│   ├── frontmatter-validator/      # Zod schema validation
│   ├── diagram-build/              # Mermaid compile, SVG optimize
│   └── i18n-parity-check/          # Enforce EN/VI parity
│
├── .github/workflows/
│   ├── ci.yml                      # Lint, validate, build, test
│   ├── deploy.yml                  # Vercel deploy on merge
│   └── nightly-link-check.yml      # Lychee link checker
│
├── pnpm-workspace.yaml             # Monorepo workspace config
├── turbo.json                      # Build task orchestration
├── tsconfig.base.json              # Base TypeScript config
├── vercel.json                     # Vercel deployment config
├── lighthouserc.json               # Lighthouse CI config
├── package.json
└── README.md
```

---

## Where to Find Things

### Lesson Template & Frontmatter Schema
- **Example lesson:** `/content/en/rf/r0-foundations/01-decibels.mdx`
- **Frontmatter spec:** See `PLATFORM_BLUEPRINT.md` §3.3 — defines `id`, `parityId`, `level`, `prerequisites`, `widgets`, etc.
- **Validation:** Astro content collections schema (TypeScript-first) in `apps/web/src/content/config.ts`

### Glossary System
- **Data:** `/data/glossary.json` (bilingual term definitions)
- **Auto-linking:** `packages/glossary/src/remark-plugin.ts` — remark plugin that wraps first occurrence of glossary terms in MDX
- **Runtime lookup:** `packages/glossary/src/index.ts` — exported for use in React components

### Citations Database
- **Data:** `/data/citations.json` (IEEE-ish format, structured by cite key)
- **Component:** `packages/citations/src/Cite.tsx` — renders inline `<Cite cite="3gpp-ts-23501-rel18" />` → `[1]` + bibliography at end
- **Validation:** `packages/citations/src/validate.ts` runs at build time to ensure cited keys exist

### Design Tokens
- **File:** `packages/ui/src/tokens.ts` — color palette, typography (Inter + IBM Plex Sans), spacing, breakpoints
- **Usage:** Exported as CSS custom properties and/or Tailwind config
- **Dark mode:** OS-follow by default + manual override via CSP-compliant script
- **Print:** Separate stylesheet handles print-friendly styles (no dark bg, readable fonts)

### Widget System
- **Directory:** `packages/widgets/src/components/`
- **Import in lessons:** `import { PolarPlot } from '@rfcn-space-handbook/widgets';`
- **Hydration:** Use `client:visible` (lazy hydrate on scroll) or `client:idle` (after main thread idle)
- **Bundle budgets:** `packages/widgets/.size-limit.json` enforces ≤150KB gzipped per widget chunk
- **Categories:**
  - **RF widgets:** PolarPlot (D3), AntennaPattern3D (Three.js)
  - **Space widgets:** OrbitVisualizer (Three.js), GroundTrack
  - **Network widgets:** ProtocolSequence, CallFlowStepper
  - **Shared:** Plot, Slider, InteractiveCalculator

### Build & Validation Tools
- **i18n parity check:** `tools/i18n-parity-check/` — CI enforces every lesson in `vi/` has a `parityId` match in `en/`
- **Frontmatter validator:** `tools/frontmatter-validator/` — Zod schema ensures all required MDX frontmatter fields exist + valid types
- **Diagram build:** `tools/diagram-build/` — Mermaid → SVG compile + SVGO minimize
- **Content lint:** `tools/content-lint/` — Custom rules (e.g., no hardcoded citations, require figcaptions)

### CI/CD Pipeline
- **GitHub Actions:** `.github/workflows/`
  - `ci.yml` — runs on every PR: lint → validate → build → test → bundle budget → axe-core (a11y) → Lighthouse
  - `deploy.yml` — on merge to main: Vercel deploy (preview + production)
  - `nightly-link-check.yml` — Lychee link checker for broken internal/external links
- **Vercel config:** `vercel.json` — override build command, set environment variables

### i18n System
- **Utils:** `packages/i18n/src/`
  - Locale detection from URL (e.g., `/en/`, `/vi/`)
  - Language switcher (preserves path, swaps lang prefix)
  - Fallback: if lesson not translated, show EN original with banner
- **Content routing:** `apps/web/src/pages/[lang]/[domain]/...` — Astro dynamic routes

---

## Key Architectural Decisions

See `PLATFORM_BLUEPRINT.md` for the full reasoning. Highlights:

1. **Content = code repo, not separate CMS.** MDX + JSON colocated. Editorial PRs are reviewable; no external dependencies.
2. **Astro islands, not full hydration.** Default zero JS; `client:visible` for most widgets; strict per-widget bundle budgets.
3. **parityId binding.** Every lesson ID binds EN+VI versions together, verified at build time.
4. **Glossary auto-link at build time.** First occurrence of any glossary term auto-wraps; no runtime Ctrl+F needed.
5. **Vercel, not Cloudflare Pages.** (Note: blueprint specified Cloudflare; deviation for deploy hosting choice.)

---

## Quick Start for Contributors

1. **Adding a lesson:** Copy `/content/en/rf/r0-foundations/01-decibels.mdx` as a template. Fill frontmatter. Write MDX.
2. **Pairing in VI:** Create matching `.mdx` in `/content/vi/rf/r0-foundations/0X-*.mdx` with same `parityId`.
3. **Run parity check:** `pnpm i18n-parity-check` — ensures both languages exist.
4. **Add glossary terms:** Edit `/data/glossary.json`, they auto-link on rebuild.
5. **Add citations:** Edit `/data/citations.json`, use `<Cite cite="key" />` in lesson.
6. **Commit:** `git commit -m "lesson: add decibels in RF R0"`
7. **Build locally:** `pnpm build`
8. **Preview:** Push PR, Vercel preview link auto-generates.

---

## Standards Compliance

- **Bilingual parity:** 100% — every lesson ships in both languages.
- **Accessibility:** WCAG 2.2 AA target (axe-core CI gate).
- **Performance:** Median lesson ≤200KB, LCP <2.5s mobile (Lighthouse CI).
- **SEO:** hreflang tags, sitemap.xml, structured data (Article schema).

---

See `PLATFORM_BLUEPRINT.md` for deep dives on content model, widget architecture, curriculum design, and multi-year roadmap.
