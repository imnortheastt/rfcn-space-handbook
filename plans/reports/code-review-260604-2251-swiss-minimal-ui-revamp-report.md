# Code Review — Swiss-Minimal Light-First UI Revamp

Date: 2026-06-04 · Reviewer: code-reviewer
Scope: uncommitted working-tree diff + untracked files under `apps/web/src`, `packages/ui/src`, `packages/glossary/src`. Content `.mdx` and `docs/` changes excluded per instructions.

## Verdict

Design contract largely honored: zero raw cyan, zero decorative box-shadows, correct 3-col grid with `minmax(0,1fr)` center track, Shiki dark dual-mapping present, identical dark blocks in tokens.css, no `<style>{expr}` violations. Several real defects below.

---

## CRITICAL

### C1. `@vite-ignore` uses wrong comment form — Pagefind dynamic import not silenced
`apps/web/src/components/CommandPalette.astro:176-177`
```js
// @vite-ignore — runtime-only import; not resolvable at build time
const pf = await import('/pagefind/pagefind.js');
```
Vite only honors the **block-comment-inside-the-call** form. A line comment on the preceding line is ignored. Contract item 5 explicitly requires `/* @vite-ignore */`. As written, Vite still attempts to resolve `/pagefind/pagefind.js` at build → emits an unresolvable-import warning, and can fail the build under strict/CI configs.
Fix: `await import(/* @vite-ignore */ '/pagefind/pagefind.js');`

---

## MAJOR

### M1. i18n `satisfies UIKeys` constrains values to English string literals — breaks every translated `vi` string (8 type errors)
`apps/web/src/lib/i18n.ts:46,48,79`
`en` is declared `as const` (line 46), so `type UIKeys = typeof en` (line 48) has **string-literal** value types. `vi … satisfies UIKeys` (line 79) then requires each `vi` value to be assignable to the corresponding English literal — impossible for real translations. `astro check` reports 8 `ts(2322)` errors (e.g. `'Bắt đầu học'` not assignable to `'Start learning'`). Only identical pairs (`domainRf: 'RF'/'RF'`) pass.
Caveat: the `as const` + `satisfies` mechanism is **pre-existing** (committed in `fc421b9`), not introduced by this diff. But this revamp **adds 15 new key pairs**, 11 of which differ between en/vi and thus add new errors to an already type-check-failing file. Contract item 8 ("en and vi key sets identical, TS UIKeys constraint") is not actually enforcing *keys* — it's (wrongly) enforcing *values*.
Fix: define the key contract over keys only, e.g. `type UIKeys = Record<keyof typeof en, string>;` then `vi … satisfies UIKeys`. This keeps the dropped-key compile error while allowing translated values. Recommend confirming with owner since it touches pre-existing infra.

### M2. `aria-activedescendant` always set to empty string — listbox keyboard nav not announced
`apps/web/src/components/CommandPalette.astro:241,279`
Result options are created with `a.dataset.idx` but **no `a.id`** (line 241). `setActive` does `input.setAttribute('aria-activedescendant', el.id || '')` (line 279) → always `''`. The `role="listbox"` / `role="option"` / arrow-key pattern is wired, but screen readers cannot track the active option because the active-descendant reference never resolves. a11y regression for the documented combobox contract.
Fix: assign `a.id = 'cp-opt-' + optionIndex` in `renderResults` so `aria-activedescendant` points to a real node.

---

## MINOR

### m1. ThemeToggle icon state not mirrored for `prefers-color-scheme` fallback path
`apps/web/src/components/ThemeToggle.astro:90-95`
Icon visibility is keyed only on `:global(.theme-dark)`; there is no `@media (prefers-color-scheme: dark)` twin. Every other dark surface in tokens.css/base.css mirrors both. In the **common** path this is harmless: `dark-mode-init.js:8-10` adds `.theme-dark` when OS prefers dark and no stored pref. The gap is only the catch path (`dark-mode-init.js:13-14`): localStorage blocked (private browsing / permissions policy) **and** OS-dark → page renders dark via `@media`, but no `.theme-dark` class, so the toggle shows the moon (light) icon over a dark page. Narrow but real inconsistency with the dual-structure contract (item 1).
Fix: add `@media (prefers-color-scheme: dark) { :root:not(.theme-light) .icon-sun { display:block } … .icon-moon { display:none } }`.

