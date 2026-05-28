# RF · Core Network · Space — Bilingual Open Learning Platform
### Architecture Blueprint, PRD, Curriculum & Multi-Year Roadmap

> **Author voice for content:** veteran RF / Core Network / Space engineer (20+ YoE) writing for SEA learners in Vietnamese & English.
> **Author voice for this document:** Tech Lead writing for the platform builder (Tindang).
> **Status:** Locked architectural frame at ~96% confidence. Open items are design choices within the frame, not architectural unknowns — they are flagged in §10.

---

## 0. Executive Summary

We are building **a bilingual (Vietnamese + English), open-and-free, deeply-written technical handbook** that teaches RF Engineering, Core Network Architecture, and Space Engineering across a level-tiered curriculum spanning beginner SWE through to research frontier (6G, NTN, NewSpace).

**Strategic positioning:** MDN-for-radio-and-space, written natively in Vietnamese alongside English. The competitive moat is *not* the existence of the content (English equivalents exist) — it is the **Vietnamese-language fidelity at engineering depth**, the **unified treatment of three domains that elsewhere live in disconnected silos**, and the **handbook density** (deep, citable, durable) instead of video-bootcamp ephemerality.

**Technical shape:** Astro 5 (multi-page application, content collections) + React islands for interactive widgets + Pagefind for client-side search + Cloudflare Pages for hosting. Content is colocated with code in a monorepo as `.mdx` and `.json`. No backend, no database, no auth, no payments at launch. The widget layer is the only meaningful engineering surface — everything else is JAMstack discipline.

**The dominant risk** is not technical. It is **author throughput**. The architecture must make writing 800–1,400 lessons feasible over a multi-year horizon while remaining production-quality from day one. Every architectural decision in this document is filtered through that lens.

---

## 1. Product Requirements (PRD)

### 1.1 Vision

> A Vietnamese & English open handbook for radio, network, and space engineering — at the depth a working engineer trusts, written in the language a SEA engineer thinks in.

### 1.2 Mission Statement

For Vietnamese-speaking software engineers, telecom engineers, students, and career-changers who want to learn RF, core network architecture, or space engineering at *engineering depth*, this platform provides the only natively bilingual, free, durable, deeply-cited handbook with interactive simulators baked into the docs themselves. Unlike Coursera, NPTEL, 3GPP Academy, or Stanford OCW (English-only, fragmented, often gated, often shallow on practical implementation), we publish a unified handbook in Vietnamese first-class.

### 1.3 Problem Statement

1. **The Vietnamese technical-language vacuum.** Engineering students and working engineers in Vietnam (and SEA broadly) study globally relevant 5G, satellite, and RF material — but virtually all rigorous learning sources are English. The cognitive overhead of translation while learning is enormous and a known retention killer.
2. **The siloed-domain problem.** RF, core network, and space-comms are taught as three separate disciplines in three separate corners of the internet, despite the fact that an end-to-end engineer (especially in the NTN / satellite-5G era) needs all three. There is no single resource that traces a signal from an antenna through the air interface through the core network through to a LEO satellite and back.
3. **The depth-vs-accessibility false dichotomy.** Existing resources are either too shallow (YouTube explainers, Medium posts) or too deep without on-ramps (3GPP specs, IEEE papers, Pozar). There is no tiered handbook that takes a curious SWE from "what is a base station?" to "design the link budget for a Ka-band downlink from a 550 km LEO."
4. **The interactivity gap.** Engineering concepts are spatial and dynamic (radiation patterns, orbital mechanics, beamforming geometry, protocol exchanges). They are taught with static diagrams in PDFs from 1998. We can do better with in-doc interactive widgets — and *we are not the first to know this* (Distill.pub, Bartosz Ciechanowski, 3Blue1Brown showed the way), but it has not been done for our domains.

### 1.4 Target Users (Personas)

**P1 — Khôi, the curious backend SWE (L0–L2)**
- 3 years professional Python/Go experience, no formal RF/networking education beyond university OSI model
- Wants to understand "how does my video call actually reach the other side?" deeply
- Will *bounce immediately* if the first lesson opens with Maxwell's equations
- Reads on his phone on the commute; uses laptop for serious sessions
- Bilingual but more fluent in Vietnamese

**P2 — Linh, the telecom engineer specializing (L2–L4)**
- 7 years at a Vietnamese telco operator, works on RAN/transport
- Knows 4G EPC well, wants to deeply understand 5G SBA + cloud-native core + O-RAN
- Will use the platform as a daily reference, not a course
- Will *judge the platform on the accuracy of one 3GPP citation* — if she finds one wrong release number, she leaves and tells colleagues
- Mostly reads in English for precision, prefers Vietnamese for conceptual sections

**P3 — Dr. Tuấn, the academic researcher / faculty (L4–L5)**
- Vietnamese university lecturer, supervises masters students in wireless or aerospace
- Wants something he can *assign as supplementary reading* in Vietnamese
- Cares about citation rigor, math correctness, version stamps
- Will become an evangelist if we get the rigor right; will publicly call us out if we don't

These three drive every editorial and UX decision. If a decision is good for one and bad for another, we resolve the conflict explicitly rather than averaging it away.

### 1.5 Non-Goals (Explicit Anti-Scope)

To prevent scope drift, we are explicit about what we are **not** building:

- **NOT a MOOC.** No videos, no cohorts, no live sessions, no calendars, no instructor model.
- **NOT a credentialing body.** No certificates, no exams, no proctoring.
- **NOT a marketplace.** No paid courses, no instructor revenue share, no UGC at launch.
- **NOT a community platform.** No forums, no chat, no profiles, no comments at launch. (Feedback flows through GitHub Issues only.)
- **NOT a code-running environment.** No JupyterHub, no in-browser Linux, no Docker labs. External hardware/lab guidance is *content*, not platform feature.
- **NOT a research repository.** We synthesize known engineering; we do not publish original research.
- **NOT a service that stores user data.** No accounts, no analytics with PII, no tracking beyond privacy-respecting aggregate.

### 1.6 Success Metrics

Because there is no paid funnel, we measure pedagogical and authority signals.

| Tier | Metric | Year-1 Target | Year-3 Target |
|------|--------|---------------|---------------|
| Reach | Monthly unique readers | 5K | 100K |
| Reach | Vietnamese share of traffic | ≥40% | ≥35% (English globalization expected) |
| Depth | Avg session depth (pages/session) | ≥3 | ≥4 |
| Depth | Returning readers within 30d | ≥25% | ≥35% |
| Authority | External backlinks from .edu, .gov, telco/aerospace orgs | 20 | 200 |
| Authority | Lessons cited in Vietnamese academic theses (via Google Scholar) | 5 | 50 |
| Content | Lessons published | 150 | 800 |
| Content | Lessons reviewed/refreshed in last 12 months | 100% | 80% |
| Engineering | Lighthouse perf (median lesson, mobile) | ≥90 | ≥90 |
| Engineering | LCP (median, mobile) | <2.5s | <2.0s |
| Engineering | Bilingual parity (lessons available in both VN and EN) | 100% | 100% |

Note: the bilingual parity requirement is **non-negotiable at the lesson level**. We do not ship a lesson in one language; both ship together. This shapes the authoring workflow significantly (§3.5, §6).

---

## 2. Functional & Non-Functional Requirements

### 2.1 Functional Requirements

**FR-01 Content rendering.** Render MDX content with embedded React components (widgets), KaTeX math, mermaid diagrams, SVG, code blocks with syntax highlighting, callouts, footnotes, and cross-references.

**FR-02 Multi-level navigation.**
- Domain → Track → Unit → Lesson hierarchy
- Cross-domain bridges (e.g., satcom link budgets appears under both RF and Space)
- "You are here" breadcrumbs
- Next/prev lesson within a unit
- Visual roadmap per domain (SVG, with current-position highlighting if reader has progress markers in localStorage)

**FR-03 Bilingual routing.** Every lesson lives at `/vi/...` and `/en/...`. Language switcher preserves position. Hreflang tags for SEO. Untranslated content falls back to the other language with an explicit banner ("This page is not yet available in Vietnamese — showing English original").

**FR-04 Full-text search.** Pagefind-indexed search across all content. Search supports Vietnamese diacritics + diacritic-insensitive matching ("anten" matches "ăng-ten"), English, and mixed-language queries. Returns lesson title, snippet, domain/track tags.

**FR-05 Glossary & acronym system.** A central glossary (JSON-sourced) with terms in both languages. First occurrence of any glossary term in any lesson auto-links to the glossary entry. Hover/tap reveals a definition popover without leaving the page.

**FR-06 Citation system.** Every standards reference uses a structured `<Cite>` component that renders as inline footnote + auto-collected bibliography at lesson end. Citation database is a JSON file. Format follows IEEE-ish convention adapted for web.

**FR-07 Interactive widget library.** Registered React components callable from MDX with props. Categories:
- Math/plot widgets (Plotly-like, lightweight)
- Signal/spectrum visualizers (Web Audio API for live, Canvas for plotted)
- Antenna pattern visualizer (Three.js, 3D)
- Orbital mechanics visualizer (Three.js, time-controllable)
- Protocol sequence diagrams (interactive mermaid sequence or custom React)
- Link budget calculator
- 5G call-flow stepper

