# Project Changelog

All notable changes to RF·CN·Space are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Phase 1.1+ Content Authoring (In Progress)

- [ ] ~150 lessons authored (EN+VI parity)
- [ ] Cross-domain bridges: B1, B2, B3
- [ ] Glossary expansion to ~300 terms
- [ ] Public launch

---

## [1.1.0] — 2026-06-02

### Added — Phase 1.0 Mechanical Scaffolding

#### Curriculum Structure
- Full curriculum DAG with ~1,000 lesson IDs across 3 domains (RF, Core Network, Space)
- 34 tracks, ~150 units with Zod-validated schema
- Lesson ID convention: `{domain}-{track}-{unit-slug}-{order:02d}-{slug}`

#### Content Infrastructure
- 526 lesson stub MDX files (EN+VI pairs)
- `status: draft` frontmatter field for navigation exclusion
- Lesson stub generator tool (`tools/lesson-stub-generator/`)
- Extended frontmatter schema with status field

#### Visualization
- Per-domain SVG roadmap visualizer at `/{lang}/{domain}/`
- Pure CSS hover effects (no JS shipped)
- Full curriculum DAG rendered with track/unit/lesson hierarchy

#### Interactive Widgets (4 scaffolds)
- **LinkBudget** (RF domain) — link budget calculator scaffold
- **ModulationVisualizer** (RF domain) — constellation/eye diagram scaffold
- **FiveGCallFlow** (Network domain) — 5G call flow stepper scaffold
- **OrbitVisualizer** (Space domain) — orbital mechanics scaffold
- All widgets: experimental flag, placeholder math, smoke tests pass

#### Data Expansion
- Glossary: 52 bilingual terms (from 50 baseline)
- Citations: 20 verified standards + textbooks
  - IEEE 145-2013, 3GPP TS 23.501/23.502/23.503, TR 38.811
  - Pozar Microwave Engineering, etc.

#### Validation
- `pnpm validate:parity` confirms ~500+ parityIds matched
- `pnpm validate:frontmatter` passes on all ~1,000 files
- Build completes in <90s
- All tests green

### Changed

- Development roadmap updated to reflect Phase 1.0 completion

### Fixed

- N/A

---

## [1.0.0] — 2026-05-29

### Added — Phase 0 Platform Foundation

#### Platform & Build
- Monorepo scaffold (pnpm workspaces + Turborepo + TypeScript strict mode)
- Astro 5 app with i18n routing (`/en/`, `/vi/` URL prefixes)
- MDX content collections with Zod-validated frontmatter schema
  - Supports: `id`, `parityId`, `slug`, `lang`, `domain`, `track`, `unit`, `order`
  - Supports: `level`, `estimatedReadingMinutes`, `prerequisites`, `spiralRevisits`
  - Supports: `title`, `description`, `authors`, `publishedAt`, `lastVerified`, `lastReviewedAt`
  - Supports: `standards`, `widgets`, `tags`, `keywords`, `license`
- Bilingual routing with fallback logic (EN→VI or VI→EN if missing, with banner)
- Language switcher (preserves path hierarchy)

#### Workspace Packages (5)
- **@rfcn-space-handbook/widgets**: React island components
  - Initial: `PolarPlot` (D3-based, polar radiation pattern visualizer)
  - Bundle budget: ≤150KB gzipped per widget chunk
  - Hydration strategy: `client:visible` / `client:idle` directives
  
- **@rfcn-space-handbook/ui**: Design tokens + shared chrome
  - Colors: Teal #0b5351 (primary), amber, grays
  - Typography: Inter (body), IBM Plex Sans (headings), IBM Plex Mono (code)
  - Dark mode: OS-follow with manual override (CSP-compliant)
  - Print stylesheet for clean PDF output
  - Reduced motion support (`prefers-reduced-motion: reduce`)
  
- **@rfcn-space-handbook/glossary**: Auto-linking system
  - Remark plugin wraps first occurrence of glossary terms
  - Runtime lookup API for popover tooltips
  - No manual markup needed in MDX
  
- **@rfcn-space-handbook/citations**: Citation rendering & validation
  - `<Cite>` React component (renders `[n]` + collected bibliography at lesson end)
  - Build-time validation (cites keys must exist in `/data/citations.json`)
  - Supports: standards, textbooks, RFCs, conference papers (IEEE-ish format)
  
- **@rfcn-space-handbook/i18n**: i18n utilities
  - Locale detection from URL
  - Language switcher logic
  - Fallback language selection

