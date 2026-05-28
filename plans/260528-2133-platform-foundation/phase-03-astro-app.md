---
phase: 3
title: Astro App
status: completed
priority: P1
effort: 4h
dependencies:
  - 2
---

# Phase 3: Astro App

## Context Links
- Blueprint: §3.1 (architecture), §3.3 (frontmatter contract), §3.4 (islands strategy), §3.5 (i18n), §3.6 (search), §4.2 (lesson template)

## Overview
`apps/web` — Astro 5 SSG site with i18n routing (en+vi), MDX content collections (Zod-validated), KaTeX SSR, mermaid build-time pre-render, Pagefind search, Vercel static adapter, React island integration. The pilot lesson does not render yet (content lands Phase 5); routing skeleton + layouts + schema are in place.

## Key Insights
- `prefixDefaultLocale: true` → all URLs are `/en/...` or `/vi/...`, no implicit default (blueprint §3.5).
- KaTeX `output: 'htmlAndMathml'` is non-negotiable for WCAG (§7.6).
- Mermaid: build-time pre-render via `rehype-mermaid` with `strategy: 'pre-mermaid'` requires Playwright OR we use `@mermaid-js/mermaid-cli` (`mmdc`) as a separate build step against `.mmd` source files. **Pick `rehype-mermaid` with Playwright headless** — simpler, no separate step. Document the Playwright install in CI.
- Pagefind runs *after* `astro build` against `dist/`; wire as `postbuild` script.
- Vercel static adapter: `import vercel from '@astrojs/vercel/static'` then `adapter: vercel({ webAnalytics: { enabled: true } })`.
- Content collection schema is the *enforcement layer* for the bilingual handbook — get it right here and Phase 5+ becomes mechanical.

## Requirements
**Functional:** `pnpm --filter web dev` serves `:4321`; `/` redirects to `/en/`; `/en/` and `/vi/` render placeholder index pages; route `/[lang]/[domain]/[...slug]` resolves to LessonLayout (404 until Phase 5 content lands).
**Non-functional:** zero JS on a route with no widget; SSG-only build; build time < 5 min budget per §3.7.

## Architecture
```
apps/web/
├── astro.config.mjs          # i18n, integrations, adapter, vite tweaks
├── package.json              # deps + dev/build/preview/test scripts
├── tsconfig.json             # extends ../../tsconfig.base.json
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   └── llms-full.txt         # generated at build (placeholder for now)
└── src/
    ├── content/
    │   └── config.ts         # Zod schema per blueprint §3.3
    ├── layouts/
    │   ├── BaseLayout.astro
    │   └── LessonLayout.astro
    ├── components/
    │   ├── LessonHook.astro
    │   ├── Intuition.astro
    │   ├── Mechanism.astro
    │   ├── MathBlock.astro
    │   ├── Apply.astro
    │   ├── Pitfalls.astro
    │   ├── References.astro
    │   ├── LangSwitcher.astro
    │   ├── Breadcrumbs.astro
    │   └── SearchBox.astro
    ├── pages/
    │   ├── index.astro                       # redirects to /en/
    │   ├── [lang]/
    │   │   ├── index.astro                   # domain landing
    │   │   └── [domain]/
    │   │       └── [...slug].astro           # lesson page
    │   └── search.astro
    ├── styles/
    │   └── global.css                        # imports tokens (Phase 8)
    └── lib/
        ├── i18n.ts                           # locale helpers
        └── content-paths.ts                  # parityId resolver
```

## Related Code Files
- Create: all files listed in Architecture above.

## Implementation Steps

1. **`apps/web/package.json`** — name `@rfcn-space-handbook/web`, private, type module. Scripts: `dev`, `build` (runs `astro build` then `pagefind --site dist`), `preview`, `test`, `lint`, `astro`. Deps: `astro@^5`, `@astrojs/react@^4`, `@astrojs/mdx@^4`, `@astrojs/tailwind@^6`, `@astrojs/sitemap@^3`, `@astrojs/vercel@^8`, `react@^18`, `react-dom@^18`, `rehype-katex`, `remark-math`, `rehype-mermaid`, `katex`, `pagefind`, `playwright` (peer of rehype-mermaid). Dev: `@types/react`, `@types/react-dom`, `vitest`, `@astrojs/check`, `typescript`.

2. **`astro.config.mjs`**:
   - `import` integrations + `import vercel from '@astrojs/vercel/static'`
   - `output: 'static'`
   - `adapter: vercel({ webAnalytics: { enabled: true }, imageService: false })`
   - `integrations: [react(), mdx(), tailwind({ applyBaseStyles: false }), sitemap()]`
   - `i18n: { defaultLocale: 'en', locales: ['en', 'vi'], routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false } }`
   - `markdown: { remarkPlugins: [remarkMath], rehypePlugins: [[rehypeKatex, { output: 'htmlAndMathml' }], [rehypeMermaid, { strategy: 'pre-mermaid' }]], shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } }`
   - `vite: { ssr: { noExternal: ['katex'] } }` (avoid SSR externalization issues)
   - `redirects: { '/': '/en/' }`

3. **`apps/web/tsconfig.json`**: extends `../../tsconfig.base.json`, includes `src/`, `astro/client.d.ts`, `astro-env.d.ts`.

