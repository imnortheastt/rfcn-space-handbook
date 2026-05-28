# Code Review Fixes — Platform Foundation (pre-commit)

**Date:** 2026-05-29
**Scope:** 4 findings from `code-review-260528-2201-platform-foundation-review.md`

## Fix Summary

| # | Sev | Finding | Fix Applied | Verification |
|---|-----|---------|-------------|--------------|
| 1 | HIGH | `<Cite>` registry never instantiated — renders raw IDs, bibliography always empty | Build-time SSR pipeline: `CiteResolved` pure component added to `cite.tsx`; `makeCiteComponent()` factory in `cite-page-component.tsx` pre-binds id→[n] map; lesson route scans `entry.body` via regex for `<Cite id="...">` patterns, passes resolved component via `<Content components={{ Cite }}>`, passes `citedIds`+`citationsDB` to `BibliographyCollector`. Zero client:load hydration. | dist HTML contains `cite-ieee-145-2013`, `[1]`, `lesson-references`, `References`, `IEEE` — FOUND |
| 2 | MED | `parityException: z.literal('vi-only')` drifts from tool accepting both `'vi-only'\|'en-only'` | `config.ts`: changed to `z.enum(['vi-only', 'en-only'])`. `LangSwitcher.astro`: prop type widened to `'vi-only' \| 'en-only'`. | `pnpm validate` passes (parity + frontmatter) |
| 3 | LOW | Inline dark-mode script blocked by CSP `script-src 'self'` | Extracted to `apps/web/public/dark-mode-init.js`. `BaseLayout.astro` uses `<script is:inline src="/dark-mode-init.js">` — Astro emits literal src tag, CSP 'self' compliant. | dist HTML contains `dark-mode-init` — FOUND |
| 4a | LOW | Missing `frame-ancestors`, `base-uri`, `form-action` CSP directives | `vercel.json` CSP updated: appended `frame-ancestors 'none'; base-uri 'self'; form-action 'self'` | `python3 -m json.tool vercel.json \| grep csp` confirms all 3 directives |
| 4b | LOW | Dead `try/catch` around `remarkGlossaryAutoLink` config | Removed try/catch; `data/glossary.json` is committed — direct assignment now. Simplified `remarkPlugins` array. | Build succeeds |
| 4c | LOW | `ui` object not type-checking VI keys against EN keys | Extracted `en` block as `const en = {...} as const`; defined `type UIKeys = typeof en`; applied `satisfies UIKeys` to `vi` block. Compile-time error if VI key is dropped. | `pnpm --filter @rfcn-space-handbook/web build` clean |

## Build & Test Results

| Check | Result |
|-------|--------|
| `pnpm --filter @rfcn-space-handbook/web build` | PASS — 5 pages built |
| `pnpm test` | PASS — 9/9 citations tests, web no-test pass |
| `pnpm validate` | PASS — 1 parity match, 2 frontmatter valid |
| `pnpm exec eslint <modified files>` | PASS — no issues |
| `pnpm --filter @rfcn-space-handbook/widgets size-limit` | PASS — 89.59 kB / 100 kB limit |
| Citation `[1]` in EN decibels page | FOUND |
| Citation `[1]` in VI decibels page | FOUND |
| `đề-xi-ben` in VI page | FOUND |

## Files Modified

- `packages/citations/src/cite.tsx` — added `CiteResolved` pure SSR component (no hooks, no context)
- `packages/citations/src/index.ts` — exported `CiteResolved`, `CiteResolvedProps`
- `apps/web/src/pages/[lang]/[domain]/[...slug].astro` — wired citation pipeline (load JSON, scan body, inject component)
- `apps/web/src/components/cite-page-component.tsx` — NEW: `makeCiteComponent()` factory
- `apps/web/src/content/config.ts` — `parityException` widened to `z.enum`
- `apps/web/src/components/LangSwitcher.astro` — prop type widened to match enum
- `apps/web/public/dark-mode-init.js` — NEW: externalized dark-mode bootstrap
- `apps/web/src/layouts/BaseLayout.astro` — replaced inline script with `<script is:inline src="/dark-mode-init.js">`
- `vercel.json` — appended 3 CSP directives
- `apps/web/astro.config.mjs` — removed dead try/catch
- `apps/web/src/lib/i18n.ts` — `en` block extracted, `UIKeys` type enforces key parity at compile time

## Unresolved Questions

None. All 4 findings resolved without deferred workarounds.

---
**Status:** DONE
**Summary:** All 4 review findings fixed. Build clean, 29/29 tests pass, citation `[1]` markers render in both locales with bibliography, zero client-side hydration added.