#### Content & Data
- Pilot lesson: **Decibels** (RF R0 Foundations, L1)
  - Published in English + Vietnamese parity pair
  - Exercises full MDX pipeline: KaTeX math, PolarPlot widget, glossary auto-link, citations, license
  - Demonstrates: hook section, intuition section, mechanism section (with widget), apply section, bridge section
  
- Glossary database: `data/glossary.json`
  - 50+ bilingual terms seeded (decibel, antenna, gain, dB, dBm, etc.)
  - Supports: term, definition, related terms, domain tags
  
- Citations database: `data/citations.json`
  - 30+ entries seeded (IEEE standards, textbooks, RFCs)
  - Supports: standards (3GPP, IEEE, ITU-R, ECSS, IETF), textbooks (Pozar, Vallado, Stallings, Tanenbaum), RFCs
  - Includes: title, authors, version, URL, verification date
  
- Curriculum structure: `data/curriculum.json`
  - Domain skeleton: RF, Core Network, Space
  - Track stubs: R0–R9, N0–N9, S0–S10
  - Unit metadata: title, description, ordering
  - Foundation for roadmap visualizer (Phase 1)

#### Build & Validation Tools
- `tools/i18n-parity-check`: Enforces EN/VI parity
  - Fails build if `parityId` exists in one language but not the other
  - Prevents accidental single-language lesson publication
  
- `tools/frontmatter-validator`: Zod schema validation
  - Enforces required fields: `id`, `parityId`, `slug`, `lang`, `domain`, `track`, `unit`, `order`, `level`, `title`, `license`
  - Type checks: `level` ∈ {L0–L5}, `lang` ∈ {en, vi}, `domain` ∈ {rf, core-network, space}
  - Fails build if invalid
  
- `tools/diagram-build`: Mermaid → SVG pipeline
  - mermaid-cli compiles .mmd files to SVG
  - SVGO minimizes output
  - Supports: flowcharts, sequence diagrams, state diagrams, class diagrams
  
- `tools/content-lint`: Custom MDX linting (future expansion point)
  - Placeholder for: no hardcoded citation keys, require figcaptions for images, warn on unsupported widgets

#### CI/CD & Quality Gates
- GitHub Actions workflows:
  - `ci.yml`: PR gate — lint (ESLint 9 flat) → validate → build → test (Vitest) → bundle-budget (size-limit) → a11y (axe-core) → Lighthouse
  - `deploy.yml`: Merge gate — Vercel preview + production deploys
  - `nightly-link-check.yml`: Lychee link checker (broken external/internal links reported as issues)
  
- Linting: ESLint 9 flat config, Prettier auto-format gate
  - Enforces: strict TypeScript, no console.log, prefer const, no var
  - React rules: exhaustive dependencies, a11y warnings
  
- Bundle budgets: `packages/widgets/.size-limit.json`
  - PolarPlot: ≤150KB gzipped
  - Total widget JS: ≤500KB gzipped (across all lessons)
  
- Performance gates:
  - Lighthouse mobile: ≥90 score on median lesson (no widget)
  - LCP (large content paint): <2.5s
  - Total page size: ≤200KB transferred (no widget)
  
- Accessibility gate: axe-core WCAG 2.2 AA checks
  - Auto-fail if violations found

#### Deployment
- Vercel integration
  - Git-connected: preview on PR, production on merge
  - `vercel.json` override build command to `pnpm build`
  - Environment: `ASTRO_SITE_URL`
  - CDN + serverless function support (for future features)
  
- Note: Blueprint specified Cloudflare Pages; deviation to Vercel for superior git-integrated preview workflow

#### Documentation
- `docs/PLATFORM_BLUEPRINT.md`: Locked architectural frame (canonical source)
- `README.md`: Quick start, contributor guidelines, tech stack overview
- Lesson authoring guide: "How to write a lesson" (frontmatter, structure, widgets, glossary, citations)
- Contributor guide: commit conventions, branching strategy, PR process

#### Performance & Metrics (Phase 0 Exit)
- Lighthouse mobile: 92 (decibels lesson, no widget overhead)
- LCP: ~1.8s (median, mid-tier Android 4G)
- Total transferred: ~120KB (decibels lesson)
- i18n parity: 100% (EN + VI shipped together)
- Build time: <2 minutes (full rebuild)
- Search index: Pagefind pre-built, Vietnamese diacritics working

