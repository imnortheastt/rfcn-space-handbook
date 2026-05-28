---
phase: 7
title: CI + Vercel
status: completed
priority: P1
effort: 3h
dependencies:
  - 6
---

# Phase 7: CI + Vercel

## Context Links
- Blueprint: §3.7 (build/deploy pipeline), §3.8 (observability), §7.2 (bundle weight)
- User decision: deploy = **Vercel** (overrides blueprint §3.7 Cloudflare Pages)

## Overview
Two GitHub Actions workflows + `vercel.json` + `dependabot.yml`. Vercel git integration handles deploys (no `deploy.yml`). CI enforces every hard constraint: lint, validators, build, tests, bundle budget, Lighthouse, broken-link check.

## Key Insights
- Vercel git integration = zero deploy YAML. Connect repo in Vercel dashboard once; Vercel builds on every push to `main` (prod) and PR (preview). README documents the manual one-time setup.
- `vercel.json` lives at repo root and sets headers (security CSP, immutable cache on `/_astro/*`), redirects (`/` → `/en/` redundant with Astro config but explicit), and build command (`pnpm --filter @rfcn-space-handbook/web build`).
- Vercel auto-detects `pnpm-workspace.yaml` and uses `pnpm install --frozen-lockfile`.
- `size-limit` per widget chunk: configure in `packages/widgets/.size-limit.json` with limits per `dist/**/*.js` file ≤150KB gz.
- LHCI in CI runs against a `pnpm preview` server spawned in workflow; sample 2 pages (homepage + decibels lesson), mobile preset, perf budget ≥85 to allow CI noise headroom while gating regressions.
- `lychee` for broken-link check (fast, Rust-based, GitHub Actions integration trivial).

## Requirements
**Functional:** PR to `main` runs full CI; merging triggers Vercel prod deploy automatically; preview URL appears on every PR (via Vercel bot comment).
**Non-functional:** total CI runtime < 5 min on standard `ubuntu-latest`.

## Architecture
```
.github/
├── workflows/
│   ├── ci.yml                      # on: pull_request, push to non-main
│   └── nightly-link-check.yml      # on: schedule
└── dependabot.yml                  # pnpm + actions
vercel.json                         # adapter config, headers, redirects
packages/widgets/.size-limit.json   # per-chunk budget
lighthouserc.json                   # LHCI config
```

## Related Code Files
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/nightly-link-check.yml`
- Create: `.github/dependabot.yml`
- Create: `vercel.json`
- Create: `packages/widgets/.size-limit.json`
- Create: `lighthouserc.json`
- Create: `apps/web/src/pages/api/health.ts` — *skip*, we're static-only; use root `/` redirect as health
- Modify: root `package.json` add `lhci` + `size-limit` devDeps + scripts
- Modify: `README.md` add "Vercel one-time setup" section

## Implementation Steps

1. **`.github/workflows/ci.yml`** — on `pull_request` to `main` + `push` to non-main branches:
   - jobs: `lint-validate-build-test` (single job, cache-heavy)
   - steps: checkout → setup-node 22 → setup-pnpm v9 → `pnpm install --frozen-lockfile` (with cache) → `pnpm lint` → `pnpm validate` → `pnpm -r build` → `pnpm test` → `pnpm --filter @rfcn-space-handbook/web exec pagefind --site dist` (postbuild) → `pnpm size-limit` → `npx -y lychee ./content/**/*.mdx ./README.md --no-progress`
   - Separate `lhci` job depending on the above, runs `pnpm --filter web preview &` then `lhci autorun --config=./lighthouserc.json`
   - All jobs concurrency-keyed to PR (cancel prior runs on push)

2. **`.github/workflows/nightly-link-check.yml`** — cron `0 3 * * *`:
   - checkout → install lychee → run against all `.mdx` external links + standards URLs from `data/citations.json`
   - on failure: open issue using `peter-evans/create-issue-from-file` with the report attached

3. **`.github/dependabot.yml`**:
   - ecosystem `npm`, directory `/`, schedule weekly, group all minor+patch in one PR
   - ecosystem `github-actions`, weekly

4. **`vercel.json`**:
   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "buildCommand": "pnpm --filter @rfcn-space-handbook/web build",
     "outputDirectory": "apps/web/dist",
     "installCommand": "pnpm install --frozen-lockfile",
     "framework": "astro",
     "redirects": [{ "source": "/", "destination": "/en/", "permanent": false }],
     "headers": [
       {
         "source": "/_astro/(.*)",
         "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
       },
       {
         "source": "/(.*)",
         "headers": [
           { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' data:; connect-src 'self'" },
           { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "Permissions-Policy", "value": "interest-cohort=()" }
         ]
       }
     ]
   }
   ```

