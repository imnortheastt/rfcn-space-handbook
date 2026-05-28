---
phase: 5
title: Content + Data Seeds
status: completed
priority: P1
effort: 2h
dependencies:
  - 4
---

# Phase 5: Content + Data Seeds

## Context Links
- Blueprint: §3.3 (frontmatter), §4.2 (lesson template), §6.2 (citation format), Appendix A (sample MDX), Appendix B (curriculum.json)

## Overview
Seed the *minimum* content needed to prove the pipeline: 1 EN/VI lesson parity pair (`decibels`), 5 bilingual glossary terms, 3 citations (one 3GPP, one IEEE, one textbook), a curriculum.json skeleton with just the bootstrap track. **This is a pipeline proof, not curriculum content.** Copy is placeholder; real authoring begins after Phase 0.

## Key Insights
- The pilot lesson must exercise every contract: frontmatter schema, `parityId` pairing, KaTeX block, glossary-term auto-link, `<Cite>` call, `<PolarPlot>` widget, standards-baseline.
- Pick `decibels` because it's foundational, brief, and naturally bilingual (Vietnamese engineers say "đề-xi-ben" or "dB" — clean term for the glossary).
- `data/*.json` files are imported by build, so schema mismatches fail the build — good.

## Requirements
**Functional:** both EN and VI versions of the decibels lesson render at `/en/rf/r0-foundations/decibels` and `/vi/rf/r0-foundations/decibels`; lang switcher swaps between them; PolarPlot widget renders; glossary term has popover; citation rendered as numbered marker + bibliography entry at lesson end.
**Non-functional:** lesson page transferred size < 200KB (no widget) / < 400KB (with PolarPlot).

## Architecture
```
content/
├── en/rf/r0-foundations/
│   ├── _track.json        # { id: "r0", title: "Math & Physics Foundations" }
│   ├── _unit.json         # { id: "r0-foundations-units", title: "Foundations" }
│   └── 01-decibels.mdx
└── vi/rf/r0-foundations/
    ├── _track.json
    ├── _unit.json
    └── 01-decibels.mdx

data/
├── glossary.json          # 5 terms × {en, vi, definition_en, definition_vi}
├── citations.json         # 3 entries per §6.2 schema
└── curriculum.json        # Appendix B shape, only rf.r0 populated
```

## Related Code Files
- Create: `content/en/rf/r0-foundations/_track.json`
- Create: `content/en/rf/r0-foundations/_unit.json`
- Create: `content/en/rf/r0-foundations/01-decibels.mdx`
- Create: `content/vi/rf/r0-foundations/_track.json`
- Create: `content/vi/rf/r0-foundations/_unit.json`
- Create: `content/vi/rf/r0-foundations/01-decibels.mdx`
- Create: `data/glossary.json`
- Create: `data/citations.json`
- Create: `data/curriculum.json`

## Implementation Steps

1. **`data/glossary.json`** — 5 terms:
   - decibel (en) / đề-xi-ben (vi)
   - antenna (en) / ăng-ten (vi)
   - gain (en) / độ lợi (vi)
   - directivity (en) / tính định hướng (vi)
   - radiation pattern (en) / giản đồ bức xạ (vi)
   - Schema: `[{ id, en, vi, defEn, defVi, domain, firstSeenIn? }]`

2. **`data/citations.json`** — 3 entries per blueprint §6.2 example:
   - `ieee-145-2013` (IEEE Standard for Definitions of Terms for Antennas)
   - `3gpp-ts-23501-rel18` (5G System Architecture)
   - `pozar-microwave-eng-4ed` (Pozar textbook)
   - Validated by `citationsSchema` from `packages/citations`.

3. **`data/curriculum.json`** — minimal skeleton matching Appendix B; only `domains.rf.tracks[0]` (the r0 foundations track) populated with one unit and one lesson.

4. **`content/en/rf/r0-foundations/_track.json`** + `_unit.json` — id, bilingual titles, level, ordering.

5. **`content/en/rf/r0-foundations/01-decibels.mdx`** — frontmatter per blueprint Appendix A; body has Hook ("Why dB? Because adding is easier than multiplying.") → Intuition → Mechanism (KaTeX equation `$L_{dB} = 10 \log_{10}(P/P_{ref})$`) → Apply (`<PolarPlot data={[1,3,5,10,5,3,1]} />` placeholder demonstrating axis scale) → Pitfalls (3 items: dB vs dBm confusion, power vs voltage 10log vs 20log, reference must be stated) → References (`<Cite id="ieee-145-2013" />`).

6. **`content/vi/rf/r0-foundations/01-decibels.mdx`** — same `parityId: rf-r0-foundations-01-decibels`, lang `vi`, Vietnamese prose mirroring the English structure; same `<PolarPlot>` widget call (widgets are language-agnostic); same `<Cite>` calls.

7. Smoke: `pnpm --filter @rfcn-space-handbook/web dev` → visit `/en/rf/r0-foundations/decibels` and `/vi/rf/r0-foundations/decibels`. Verify:
   - Both routes render
   - KaTeX block displays correctly with MathML for a11y
   - First occurrence of "decibel" / "đề-xi-ben" auto-links to glossary popover
   - PolarPlot widget hydrates and renders SVG
   - Bibliography appears at lesson end with IEEE 145-2013 entry
   - Lang switcher in header jumps between the pair

## Todo List
- [ ] data/glossary.json (5 terms)
- [ ] data/citations.json (3 entries)
- [ ] data/curriculum.json (skeleton)
- [ ] content/en/rf/r0-foundations/_track.json + _unit.json
- [ ] content/en/rf/r0-foundations/01-decibels.mdx
- [ ] content/vi/rf/r0-foundations/_track.json + _unit.json
- [ ] content/vi/rf/r0-foundations/01-decibels.mdx
- [ ] Manual smoke both routes

## Success Criteria
- [ ] `/en/rf/r0-foundations/decibels` renders fully (KaTeX, widget, glossary, citation)
- [ ] `/vi/rf/r0-foundations/decibels` renders fully (Vietnamese diacritics correct, MDX components shared)
- [ ] Lang switcher round-trips: `/en/.../decibels` ↔ `/vi/.../decibels`
- [ ] Frontmatter schema validation passes
- [ ] Built page transferred size budget respected (check Vercel preview or `astro build && du -sh dist/.../decibels.html`)

## Risk Assessment
- **Vietnamese diacritic encoding** (low): all files UTF-8 (enforced by `.editorconfig`); double-check on Windows if any contributor uses it (CRLF / BOM).
- **PolarPlot SSR** (low): React island hydrates client-side via `client:visible`; SSR renders an empty placeholder which is fine.
- **Glossary auto-link false positives** (medium): "gain" is a common English word, could match "gain weight" in unrelated context. Mitigation: only first occurrence per page, only inside `<p>` not headings; document the rule in CONTRIBUTING.md.

## Security Considerations
- MDX content is *authored*, not user input — no XSS surface.
- `<Cite>` only renders ids from the validated citations.json — no arbitrary URL injection.

## Next Steps
Phase 6 adds the validators that enforce these contracts at CI time.
