---
phase: 4
title: "Widget Scaffolds"
status: completed
priority: P2
effort: "3h"
dependencies: []
---

# Phase 4: Widget Scaffolds

## Context Links
- Blueprint §3.4 (widget architecture: per-widget hydration, bundle budget, library choices)
- Phase 0: `packages/widgets/src/rf/polar-plot.tsx` is the reference implementation

## Overview
Scaffold 4 more flagship widgets per blueprint Phase 1 §8 list. Each is a working React component with placeholder math + a11y wrappers + Vitest smoke test. Physics correctness is **NOT verified** here — that's content-author work. Each widget is flagged `experimental: true` in exports until validated.

## Key Insights
- Honest scoping: these are scaffolds, not finished tools. A LinkBudgetCalculator that lets a user input parameters and returns *plausible* numbers is fine; verifying it against ITU-R P.618 atmospheric loss models is content-author work.
- OrbitVisualizer is the only Three.js widget — pulls ~120KB Three.js into the chunk. Must be `client:visible` only, never `client:load`. Respect reduced-motion (pause animation).
- FiveGCallFlow and ModulationVisualizer are React+SVG only (no Three.js, no D3 — just plain Canvas/SVG).
- Each widget gets its own subpath export: `@rfcn-space-handbook/widgets/rf/link-budget`, `/space/orbit-visualizer`, etc. Astro then code-splits per import.

## Requirements
**Functional:** each widget renders, accepts props, has keyboard navigation, has aria-label/title, has a Vitest smoke test asserting `<svg>`/`<canvas>` mounts.
**Non-functional:** each widget's bundle (its chunk, post-Astro build) ≤150KB gz. OrbitVisualizer expected ~120KB (Three.js); others <50KB.

## Architecture
```
packages/widgets/src/
├── rf/
│   ├── polar-plot.tsx        # Phase 0 reference
│   ├── link-budget.tsx       # NEW — pure React form, math.js optional
│   └── modulation-visualizer.tsx  # NEW — Canvas 2D, draws constellation + waveform
├── network/
│   └── five-g-call-flow.tsx  # NEW — interactive sequence stepper, SVG
├── space/
│   └── orbit-visualizer.tsx  # NEW — Three.js, dynamic import, prefers-reduced-motion
└── shared/
    └── use-reduced-motion.ts  # Phase 0
```

## Related Code Files
- Create: `packages/widgets/src/rf/link-budget.tsx` + `.test.tsx`
- Create: `packages/widgets/src/rf/modulation-visualizer.tsx` + `.test.tsx`
- Create: `packages/widgets/src/network/five-g-call-flow.tsx` + `.test.tsx`
- Create: `packages/widgets/src/space/orbit-visualizer.tsx` + `.test.tsx`
- Modify: `packages/widgets/src/index.ts` — re-export with `experimental` flag
- Modify: `packages/widgets/package.json` — add `three`, `@types/three` as deps; add subpath exports

## Implementation Steps

1. **LinkBudget** (~40 lines):
   - Inputs (controlled): EIRP (dBW), G/T (dB/K), path loss (dB), atmospheric loss (dB), system noise BW (Hz)
   - Output: CNR (dB), Eb/N0 (dB), link margin (dB) against a target
   - Pure JSX form; useState only; math is `cnr = eirp + g_t - pathLoss - atmoLoss - kT - bw_log` (standard link equation)
   - a11y: every input is a labeled `<input>`, results in an `<output>` with `aria-live="polite"`

2. **ModulationVisualizer** (~80 lines):
   - Inputs (controlled): modulation scheme (BPSK/QPSK/16QAM/64QAM via radio), SNR slider (0-30 dB)
   - Output: Canvas showing constellation diagram with noise scatter
   - Plain Canvas 2D; redraw on input change; `requestAnimationFrame` skipped if reduced-motion
   - a11y: `<canvas>` has `<figcaption>` describing current scheme + SNR

3. **FiveGCallFlow** (~60 lines):
   - Inputs (controlled): scenario (initial registration / handover / PDU session establishment)
   - Output: SVG sequence diagram with UE → gNB → AMF → SMF → UPF lanes; clicking "Next step" highlights the next message
   - Plain React state machine; SVG `<line>` + `<text>` per message
   - a11y: keyboard ArrowRight/ArrowLeft advances/rewinds steps; current step has `aria-current="step"`

4. **OrbitVisualizer** (~120 lines):
   - Inputs (controlled): orbit type (LEO 550km / MEO 8000km / GEO), inclination slider
   - Output: Three.js scene with Earth sphere + orbit line + small satellite mesh, slow rotation
   - **Dynamic import of three**: `const THREE = await import('three')` inside `useEffect`. SSR renders empty placeholder div.
   - Reduced-motion: skip animation loop, render single static frame
   - a11y: `<canvas>` with `<figcaption>` describing orbit parameters; full keyboard nav optional (defer)

5. Each widget: `.test.tsx` with 2-3 assertions (renders, has accessible name, responds to input change).

6. Update `packages/widgets/src/index.ts` barrel:
   ```ts
   export { PolarPlot } from './rf/polar-plot';            // stable
   export { LinkBudget } from './rf/link-budget';          // @experimental
   export { ModulationVisualizer } from './rf/modulation-visualizer';  // @experimental
   export { FiveGCallFlow } from './network/five-g-call-flow';        // @experimental
   export { OrbitVisualizer } from './space/orbit-visualizer';        // @experimental
   ```

7. Add `three` to package.json deps. Verify `pnpm install` + `pnpm test` + `pnpm --filter web build` all exit 0.

8. Update `packages/widgets/.size-limit.json` to add the new widgets with appropriate budgets.

## Todo List
- [x] LinkBudget component + test
- [x] ModulationVisualizer component + test
- [x] FiveGCallFlow component + test
- [x] OrbitVisualizer component + test (dynamic three import)
- [x] Three.js added as dep
- [x] barrel updated with @experimental jsdoc tags
- [x] size-limit budgets updated
- [x] All tests green

## Success Criteria
- [x] All 4 widgets render in vitest smoke tests
- [x] OrbitVisualizer chunk ≤150KB gz (will be close — Three.js ~120KB)
- [x] Others ≤50KB gz each
- [x] No `client:load` anywhere
- [x] Reduced-motion respected globally
- [x] `pnpm --filter web build` exits 0

## Risk Assessment
- **Bundle budget on OrbitVisualizer** (high): Three.js minified gzipped is ~130KB. Mitigation: import only modules used (`three/src/Three.Core` instead of full `three`); accept the budget reality and document it as the floor for any Three.js widget.
- **Physics correctness** (acknowledged): all 4 widgets use placeholder math. They look plausible but ARE NOT trustworthy for actual engineering work. JSDoc `@experimental` + frontmatter `widgets: { experimental: true }` warn the reader.
- **SSR for Three.js** (medium): `import 'three'` at module top breaks SSR. Mitigation: dynamic import inside useEffect (already done in polar-plot pattern).

## Security Considerations
- No user input reaches network/disk; no XSS surface (all inputs are typed-number controls or radio buttons).

## Next Steps
Phase 5 expands data files; Phase 6 verifies + commits.