### m2. Stale breakpoint in TableOfContents doc/comments (1280px vs actual 1024px)
`apps/web/src/components/TableOfContents.astro:5-7,34,62` (JSDoc + inline comments say "≥1280px"/"<1280px")
Actual rail/mobile toggle is governed by `LessonLayout.astro` media queries at **1024/1025px** (`LessonLayout.astro:176`, `DocsLayout.astro:256`). Behavior is correct (contract item 6 "hidden ≤1024px" is met); only the comments are wrong. Doc-only, no runtime impact. Align comments to 1024px to avoid future confusion.

### m3. Palette and sidebar drawer share `document.body.style.overflow` with no nesting guard
`CommandPalette.astro:158,189` and `DocsLayout.astro:191,205`
Both set/clear `body.style.overflow` directly. If the mobile sidebar drawer is open and the user hits ⌘K (palette opens, then closes), `closePalette` resets `overflow=''` while the drawer is still open → background scroll unlocks under the drawer. Edge case (both modals open simultaneously on mobile); low likelihood. Consider a ref-count or checking the other modal's state before clearing.

---

## Verified PASS (contract items)

- **Item 1 (dual dark structure):** `:root.theme-dark` (tokens.css:101-127) and `@media prefers-color-scheme` (130-151) blocks are byte-identical in token values. Tier comments match actual values.
- **Item 2 (no decorative shadows):** grep across scope — zero `box-shadow:` declarations outside `transition` lists and `var(--focus-ring)`. Focus rings use `var(--focus-ring)` / outline only.
- **Item 3 (no raw cyan):** zero matches for `88e1e6` / `rgba(136,225,230)` anywhere in scope. Teal `--color-accent-*` tokens only.
- **Item 4 (no `<style>{expr}`):** none found; roadmap-svg.astro:5 even carries a guard comment.
- **Item 5 (palette a11y):** role=dialog + aria-modal (35-41), focus trap (136-152), Esc (393-397) + backdrop (391) close, restore focus (208-210), sibling `inert` + body lock, `astro:after-swap` re-init (417-422), dev fallback (329-337). Excerpt `innerHTML` is Pagefind-generated plain text (safe, line 250-253); user query escaped via `escHtml` (349,378). Gaps: C1, M2 above.
- **Item 7 (3-col grid):** `grid-template-columns: 240px minmax(0,1fr) 200px` (DocsLayout.astro:237); `.docs-content` `min-width:0` (243). Collapses cleanly at 1024/768px.
- **Item 8 (i18n parity):** all 15 new keys present in both en and vi. Constraint mechanism flawed — see M1.
- **Item 9 (WCAG AA tokens):** accent-link `#0f766e` on white and dark accent `#2dd4bf` on `#0a0a0a` match contract; contrast notes in token comments consistent with values.
- **Item 10 (Shiki dark mapping):** `.theme-dark pre.astro-code span { color: var(--shiki-dark) }` (base.css:161) + `prefers-color-scheme` twin (base.css:169-173).
- **CommandPalette wiring:** rendered in Header (Header.astro:86), trigger via `window.__cpOpen` with own `astro:after-swap` re-init (Header.astro:103-107).

## Unresolved questions

1. Does CI gate on `astro check`? If yes, M1 (i18n) and the pre-existing `[...slug].astro` content-collection `never` errors (22 of the 30, unrelated to this revamp) already fail the build. Confirm whether those 22 are tracked separately.
2. M1 touches pre-existing infra (`as const`/`satisfies`) committed in `fc421b9` — confirm with owner before changing the type contract, per repo's verified-decision rule.

**Status:** DONE — 1 critical, 2 major findings (plus 3 minor).