5. **`packages/widgets/.size-limit.json`**:
   ```json
   [
     { "path": "dist/rf/polar-plot.js", "limit": "30 KB" },
     { "path": "dist/**/*.js", "limit": "150 KB" }
   ]
   ```
   - Install `size-limit` + `@size-limit/preset-small-lib` as devDep on the widgets package.

6. **`lighthouserc.json`** at root:
   ```json
   {
     "ci": {
       "collect": { "url": ["http://localhost:4321/en/", "http://localhost:4321/en/rf/r0-foundations/decibels"], "numberOfRuns": 1, "settings": { "preset": "mobile" } },
       "assert": { "preset": "lighthouse:no-pwa", "assertions": { "categories:performance": ["error", { "minScore": 0.85 }], "categories:accessibility": ["error", { "minScore": 0.9 }], "categories:best-practices": ["warn", { "minScore": 0.9 }] } }
     }
   }
   ```

7. **README addition** — manual Vercel setup:
   ```
   1. Create Vercel project, "Import Git Repository" → select this repo
   2. Framework Preset: Astro
   3. Build/Install/Output overridden by vercel.json (no UI changes needed)
   4. Add domains in Project Settings → Domains (when ready)
   5. Web Analytics auto-enabled by adapter config
   ```

8. Verify by opening a draft PR with all changes, watching CI run end-to-end green.

## Todo List
- [ ] ci.yml with all checks
- [ ] nightly-link-check.yml
- [ ] dependabot.yml
- [ ] vercel.json with headers, redirects, build command
- [ ] .size-limit.json on widgets + size-limit script in root package.json
- [ ] lighthouserc.json
- [ ] README Vercel one-time setup section
- [ ] Draft PR with everything → CI green

## Success Criteria
- [ ] CI workflow runs and passes on a draft PR within < 5 min
- [ ] LHCI mobile perf ≥85 on both sampled pages
- [ ] Bundle size assertion green (PolarPlot ≤30KB, all chunks ≤150KB)
- [ ] No broken links in lychee scan
- [ ] Vercel preview URL appears in PR (post-`vercel link` user step)
- [ ] CSP headers present in preview deployment response

## Risk Assessment
- **Playwright in CI** (medium): `rehype-mermaid` needs Playwright Chromium; install adds ~250MB + 30s. Mitigation: cache `~/.cache/ms-playwright`; if too slow, swap to `mmdc` external build step.
- **Vercel free Hobby commercial-use clause** (low for v1): handbook is non-commercial and CC-BY-SA. If monetization ever introduced, upgrade or move back to Cloudflare.
- **CSP `'unsafe-inline'` on styles** (medium): Astro's island hydration injects inline styles. We accept `unsafe-inline` on style-src only; script-src stays strict. Document in `docs/security-posture.md` later.

## Security Considerations
- CSP set on every response.
- No secrets in workflow files — Vercel deploy keys live in Vercel project settings, never in repo.
- Dependabot weekly catches CVEs in transitive deps.
- Lychee runs against external links nightly — bad standards URLs caught early.

## Next Steps
Phase 8 finishes Tailwind setup + design tokens so the UI renders polished, not raw.
