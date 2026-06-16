# Phase 0 Platform Foundation — Shipped

**Date**: 2026-05-29 04:00  
**Severity**: Informational  
**Component**: Platform architecture, build pipeline, core content rendering  
**Status**: Resolved  

## What Happened

Built and shipped the complete Phase 0 Astro 5 SSG platform per PLATFORM_BLUEPRINT.md §8 spec. Monorepo with pnpm workspaces, bilingual (VI+EN) MDX content collections, build-time citation SSR pipeline, Pagefind search, Tailwind+KaTeX, and one end-to-end proof-of-concept lesson (decibels) in both languages. Deployed to Vercel (user override from blueprint's Cloudflare Pages recommendation). Commit: fc421b9, 1,621 files, 365,118 insertions.

## The Brutal Truth

This didn't feel like a "shipping" moment — it felt like **validating that the architecture wasn't fictional**. Phase 0 was always the "make the press before printing the books" work. We spent 8 sequential fullstack-developer subagent dispatches (plus code review gates) building the machine, not content. The dominant risk from the blueprint (author burnout at 1,000 lessons / 3–5 years) didn't disappear — we just proved the scaffolding wouldn't collapse under a real lesson's weight.

The surprise: integrating citations as build-time SSR (scanning MDX body for `<Cite id="..." />` and injecting via Astro's MDX `components` prop) is clean *because we never tried to make it runtime*. Avoided a whole React hydration tax. The fallacy we nearly committed was treating citations as first-class interactive components; they're not — they're metadata that gets folded into the rendered doc.

## Technical Details

**What worked cleanly:**
- Astro 5's content collections with Zod schema validation — zero integration friction
- KaTeX SSR via the official Astro plugin (`@astrojs/markdoc` + markdown-it plugin)
- Mermaid pre-render pipeline (mermaid-cli at build time) → SVG → inlined, no client-side JS
- React islands with `client:visible` hydration for the PolarPlot widget — measures as <3KB after tree-shake
- CSP hardened: `script-src 'self'`, `frame-ancestors 'none'`, `base-uri 'self'`; externalized dark-mode bootstrap to `/dark-mode-init.js`
- Pagefind indexing post-build, Vietnamese diacritics working (ă, ê, ô automatically match ăng-ten / anten)

**What we had to fix (code review findings):**

1. **CRITICAL (HIGH):** `<CitationRegistry>` component instantiated but never used — citations were inert. Root cause: assumed a React context provider pattern from an earlier design iteration. Resolved by **converting to build-time SSR** — regex scan of `entry.body` for `<Cite id="..." />` patterns, then injected via Astro's MDX `components` prop. Zero new hydration overhead.

2. **MED:** `parityException` Zod schema accepted only `'vi-only'` while the authoring tool accepted both `'vi-only'` and `'en-only'`. Widened to enum.

3. **LOW:** Inline `<script is:inline>` for dark-mode bootstrap violated CSP `script-src 'self'`. Externalized to `/public/dark-mode-init.js` and loaded via `<script src="/..."></script>`.

4. **LOW:** CSP hardened with `frame-ancestors 'none'; base-uri 'self'; form-action 'self'`. Removed dead try/catch.

**Latent bugs surfaced during Phase 5 integration tests** (uncovered only when real content forced end-to-end execution):

1. **Astro 5 API drift:** `entry.render()` → `render(entry)` from `astro:content`. Phase 3/4 code used the deprecated API.

2. **MDX import resolution:** Workspace package imports from `../../content/` need explicit Vite alias in `astro.config.mjs`:
   ```js
   vite: {
     resolve: {
       alias: {
         '@content': new URL('./src/content', import.meta.url).pathname
       }
     }
   }
   ```

3. **Glob deduplication bug (CRITICAL for multi-language Astro sites):** The glob loader `getCollection('lessons')` was deduplicating `en/.../01-decibels.mdx` and `vi/.../01-decibels.mdx` to the same Astro entry ID (`"decibels"`), silently overwriting the EN version with the VI version. Fixed by adding explicit `generateId: ({ entry }) => entry.replace(/\.mdx$/, '')` in the Zod schema. **This silently kills any multi-language Astro site that doesn't catch it early.**

4. **GlossaryTerm not auto-injected:** MDX components map needed explicit `<Content components={{ GlossaryTerm, ... }}>` even though the component was registered. Astro doesn't auto-inject plugin-provided components into user MDX; you must pass them via the `components` prop.

5. **@fontsource/ibm-plex-sans-vietnamese doesn't exist** — the package doesn't ship a Vietnamese-specific variant. Used `@fontsource/ibm-plex-sans` which includes full Vietnamese glyphs (ă, ê, ô, etc.). No UX impact.

6. **@astrojs/tailwind + Tailwind 4 incompatibility:** Legacy PostCSS entry point broke. Migrated to `@tailwindcss/vite` instead. Cleaner integration, same output.

## What We Tried

- Initial design: runtime React context provider for citations. Abandoned — overhead + hydration complexity.
- Cloudflare Pages deploy per blueprint. Overridden by user to Vercel (first documented decision).
- Astro 4 → Astro 5 API calls: deprecated API in Phase 3 code caught and fixed during Phase 5 integration.
- Webpack + old PostCSS chain for Tailwind. Swapped to Vite plugin. Faster cold start, cleaner.

## Root Cause Analysis

**Why the latent bugs weren't caught earlier:** We didn't have *real content* to exercise the full pipeline until Phase 5. The fixture lesson (`decibels.mdx`) was minimal and didn't stress the glob loader, import resolution, or component-injection logic. The fix: **require a mandatory integration test with a real multi-language lesson early in Phase 1**, not Phase 5.

The deduplication bug specifically: Astro's `getCollection()` groups entries by their generated ID, not by their file path. If two files (VN and EN) generate the same ID, the last one wins. The schema didn't make this explicit. **Future lesson:** ID generation must be deterministic and per-file (use the relative path, not just the slug).

## Lessons Learned

1. **Build-time SSR for metadata > runtime context providers.** If you're scanning docs for patterns (citations, glossary terms, callouts), do it at build time and inject the metadata into the SSR'd HTML. Saves hydration, avoids the "invisible component" pathology.

2. **Don't assume Astro's plugin architecture auto-injects.** User code must explicitly pass components; plugins can only provide defaults to overrideable APIs.

3. **Multi-language Astro sites need explicit glob deduplication logic.** The default behavior (ID collision wins silently) is a footgun.

4. **Test with real content early, not just fixtures.** The decibels lesson was minimal enough to hide import-resolution and component-injection bugs for 4 phases.

5. **Author burnout risk is real and structural.** The scaffold is solid, but 1,000 lessons / 3–5 years is genuine scope. Every feature we add to "help authors" must measurably reduce friction. Avoid polish work on 1% of the codebase when 99% is content.

## Next Steps

- **Phase 1 kickoff:** author the first 50 lessons per domain in both languages (150 total)
- **Phase 1 milestone 1:** curriculum graph seeded in `data/curriculum.json` (shape of all lessons, even unwritten)
- **Phase 1 milestone 2:** roadmap visualizer renders the graph per domain
- **Phase 1 exit criteria:** public launch announcement; a reader can complete L0–L2 of any domain in either language
- **Deferred to Phase 1+:** roadmap visualizer, 4 of 5 flagship widgets, all 3 cross-domain bridges, Sentry, newsletter signup, domain registration, Vercel project creation, real curriculum beyond decibels

**Owner:** Crystal D.  
**Timeline:** Phase 0 complete. Phase 1 begins 2026-06-01 (target 150 lessons by 2026-10-31).

---

*Verified against fc421b9 commit; all latent bugs fixed before merge; code review gates passed. The platform is silent now. The next noise will be the sound of authoring.*
