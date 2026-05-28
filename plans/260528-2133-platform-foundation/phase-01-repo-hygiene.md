---
phase: 1
title: Repo Hygiene
status: completed
priority: P1
effort: 1h
dependencies: []
---

# Phase 1: Repo Hygiene

## Context Links
- Blueprint: `docs/PLATFORM_BLUEPRINT.md` §6.1 (sourcing/license), §10 (open decisions)
- Bootstrap scope: `/Users/imnortheast/.claude/plans/you-must-gather-information-dazzling-whale.md`

## Overview
Top-level repo files that every later phase assumes. Git already initialized on `main` (no commits).

## Key Insights
- License must be CC-BY-SA-4.0 for content (blueprint §6.1). Code license: MIT — separate file, declared in root `package.json`. Document the split in LICENSE / NOTICE.
- README is reader-facing; CONTRIBUTING is author-facing (the future tech-blog authors writing 1,000 lessons).

## Requirements
**Functional:** repo bootable by a new contributor with `pnpm install` instructions in README.
**Non-functional:** no secrets ever committed; `.gitignore` covers Node, Astro, Vercel, OS junk.

## Architecture
Flat root files. No subdirs created in this phase.

## Related Code Files
- Create: `LICENSE` (CC-BY-SA-4.0 full text, scope = `content/` and `data/`)
- Create: `LICENSE-CODE` (MIT, scope = everything else)
- Create: `NOTICE` (explains the dual-license split)
- Create: `README.md` (project pitch + dev quickstart + Vercel deploy notes)
- Create: `CONTRIBUTING.md` (author workflow, lesson template pointer, parity rule)
- Create: `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1)
- Modify: `.gitignore` (extend with: `node_modules/`, `dist/`, `.astro/`, `.turbo/`, `.vercel/`, `.env*`, `coverage/`, `.DS_Store`, `*.log`)

## Implementation Steps
1. Write `LICENSE` (CC-BY-SA-4.0 text from creativecommons.org legalcode).
2. Write `LICENSE-CODE` (MIT, copyright Tindang + contributors).
3. Write `NOTICE` (1 paragraph: code MIT, content CC-BY-SA-4.0, see respective files).
4. Write `README.md`: project name, one-line pitch from blueprint §0, dev quickstart (`pnpm install && pnpm dev`), build (`pnpm build`), structure overview pointing to blueprint, Vercel setup notes (manual: `vercel link`, set `CLOUDFLARE_*` no — just `VERCEL_*` if needed), link to PLATFORM_BLUEPRINT.md.
5. Write `CONTRIBUTING.md`: branch model (`main` is shipped; feature branches → PR), parityId rule (lessons land in pairs or not at all), commit conventions (conventional commits, no AI references), how to add a citation / glossary term, how to run validators locally.
6. Write `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1 verbatim).
7. Extend `.gitignore` with Node/Astro/Turbo/Vercel/coverage/OS entries (preserve existing entries).

## Todo List
- [ ] LICENSE (CC-BY-SA-4.0)
- [ ] LICENSE-CODE (MIT)
- [ ] NOTICE
- [ ] README.md
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md
- [ ] .gitignore extended

## Success Criteria
- [ ] All 7 files present at repo root
- [ ] `.gitignore` covers Node + Astro + Vercel + OS
- [ ] License split (content vs code) is unambiguous and documented in NOTICE
- [ ] README has working `pnpm install && pnpm dev` instruction (will work after Phase 2-3)

## Risk Assessment
- **License confusion** (low/medium): single LICENSE file is more common; we split for a deliberate reason (content vs code). NOTICE must be clear. Mitigation: state the split explicitly in README too.

## Security Considerations
- `.gitignore` must include `.env*` before any `apps/web/` work — prevent accidental secret commits.

## Next Steps
Phase 2: monorepo workspace files reference these license/readme files.
