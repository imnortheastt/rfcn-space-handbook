# Code Review — Phase 0 Platform Foundation (pre-commit)

**Reviewer:** code-reviewer subagent
**Date:** 2026-05-28
**Scope:** ~80 files, Astro 5 SSG monorepo, bilingual handbook scaffold
**Verifier baseline:** `tester-260528-2201-platform-foundation-verification-report.md` (build green, 29/29 tests pass)

## Verdict: APPROVE_WITH_CONCERNS

Foundation is solid and faithful to the blueprint. Two contract drifts worth fixing before commit (one is trivial, one is a latent functional gap that the blueprint explicitly flagged as a Phase 0 deliverable). No security blockers. No scope creep.

## Findings

| Sev | File:Line | Issue | Recommendation |
|-----|-----------|-------|----------------|
| HIGH | `apps/web/src/layouts/LessonLayout.astro:21,74` + `apps/web/src/pages/[lang]/[domain]/[...slug].astro` | `<Cite>` registry context is **never instantiated**. `LessonLayout` declares `citations = []` and `citedIds = []` defaults, but the lesson route never wraps content in `<CitationRegistry>` nor computes `citedIds`. Result: every `<Cite id="…">` in MDX renders the literal id (`[ieee-145-2013]`) instead of `[1]`, and `<BibliographyCollector>` always renders nothing. Verifier said "renders" — it does, but the citation system is wired but inert. | Either (a) wrap `<Content>` with a server-side registry + collect cited ids, or (b) explicitly mark citations as Phase-1 follow-up and add a TODO at the call site so it isn't forgotten. The current state ships latent dead code. |
| MED | `apps/web/src/content/config.ts:68` vs `tools/i18n-parity-check/src/index.ts:24,52,59` | Schema/validator contract mismatch: Zod `parityException` is `z.literal('vi-only')`. The parity tool accepts both `'vi-only'` and `'en-only'`. An EN-only lesson would pass i18n parity but fail Zod build. | Pick one. Blueprint §3.3 only names `parityException` generically. Recommend extending Zod to `z.enum(['vi-only','en-only'])` (matches tool), and update `LangSwitcher` prop type. |
| MED | `apps/web/src/components/LangSwitcher.astro:17` | Prop type `parityException?: 'vi-only'` will TS-error the moment item above is widened. | Update with the same enum change. |
| LOW | `apps/web/src/lib/i18n.ts` | `ui` object is `as const satisfies Record<Locale, Record<string,string>>` — VI keys are not type-checked to match EN keys. If a VI key is dropped, `t(vi, 'foo')` returns `undefined` at runtime. | Add `Record<Locale, typeof ui.en>` constraint. Cheap fix, prevents drift over 800+ lessons. |
| LOW | `vercel.json:18` CSP | `style-src 'unsafe-inline'` is acceptable (Astro scoped styles + KaTeX inline styles need it). `script-src 'self'` is strict — good. No `frame-ancestors`, no `base-uri`. Mermaid `strategy: 'pre-mermaid'` defers SVG render to client, which **requires bundled mermaid JS** under `'self'`. Should be fine but verify with a real Mermaid lesson before declaring CSP locked. | Add `frame-ancestors 'none'; base-uri 'self'` for defense-in-depth. Confirm Mermaid client renders under current CSP once a diagram lesson lands. |
| LOW | `apps/web/src/layouts/BaseLayout.astro:65-80` (inline dark-mode script) | Safe: no user input, wrapped in try/catch, runs before paint. CSP-compatible with `script-src 'self'` only if Astro hashes inline scripts via `is:inline` — **Astro does not auto-hash `is:inline`**, so this script will be blocked by the current CSP. | Either move to an external `/theme-bootstrap.js`, or add a CSP nonce/hash. **Verify in a Vercel preview before commit** — this is the most likely runtime regression. |
| LOW | `packages/citations/src/cite.tsx:60-68` | `useEffect` re-registers id on every change, but `register()` is order-dependent and idempotent only for the **same** id. For SSR-only consumption this is moot, but if a `<Cite>` is rendered inside a hydrated island the duplicate registration is harmless yet wasted work. | Fine as-is; document the SSR-first assumption. |
| LOW | `apps/web/astro.config.mjs:18-25` | `try/catch` around `remarkGlossaryAutoLink` config is theatre — `require()`/import resolution happens at module top, not inside the try block. If the package were truly missing, build crashes before reaching this code. | Either remove the dead try/catch, or move plugin import inside it via dynamic `await import()`. |

## Verified-OK (no action)

- License posture per §6.1: `LICENSE` (CC-BY-SA-4.0 for content), `LICENSE-CODE` (MIT), `NOTICE` clarifying boundary — correct.
- `prefixDefaultLocale: true`, `redirectToDefaultLocale: false` — matches blueprint.
- Zero-JS rule honored: only `client:visible` used in pilot (`PolarPlot`), no `client:load` anywhere.
- Astro 5 content layer `generateId` set correctly to prevent en/vi id collision — comment in `config.ts:7-10` documents the fix.
- `getStaticPaths` correctly maps `lang`/`domain`/`slug` per entry (no filter needed — entries are already lang-tagged).
- Remark plugin order correct: glossary BEFORE `remarkMath`, math identifiers protected.
- `execFileSync` in `tools/diagram-build` uses argv array (no shell), path from glob — safe.
- No secrets / API keys found.
- Pilot pair `rf-r0-foundations-01-decibels` renders in both languages, parity check passes.

## Decision Summary

**Must address before commit:**
1. **LOW-but-likely** CSP vs inline dark-mode script — verify on Vercel preview; if blocked, externalize.
2. **MED** parityException enum mismatch (Zod vs validator) — 5-min fix.

**Can defer (open a Phase-1 follow-up):**
3. **HIGH** Citation registry wiring — file an issue titled "Wire CitationRegistry + citedIds into lesson route" so the bibliography section actually renders. The infrastructure is in place; only the route-level glue is missing.
4. **LOW** `Record<Locale, typeof ui.en>` typing, `frame-ancestors`/`base-uri` CSP hardening, remove dead try/catch in `astro.config.mjs`.

No scope creep detected. Phase 0 stayed at platform-only + 1 pilot pair.

## Unresolved Questions

1. Is the citation system intentionally inert in Phase 0 (deferred to first real lesson batch), or was the route-level wiring missed? Plan §6 implies wired, code says otherwise.
2. Should the inline dark-mode bootstrap be tested under prod CSP before commit, or accepted as a known follow-up if Vercel preview blocks it?
3. Is `parityException: 'en-only'` a real future case (EN-only research notes)? If never, drop it from the validator instead of widening Zod.

---
**Status:** DONE_WITH_CONCERNS
**Summary:** Foundation is contract-faithful and secure. One latent functional gap (citation registry not wired into route) and one schema/validator drift to resolve; CSP-vs-inline-script needs preview verification before merge.