#### Design & Accessibility
- Base color palette: Teal primary, amber accent, neutral grays
- Typography: Inter (16px base, responsive scaling), IBM Plex Mono (code blocks, `pre` elements)
- Dark mode: Follows OS preference by default, manual toggle via script (CSP-compliant)
- Print: Light background, dark text, no dark mode in print media, responsive font scaling
- Reduced motion: All animations pause if `prefers-reduced-motion: reduce` set
- Focus management: All interactive elements keyboard-navigable, visible focus indicators
- ARIA labels: KaTeX auto-labels math; all widgets have aria-label or aria-labelledby

#### Standards & Compliance
- Bilingual parity: 100% (every lesson EN + VI)
- Content license: CC-BY-SA-4.0 (all lessons)
- Standards baseline: Lessons track 3GPP, IEEE, ITU-R, ECSS versions via `standards` frontmatter array
- Code license: MIT (for implementation; proprietary for content)

### Changed

- N/A (initial release)

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A

---

## Future Releases (Planned)

### Phase 1 (Months 2–6)
- 150 lessons total (~50 per domain), full bilingual parity
- Five flagship widgets shipped
- B1 cross-domain bridge (antenna → base station)
- Glossary: 300 terms, Citations: 300 entries
- Public launch

### Phase 2 (Months 6–18)
- 400 lessons total (150 Phase 1 + 250 Phase 2)
- L3–L4 depth reached
- All three domain bridges (B1, B2, B3)
- 20 interactive widgets
- External contributor recognition
- Backlinks from ≥5 universities/telcos/space orgs

### Phase 3 (Months 18–30)
- 700 lessons total
- L4–L5 frontier content (6G, NTN, NewSpace)
- Guest-authored units
- Quarterly standards-refresh sprints
- PDF export feature ("Build my own book")
- Cited in ≥5 academic theses

### Phase 4 (Month 30+)
- Steady-state maintenance
- Annual track-by-track refresh
- Community contributions (curated)
- Quarterly standards updates
- Optional community feedback layer

---

## Glossary of Terms & Abbreviations

| Term | Meaning |
|------|---------|
| parityId | Identifier binding EN + VI lesson pair together |
| L0–L5 | Learning level (beginner SWE → research frontier) |
| R0–R10 | RF domain track IDs |
| N0–N10 | Core Network domain track IDs |
| S0–S11 | Space domain track IDs |
| B1, B2, B3 | Cross-domain bridge lessons |
| MDX | Markdown with embedded JSX (React components) |
| Zod | TypeScript schema validation library |
| Remark | Markdown AST plugin system |
| KaTeX | Math rendering (LaTeX subset) |
| Mermaid | Diagram-as-code (flowcharts, sequences, etc.) |
| Pagefind | Client-side full-text search indexing |
| Astro | Meta-framework for static + hydrated content |
| Turborepo | Monorepo task orchestration + caching |
| pnpm | Package manager with workspace support |
| i18n | Internationalization (multi-language support) |
| CI/CD | Continuous integration / continuous deployment |
| WCAG 2.2 AA | Web Content Accessibility Guidelines level AA |
| CSP | Content Security Policy (no inline scripts) |
| LCP | Largest Contentful Paint (Core Web Vitals metric) |
| CLS | Cumulative Layout Shift (Core Web Vitals metric) |

---

## Version History

| Version | Release Date | Phase | Key Milestone |
|---------|--------------|-------|--------------|
| 1.0.0 | 2026-05-29 | 0 | Platform foundation shipped, pilot lesson validated |
| 1.1.0 | TBD (Phase 1) | 1 | 150 lessons, first public launch |
| 2.0.0 | TBD (Phase 2) | 2 | 400 lessons, working engineer daily reference |
| 3.0.0 | TBD (Phase 3) | 3 | 700 lessons, authoritative platform |
| 4.0.0+ | TBD (Phase 4) | 4 | Steady-state maintenance & community |

---

## How to Contribute to This Changelog

- Add an entry under `[Unreleased]` when opening a PR (describe the change)
- On release, move `[Unreleased]` to a dated version section (follow [Keep a Changelog](https://keepachangelog.com/) format)
- Use clear language: describe the *user-facing* change, not the implementation detail
- Do NOT reference plan phases, finding codes, or audit labels — explain the *why*

---

## Contact & Feedback

- Issues: https://github.com/rfcn-space/rfcn-space-handbook/issues
- Discussions: (TBD: GitHub Discussions or community forum)
- Email: tindang.ht97@gmail.com

See `docs/PLATFORM_BLUEPRINT.md` for full product vision and multi-year strategy.
