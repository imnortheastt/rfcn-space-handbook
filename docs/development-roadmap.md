# Development Roadmap

Multi-year roadmap for RF·CN·Space from Phase 0 (foundation) through Phase 4 (steady state). Calibrated for single primary author with AI-assisted drafting.

---

## Phase 0 — Platform Foundation (Months 0–2)

**Status:** COMPLETE 2026-05-29

**Goal:** Build and ship a production-ready platform before authoring substantial content. Prove the full pipeline end-to-end with pilot lessons.

### Milestones Delivered

- [x] Monorepo scaffold (pnpm workspaces + Turborepo + TypeScript strict + ESLint 9 flat)
- [x] Astro 5 app with i18n routing (`/en/`, `/vi/` URL prefixes)
- [x] MDX content collections with Zod-validated frontmatter schema
- [x] 5 workspace packages: `widgets`, `ui`, `glossary`, `citations`, `i18n`
- [x] Pilot lesson: **Decibels** (RF R0 Foundations, L1)
  - Published in English + Vietnamese parity pair
  - Exercises: KaTeX math, PolarPlot widget, glossary auto-link, citation collection, license badge
  - Full MDX → HTML pipeline validated end-to-end
- [x] Design tokens: Teal #0b5351 primary, Inter + IBM Plex Sans, dark mode (OS-follow + manual), print stylesheet, `prefers-reduced-motion` support
- [x] Build tools: `i18n-parity-check`, `frontmatter-validator`, `diagram-build` (Mermaid CLI pipeline)
- [x] CI/CD pipeline: lint → validate → build → test → bundle-budget → a11y (axe-core) → Lighthouse
- [x] Nightly link check (Lychee)
- [x] Vercel git integration (preview on PR, production on merge)
- [x] Glossary & citations: 50 terms, 30 citations seeded
- [x] Documentation: "How to write a lesson" guide published
- [x] Lighthouse mobile: ≥90 on median lesson

### Exit Criteria Met

- Reader can land on homepage, navigate to lesson in EN or VI
- Math, diagrams, widgets render correctly
- Search works (Pagefind indexed)
- No 404s or layout breaks
- Build green, tests pass, code review approved

### Learnings & Technical Debt

- Vercel chosen over Cloudflare Pages (blueprint specified Cloudflare; deviation justified by git-integrated preview UX)
- Widget hydration strategy validated: `client:visible` works well for most interactive elements
- i18n parity check catches mismatched lessons early (crucial for bilingual maintainability)

---

## Phase 1 — Content Scaffold & Anchor Slice (Months 2–6)

**Status:** RF CONTENT COMPLETE — 92/92 RF lessons published (100%)

**Goal:** Make the platform credibly usable for one complete reader journey per domain. Establish content patterns, prove Vietnamese-language depth.

### Phase 1.0 Mechanical Scaffolding (COMPLETE)

- [x] Curriculum graph (`curriculum.json`) fully populated with ~1,000 lesson IDs
  - Domain → Track → Unit → Lesson hierarchy defined (34 tracks, ~150 units)
  - Zod schema validates structure (commit d2cd946)
- [x] 526 lesson stub MDX files generated in EN+VI (commit 3da3383)
  - `status: draft` frontmatter excludes from navigation
  - Parity validator confirms EN/VI match
- [x] Roadmap visualizer renders curriculum tree per domain (commit 0fc4653)
  - SVG-based, no JS, renders at `/{lang}/{domain}/`
- [x] 4 flagship widget scaffolds (commit 9a5264f)
  - LinkBudget, ModulationVisualizer, FiveGCallFlow, OrbitVisualizer
  - Placeholder math, experimental flag, smoke tests pass
- [x] Glossary expanded to 224 bilingual terms (52 → 224)
- [x] Citations expanded to 20 verified standards/textbooks (commit 4d44c4b)

### Phase 1.1+ Content Authoring (RF COMPLETE — 100%)

**Current Progress (2026-06-02):**
- RF domain: 92/92 lessons published (100%)
- All RF tracks fully authored in EN+VI bilingual parity

**Completed Units This Session:**
- mimo-capacity (4 lessons)
- the-diversity-intuition (3 lessons)
- practical-antenna-design (3 lessons)
- probability-for-communications (4 lessons)
- propagation-in-real-environments (6 lessons)
- massive-mimo-and-favorable-propagation (3 lessons)
- ml-detection-sphere-decoding (2 lessons)
- spatial-multiplexing-vs-diversity-vs-beamforming (3 lessons)

