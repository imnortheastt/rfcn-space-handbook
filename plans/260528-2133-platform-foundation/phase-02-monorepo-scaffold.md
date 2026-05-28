---
phase: 2
title: Monorepo Scaffold
status: completed
priority: P1
effort: 1.5h
dependencies:
  - 1
---

# Phase 2: Monorepo Scaffold

## Context Links
- Blueprint: §3.2 (repo structure), §3.9 (tech stack)
- Bootstrap scope: deliverable #2

## Overview
pnpm workspaces + Turborepo + root TypeScript/ESLint/Prettier configs. Empty workspace dirs created.

## Key Insights
- pnpm + Turbo chosen over Nx for lightness (blueprint §3.2 explicitly).
- Root `tsconfig.base.json` uses `composite: true` so packages can `references` it.
- Turbo pipeline: `build` depends on `^build` (deps first), `test` depends on nothing, `lint` depends on nothing. Cache everything.
- pnpm `packageManager` field pinned in root `package.json` (Corepack-compatible).

## Requirements
**Functional:** `pnpm install` from root works; `pnpm -r build` walks workspaces.
**Non-functional:** root configs are the single source of truth; per-package configs extend them.

## Architecture
```
/
├── pnpm-workspace.yaml        # apps/*, packages/*, tools/*
├── package.json               # private, packageManager, root scripts
├── turbo.json                 # pipeline tasks
├── tsconfig.base.json         # strict, ES2022, ESM, paths
├── .eslintrc.cjs              # @typescript-eslint, astro, react
├── .prettierrc                # 2-space, single-quote, trailing-comma
├── .editorconfig
├── apps/                      # empty
├── packages/                  # empty
├── content/                   # empty
├── data/                      # empty
├── diagrams/                  # empty
└── tools/                     # empty
```

## Related Code Files
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root, private)
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.eslintrc.cjs`
- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `.editorconfig`
- Create: empty placeholder dirs via `.gitkeep`: `apps/.gitkeep`, `packages/.gitkeep`, `content/.gitkeep`, `data/.gitkeep`, `diagrams/.gitkeep`, `tools/.gitkeep`

## Implementation Steps
1. `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
     - 'tools/*'
   ```
2. Root `package.json` (private: true; packageManager: `pnpm@9.x`; scripts: `dev`, `build`, `test`, `lint`, `format`, `clean` — all delegate to `turbo run <task>`).
3. `turbo.json` pipeline: `build` (dependsOn: `^build`, outputs `dist/**`, `.astro/**`), `test`, `lint`, `dev` (cache: false, persistent: true).
4. `tsconfig.base.json`: `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true`, `jsx: react-jsx`, `skipLibCheck: true`, paths placeholder.
5. `.eslintrc.cjs`: extends `eslint:recommended`, `@typescript-eslint/recommended`, `plugin:astro/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`. Override Astro files. `no-unused-vars: warn`. Ignore `dist/`, `.astro/`, `node_modules/`.
6. `.prettierrc`: 2-space, single-quote, no semis (or with semis — pick semis for consistency with Astro defaults), trailing comma `all`, `printWidth: 100`, plugin: `prettier-plugin-astro`.
7. `.prettierignore`: `dist/`, `.astro/`, `node_modules/`, `pnpm-lock.yaml`, `*.mdx` (we format MDX by hand to preserve prose), `data/*.json`.
8. `.editorconfig`: utf-8, lf, 2-space, trim trailing whitespace, final newline.
9. `.gitkeep` files in 6 empty dirs.
10. Run `pnpm install` to materialize lockfile + `node_modules`. Expect zero deps until per-package package.json files exist; just installs pnpm machinery.

## Todo List
- [ ] pnpm-workspace.yaml
- [ ] root package.json
- [ ] turbo.json
- [ ] tsconfig.base.json
- [ ] .eslintrc.cjs + plugins listed in devDependencies of root package.json
- [ ] .prettierrc + .prettierignore + prettier-plugin-astro
- [ ] .editorconfig
- [ ] empty workspace dirs + .gitkeep
- [ ] `pnpm install` succeeds

## Success Criteria
- [ ] `pnpm install` exits 0
- [ ] `pnpm -r build` exits 0 (no workspaces yet → no-op, expected)
- [ ] `pnpm lint` exits 0 (no files yet → no-op)
- [ ] Turbo cache dir `.turbo/` is gitignored

## Risk Assessment
- **pnpm version mismatch** (low): pin `packageManager` field; Corepack handles per-repo version.
- **Turbo remote cache** (low/medium): blueprint §3.7 mentions Vercel remote cache; defer setup until build time exceeds 1 min (currently empty).

## Security Considerations
- Root `package.json` is `private: true` — never accidentally published.
- No deps yet means no supply-chain surface in this phase.

## Next Steps
Phase 3 adds `apps/web` Astro app inside this workspace structure.
