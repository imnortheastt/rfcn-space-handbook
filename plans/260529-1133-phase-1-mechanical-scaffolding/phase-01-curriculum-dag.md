---
phase: 1
title: "Curriculum DAG"
status: completed
priority: P1
effort: "2h"
dependencies: []
---

# Phase 1: Curriculum DAG

## Context Links
- Blueprint: §5 (full curriculum: §5.1 RF, §5.2 CN, §5.3 Space, §5.4 Bridges), Appendix B (data/curriculum.json shape)

## Overview
Populate `data/curriculum.json` with the complete track/unit/lesson DAG from blueprint §5. IDs and bilingual titles only — no lesson bodies, no descriptions. ~1,000 leaf lesson entries.

## Key Insights
- Blueprint §5 gives the authoritative taxonomy: 11 RF tracks (R0–R10), 11 CN tracks (N0–N10), 12 Space tracks (S0–S11) — total 34 tracks, ~150 units, ~1,000 lessons.
- Each lesson gets a stable ID per blueprint §3.3 convention: `{domain}-{track}-{unit-slug}-{order:02d}-{slug}`. Example: `rf-r0-foundations-01-decibels`.
- IDs locked at this phase — content authors don't get to rename later (causes broken links).
- Add 3 bridges (B1/B2/B3) per §5.4 — they're cross-domain links, not new lessons.

## Requirements
**Functional:** `data/curriculum.json` validates against an extended schema (add to packages/citations or new packages/curriculum-schema if needed). Provides 1,000 lesson IDs the stub generator (Phase 2) consumes.
**Non-functional:** human-editable JSON (pretty-printed, 2-space indent, alphabetized within arrays where possible).

## Architecture
```json
{
  "domains": {
    "rf": {
      "title": { "vi": "...", "en": "RF Engineering" },
      "tracks": [
        {
          "id": "r0",
          "title": { "vi": "...", "en": "Math & Physics Foundations" },
          "levels": ["L1","L2","L3"],
          "units": [
            {
              "id": "vector-calculus",
              "title": { "vi": "...", "en": "Vector calculus for engineers" },
              "lessons": [
                { "id": "01-vectors", "title": { "vi": "...", "en": "Vectors" }, "level": "L1" },
                ...
              ]
            }
          ]
        }
      ]
    }
  },
  "bridges": [
    { "id": "b1", "title": { "vi": "...", "en": "From Antenna to Base Station" }, "links": ["rf", "core-network"] },
    { "id": "b2", "title": { "vi": "...", "en": "From Satellite to UE" }, "links": ["space", "rf", "core-network"] },
    { "id": "b3", "title": { "vi": "...", "en": "From Spectrum to Service" }, "links": ["rf", "core-network", "space"] }
  ]
}
```

## Related Code Files
- Modify: `data/curriculum.json` (currently has only rf.r0 stub)
- Create: `packages/curriculum-schema/` — Zod schema package (small)
- Modify: `tools/frontmatter-validator/` if it needs to cross-check lesson IDs against curriculum.json

## Implementation Steps
1. Define Zod schema for curriculum.json in `packages/curriculum-schema/src/index.ts`
2. Write the full DAG. Source: blueprint §5.1, §5.2, §5.3 sample unit breakdowns + extrapolate the unnamed units to match the lesson-count estimates in the track tables. Be conservative — when a unit isn't enumerated in §5, propose 3-5 plausible lessons per unit topic and document the proposal in a comment.
3. For each lesson: choose a kebab-case slug, give EN + VI title. **VI titles can use accepted Vietnamese engineering terms** (consult blueprint glossary entries first, then fall back to phonetic Vietnamese for proper nouns like "Maxwell").
4. Validate: load curriculum.json, run through Zod, count entries. Expect roughly 290 RF lessons, 285 CN lessons, 290 Space lessons (per blueprint §5 estimates).

## Todo List
- [ ] packages/curriculum-schema scaffold
- [ ] Full RF DAG (11 tracks, ~290 lessons)
- [ ] Full CN DAG (11 tracks, ~285 lessons)
- [ ] Full Space DAG (12 tracks, ~290 lessons)
- [ ] 3 bridges
- [ ] Schema validation passes

## Success Criteria
- [ ] data/curriculum.json validates against schema
- [ ] Total lesson count between 800 and 1,200 (blueprint says ~1,000)
- [ ] Every lesson has EN + VI title
- [ ] No duplicate IDs anywhere
- [ ] Bridges reference real domain IDs

## Risk Assessment
- **VI titles wrong** (medium): I'm not a native Vietnamese RF engineer. Mitigation: lock the schema and IDs; flag every VI title with `vi_review_needed: true` in a sidecar file `data/curriculum-review.json` for human pass.
- **Lesson count overshoot** (low): better to under-estimate; deleting IDs is hard, adding is easy.

## Security Considerations
- None — pure structured data.

## Next Steps
Phase 2 reads curriculum.json and generates ~2,000 MDX stubs.