- [ ] Content authoring & publication
  - ~50 lessons per domain (~150 total)
  - Bilingual parity: 100% (every lesson EN + VI simultaneously)
  - Coverage:
    - **RF (r0–r3):** Foundations, transmission lines, antennas fundamentals → introductory antenna arrays
    - **Core Network (n0–n1):** Networking fundamentals (for SWE audience), classic signalling
    - **Space (s0–s1):** Math/physics foundations, orbital mechanics introduction
  - All lessons peer-reviewed (editorial + technical)

- [x] All three cross-domain bridges published (B1, B2, B3) — EN+VI
  - **B1:** Antenna to base station — gNB architecture, fronthaul 7.2x, RF-network interface
  - **B2:** Satellite to UE — LEO 5G NTN, link budget, Doppler compensation, timing advance, HARQ
  - **B3:** Spectrum to service — ITU framework, auctions, interference management, economics

- [ ] Five flagship interactive widgets shipped & tested
  1. **Link Budget Calculator** — RF domain
  2. **Antenna Pattern 3D** — RF domain (Three.js)
  3. **5G Call Flow Stepper** — Core Network domain
  4. **Orbital Visualizer** — Space domain (Three.js, interactive time control)
  5. **Modulation Visualizer** — RF domain (signal constellation, eye diagram)
  
  All widgets:
  - Meet bundle budget (<150KB gzipped each)
  - Have accessibility (keyboard nav, aria-labels, reduced-motion)
  - Include unit tests (Vitest, >80% coverage)

- [ ] Glossary expansion: ~300 terms (bilingual, comprehensive for L0–L2 content)

- [ ] SEO & discoverability
  - hreflang tags auto-generated per lesson
  - Pagefind search index built; Vietnamese diacritic-insensitive matching verified
  - Structured data (Article schema) per lesson
  - Sitemap.xml + RSS feeds per domain

- [ ] Public launch preparation
  - Landing page (homepage, per-domain landing pages)
  - Contributor guidelines published
  - "Getting started" onboarding flow
  - Social media assets

### Exit Criteria

- [ ] Any L0–L2 reader can complete a full track (e.g., RF R0 Foundations) and emerge competent
- [ ] Vietnamese-language depth is conspicuous (not a translation afterthought)
- [ ] Lighthouse scores maintained (≥90 mobile)
- [ ] Zero broken links (Lychee clean)
- [ ] All 150 lessons have peer review sign-off
- [ ] No external docs needed — the platform is self-contained for Phase 1 scope

### Public Launch Announcement

End of Phase 1 marks the first public announcement. Target channels:

- Product Hunt
- Hacker News
- Vietnamese tech communities (Reddit, Discord, local forums)
- SEA university networks
- Telecom/space engineering communities

---

## Phase 2 — Domain Breadth (Months 6–18)

**Status:** Pending Phase 1 completion

**Goal:** Reach L3–L4 depth in each domain. Become a daily-reference resource for working engineers.

### Milestones

- [ ] Content scale: ~400 lessons total (150 Phase 1 + 250 Phase 2)
  - **RF:** Expand to R4–R6 (MIMO, mmWave, modulation deep dives)
  - **Core Network:** Expand to N2–N5 (4G EPC, 5G SBA, NFV/SDN)
  - **Space:** Expand to S2–S7 (spacecraft systems, propulsion, satcom)

- [ ] Every track has at least one complete unit
  - No orphaned units or tracks
  - Cross-unit connections established

- [x] All three domain bridges (B1, B2, B3) shipped (completed in Phase 1)
  - B1: Antenna to Base Station (RF ↔ Core Network) ✓
  - B2: Satellite to UE (Space ↔ RF ↔ Core Network) ✓
  - B3: Spectrum to Service (RF ↔ Core Network ↔ Space regulatory) ✓

- [ ] Interactive widgets: ~20 total
  - Additional domain-specific widgets
  - Performance: all within budget, no page regresses

- [ ] Glossary: ~800 terms (covers L0–L4 content)

