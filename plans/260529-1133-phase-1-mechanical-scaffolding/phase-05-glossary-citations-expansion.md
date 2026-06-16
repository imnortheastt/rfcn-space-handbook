---
phase: 5
title: "Glossary + Citations Expansion"
status: completed
priority: P2
effort: "1.5h"
dependencies: []
---

# Phase 5: Glossary + Citations Expansion

## Context Links
- Blueprint §6.1 (sourcing), §6.2 (citation format example), §3.5 (terminology JSON)
- Phase 0: `data/glossary.json` (5 terms) and `data/citations.json` (3 entries) seeded

## Overview
Expand the two data files to a useful baseline: ~50 bilingual glossary terms drawn from blueprint vocabulary (so the auto-link plugin actually fires across stub lessons), ~20 citations covering the most commonly-referenced standards. Both are mechanical — terms and citation pointers exist in the blueprint; we transcribe them.

## Key Insights
- Glossary terms can be drawn from the unit titles in §5 (e.g. "radiation pattern", "Smith chart", "Fourier transform", "AMF", "SUPI", "Hohmann transfer"). VI translations follow the conventions used in the curriculum DAG VI titles.
- Citations from blueprint: every standard mentioned by number (IEEE 145-2013, 3GPP TS 23.501, TR 38.811, ITU-R P.618, ECSS, RFC numbers if any).
- Mark `vi_review_needed: true` on glossary terms where the Vietnamese gloss is my guess — flags for human review, doesn't block build.
- `data/citations.json` schema is locked (Zod in packages/citations). All entries must pass `citationsSchema.parse`.

## Requirements
**Functional:** ~50 glossary entries × {id, en, vi, defEn, defVi, domain}. ~20 citation entries valid against schema.
**Non-functional:** files stay under ~30KB each — manually editable.

## Architecture
- Modify: `data/glossary.json` (append, don't reorder — preserve Phase 0 entries)
- Modify: `data/citations.json` (append)
- Create: `data/glossary-review.json` — sidecar listing entries needing human VI review

## Related Code Files
- Modify: `data/glossary.json`
- Modify: `data/citations.json`
- Create: `data/glossary-review.json`

## Implementation Steps

1. **Glossary expansion** — propose ~45 new terms (5 already exist). Categories:
   - RF: Smith chart, S-parameters, VSWR, impedance matching, dipole, monopole, patch antenna, beamforming, MIMO, OFDM, QAM, Shannon capacity, AWGN, multipath, Doppler, intermodulation, EIRP, noise figure, link budget, Fresnel zone
   - Core Network: AMF, SMF, UPF, AUSF, NRF, SUPI, GUTI, IMSI, PDU session, network slicing, gNB, eNB, EPC, IMS, Diameter, SBA, fronthaul, midhaul, backhaul, RAN, RIC
   - Space: orbit, LEO, MEO, GEO, ECI, ECEF, TLE, SGP4, delta-v, Hohmann transfer, apogee, perigee, inclination, ground track, station-keeping, ADCS, payload, bus, mission ops
   - Pick ~45 distributed across the three domains (15 each).
   - For each: id (kebab-case), en, vi, brief defEn (one sentence), defVi, domain.

2. **Citations expansion** — ~17 new entries. Pull from blueprint and standard references the curriculum will use:
   - Standards: 3GPP TS 23.501 (already), TS 23.502, TS 23.503, TR 38.811 (NTN), TR 38.821 (NTN), TS 38.300 (NR overall), TS 38.331 (RRC), IEEE 802.11 (latest), ITU-R P.618 (rain attenuation), ITU-R P.676 (atmospheric absorption), ECSS-E-ST-50-12C (SpaceWire), CCSDS 132.0-B (TM Space Data Link)
   - Textbooks: Pozar Microwave Engineering (already), Balanis Antenna Theory, Vallado Fundamentals of Astrodynamics, Proakis Digital Communications, Schiller Mobile Communications, Roddy Satellite Communications, Wertz/Larson Space Mission Analysis
   - RFCs (if referenced): RFC 8200 (IPv6), RFC 9000 (QUIC) — only if used in CN curriculum
   - Each: full bibliographic info per schema.

3. **glossary-review.json** sidecar — pure metadata, list of `{id, reason}` entries flagging terms where the VI translation is a best-guess.

4. Validate: `pnpm validate:frontmatter` still green (it doesn't check data/*.json but make sure build still parses citations.json without Zod errors). Run a quick `node -e "const c=require('./data/citations.json'); const {citationsSchema}=require('@rfcn-space-handbook/citations'); citationsSchema.parse(c);"` to validate citation schema.

## Todo List
- [x] Glossary: +45 terms across 3 domains
- [x] Citations: +17 entries
- [x] glossary-review.json sidecar
- [x] Citations validate via Zod
- [x] Build still exits 0 (glossary auto-link runs against new terms)

## Success Criteria
- [x] data/glossary.json has ~50 entries
- [x] data/citations.json has ~20 entries, all valid against schema
- [x] data/glossary-review.json lists every entry needing VI review
- [x] No build regressions

## Risk Assessment
- **Wrong citation metadata** (medium): I may misremember a 3GPP release number or ISBN. Mitigation: every citation has `verifiedAt` = "needs-verification"; mark a sidecar `data/citations-review.json` for human verification before any lesson cites them in published prose.
- **Glossary false-positive auto-link** (medium): "gain" matches "gain weight"; "RAN" matches "ran" (past tense). The remark plugin only matches first occurrence and case-sensitive — partly mitigates. Document in CONTRIBUTING.md for content authors.
- **Vietnamese term controversy** (low): Vietnamese engineering vocabulary has regional variants. Flag everything in glossary-review.json.

## Security Considerations
- None — pure data, validated at build time.

## Next Steps
Phase 6 runs full verification + commit.