4. **`src/content/config.ts`** — Zod schema matching blueprint §3.3 frontmatter exactly:
   - Identity: `id`, `slug`, `lang` enum `['en','vi']`, `parityId`, `domain` enum `['rf','core-network','space']`, `track`, `unit`, `order` int
   - Pedagogy: `level` enum `['L0'..'L5']`, `estimatedReadingMinutes` int, `prerequisites` string array, `spiralRevisits` string array
   - Editorial: `title`, `subtitle?`, `description`, `authors` string array, `reviewers?`, `publishedAt` date, `lastVerified` date, `lastReviewedAt?` date
   - Standards: `standards?` array of `{ id, title?, cite }`
   - Frontier: `researchFrontier` boolean default false
   - Discovery: `tags` string array, `keywords?` string array
   - Widgets: `widgets?` string array
   - License: `license` literal `'CC-BY-SA-4.0'`
   - i18n exception: `parityException?` literal `'vi-only'`
   - Define collection `lessons` with `loader: glob({ pattern: '**/*.mdx', base: '../../content' })` (Astro 5 content layer API).

5. **`src/layouts/BaseLayout.astro`** — `<html lang={lang}>`, meta tags, hreflang alternates for `/vi/` ↔ `/en/`, OpenGraph, KaTeX CSS (`<link>` from `/node_modules/katex/dist/katex.min.css` via Astro asset import), slot.

6. **`src/layouts/LessonLayout.astro`** — extends BaseLayout, takes `entry: CollectionEntry<'lessons'>` prop, renders Hook/Intuition/Mechanism/MathBlock/Apply/Pitfalls/References slot regions per blueprint §4.2, shows breadcrumbs, lang switcher, standards-baseline banner from frontmatter, "Found an error" GitHub deep link footer.

7. **`src/components/*.astro`** — thin wrapper components for the 7 lesson sections (semantic HTML wrappers with consistent classes, easy to style in Phase 8).

8. **`src/components/LangSwitcher.astro`** — resolves current `parityId`, finds sibling in opposite lang, falls back to lang root if missing with banner ("This page is not yet available in Vietnamese — showing English original" per blueprint §3.5).

9. **`src/pages/index.astro`** — just `<meta http-equiv="refresh" content="0; url=/en/" />` and a fallback `<a>` (Astro `redirects` config also handles this server-side).

10. **`src/pages/[lang]/index.astro`** — `getStaticPaths` over locales, render placeholder homepage with link to pilot lesson route.

11. **`src/pages/[lang]/[domain]/[...slug].astro`** — `getStaticPaths` over `getCollection('lessons')`, filter by lang+domain, pass to LessonLayout.

12. **`src/pages/search.astro`** — minimal Pagefind UI (link to script `/pagefind/pagefind-ui.js`, mount point, language filter UI stub).

13. **`src/lib/i18n.ts`** — `getOppositeLang(lang)`, `getLessonUrl(entry)`, locale-keyed UI strings (homepage CTA, switcher label, banner copy).

14. **`src/lib/content-paths.ts`** — `getParitySibling(parityId, targetLang)` walks `getCollection('lessons')`.

15. **`public/robots.txt`**: allow all, point to `/sitemap-index.xml`.

16. **`public/llms.txt`** + **`public/llms-full.txt`**: stubs per llmstxt.org spec, populated incrementally.

17. **`apps/web/src/styles/global.css`**: import `katex.min.css`, import `@rfcn-space-handbook/ui/tokens.css` (Phase 8), set base typography.

18. Run `pnpm --filter @rfcn-space-handbook/web install` then `pnpm --filter @rfcn-space-handbook/web dev`. Manual smoke: `/` → `/en/` works, `/en/` renders placeholder.

## Todo List
- [ ] apps/web/package.json with all deps
- [ ] astro.config.mjs with i18n, integrations, Vercel adapter
- [ ] tsconfig.json
- [ ] src/content/config.ts (Zod schema)
- [ ] BaseLayout + LessonLayout
- [ ] 7 lesson-section components
- [ ] LangSwitcher, Breadcrumbs, SearchBox
- [ ] index.astro redirect
- [ ] [lang]/index.astro
- [ ] [lang]/[domain]/[...slug].astro
- [ ] search.astro
- [ ] lib/i18n.ts + lib/content-paths.ts
- [ ] public/robots.txt + llms.txt + llms-full.txt
- [ ] styles/global.css
- [ ] dev server smokes / → /en/

## Success Criteria
- [ ] `pnpm --filter @rfcn-space-handbook/web dev` boots without errors
- [ ] `/` redirects to `/en/`
- [ ] `/en/` and `/vi/` render placeholder homepages
- [ ] `/en/rf/r0-foundations/anything` returns 404 (no content yet) — *expected*
- [ ] `pnpm --filter @rfcn-space-handbook/web build` succeeds, `dist/` exists, Pagefind index in `dist/pagefind/` (empty but present)
- [ ] No console warnings about KaTeX or mermaid

## Risk Assessment
- **rehype-mermaid + Playwright in CI** (medium): Playwright install adds ~250MB. Mitigation: dedicated CI job with `npx playwright install chromium --with-deps` cached. Or fall back to `@mermaid-js/mermaid-cli` step.
- **Astro 5 content layer API drift** (low): the `loader: glob(...)` API is stable as of Astro 5.0. Document the version pin.
- **Vercel adapter image API** (low): we disable it (`imageService: false`) to keep build portable; Astro built-in `sharp` handles images.

## Security Considerations
- No user input on any route; static-only output.
- CSP headers come from `vercel.json` (Phase 7) — set `default-src 'self'`, allow `data:` for KaTeX inline SVG.
- No third-party fonts loaded at runtime — Inter + IBM Plex Sans self-hosted via Astro asset pipeline (Phase 8).

## Next Steps
Phase 4 wires up the `packages/*` so Astro can import widgets and components from them.