**FR-08 Code examples & syntax highlighting.** Shiki for highlighting (since Astro ships with it). Supports Python, Rust, C, MATLAB, Verilog, YAML, JSON, shell.

**FR-09 Progress markers (localStorage only).** Each lesson has an implicit "visited" marker. Users can manually mark "mastered". Stored in localStorage; cleared on browser reset. No server-side sync, no account. Visible on roadmap visualizations.

**FR-10 Print/export.** Each lesson and each unit are printable as a clean PDF via browser print stylesheet. Eventually a generated "build my own book" feature can bundle selected units.

**FR-11 Versioning of standards.** Lesson frontmatter includes `standards: [{id: "3GPP TS 23.501", release: "Rel-18", lastVerified: "2026-03-15"}]`. Rendered as a "Standards baseline" banner so readers know what 3GPP release we are tracking.

**FR-12 Feedback channel.** Every lesson has a footer "Found an error? Open an issue on GitHub" deep link pre-populated with lesson path.

**FR-13 RSS / sitemap.** RSS feed per domain, full sitemap.xml, structured data (Article schema) for SEO.

### 2.2 Non-Functional Requirements

**NFR-01 Performance.**
- Median lesson page (no widget) ≤ 200KB transferred, LCP < 1.5s on mid-tier Android over 4G
- Widget-heavy lesson page ≤ 800KB transferred initial, LCP < 2.5s, widget hydrates after main content
- Strict per-widget bundle budget: any single widget chunk ≤ 150KB gzipped

**NFR-02 Accessibility.**
- WCAG 2.2 AA target
- All math has aria-labels (KaTeX option enabled)
- All diagrams have text descriptions in `<figcaption>` or `<desc>`
- All interactive widgets keyboard-navigable
- Color contrast ≥ 4.5:1
- Reduced-motion respected (Three.js scenes pause animation)

**NFR-03 i18n parity.**
- 100% of published lessons exist in both VN and EN
- Glossary, navigation chrome, error messages, UI components fully translated
- Right-to-left not required (no RTL languages in scope)

**NFR-04 SEO.**
- Server-rendered HTML (Astro SSG)
- Per-locale `<link rel="alternate" hreflang>`
- Structured data: Article, BreadcrumbList, EducationalOccupationalProgram
- Canonical URLs, no dupes between VN/EN
- llms.txt and llms-full.txt published for LLM crawlers

**NFR-05 Sustainability.**
- Static hosting cost trivial at scale (Cloudflare Pages free tier covers most projections)
- Carbon estimate: <0.2g CO2eq per page view (Astro SSG + Cloudflare)

**NFR-06 Privacy.**
- No cookies except essential
- No third-party analytics with PII (Plausible self-hosted, Cloudflare Web Analytics, or similar privacy-respecting tool)
- No tracking pixels, no fingerprinting

**NFR-07 Maintainability.**
- All content in a single Git repo, plain MDX files
- Any contributor with Markdown skill can edit (no proprietary CMS lock-in)
- Schema-validated frontmatter (Zod via Astro content collections)
- Broken-link CI check on every PR
- Diagram source files (`.mmd`, `.svg`, `.glb`, source notebooks) stored alongside compiled output

**NFR-08 Browser support.**
- Last 2 versions of Chrome, Safari, Firefox, Edge
- iOS Safari 16+, Chrome Android 110+
- No IE, no legacy Edge

**NFR-09 Build performance.**
- Full site build (1,000+ lessons) under 5 min on CI
- Incremental dev rebuild < 500ms per file change

### 2.3 Content Authoring Requirements

**CAR-01** Every lesson uses the same MDX frontmatter schema (§3.3) — non-conformance fails CI.

**CAR-02** Every lesson has the same internal structure (§4.2 lesson template) — enforced by editorial review, not CI (some lessons legitimately deviate).

**CAR-03** Every claim about a standard must cite that standard, with TS/TR/IEEE number + release/year.

**CAR-04** Every diagram has a source-of-truth file checked into the repo. No "diagram from PowerPoint" with no source.

**CAR-05** Every interactive widget is a tested React component (Vitest), not ad-hoc inline code.