- [ ] Citations: ~300 entries (standards: 3GPP, IEEE, ITU-R, ECSS, IETF; textbooks: Pozar, Vallado, Stallings, Tanenbaum)

- [ ] Community & credibility
  - First external contributor accepted (reviewer role)
  - Backlinks from ≥5 SEA universities, telco blogs, space orgs
  - First mention in Vietnamese academic thesis (Google Scholar tracked)

- [ ] Standards & versioning
  - Standards metadata per lesson (`standards` array in frontmatter)
  - Quarterly standards-refresh workflow established (e.g., 3GPP Rel-19 updates tracked)

### Exit Criteria

- [ ] Working engineer in Vietnam can use the platform as primary daily reference for their domain
- [ ] L3–L4 content demonstrates depth (not survey-level)
- [ ] Vietnamese and English versions maintain parity and quality
- [ ] Platform is recognized in regional tech/telco/space communities
- [ ] Lighthouse maintained (≥90 mobile, ≥85 widget-heavy)
- [ ] CI/CD gates all passing

---

## Phase 3 — Depth & Frontier (Months 18–30)

**Status:** Pending Phase 2 completion

**Goal:** Reach L4–L5 in mature tracks. Pioneer frontier content (6G, NTN, NewSpace). Invite external experts.

### Milestones

- [ ] Content scale: ~700 lessons total (400 Phase 2 + 300 Phase 3)
  - **RF:** R7–R10 (6G radio, beyond 5G antennas, quantum comms concepts)
  - **Core Network:** N6–N10 (Open RAN deep dives, 6G architecture, AI-native core)
  - **Space:** S8–S11 (mission ops, constellations, NTN, cislunar, NewSpace economics)

- [ ] Frontier tracks substantially populated
  - R10, N10, S11 (research frontier) contain 15–20+ lessons each
  - Content written at L4–L5 (assumes prior mastery of L0–L3)
  - Acknowledges open research questions, not false certainty

- [ ] Guest-authored units from external experts
  - At least one domain expert (e.g., O-RAN expert, NTN researcher) contributes a unit
  - `authors` array extends to include external contributors
  - Byline & brief bio included

- [ ] Standards refresh cadence established
  - Quarterly sprints: scan for new 3GPP releases, IEEE standards, ITU updates
  - Lessons updated with version stamps
  - Changelog updated per refresh

- [ ] PDF export feature ("Build my own book")
  - Readers can select units/lessons and generate a curated PDF
  - Respects print stylesheet (no dark mode, readable typography)
  - Cites attribution correctly

- [ ] Academic citations verified
  - Platform cited in ≥5 Vietnamese academic theses (Google Scholar tracked)
  - Tracked in notes for future citations

### Exit Criteria

- [ ] Platform is *recognized as authoritative* in SEA technical community
  - Telecom operators cite lessons internally
  - Universities assign lessons as supplementary reading
  - Space programs reference NTN/NewSpace content

- [ ] L4–L5 content is credible and defensible
  - Peer review from domain experts (even if not bylined authors)
  - All frontier content cites primary sources rigorously

- [ ] Growth metrics achieved
  - ≥30K monthly unique readers
  - Vietnamese share ≥35% of traffic
  - ≥200 external backlinks from .edu, .gov, telco, space orgs

---

## Phase 4 — Steady State (Month 30+)

**Status:** Pending Phase 3 completion

**Goal:** Maintenance, refresh, modest community. Garden the platform as a durable reference.

### Activities

- [ ] **Quarterly standards refresh sprints**
  - Monitor 3GPP releases (Rel-19, Rel-20, beyond)
  - Track IEEE, ITU, ECSS, IETF updates
  - Update lessons with new version stamps
  - Changelog entries per refresh

- [ ] **Annual track-by-track refresh**
  - Re-read all lessons for technical accuracy
  - Update examples if they are dated
  - Refresh links (Lychee nightly check catches broken external links)
  - Bump `lastVerified` date

- [ ] **Community contributions** (curated, not UGC)
  - Accept pull requests from external contributors
  - Peer review + approval gate before merge
  - Contributor guidelines enforced

- [ ] **Community feedback layer** (optional, low-cost)
  - Possible: GitHub Discussions (threaded, moderated)
  - Do NOT build custom comment system
  - Feedback flows back to maintainers (issues, PRs)

