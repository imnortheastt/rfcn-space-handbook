---
phase: 6
title: Tools Validators
status: completed
priority: P1
effort: 2h
dependencies:
  - 5
---

# Phase 6: Tools Validators

## Context Links
- Blueprint: §3.5 (parity check), §3.7 (CI workflows), §7.3 (parity drift mitigation), §7.4 (standards drift)

## Overview
Three build-time CLI validators in `tools/*`, each independently runnable and CI-wired (Phase 7). Each writes a concise report to stdout, exits 0 on pass and non-zero on fail.

## Key Insights
- These are intentionally *separate* from Astro's built-in content validation: redundancy is a feature, and standalone tools mean a contributor can run them outside the dev server.
- Each is a tiny Node CLI (no framework, just `fs`, `glob`, `zod` from the citations package). Keeps deps minimal.
- The diagram-build tool is a *placeholder* in Phase 0 — no `.mmd` files exist yet. We wire it so Phase 1+ can drop diagrams in `diagrams/` and they auto-build.

## Requirements
**Functional:**
- `tools/i18n-parity-check`: walks `content/{en,vi}/**/*.mdx`, parses frontmatter, asserts every `parityId` appears in *both* locales (unless `parityException: vi-only` set)
- `tools/frontmatter-validator`: runs Zod schema (re-imported from `apps/web/src/content/config.ts`) against every `.mdx`, reports a clean table of failures
- `tools/diagram-build`: globs `diagrams/**/*.mmd`, runs `mmdc` to produce `diagrams/**/*.svg` next to source; skips if mtime SVG > mtime MMD

**Non-functional:** each tool runs in < 5s on the Phase 0 corpus; output is grep-friendly (no fancy ANSI on CI).

## Architecture
```
tools/
├── i18n-parity-check/
│   ├── package.json          @rfcn-space-handbook/tool-i18n-parity-check
│   ├── tsconfig.json
│   └── src/index.ts          # invoked via `node tools/i18n-parity-check/dist/index.js` or `tsx`
├── frontmatter-validator/
│   ├── package.json          @rfcn-space-handbook/tool-frontmatter-validator
│   ├── tsconfig.json
│   └── src/index.ts
└── diagram-build/
    ├── package.json          @rfcn-space-handbook/tool-diagram-build
    ├── tsconfig.json
    └── src/index.ts          # shells out to mmdc
```

Each tool is a workspace package, runnable via `pnpm --filter @rfcn-space-handbook/tool-* exec tsx src/index.ts`.

Root `package.json` exposes top-level scripts: `pnpm validate:parity`, `pnpm validate:frontmatter`, `pnpm build:diagrams`, `pnpm validate` (runs all three).

## Related Code Files
- Create: `tools/i18n-parity-check/{package.json,tsconfig.json,src/index.ts}`
- Create: `tools/frontmatter-validator/{package.json,tsconfig.json,src/index.ts}`
- Create: `tools/diagram-build/{package.json,tsconfig.json,src/index.ts}`
- Modify: root `package.json` scripts

## Implementation Steps

1. **i18n-parity-check**:
   - Glob `content/en/**/*.mdx` and `content/vi/**/*.mdx`
   - Parse frontmatter with `gray-matter`
   - Build two `Set<parityId>` and diff
   - Report: per-side missing parityIds with file paths
   - Honor `parityException: 'vi-only'` (or `'en-only'`)
   - Exit 1 if any unmatched

2. **frontmatter-validator**:
   - Import `lessonFrontmatterSchema` from `apps/web/src/content/config.ts` (via workspace alias or relative path)
   - Glob `content/**/*.mdx`, parse frontmatter, run `safeParse`
   - Report failures as a table: `[file] [field] [error]`
   - Exit 1 on any failure

3. **diagram-build**:
   - Glob `diagrams/**/*.mmd`
   - For each, check `diagrams/.../foo.svg` mtime; skip if newer than `.mmd`
   - Else shell `npx mmdc -i foo.mmd -o foo.svg -t neutral -b transparent`
   - In Phase 0 with 0 `.mmd` files: should print "no diagrams to build" and exit 0
   - Document `@mermaid-js/mermaid-cli` as a tool dep

4. Root `package.json` script additions:
   ```json
   "validate:parity": "pnpm --filter @rfcn-space-handbook/tool-i18n-parity-check exec tsx src/index.ts",
   "validate:frontmatter": "pnpm --filter @rfcn-space-handbook/tool-frontmatter-validator exec tsx src/index.ts",
   "validate": "pnpm validate:parity && pnpm validate:frontmatter",
   "build:diagrams": "pnpm --filter @rfcn-space-handbook/tool-diagram-build exec tsx src/index.ts"
   ```

5. Smoke each tool against Phase 5 content:
   - parity: should exit 0 (decibels exists in both EN and VI)
   - frontmatter: should exit 0 (Phase 5 lessons validate)
   - diagrams: should print "no diagrams" and exit 0

## Todo List
- [ ] tools/i18n-parity-check scaffold + implementation
- [ ] tools/frontmatter-validator scaffold + implementation
- [ ] tools/diagram-build scaffold + implementation
- [ ] Root package.json scripts wired
- [ ] All three smoke-pass against Phase 5 content
- [ ] Negative test: temporarily delete `content/vi/.../decibels.mdx` → parity-check exits 1 with clear error → restore file

## Success Criteria
- [ ] `pnpm validate` exits 0 with current content
- [ ] `pnpm validate:parity` correctly detects asymmetry when an EN lesson lacks VI sibling (negative-test confirmed)
- [ ] `pnpm validate:frontmatter` correctly rejects an MDX with missing required field
- [ ] Tools usable independently of CI (a contributor runs them locally pre-PR)

## Risk Assessment
- **Cross-package import of Zod schema** (medium): `tools/frontmatter-validator` importing from `apps/web/src/content/config.ts` couples tool to app. Mitigation: extract schema to `packages/content-schema` if it becomes a problem; defer until then (YAGNI).
- **gray-matter perf** (low): few hundred files at most, negligible.
- **mmdc Playwright vs puppeteer** (low): `@mermaid-js/mermaid-cli` uses puppeteer-core; document `npx puppeteer browsers install chrome` if needed. In Phase 0 with no diagrams this doesn't trigger.

## Security Considerations
- Tools only read files inside repo; no network, no exec of user-controlled strings.
- `mmdc` shells out — input filename comes from glob, not user input. Safe.

## Next Steps
Phase 7 wires these tools into GitHub Actions CI + adds Vercel deploy config.