**CAR-06** Every Vietnamese lesson is reviewed by a Vietnamese-native engineer for terminology consistency (this is a process requirement, not platform feature). A glossary-locked terminology list is maintained.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     READER (Browser)                         │
│                                                              │
│   Static HTML (SSG'd MDX)  +  Hydrated React Islands        │
│   - KaTeX rendered server-side                              │
│   - Mermaid rendered server-side (mermaid-cli pre-build)    │
│   - SVG inlined                                              │
│   - Three.js / D3 / custom widgets hydrate on idle/visible  │
│   - localStorage for progress markers                       │
│   - Pagefind WASM for search                                │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │  Static assets over HTTPS
                            │
┌─────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE PAGES (CDN)                      │
│   - Global edge cache                                        │
│   - HTTP/3, Brotli, image resizing                          │
│   - Web Analytics (privacy-respecting)                      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │  git push → build trigger
                            │
┌─────────────────────────────────────────────────────────────┐
│                   BUILD PIPELINE (CI)                        │
│   GitHub Actions:                                            │
│     1. Lint MDX, validate frontmatter schema                │
│     2. Run mermaid-cli to pre-render diagrams to SVG        │
│     3. Run Vitest on widget components                      │
│     4. Astro build (SSG) → dist/                            │
│     5. Pagefind index → dist/pagefind/                      │
│     6. Lighthouse-CI smoke test on sampled pages            │
│     7. Broken-link check                                     │
│     8. Deploy to Cloudflare Pages                           │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│              SOURCE REPOSITORY (GitHub, monorepo)            │
│                                                              │
│   /apps/web              Astro app                          │
│   /packages/widgets      React widget library               │
│   /packages/ui           Shared UI components               │
│   /content/vi/...        Vietnamese MDX lessons             │
│   /content/en/...        English MDX lessons                │
│   /data/glossary.json    Glossary                           │
│   /data/citations.json   Citations DB                       │
│   /data/curriculum.json  Curriculum graph                   │
│   /diagrams/...          Diagram source files               │
└─────────────────────────────────────────────────────────────┘
```

There is **no backend**, **no database**, **no auth server**, **no message broker**, **no microservice**. This is intentional and durable; it is also the only way the project survives multi-year content authoring without bleeding maintenance time into ops.

### 3.2 Repository Structure (Monorepo)

We use **pnpm workspaces + Turborepo** (or Nx — either fine; pnpm+Turbo is lighter).

```
rfcn-space-handbook/                # working name; rename freely
├── apps/
│   └── web/                        # Astro 5 site
│       ├── astro.config.mjs
│       ├── src/
│       │   ├── content/
│       │   │   └── config.ts       # Zod content collections schema
│       │   ├── components/         # Astro components (chrome, nav, footer)
│       │   ├── layouts/            # Page layouts
│       │   ├── pages/
│       │   │   ├── index.astro
│       │   │   ├── [lang]/
│       │   │   │   ├── index.astro
│       │   │   │   ├── rf/[...slug].astro
│       │   │   │   ├── core-network/[...slug].astro
│       │   │   │   └── space/[...slug].astro
│       │   ├── styles/
│       │   └── lib/
│       └── public/
├── packages/
│   ├── widgets/                    # React interactive components
│   │   ├── src/
│   │   │   ├── rf/
│   │   │   │   ├── AntennaPattern3D.tsx
│   │   │   │   ├── LinkBudget.tsx
│   │   │   │   ├── ModulationVisualizer.tsx
│   │   │   │   └── ...
│   │   │   ├── network/
│   │   │   │   ├── FiveGCallFlow.tsx
│   │   │   │   ├── ProtocolSequence.tsx
│   │   │   │   └── ...
│   │   │   ├── space/
│   │   │   │   ├── OrbitVisualizer.tsx
│   │   │   │   ├── GroundTrack.tsx
│   │   │   │   ├── DeltaVPlanner.tsx
│   │   │   │   └── ...
│   │   │   └── shared/
│   │   │       ├── Plot.tsx
│   │   │       ├── Slider.tsx
│   │   │       └── ...
│   │   └── package.json
│   ├── ui/                         # Shared chrome components (Astro + React)
│   ├── glossary/                   # Glossary lookup & link transformer
│   ├── citations/                  # Citation rendering & validation
│   └── i18n/                       # Translation utilities, fallback logic
├── content/
│   ├── vi/
│   │   ├── rf/
│   │   │   ├── _track.json
│   │   │   ├── r0-foundations/
│   │   │   │   ├── _unit.json
│   │   │   │   ├── 01-vector-calculus-intuition.mdx
│   │   │   │   ├── 02-complex-numbers-for-rf.mdx
│   │   │   │   └── ...
│   │   │   ├── r1-transmission-lines/
│   │   │   └── ...
│   │   ├── core-network/
│   │   │   └── n0-networking-foundations/
│   │   │       └── ...
│   │   └── space/
│   │       └── s0-foundations/
│   │           └── ...
│   └── en/
│       └── (mirror structure)
├── data/
│   ├── glossary.json
│   ├── citations.json
│   ├── curriculum.json             # the full taxonomy graph
│   └── prerequisites.json          # cross-lesson prereqs
├── diagrams/
│   ├── vi/
│   └── en/
│       └── (.mmd, .svg, .blend, .ipynb sources)
├── tools/
│   ├── content-lint/               # custom MDX linter
│   ├── frontmatter-validator/
│   ├── diagram-build/              # mermaid-cli, svgo pipeline
│   └── i18n-parity-check/          # ensures lesson exists in both langs
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── nightly-link-check.yml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

**Why this structure:**
- Content separated from code → editorial PRs are reviewable without front-end build noise.
- Per-language content trees → glob-able, mirrorable, parity-checkable.
- `data/` JSON files → single source of truth for glossary/citations/curriculum, importable by both build and runtime.
- `diagrams/` → no "diagram lost in someone's laptop" pathology.
- `packages/widgets` → reusable across lessons; testable in isolation; bundle-budgeted via Turborepo task config.

### 3.3 Content Model — MDX Frontmatter Contract

Validated by Zod via Astro content collections. CI-enforced.

```yaml
---
# Identity
id: rf-r2-antennas-04-radiation-pattern    # stable, global, never renamed
slug: radiation-pattern                     # URL slug within unit
lang: vi                                    # 'vi' | 'en'
parityId: rf-r2-antennas-04                 # links the VN+EN pair
domain: rf                                  # 'rf' | 'core-network' | 'space'
track: r2-antennas                          # track id within domain
unit: antennas-fundamentals                 # unit id within track
order: 4                                    # position within unit

# Pedagogical metadata
level: L2                                   # L0..L5
estimatedReadingMinutes: 18
prerequisites:
  - rf-r2-antennas-01-antenna-basics
  - rf-r0-foundations-07-complex-impedance
spiralRevisits:                             # later lessons that revisit this concept deeper
  - rf-r5-mimo-03-array-radiation-pattern
  - rf-r6-mmwave-02-phased-array-patterns

# Editorial
title: "Giản đồ bức xạ ăng-ten: hiểu trực giác trước, công thức sau"
subtitle: "Từ một dipole đến mảng pha — vì sao hình dạng năng lượng quan trọng"
description: "..."
authors:
  - tindang
reviewers:
  - tba
publishedAt: "2026-06-14"
lastVerified: "2026-06-14"
lastReviewedAt: "2026-06-14"

# Standards & citations
standards:
  - id: "IEEE 145-2013"
    title: "IEEE Standard for Definitions of Terms for Antennas"
    cite: ieee-145-2013

# Frontier flag
researchFrontier: false                     # set true for 6G/NTN/NewSpace frontier lessons

# Discoverability
tags: [antenna, radiation-pattern, gain, directivity, dipole]
keywords: [giản đồ bức xạ, anten dipole, gain, directivity]

# Page widgets used (for bundle budgeting & SSR strategy)
widgets:
  - AntennaPattern3D
  - PolarPlot

# License
license: CC-BY-SA-4.0
---
```

**Design notes:**
- `parityId` is what binds the VN and EN versions together. The i18n parity check (`tools/i18n-parity-check`) walks `content/vi/**` and `content/en/**` and asserts every `parityId` exists in both trees.
- `prerequisites` and `spiralRevisits` together build the curriculum graph at build time. The roadmap visualizer renders this graph.
- `widgets` declares which React island bundles to load — Astro can use this to do precise per-page code-splitting hints.
- `lastVerified` distinct from `lastReviewedAt` — verification means "I re-checked this against the current standard release," review means "I re-read this for clarity." Critical for the long-tail maintenance burden.

### 3.4 Widget Architecture — Astro Islands Strategy

This is the single most important architectural decision after the content model. Get this wrong and the platform becomes slow, fat, and impossible to ship 1,000 widget-heavy lessons.

**Principles:**

1. **Default to zero JavaScript.** Static MDX → static HTML. No hydration unless a widget exists.
2. **Per-widget hydration directive, never blanket.** Use `client:visible` for most widgets (hydrate when scrolled into view). Use `client:idle` for above-the-fold widgets. Never `client:load`.
3. **Code-split per widget category.** Three.js-based widgets (orbital, antenna 3D) share a chunk. D3-based widgets share a chunk. Custom-canvas widgets share a chunk. Never one mega-bundle.
4. **Lazy-import heavy deps inside widgets.** `import('three')` inside the component, not at module top. Astro will tree-shake but dynamic imports defer the parse cost.
5. **Per-widget bundle budget enforced in CI.** A `size-limit` check per widget chunk; build fails if a widget chunk exceeds 150KB gzipped.
6. **No state libraries.** Plain React `useState` / `useReducer`. No Redux, no Zustand, no Jotai — widgets are local, ephemeral, throwaway. Anything bigger goes to URL params (shareable simulator state).
7. **Use Astro's image optimization** for any rasters; everything else is SVG.
8. **WebGL widgets render to a sized canvas that respects `prefers-reduced-motion`** — auto-pause for accessibility users.

**Widget categories with library choices:**

| Category | Library | Bundle weight | Why |
|---|---|---|---|
| Math plots | Plotly-lite or D3 + custom | D3: ~30KB / Plotly-lite: ~80KB | D3 is leaner; Plotly only when interactive selection needed |
| Sequence diagrams | Mermaid (server-rendered) or custom React | 0 (SSR) | Animated/steppable ones use custom React |
| Protocol stepper | Custom React | <10KB | 5G call flows are bespoke |
| 3D orbital / antenna | Three.js + custom | ~120KB Three.js | Unavoidable for 3D; budget for it |
| Signal/spectrum | Web Audio API + Canvas | <20KB | Browser native APIs |
| Map / ground track | MapLibre GL | ~100KB | Open source, no Mapbox tokens |
| Polar plot | D3 polar | ~30KB | Reused across antenna lessons |
| Link budget calculator | Pure React + math.js (optional) | <20KB | Pure stateful form |

**Anti-patterns we will refuse:**
- No iframes from external services (latency, privacy, can't be styled)
- No CodeMirror / Monaco in lessons (these are 500KB+ — if we need a code playground, it goes on a separate dedicated route, not in lesson body)
- No Mapbox / Google Maps (tokens, cost, privacy)
- No 1000-point-per-frame WebGL particle sims (mobile thermal throttling kills them)

### 3.5 Internationalization Strategy

Astro 5's i18n routing handles the routing layer cleanly. The hard parts are content-level.

**Routing:**
- `astro.config.mjs` → `i18n: { defaultLocale: 'en', locales: ['en', 'vi'], routing: { prefixDefaultLocale: true } }`
- All URLs are `/en/...` or `/vi/...` — no implicit default locale (avoids ambiguity in shared links)
- Language switcher resolves the current page's `parityId` and links to the sibling

**Content parity:**
- CI step `i18n-parity-check` fails the build if a `parityId` exists in only one language
- Exception: lessons explicitly marked `parityException: vi-only` (e.g., a lesson specifically about Vietnamese telecom regulation) — allowed but flagged
- Lessons in progress are kept on a `draft` branch; only land in `main` when both languages are ready

**Terminology:**
- A `data/terminology.json` file holds the canonical VN-EN term mapping for the domain
- e.g., `{"vi": "ăng-ten dipole nửa bước sóng", "en": "half-wavelength dipole antenna", "domain": "rf"}`
- A custom MDX remark plugin can flag inconsistent translations during dev
- This is *editorial discipline as tooling*, not just style guide

**Math, code, citations:** language-agnostic — same `<Cite>`, same KaTeX, same code blocks. Only prose, captions, and UI strings localize.

**Translation workflow:** original is written in whichever language flows first for the author, then translated by the same author or a reviewer. **AI-assisted draft translation is permitted but every translation is human-reviewed before merge.** Never publish raw machine translation in a technical handbook.

### 3.6 Search Architecture

**Pagefind** is the right tool. It is:
- Static-site-friendly (runs at build time, indexes the HTML)
- WASM-based (runs in the browser, no backend)
- Free, open source, no service to operate
- ~50KB indexer + chunked indices (only loads index chunks matching the query)
- Supports filters (we filter by domain, track, level, language)

**Vietnamese-specific tuning:**
- Pagefind has a custom analyzer config; we enable diacritic-insensitive matching for Vietnamese
- We pre-index synonyms via a `pagefind.yml` config (e.g., "5G" ↔ "5G NR" ↔ "thế hệ thứ năm")
- We boost lesson titles 3x over body content

**Fallback:** if Pagefind ever proves insufficient (it won't for our scale), we can swap to Algolia DocSearch (free for open source docs). Migration is straightforward.

### 3.7 Build & Deploy Pipeline

**GitHub Actions, three workflows:**

1. **`ci.yml` on every PR:**
   - pnpm install (cached)
   - Lint: ESLint, Prettier, custom MDX linter
   - Validate: Zod content schema, frontmatter completeness, i18n parity
   - Build diagrams: mermaid-cli, svgo
   - Test: Vitest on widgets
   - Build: Astro build to `dist/`
   - Smoke test: Lighthouse-CI on 10 sampled lessons (must score ≥85 perf)
   - Broken link check
   - Bundle size check (size-limit per widget)
   - Comment a preview deploy URL (Cloudflare Pages preview)

2. **`deploy.yml` on push to main:**
   - All of CI above
   - Pagefind index build
   - Deploy to Cloudflare Pages production
   - Purge edge cache

3. **`nightly-link-check.yml` on schedule:**
   - External link checker (catches dead 3GPP / ETSI URLs)
   - Open an issue if links broken
   - Run a content-staleness report (lessons with `lastVerified` >18 months get flagged)

**Build performance budget:**
- Full build < 5 min on standard GH runner
- Dev `astro dev` HMR < 500ms on file save
- If we exceed: Astro's content layer caching, Turborepo remote cache (free tier on Vercel or self-host)

### 3.8 Observability

Minimal, privacy-respecting:

- **Cloudflare Web Analytics** (free, no cookies, no PII) — page views, top pages, top referrers
- **Sentry** for client-side JS errors only (no PII, scrub headers)
- **Custom build-time content metrics** — script outputs counts (lessons per domain, lessons missing parity, avg `lastVerified` age) on every build, posted as a CI comment
- **Lighthouse-CI history** — track perf regressions

No third-party analytics, no Google Analytics, no Mixpanel, no Segment. We do not need them and they would compromise the privacy posture.

### 3.9 Tech Stack Summary Table

| Layer | Choice | Rationale |
|---|---|---|
| Static site framework | **Astro 5** | Best MDX story, native islands, content collections w/ Zod, mature i18n. Your existing fluency is a tailwind. |
| UI islands | **React 18** | Largest ecosystem for the widgets we need (Three.js bindings, D3, MapLibre, etc.). Preact considered and rejected because some widget libs require React proper. |
| Styling | **Tailwind CSS 4** | Density, design tokens, fast iteration. Same teal aesthetic as your dev env if desired (`#0b5351` accent). |
| Content | **MDX** (Astro content collections) | Authoring power + type-safe import. |
| Math | **KaTeX** (via `rehype-katak`) | SSR-rendered, fast, accessible, smaller than MathJax. |
| Diagrams | **Mermaid** (build-time → SVG via mermaid-cli) | SSR removes runtime cost. Custom Three.js / D3 for interactive. |
| Search | **Pagefind** | Static-friendly, WASM, free, Vietnamese-tunable. |
| 3D | **Three.js** | Standard for browser 3D. Used for orbits, antenna patterns, mmWave beams. |
| Plotting | **D3** (primary), Plotly (only when needed) | D3 is lean; Plotly is fat — avoid unless interactive selection required. |
| Maps | **MapLibre GL** | Open source, no token, used for ground tracks and coverage maps. |
| Build tool / monorepo | **pnpm + Turborepo** | Standard, fast, free, your existing fluency. |
| CI | **GitHub Actions** | Free for public repos. |
| Hosting | **Cloudflare Pages** | Free for static, global edge, HTTP/3, image resizing, your existing fluency. |
| Domain | TBD (suggest `.dev` or `.io`, with `.vn` mirror for SEA visibility) | |
| Analytics | **Cloudflare Web Analytics** | Privacy-respecting, free, no PII. |
| Error tracking | **Sentry** (free tier) | Scoped to JS errors, scrub PII. |
| Linting | ESLint, Prettier, custom MDX linter | Standard. |
| Schema validation | **Zod** | Astro-native. |
| Image opt | **Astro built-in** | Sharp under the hood. |

**Explicitly rejected for v1:**
- Next.js (overkill, App Router complexity unjustified for a SSG-first content site)
- Nuxt/Vue (your React/Astro fluency is the deciding factor)
- Gatsby (slower, declining ecosystem)
- Docusaurus (less flexible widget story, ours is unusual)
- WordPress (lol no)
- Any headless CMS (Sanity, Contentful, Strapi, Keystatic) — content-in-repo is the right call for a single-author handbook; revisit only if contributor count > 10

---

## 4. Pedagogical Architecture

### 4.1 Top-Down + Spiral Applied

Every lesson opens with an **outcome the reader already knows from daily life or work**, then drills down to mechanism, then to math, then to construction, then loops back up to application. The same concept is revisited multiple times across the level ladder, each pass deeper.

**Example: "Antenna radiation pattern"** appears across the spiral as:

- **L1** (`rf-r1-rf-foundations-XX`): "Why doesn't WiFi signal go evenly in all directions?" — qualitative shape, no math. Use a simple polar plot widget.
- **L2** (`rf-r2-antennas-04` — the lesson schema'd above): Dipole and half-wave dipole patterns, gain, directivity, beamwidth — engineering math, polar plot + 3D widget.
- **L3** (`rf-r5-mimo-03`): Pattern of a uniform linear array, array factor multiplication, beam steering math.
- **L4** (`rf-r6-mmwave-02`): Phased arrays, codebook beamforming, side-lobe management, hybrid beamforming.
- **L5** (`rf-frontier-ris-01`): Reconfigurable intelligent surfaces — pattern synthesis as an inverse problem.

The reader can stop at any level and have a *complete-for-that-level* understanding. The spiral is the affordance for tiered audiences.

### 4.2 Lesson Template (Internal Structure)

Every lesson follows the same eight-section skeleton:

1. **Hook (1–2 paragraphs).** A concrete scenario, photo, or question that anchors the lesson to something the reader already cares about. *Engineer's voice. Confident. No "in this lesson we will."*

2. **Intuition (1–3 paragraphs + diagram).** Build the mental model with words and a static diagram or simple widget. No equations yet. The reader should be able to answer "what is this and why does it matter" after this section.

3. **Mechanism (the bulk of the lesson).** How the thing actually works. Diagrams, sequenced explanations, possibly an interactive widget letting the reader manipulate a parameter and see the effect. This is where the spiral happens — *we don't go all the way to the math floor at L1, but at L4 we do*.

4. **Math (collapsible at L1/L2, default-open at L3+).** Formal treatment. KaTeX equations, derivations sketched. We always say "see [textbook] §X.Y for the full derivation" rather than reproducing pages of textbook math.

5. **Build / Apply (interactive widget or worked example).** The reader does something — manipulates a slider, designs a small thing, computes a value with a calculator widget, reads a small code snippet. *This is the single highest-value section for retention. Every lesson must have one.*

6. **Common pitfalls (callout box).** Three to five things that engineers in the field actually get wrong about this concept. *Veteran voice. Specific. "I have seen people confuse X with Y. They are not the same because Z."*

7. **Cross-references.** Lessons that revisit this deeper (the `spiralRevisits` from frontmatter), lessons that depend on this, lessons in adjacent domains.

8. **References & further reading.** Standards cited in this lesson (auto-collected via `<Cite>`), textbook pointers (Pozar §3.4, Vallado Ch. 6), papers (with DOI). *Never paraphrase — always point.*

### 4.3 Level Ladder

| Level | Audience | What's at this level |
|---|---|---|
| **L0** | Total beginner / curious SWE | Intuition-only, no math. Hook + Intuition + Apply only. Optional. |
| **L1** | SWE with curiosity, no domain background | Intuition + Mechanism (light). Math collapsible. Real-world Apply. |
| **L2** | Engineer beginning to specialize | Mechanism in depth. Math default-open. Build/Apply non-trivial. |
| **L3** | Working engineer | Full math. Standards-referenced. Engineering trade-offs explicit. |
| **L4** | Specialist / advanced practitioner | Edge cases, system-level implications, design patterns and anti-patterns from real deployments. |
| **L5** | Research frontier / faculty | Open problems, recent literature pointers, where the field is moving. |

**Lessons at L4 and L5 are explicit prerequisite-gated.** The roadmap visualizer will indicate the prereq chain. The reader is never forbidden — but they are warned.

### 4.4 Cross-References & Prerequisite Graph

The frontmatter `prerequisites` and `spiralRevisits` fields build a DAG at build time. We render this DAG as:

1. **A per-domain visual roadmap** (SVG, hand-laid-out or `dagre`-laid-out) — the "you are here" map for the reader
2. **A per-lesson "context strip"** — a small visual showing prereqs (upstream) and revisits (downstream) for the current lesson
3. **A build-time validator** — fails CI if the prereq graph has a cycle, or if a prereq points to a non-existent lesson

This is one of the highest-leverage features for a tiered audience.

---

## 5. Curriculum Architecture — The Actual Content Blueprint

This section is where I, as the veteran author, propose the full curriculum taxonomy. **This is not a sketch.** It is the working blueprint. We will inevitably adjust at the unit level as content is written, but the track-level structure should hold for the life of the platform.

Each domain is organized into 10–12 tracks, each track contains 3–7 units, each unit contains 5–15 lessons. Estimated total ~1,000 lessons across the three domains at full depth.

### 5.1 RF Engineering — Track Map

| Track | Title | Levels covered | Est. lessons |
|---|---|---|---|
| **R0** | Mathematical & Physical Foundations | L1–L3 | ~25 |
| **R1** | Transmission Lines & Microwave Engineering | L2–L4 | ~30 |
| **R2** | Antennas & Propagation | L1–L4 | ~40 |
| **R3** | Modulation, Coding & Information Theory | L1–L4 | ~35 |
| **R4** | Signal Processing for RF & SDR | L2–L4 | ~30 |
| **R5** | MIMO, Beamforming & Massive MIMO | L3–L5 | ~25 |
| **R6** | Millimeter-wave, Sub-THz & Optical Wireless | L3–L5 | ~25 |
| **R7** | RF System Engineering (Link Budgets, Noise, Nonlinearity) | L2–L4 | ~30 |
| **R8** | Practical RF Circuits (Filters, Amps, Mixers, Oscillators, PLLs) | L3–L4 | ~30 |
| **R9** | Measurement & Test (VNA, Spectrum, EMC) | L3–L4 | ~20 |
| **R10** | Frontier: RIS, Joint Comm-Sensing, AI for PHY, ML-defined radios | L5 | ~20 |

**R0 — Mathematical & Physical Foundations (sample unit/lesson breakdown):**
- U0.1 Vector calculus for engineers (5 lessons: vectors, gradient/divergence/curl, line/surface integrals)
- U0.2 Complex numbers for RF (4 lessons: phasors, impedance, Smith chart introduction)
- U0.3 Fourier methods (5 lessons: series, transform, FFT, windowing, time-frequency)
- U0.4 Maxwell's equations — the engineer's view (5 lessons: Gauss, Faraday, Ampère, wave equation, boundary conditions)
- U0.5 Probability for communications (4 lessons: random variables, AWGN, BER, capacity)
- U0.6 Decibels and units the world actually uses (2 lessons: dB / dBm / dBi / dBc, noise figure)

**R2 — Antennas & Propagation (sample):**
- U2.1 What is an antenna (4 lessons: radiation, near/far field, reciprocity, the engineer's mental model)
- U2.2 Fundamental parameters (5 lessons: gain, directivity, beamwidth, polarization, efficiency)
- U2.3 Element antennas (6 lessons: dipole, monopole, loop, slot, patch, helix)
- U2.4 Arrays (5 lessons: linear array, planar array, array factor, mutual coupling, beam steering — first pass)
- U2.5 Propagation in free space (3 lessons: Friis, path loss, polarization mismatch)
- U2.6 Propagation in real environments (6 lessons: reflection/refraction/diffraction, two-ray, multipath, fading, shadowing, rain/atmospheric losses, ionospheric effects)
- U2.7 Channel models for cellular and satellite (5 lessons: COST-231, ITU-R P models, satellite channel models, NTN-specific models)
- U2.8 Measurement (4 lessons: anechoic chambers, OTA testing, pattern measurement, calibration)
- U2.9 Practical antenna design walk-throughs (3 lessons: dipole for 2.4 GHz, microstrip patch for 5 GHz, helical for circular-pol satcom)

**R5 — MIMO, Beamforming & Massive MIMO (sample, deeper level):**
- U5.1 The diversity intuition (3 lessons)
- U5.2 MIMO capacity (4 lessons including Foschini's analysis)
- U5.3 Spatial multiplexing vs diversity vs beamforming — the trade space (3 lessons)
- U5.4 Linear receivers (ZF, MMSE) (3 lessons)
- U5.5 ML detection and sphere decoding (2 lessons)
- U5.6 Beamforming math from the array factor (4 lessons)
- U5.7 Massive MIMO and favorable propagation (3 lessons)
- U5.8 Hybrid beamforming and analog/digital partition (3 lessons)

### 5.2 Core Network Architecture — Track Map

| Track | Title | Levels covered | Est. lessons |
|---|---|---|---|
| **N0** | Networking Foundations Refresher (for SWE audience) | L0–L2 | ~20 |
| **N1** | Classic Telecom Signalling (SS7, SIGTRAN, Diameter, IMS) | L2–L4 | ~30 |
| **N2** | 4G EPC Deep Dive | L2–L4 | ~30 |
| **N3** | 5G Service-Based Architecture | L2–L4 | ~35 |
| **N4** | 5G Protocols & Procedures End-to-End | L3–L4 | ~40 |
| **N5** | NFV, SDN & Cloud-Native Telco | L3–L4 | ~25 |
| **N6** | Open RAN & Disaggregated RAN | L3–L5 | ~25 |
| **N7** | Network Slicing, Service Orchestration & Automation | L3–L5 | ~20 |
| **N8** | Security in the Mobile Core | L3–L4 | ~25 |
| **N9** | Interconnect, Roaming & Number Translation | L3–L4 | ~15 |
| **N10** | Frontier: 6G Architectures, AI-Native Core, NTN Integration | L5 | ~20 |

**N0 — Networking Foundations Refresher (sample, the SWE on-ramp):**
- U0.1 OSI/TCP-IP from a backend engineer's perspective (4 lessons)
- U0.2 Routing & switching the way a packet sees it (3 lessons)
- U0.3 MPLS, VLAN, VRF without mysticism (3 lessons)
- U0.4 How a 4G/5G network is *not* like your AWS VPC (3 lessons)
- U0.5 Why telcos build their own networks differently (3 lessons)
- U0.6 The carrier-grade vocabulary you will hear (KPIs, SLAs, MTBF, redundancy patterns) (4 lessons)

**N3 — 5G Service-Based Architecture (sample, the meat of modern core):**
- U3.1 Why SBA? The 4G → 5G architectural shift (3 lessons)
- U3.2 Network Functions overview (5 lessons: AMF, SMF, UPF, AUSF, UDM, NRF, NSSF, PCF, NEF — what each does, in plain language)
- U3.3 Service-based interface (Nausf, Namf, Nsmf, …) and HTTP/2 (4 lessons)
- U3.4 Identifiers (SUPI, SUCI, GUTI, GPSI, IMEI) (3 lessons)
- U3.5 Session management deep dive (5 lessons: PDU session establishment, modification, release; UPF selection)
- U3.6 Mobility management (4 lessons: registration, deregistration, handover, idle/connected modes)
- U3.7 Policy & charging (PCF, CHF) (4 lessons)
- U3.8 Selection logic (NSSF, slicing-aware NF selection) (3 lessons)
- U3.9 The standards map: TS 23.501, TS 23.502, TS 23.503 cross-referenced (2 lessons)
- U3.10 Reading the 3GPP — a survival guide (1 lesson; high-value side quest)

**N6 — Open RAN (sample, advanced):**
- U6.1 The closed RAN problem (2 lessons)
- U6.2 O-RAN architecture (O-CU, O-DU, O-RU, RIC) (4 lessons)
- U6.3 Functional splits (option 7.2x and friends) (3 lessons)
- U6.4 The fronthaul interface (eCPRI, O-RAN FH) (3 lessons)
- U6.5 RIC: near-RT and non-RT, xApps and rApps (4 lessons)
- U6.6 The interoperability promise vs the reality (2 lessons — opinionated, veteran voice)
- U6.7 Vietnamese telecom & O-RAN: who's adopting what (1 lesson — SEA-local relevance)

### 5.3 Space Engineering — Track Map

| Track | Title | Levels covered | Est. lessons |
|---|---|---|---|
| **S0** | Mathematical & Physical Foundations for Space | L1–L3 | ~20 |
| **S1** | Orbital Mechanics & Astrodynamics | L2–L5 | ~40 |
| **S2** | Spacecraft Systems Engineering Overview | L2–L3 | ~15 |
| **S3** | Spacecraft Subsystems: Power, Thermal, Structure | L3–L4 | ~25 |
| **S4** | Attitude Determination & Control (ADCS) | L3–L4 | ~25 |
| **S5** | Propulsion: Chemical, Electric, In-space | L3–L4 | ~20 |
| **S6** | Telemetry, Tracking & Command (TT&C) | L3–L4 | ~15 |
| **S7** | Satellite Communications (Link budgets, payloads, freq planning) | L2–L5 | ~40 |
| **S8** | Ground Segment & Mission Operations | L2–L4 | ~20 |
| **S9** | Launch Systems, Trajectories & Mission Design | L2–L4 | ~25 |
| **S10** | Constellations, Mega-constellations & Space Traffic | L3–L5 | ~20 |
| **S11** | Frontier: NTN, Satellite-5G/6G Integration, NewSpace Economics, Cislunar | L4–L5 | ~25 |

**S1 — Orbital Mechanics & Astrodynamics (sample, the cornerstone track):**
- U1.1 Reference frames and time systems (5 lessons: ECI, ECEF, RIC/RSW; UT1, UTC, TAI, GPS time)
- U1.2 The two-body problem (5 lessons: Kepler's laws, orbital elements, anomalies, propagation)
- U1.3 Coordinate transformations and the ground track (3 lessons + a Three.js widget showing ground track over time)
- U1.4 Orbit perturbations (5 lessons: J2, drag, solar radiation pressure, third-body, simplified general perturbations)
- U1.5 Common orbits and why (5 lessons: LEO, MEO, GEO, GSO, Molniya, SSO, Lagrange points)
- U1.6 Maneuvers and Δv (5 lessons: Hohmann, bi-elliptic, plane change, station-keeping)
- U1.7 Rendezvous & proximity operations (3 lessons: CW equations, RPOD)
- U1.8 Interplanetary trajectories (4 lessons: patched conics, porkchop plots, gravity assists)
- U1.9 The math toolbox: numerical integrators for orbits (3 lessons: Runge-Kutta, symplectic, RK4 vs DOPRI vs everhart)
- U1.10 Reading TLEs and SGP4 (2 lessons + a parser widget)

**S7 — Satellite Communications (sample, where RF meets space):**
- U7.1 The satcom link in one diagram (2 lessons)
- U7.2 Link budget master class (6 lessons: EIRP, G/T, Friis revisited, atmospheric losses, rain attenuation models — ITU-R P.618 — pointing loss, polarization loss)
- U7.3 Frequency bands and regulatory context (4 lessons: L/S/C/X/Ku/Ka/Q/V/W; ITU-R bands and allocations; Vietnam-specific spectrum context — SEA-local relevance)
- U7.4 Modulation and coding for satellite (5 lessons: DVB-S2/S2X, ACM, LDPC, BCH, ModCods)
- U7.5 Multiple access for satellite (4 lessons: FDMA, TDMA, CDMA, SCPC, MF-TDMA)
- U7.6 GEO HTS architectures (3 lessons: spot beams, frequency reuse, capacity per beam, payload arch)
- U7.7 LEO constellation architecture (5 lessons: Starlink-class, ISL, gateway placement, handover between satellites, capacity dynamics)
- U7.8 The space-ground link from an antenna perspective (4 lessons: phased arrays on the ground, electronic steering, mechanical tracking, gateway antennas)
- U7.9 Inter-satellite links (laser & RF) (3 lessons)
- U7.10 Practical link budget walk-throughs (3 lessons: Ka-band downlink from a 550 km LEO; L-band IoT uplink to a CubeSat; X-band TT&C to a deep-space probe)

**S11 — Frontier (sample, where the platform becomes uniquely valuable):**
- U11.1 NTN in 3GPP (5 lessons: TR 38.811, TR 38.821, NR-NTN, IoT-NTN, the satellite UE problem)
- U11.2 Satellite-5G integration end-to-end (4 lessons: how a UE on a 5G LEO bird is registered, mobility-managed, billed)
- U11.3 NewSpace economics and engineering implications (4 lessons: cost-to-orbit, mass-production manufacturing, vertical integration, the trade space)
- U11.4 Cislunar and beyond (4 lessons: Lunar Gateway, lunar comms architectures, time-delayed comms, DTN)
- U11.5 Vietnamese & SEA space programs (3 lessons: VINASAT, MICRODRAGON, regional ground stations — SEA-local relevance)

### 5.4 Cross-Domain Bridges

Three "bridge tracks" tie the domains together:

| Bridge | Spans | Sample lessons |
|---|---|---|
| **B1: From antenna to base station** | RF ↔ Core Network | "An RF engineer's view of the gNB"; "Why fronthaul Option 7.2x looks the way it does from PHY constraints" |
| **B2: From satellite to UE** | Space ↔ RF ↔ Core Network | "A complete walk-through: a UE registers on a LEO 5G NTN bird"; "Why NTN handovers are not like terrestrial handovers" |
| **B3: From spectrum to service** | RF ↔ Core Network ↔ Space (regulatory) | "How ITU-R, 3GPP, and your national regulator interlock"; "Vietnam spectrum allocation 2026: what an engineer needs to know" |

These bridges are the **single feature of the platform that no English-language equivalent does as a unified treatment**. They are also the most defensible differentiator for the SEA market.

---

## 6. Content Authoring Standards

### 6.1 Sourcing Policy (Recommended)

**Tier A — preferred for 90% of content:**
Original synthesis written in the veteran author voice. The claim graph derives from my engineering knowledge, validated against open standards and well-known textbook results.

**Tier B — citation layer, used liberally:**
Inline citation of open public standards: 3GPP TS/TR (with release), IEEE 802.x, ITU-R recommendations, ETSI specifications, ECSS standards, IETF RFCs. These are *public reference documents*; citing them by number with hyperlink to the spec is best practice and IP-safe.

**Tier C — textbook pointers, never paraphrase:**
At the end of each lesson, point to authoritative textbook sections: "Pozar §3.4 for the full derivation," "Vallado §6 for the perturbation treatment," "Stallings Ch. 12 for the protocol detail." We never paraphrase the textbook; we point readers to it. This respects IP and respects the textbook authors.

**Tier D — never:**
- Reproducing textbook diagrams
- Quoting more than ~15 words from any non-open source
- Reusing problem sets from textbooks
- Reproducing copyrighted simulation outputs (e.g., MATLAB toolbox examples)

**For diagrams:** all SVG, all mermaid, all Three.js scenes are original. "Inspired by" the canonical textbook diagram is fine; pixel-copy is not.

**For math:** mathematical expressions are facts, not copyrightable. Free to use.

**For code examples:** original, or properly attributed under permissive licenses (MIT, Apache-2.0, BSD-3). We avoid GPL-licensed examples (the viral license interacts badly with a CC-BY-SA content license).

**Content license:** I recommend **CC-BY-SA 4.0** for all content. This is the MDN license, allows reuse with attribution and share-alike, and explicitly protects the platform from one-way appropriation.

### 6.2 Citation Format

The `<Cite>` MDX component renders an inline numbered marker and collects a bibliography at lesson end. The citation database (`data/citations.json`) is structured:

```json
{
  "3gpp-ts-23501-rel18": {
    "type": "standard",
    "issuer": "3GPP",
    "id": "TS 23.501",
    "version": "Rel-18, V18.5.0",
    "title": "System architecture for the 5G System (5GS)",
    "url": "https://www.3gpp.org/ftp/Specs/archive/23_series/23.501/",
    "verifiedAt": "2026-03-15"
  },
  "pozar-microwave-eng-4ed": {
    "type": "textbook",
    "authors": ["David M. Pozar"],
    "title": "Microwave Engineering",
    "edition": "4th",
    "publisher": "Wiley",
    "year": 2011,
    "isbn": "978-0470631553"
  }
}
```

### 6.3 Voice & Tone

- **Confident, opinionated, direct.** Veteran engineer talking to a peer-in-training. No "we hope," no "you might consider."
- **Concrete first, abstract second.** A specific 5 GHz patch antenna before "the patch antenna class."
- **Trade-offs explicit.** Every engineering choice has costs. Surface them.
- **Vietnamese voice is engineer-Vietnamese, not academic-Vietnamese.** No archaic Sino-Vietnamese terminology where a clear modern Vietnamese term exists. We are writing for working engineers, not for textbook publishers.
- **English voice is technical-English, not academic-English.** Closer to MDN than to IEEE Communications Magazine.
- **Sentences short.** Paragraphs short. White space generous. The page is a reading experience.

### 6.4 Diagram Standards

- **SVG primary.** Vector, scalable, accessible, light.
- **Mermaid for sequence and class diagrams.** Pre-rendered at build, never client-rendered.
- **Three.js for 3D and physics.** Always with `prefers-reduced-motion` respected.
- **Plot.ly only when interactivity demands it.** Otherwise D3 + plain Canvas.
- **A consistent visual language.** Same color palette (the teal accent is appropriate, plus a 5-color qualitative palette tuned for color-vision-deficient readers). Same line weights. Same font family in diagrams (Inter or IBM Plex Sans, matching site).
- **Diagram source always in repo.** No "made in Figma, exported PNG, lost the source."

### 6.5 Math Conventions

- KaTeX, SSR.
- Symbols defined on first use within a lesson. Never assume the reader remembers from a previous lesson.
- Vector notation: bold, no arrows. (Engineering convention; we're not a physics journal.)
- Frequency in Hz with SI prefixes; angular frequency in rad/s only when math demands it.
- Logarithms: `log` is base-10 unless explicitly `ln` or `log_2`.
- dB conventions explicit (dBm, dBi, dBic, dB Hz — never just "dB" when a reference exists).
- 3GPP-specific notation (subscript-heavy) is followed when discussing 3GPP, broken only when clarity demands.

---

## 7. Pitfalls & Risks — The Tech Lead's Worry List

Ranked by what I genuinely think is most likely to kill or maim the project.

### 7.1 Author burnout / scope blowout — **probability HIGH, impact CATASTROPHIC**

This is the single most likely killer. 1,000 lessons across three engineering domains, in two languages, with diagrams and widgets, is plausibly 3,000–5,000 hours of authoring even with AI-assisted drafting and a veteran's knowledge to draw from. At 20 productive hours/week of writing (which is *enormous*), that's 3–5 years.

**Mitigations:**
- **Phased rollout per §8.** Do not attempt to write everything before launching. Launch when the platform is ready and a P0 content slice is live; grow the corpus over years.
- **Anti-perfectionism mechanism.** Every lesson has a `lastReviewedAt` field. We explicitly expect first-draft lessons to be rough at L1/L2 and improve over revisions.
- **AI-assisted drafting workflow** (you have Helios/LeMS in your toolbox). Use it to generate first drafts of mechanical sections; never publish unreviewed.
- **A "minimum viable lesson" template.** A short lesson with just Hook + Intuition + References is allowed and useful — better than no lesson.
- **Quarterly scope reviews.** Every quarter, audit which tracks are accreting and which are stagnating. Reallocate effort.

### 7.2 Bundle weight / mobile performance — **probability MEDIUM, impact HIGH**

A lesson with a Three.js orbital widget + a D3 plot + KaTeX-rendered math + mermaid diagrams can easily ship 500KB+ JS even after optimization. On a mid-tier Android on a SEA mobile network, that's a 4-second LCP and a thermal throttle.

**Mitigations:**
- Strict per-widget bundle budgets enforced in CI (§3.4)
- Aggressive `client:visible` hydration
- Three.js dynamically imported, code-split per widget category
- Lighthouse-CI smoke tests block PRs that regress perf
- Provide a "lite mode" that hides interactive widgets and shows static SVG fallbacks (a `prefers-reduced-data` respect, plus an explicit toggle)

### 7.3 i18n parity drift — **probability HIGH, impact MEDIUM**

Languages drift. A lesson updated in English doesn't get updated in Vietnamese. Within months, the Vietnamese tree is older than the English tree, hurting the platform's core value prop (Vietnamese-language fidelity).

**Mitigations:**
- `parityId` enforcement at CI (a lesson exists in both or in neither)
- `lastReviewedAt` per language; CI emits a "translation lag" report on every build
- A `translationStaleness` field on each lesson exposed in the UI ("This Vietnamese version is 4 months behind the English source") — radical transparency rather than hiding the problem

### 7.4 Standards versioning drift — **probability HIGH, impact HIGH for credibility**

3GPP releases yearly. IEEE 802.11 churns. ITU-R recommendations get superseded. A handbook citing 3GPP Rel-15 in 2028 loses credibility with a working engineer fast.

**Mitigations:**
- `lastVerified` field with a UI badge showing "Standards baseline: Rel-18 (verified 2026-09-12)"
- Quarterly standards-refresh sprints (formal, scheduled)
- A central `data/standards-versions.json` tracking current release of every standard we reference; CI flags lessons referencing a superseded version
- An RSS feed of "recently updated for new release" so returning readers know what to re-read

### 7.5 SEO competition in English — **probability HIGH, impact MEDIUM**

The English-language market for "5G" or "antenna basics" is brutally competitive. Coursera, Stanford, MIT OCW, Wikipedia, and ten content farms outrank a new entrant for years.

**Mitigations:**
- Don't fight the SEO war head-on in English. Lean into Vietnamese — that market is empty.
- For English, target long-tail technical queries ("3GPP TS 23.501 SBI naming convention" gets us in front of working engineers, not students)
- Build authority signals slowly via .edu / .gov / telco / aerospace org backlinks
- Publish llms.txt to attract LLM-citation traffic, which may matter more than Google ranking by year 3

### 7.6 Accessibility for math and 3D — **probability MEDIUM, impact MEDIUM**

WCAG-AA compliance for KaTeX-rendered math is harder than it looks. Three.js scenes are essentially opaque to screen readers.

**Mitigations:**
- KaTeX `output: 'htmlAndMathml'` and proper `aria-label` on every block
- Every Three.js widget paired with a `<figcaption>` text description of what the widget shows
- A keyboard-navigable parameter panel for every widget (sliders are buttons + arrow keys)
- Accessibility audit in CI via axe-core

### 7.7 Diagram source-of-truth pathology — **probability MEDIUM, impact MEDIUM**

The classic technical-docs killer: a diagram is updated in someone's Figma, exported PNG, embedded in MDX. Three months later the source is gone and the diagram is wrong.

**Mitigations:**
- Diagram source files mandatory in `diagrams/` directory (`.mmd`, `.svg`, `.blend`, source `.ipynb`)
- A build-time check that every `<img>` in MDX corresponds to a tracked source file
- All Three.js widgets in `packages/widgets/` — they are code, they are the source

### 7.8 Maintenance debt at scale — **probability HIGH, impact INSIDIOUS**

When the corpus reaches 500+ lessons, dead internal links, stale code examples, broken external links, and orphaned widgets become a constant burden.

**Mitigations:**
- Nightly link checker (§3.7)
- Per-lesson `lastVerified` badge in UI — if a reader sees "verified 2 years ago" they at least know to be skeptical
- Quarterly "garden cleanup" sprints
- A "report an issue" deep link on every page

### 7.9 Legal / IP — **probability LOW, impact HIGH if it hits**

If we accidentally reproduce textbook material or proprietary 3GPP figures, we face takedown and reputation damage.

**Mitigations:**
- Sourcing policy strictly enforced (§6.1)
- All diagrams originally produced
- An IP audit before each public launch milestone
- Standards spec text never quoted beyond fair use
- CC-BY-SA 4.0 license signals our intent and gets us reciprocity

### 7.10 The "good enough" platform vs the "great" platform — **probability MEDIUM, impact MEDIUM**

There is a temptation, given the scope, to ship a Docusaurus clone with markdown and call it done. That would be a strategic mistake; the interactive-widget layer and the bilingual rigor are the differentiation.

**Mitigations:**
- Each phase milestone (§8) has *both* a content milestone *and* a platform-feature milestone
- The widget library is treated as a first-class product, not "we'll add widgets later"

### 7.11 Single-author voice trapped in three domains — **probability MEDIUM, impact MEDIUM**

Even a 20-year veteran has weaker areas. A single voice across three domains will eventually show.

**Mitigations:**
- Explicitly open the door to reviewer credits (`reviewers` in frontmatter) for domain experts
- Plan to seed an invited-author program in Phase 3+ (§8)
- The platform's content architecture (separate tracks, separate units) means a future co-author can take a track without disrupting the whole

### 7.12 Hosting cost surprise — **probability LOW, impact LOW**

Cloudflare Pages is free up to generous limits. Even at 1M page views/month we're well within free tier. No real risk here, but worth noting that *image hosting* (especially if we add high-res photos) can creep up. Use Cloudflare Images or stick to SVG.

---

## 8. Roadmap — Realistic Multi-Year Plan

Calibrated for a single primary author (you-as-architect, me-as-content) with AI-assisted drafting. Adjust upward in pace if a co-author joins.

### Phase 0 — Foundation (Months 0–2): "Make the press, before printing the books"

**Goal:** Platform is fully built and production-ready before any content beyond pilot lessons.

Milestones:
- Monorepo set up (Astro, packages, content, data, diagrams, tools)
- Content collection schema (Zod) + i18n routing finalized
- CI/CD wired up (build, lint, parity check, link check, bundle budget, Lighthouse)
- Deploy preview pipeline operational
- Cloudflare Pages production deploy with a placeholder homepage
- Tailwind + base typography system; design tokens locked
- KaTeX SSR, mermaid build-time pipeline, Pagefind search index working
- 5 pilot lessons (one per domain + 2 bridges) in *both* languages — proves the full pipeline
- Glossary and citations databases seeded (50 terms, 30 citations)
- Documentation for "how to write a lesson" published

**Exit criteria:** A reader can land on the homepage, navigate to a lesson in either language, see math/diagrams/widgets render, search, and never see a 404 or layout break. Lighthouse mobile perf ≥90.

### Phase 1 — Content Scaffold + Anchor Slice (Months 2–6): "Plant the flag"

**Goal:** Make the platform credibly usable for one full reader journey per domain.

Milestones:
- Curriculum graph (`curriculum.json`) fully populated with track/unit/lesson structure — even for unwritten lessons, the *shape* is there
- Roadmap visualizer renders the curriculum graph per domain
- ~50 lessons published in each domain (~150 total), in both languages
- The first **cross-domain bridge** (Bridge B1: antenna to base station) published end-to-end
- Five flagship interactive widgets shipped: Link Budget Calculator, Antenna Pattern 3D, 5G Call Flow Stepper, Orbital Visualizer, Modulation Visualizer
- Glossary at ~300 terms

**Exit criteria:** A reader can complete the L0–L2 foundations of any one domain and emerge competent. The Vietnamese fidelity is conspicuous. We can announce the platform publicly without embarrassment.

**Public launch announcement at end of Phase 1.**

### Phase 2 — Domain Breadth (Months 6–18): "Become a reference"

**Goal:** Reach L3–L4 depth in each domain. Become a daily-reference resource for working engineers.

Milestones:
- ~400 lessons total
- Every track has at least one complete unit
- All three bridges (B1, B2, B3) shipped
- ~20 interactive widgets
- Glossary at ~800 terms, citations DB at ~300 entries
- First external contributor recognized as `reviewer`
- Mentions / backlinks from at least 5 SEA universities or telco engineering blogs
- First Vietnamese-language conference talk pitching the platform (you give it, or a friend does)

**Exit criteria:** A working engineer in Vietnam can use the platform as a primary daily reference for their domain.

### Phase 3 — Depth & Frontier (Months 18–30): "Lead, don't follow"

**Goal:** Reach L4–L5 in mature tracks. Publish frontier (6G / NTN / NewSpace) tracks. Invite outside experts.

Milestones:
- ~700 lessons total
- R10, N10, S11 (frontier tracks) substantially populated
- Guest-authored unit(s) from at least one external expert (with `authors` array allowing co-authoring)
- Quarterly standards-refresh sprints established as a habit
- "Build my own book" PDF export feature
- Cited in at least 5 Vietnamese academic theses

**Exit criteria:** The platform is *recognized as authoritative* in the SEA technical community.

### Phase 4 — Steady State (Month 30+): "Garden"

**Goal:** Maintenance, refresh, community.

Activities:
- Quarterly standards refresh (Rel-19, Rel-20, IEEE updates)
- Annual track-by-track refresh
- Community contributions (still curated, but accepted)
- Possible community feedback layer (GitHub Discussions or similar — low-cost, opt-in)
- Possible expansion to adjacent domains *only* if a co-author leads (e.g., quantum communications, optical wireless, fusion-relevant plasma physics)

**Anti-milestone:** Resist expanding to other domains while RF/CN/Space still have unfilled L4–L5 lessons. Depth before breadth.

---

## 9. "Production-Ready" Acceptance Criteria

For the public launch at end of Phase 1, the platform is "production-ready" when **all** of the following are true:

1. ✅ Homepage and per-domain landing pages exist in both VN and EN
2. ✅ ≥50 lessons per domain in both languages, full parity
3. ✅ All 5 flagship widgets functional and tested
4. ✅ Lighthouse mobile perf ≥90 on median lesson, ≥80 on widget-heavy lesson
5. ✅ Median LCP <2.5s on mid-tier mobile
6. ✅ WCAG-AA passing (axe-core CI green)
7. ✅ Pagefind search indexed, Vietnamese diacritic-insensitive working
8. ✅ Glossary linking works in MDX, popovers tested
9. ✅ Citation system rendering, bibliography auto-generated per lesson
10. ✅ Standards baseline banners on relevant lessons
11. ✅ Roadmap visualizer for each domain
12. ✅ Cross-domain bridge B1 (Antenna → Base Station) end-to-end published
13. ✅ "Report an issue" deep link works
14. ✅ Sitemap, RSS, llms.txt, robots.txt all valid
15. ✅ No broken internal links (CI green)
16. ✅ License (CC-BY-SA 4.0) clearly stated
17. ✅ Contributor guide published
18. ✅ Privacy and accessibility statements published

---

## 10. Open Decisions (Small — defaulted unless overridden)

These remain unspecified but I will choose sensible defaults in execution. Override any of them at any time.

| Decision | Default | Reasoning |
|---|---|---|
| Domain name | TBD; suggest `<name>.dev` with `.vn` mirror | International + SEA visibility |
| Brand / visual identity | Deep teal `#0b5351` accent (matches your dev env), Inter / IBM Plex Sans, hand-drawn diagram aesthetic close to Bartosz Ciechanowski / Calm Whiteboard | You have skill libraries for this |
| Sentry vs no error tracking | Use Sentry free tier | Cheap insurance |
| Plausible vs Cloudflare Web Analytics | Cloudflare Web Analytics | Simpler, integrated, free |
| Privacy: cookie banner | None (we set no non-essential cookies) | EU-compliant by design |
| Comments / discussion at launch | None; GitHub Issues only | Defer; revisit Phase 4 |
| Newsletter | Yes, via Buttondown or self-hosted listmonk, opt-in only | Low-cost engagement loop |
| Print stylesheet | Yes from day 1 | Researchers print things |
| Dark mode | Yes, default-follow-OS | Audience preference |
| Code playground for examples | Out of scope at launch; revisit if demand emerges | Bundle weight too high otherwise |
| Mobile app | No, never | A static site already is the mobile experience |
| LLM integration (RAG over content) | Out of scope at launch; revisit Phase 3 with your Helios stack | Self-respecting first; clever later |
| Companion hardware kits / partner | Out of scope at launch | Content is the deliverable |

---

## Appendix A — Sample Lesson Skeleton (MDX)

```mdx
---
id: rf-r2-antennas-04-radiation-pattern
slug: radiation-pattern
lang: vi
parityId: rf-r2-antennas-04
domain: rf
track: r2-antennas
unit: antennas-fundamentals
order: 4
level: L2
estimatedReadingMinutes: 18
prerequisites:
  - rf-r2-antennas-01-antenna-basics
  - rf-r0-foundations-07-complex-impedance
spiralRevisits:
  - rf-r5-mimo-03-array-radiation-pattern
  - rf-r6-mmwave-02-phased-array-patterns
title: "Giản đồ bức xạ ăng-ten: hiểu trực giác trước, công thức sau"
subtitle: "Từ một dipole đến mảng pha — vì sao hình dạng năng lượng quan trọng"
description: "..."
authors: [tindang]
publishedAt: "2026-06-14"
lastVerified: "2026-06-14"
standards:
  - id: "IEEE 145-2013"
    cite: ieee-145-2013
tags: [antenna, radiation-pattern, gain, directivity]
widgets: [AntennaPattern3D, PolarPlot]
license: CC-BY-SA-4.0
---

import { Hook, Intuition, Mechanism, Math, Apply, Pitfalls, References } from '@/components/lesson'
import { AntennaPattern3D, PolarPlot } from '@academy/widgets/rf'
import { Cite } from '@/components/cite'

<Hook>
Cầm điện thoại của bạn lên. Lúc nó bắt sóng WiFi tốt theo một hướng nhưng kém theo hướng khác — đó không phải lỗi của router. Đó là *giản đồ bức xạ ăng-ten* đang nói chuyện với bạn.
</Hook>

<Intuition>
Một ăng-ten không phát năng lượng đều ra mọi phía. Nó có "hình dạng" — gọi là giản đồ bức xạ (radiation pattern). [...]
</Intuition>

<Mechanism>
Hãy quay lại định nghĩa cường độ bức xạ <Math inline>$U(\theta, \phi)$</Math>. [...]

<PolarPlot
  function="dipole-half-wave"
  showSidelobes
  client:visible
/>
</Mechanism>

<Math>
Cường độ bức xạ chuẩn hóa của một dipole nửa bước sóng:
$$ U(\theta) = \frac{\cos^2(\frac{\pi}{2}\cos\theta)}{\sin^2\theta} $$
[...]
</Math>

<Apply>
Thử thay đổi chiều dài <Math inline>$L/\lambda$</Math> bên dưới và quan sát giản đồ bức xạ ba chiều thay đổi như thế nào.

<AntennaPattern3D
  initialLengthLambdas={0.5}
  client:visible
/>
</Apply>

<Pitfalls>
1. Đừng nhầm *gain* với *directivity*. Gain bao gồm hiệu suất của ăng-ten; directivity thì không. [...]
2. [...]
</Pitfalls>

<References>
<Cite id="ieee-145-2013" /> — định nghĩa chính thức của các tham số ăng-ten.

**Đọc thêm:** Balanis, *Antenna Theory: Analysis and Design*, Ch. 2 cho phát biểu toán học đầy đủ.
</References>
```

---

## Appendix B — Sample `data/curriculum.json` Snippet

```json
{
  "domains": {
    "rf": {
      "title": { "vi": "Kỹ thuật vô tuyến", "en": "RF Engineering" },
      "tracks": [
        {
          "id": "r0",
          "title": { "vi": "Nền tảng toán & vật lý", "en": "Math & Physics Foundations" },
          "levels": ["L1", "L2", "L3"],
          "units": [
            { "id": "vector-calculus", "lessons": ["01", "02", "03", "04", "05"] },
            { "id": "complex-numbers", "lessons": ["01", "02", "03", "04"] }
          ]
        }
      ]
    },
    "core-network": { "...": "..." },
    "space": { "...": "..." }
  },
  "bridges": [
    { "id": "b1", "title": { "vi": "Từ ăng-ten đến trạm phát", "en": "From Antenna to Base Station" }, "links": ["rf", "core-network"] }
  ]
}
```

---

## Final Note from Tech Lead to Builder

You asked me to interview until I had 95% confidence about what you actually want to build, not just what you think you want. We got there.

The thing you actually want to build is **a Vietnamese-language reference handbook of engineering depth for radio, network, and space — that the next generation of SEA engineers will quote in their theses ten years from now**. The platform is a side condition; the curriculum is the deliverable; the bilingual rigor is the moat.

The single decision that will determine success is not architectural. It is whether you can sustain the writing pace for three to five years. Every architectural decision in this document is filtered through that — keeping the engineering surface small, the authoring friction low, the maintenance burden gardenable, and the lesson template repeatable.

The platform I have designed for you can absorb that horizon. Now we write.