- [ ] **Possible expansion** to adjacent domains (only if co-author leads)
  - Example: Quantum communications (if someone steps up)
  - Example: Optical wireless (if someone steps up)
  - Example: Fusion-relevant plasma physics (if someone steps up)
  - **Anti-milestone:** Resist expansion while RF/CN/Space still have unfilled L4–L5 lessons

### Long-Term Metrics

- Maintain ≥90 Lighthouse scores
- Keep ≥200 external backlinks active
- Sustain ≥35K monthly unique readers
- Maintain 100% bilingual parity (EN + VI for every lesson)

---

## Cross-Phase Metrics & Success Indicators

| Metric | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|--------|---|---|---|
| Lessons published | 150 | 400 | 700 |
| Monthly unique readers | 5K | 20K | 50K |
| Vietnamese traffic % | ≥40% | ≥35% | ≥35% |
| Avg session depth (pages) | ≥3 | ≥3.5 | ≥4 |
| Returning readers (30d) | ≥25% | ≥30% | ≥35% |
| External backlinks (.edu/.gov/telco/space) | 20 | 100 | 200 |
| Cited in academic theses | 5 | 20 | 50 |
| Lighthouse mobile score (median) | ≥90 | ≥90 | ≥90 |
| Glossary terms | 300 | 800 | 1200 |
| Interactive widgets | 5 | 20 | 25 |

---

## Known Open Items & Decisions

See `PLATFORM_BLUEPRINT.md` §10 for detailed open questions. Key items affecting roadmap:

1. **Guest authoring model** — When/how to invite external experts? Decision: Phase 3 start.
2. **Community contributions** — Full GitHub UGC or curated-only? Decision: Curated-only, gate via PR review.
3. **Video content** — Ever? Decision: No. Text + interactive widgets are the moat; videos are a distraction.
4. **Certification / credentials** — Ever? Decision: No. Out of scope for Phase 0–4.
5. **Revenue model** — Ever? Decision: No. Platform is free indefinitely. May explore grants/sponsorships in Phase 3+.

---

## Phase Transition Checkpoints

Each phase concludes with a readiness review:

- **Phase 0 → 1:** All exit criteria met? (Build green, pilot lesson end-to-end proven, docs published)
- **Phase 1 → 2:** 150 lessons peer-reviewed? Vietnamese depth validated? Public launch successful?
- **Phase 2 → 3:** Backlinks from ≥5 universities? Working engineer feedback positive? Guest author interested?
- **Phase 3 → 4:** Authoritative status achieved? Community engagement active? Long-term sustainability plan funded?

---

## Dependencies & Risks

### Critical Dependencies

- **Author throughput:** Platform scalability depends on efficient authoring workflow. Frontmatter schema, lesson template, CI validation all designed to maximize author velocity.
- **Peer review capacity:** Each lesson needs technical + editorial review. Phase 1–2 will strain this; Phase 3+ may require guest reviewers.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Author burnout (Phase 2–3) | Medium | High | Budget for part-time co-author; use AI drafting to reduce workload |
| Breaking 3GPP/IEEE standards (incorrect content) | Low | Critical | Rigorous peer review, subject-matter expert sign-off before publication |
| Outdated content (standards evolve) | Medium | Medium | Quarterly refresh sprints; `lastVerified` date enforced in frontmatter |
| Low Vietnamese engagement (content is too English-centric) | Low | High | Native Vietnamese writer/reviewer from Phase 1; avoid direct translations |
| SEA market saturation (competing platforms) | Low | Low | Differentiation: Vietnamese fidelity + unified treatment of 3 domains |

---

## Success Definition (End of Phase 1)

The platform is successful at the end of Phase 1 if:

1. ✅ 150 lessons published in both EN and VI
2. ✅ Vietnamese reader engagement ≥40% of traffic
3. ✅ Zero critical bugs (build stable, Lighthouse ≥90)
4. ✅ External backlinks from ≥5 .edu/.gov/.telco organizations
5. ✅ Community interest evident (stars, forks, social shares)
6. ✅ Platform is self-referential (no external docs needed to understand content)

If all five are true at the end of Phase 1, proceed to Phase 2. Otherwise, extend Phase 1 until criteria are met.

---

See `PLATFORM_BLUEPRINT.md` §8 for the detailed reasoning behind phase structure and timeline.
