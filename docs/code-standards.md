# Code Standards & Conventions

Guidelines for contributors to RF·CN·Space across the monorepo. These standards are enforced in CI/CD.

---

## TypeScript & JavaScript

### Style

- **Target:** TypeScript strict mode (`tsconfig.base.json` enforces `strict: true`)
- **Linting:** ESLint 9 flat config (`eslint.config.js`)
- **Formatting:** Prettier (single configuration, all files)
- **No console logs in production code** — use proper logging when needed
- **Prefer `const` over `let` over `var`** — `var` is banned

### File Naming

- **Components:** PascalCase, e.g., `PolarPlot.tsx`, `AntennaPattern3D.tsx`
- **Hooks:** `use*` prefix in camelCase, e.g., `useOrbitState.ts`, `useResizeObserver.ts`
- **Utils / helpers:** camelCase, e.g., `formatFrequency.ts`, `calculateLinkBudget.ts`
- **Types:** PascalCase, e.g., `LessonFrontmatter.ts`, `WidgetProps.ts`
- **Packages:** kebab-case dir names, e.g., `packages/widgets/`, `packages/glossary/`

### Imports & Exports

```tsx
// ✅ Good
import { PolarPlot } from '@rfcn-space-handbook/widgets';
import { Button } from '@rfcn-space-handbook/ui';
import { Cite } from '@rfcn-space-handbook/citations';

export const MyComponent: React.FC<Props> = ({ ...props }) => {
  // ...
};
```

**Order:**
1. External package imports (react, astro, etc.)
2. Workspace package imports (@rfcn-space-handbook/*)
3. Relative imports (../, ./)
4. Side effects (CSS, etc.) last

---

## React Components & Widgets

### Component Structure

```tsx
interface Props {
  data: number[];
  ariaLabel?: string;
  onDataChange?: (newData: number[]) => void;
}

export const MyWidget: React.FC<Props> = ({ data, ariaLabel = '', onDataChange }) => {
  const [state, setState] = useState(initialState);

  const handleChange = useCallback((newVal) => {
    setState(newVal);
    onDataChange?.(newVal);
  }, [onDataChange]);

  return (
    <section aria-label={ariaLabel}>
      {/* ... */}
    </section>
  );
};
```

### Guidelines

- **Always declare `Props` interface** — no implicit `any`
- **Use `React.FC` for function components** — includes `PropsWithChildren` type safety
- **Accessibility required:**
  - All interactive elements keyboard-navigable
  - `aria-label` or `aria-labelledby` for widgets
  - `alt` text for images
  - Color not the only signal (use icons, patterns, text labels)
  - Test with axe-core (runs in CI)

- **Use `client:visible` or `client:idle`** in Astro MDX, never `client:load`
- **Lazy-import heavy deps** (Three.js, D3, Plotly):
  ```tsx
  const THREE = await import('three');
  ```

- **No state libraries** — use `useState` / `useReducer` only
- **Memoization:** Use `useCallback` / `useMemo` for expensive operations, but don't over-apply
- **Testing:** Unit tests for complex logic (Vitest)

---

## MDX Lessons & Frontmatter

### Frontmatter Schema (Validated by Zod)

All lessons **must** include:

- `id` — Unique lesson identifier following convention `{domain}-{track}-{unit-slug}-{order:02d}-{slug}`
- `parityId` — Binds EN + VI lesson pairs together
- `slug` — URL-friendly identifier
- `lang` — Either `en` or `vi`
- `domain` — One of `rf`, `core-network`, `space`
- `track` — Track identifier (e.g., `r0`, `n2`, `s1`)
- `unit` — Unit slug (e.g., `foundations`, `antennas`)
- `order` — Lesson position within unit (integer, zero-padded)
- `level` — Learning level: `L0` (beginner SWE) through `L5` (frontier)
- `title` — Lesson title (EN + VI versions)
- `license` — License type (e.g., `CC-BY-SA-4.0`)
- `authors` — Array of author names (standardized to `Crystal D.`)
- `publishedAt` — Publication timestamp
- `description` — Brief lesson summary

Optional fields:
- `prerequisites` — Array of prerequisite lesson IDs
- `estimatedReadingMinutes` — Expected reading time
- `lastVerified` — Last technical verification date
- `lastReviewedAt` — Last editorial review date
- `standards` — Array of standards references (3GPP, IEEE, ITU-R, ECSS, IETF)
- `widgets` — Array of widget component names used in lesson
- `tags` — Topic tags for discovery
- `keywords` — SEO keywords
- `spiralRevisits` — Lesson IDs that revisit this concept at higher levels

```yaml
---
# Identity (immutable, never changed once published)
id: rf-r2-antennas-04-radiation-pattern
parityId: rf-r2-antennas-04
slug: radiation-pattern
lang: en | vi

# Organization
domain: rf | core-network | space
track: r2-antennas
unit: r2-antennas-fundamentals
order: 4                                    # position within unit, 1-indexed

# Pedagogy
level: L0 | L1 | L2 | L3 | L4 | L5          # Depth: SWE intro → research frontier
estimatedReadingMinutes: 18
prerequisites: [rf-r0-..., ...]            # IDs of prerequisite lessons
spiralRevisits: [rf-r5-...]                # IDs of later lessons that revisit this concept

# Editorial
title: "Radiation Pattern: Intuition First, Formula After"
description: "Why antenna gain and directivity matter. From dipole to phased arrays."
authors: ["Crystal D."]
publishedAt: "2026-06-14"
lastVerified: "2026-06-14"
lastReviewedAt: "2026-06-14"

# Standards & citations
standards:
  - id: "IEEE 145-2013"
    cite: ieee-145-2013
    title: "IEEE Standard for Definitions of Terms for Antennas"

# Widgets (code-splitting hint)
widgets: [AntennaPattern3D, PolarPlot]

# Metadata
tags: [antenna, radiation-pattern, gain, directivity]
keywords: [antenna diagram, dipole, gain]
license: CC-BY-SA-4.0

# Research frontier flag (optional)
researchFrontier: false
---
```

### Content Structure

Use semantic sections with CSS class hooks:

```mdx
<section class="lesson-hook">

## Hook: Why This Matters

[Brief, compelling intro — 1-2 paragraphs]

</section>

<section class="lesson-intuition">

## Intuition First

[Build mental model before formulas. Use analogies, examples.]

</section>

<section class="lesson-mechanism">

## Mechanism: The Physics

[Equations, derivations, technical depth. KaTeX for math:]

$$L_\text{dB} = 10 \log_{10}(P/P_\text{ref})$$

[Interactive widgets here:]

<PolarPlot data={[...]} client:visible ariaLabel="Demo polar plot" />

</section>

<section class="lesson-apply">

## Apply: Worked Example

[Real scenario, step-by-step calculation.]

```python
# Example code (Shiki-highlighted)
eirp = tx_power - cable_loss + antenna_gain
print(f"EIRP: {eirp} dBm")
```

</section>

<section class="lesson-bridge">

## Bridge: Where This Connects

[Link to related domains, lessons, cross-domain bridges.]

</section>
```

### Glossary Auto-Linking

First occurrence of **any glossary term** auto-links (no manual tagging needed):

```mdx
A **decibel** is a logarithmic unit...  
    ↓ (build time)
A <GlossaryLink term="decibel">decibel</GlossaryLink> is a logarithmic unit...
```

Terms defined in `/data/glossary.json`. Do not manually wrap glossary terms.

### Citations

```mdx
The SBA architecture <Cite cite="3gpp-ts-23501-rel18" /> defines...
    ↓ (rendered as)
The SBA architecture [1] defines...
    [bibliography collected at lesson end]
```

- Citation keys must exist in `/data/citations.json`
- CI validates at build time
- Bibliography auto-generated per lesson

### Code Blocks

Use Shiki (Astro's native highlighter). Specify language:

````mdx
```python
def link_budget(tx_power, path_loss, antenna_gain):
    return tx_power - path_loss + antenna_gain
```

```verilog
module fir_filter(clk, data_in, data_out);
  // ...
endmodule
```
````

Supported: python, javascript, typescript, rust, c, matlab, verilog, yaml, json, shell, etc.

### Accessibility in Lessons

- **Math:** KaTeX auto-generates `aria-label` (option enabled in build)
- **Diagrams:** Always include `<figcaption>` describing what the diagram shows
- **Images:** Always include `alt` text
- **Code blocks:** Provide brief narrative explaining the snippet
- **Color:** Don't rely on color alone to convey meaning (use labels, icons, text)

---

## Bilingual Authoring (parityId Rule)

**Every lesson ships in BOTH English and Vietnamese simultaneously.**

### Workflow

1. **Write in English first:**
   ```
   content/en/rf/r0-foundations/01-decibels.mdx
   ```
   Set `parityId: rf-r0-foundations-01-decibels`

2. **Create Vietnamese parity immediately:**
   ```
   content/vi/rf/r0-foundations/01-decibels.mdx
   ```
   Same `parityId`, same frontmatter (except `lang: vi`), translated content

3. **Run parity check:**
   ```bash
   pnpm i18n-parity-check
   ```
   Fails the build if EN and VI don't have matching `parityId`s.

4. **Never publish one language without the other.** CI enforces this.

---

## File Size & Modularization

### Rule: Keep Files < 200 Lines

- **React components:** Split large components into smaller ones
  - Container logic ↔ Presentation logic
  - One component per file as a default
  - Shared sub-components in a `components/` subdirectory

- **Utilities:** Extract reusable functions to separate files
  - `packages/widgets/src/lib/orbitCalculations.ts`
  - `packages/widgets/src/lib/antennaPatterns.ts`

- **MDX lessons:** Lessons can exceed 200 lines (they're content), but keep individual sections logical

- **CSS modules:** If a component's styles exceed ~100 lines, extract to a `.module.css` file

**Anti-pattern:** Monolithic 500-line component. Split it.

---

## Commit Conventions

Use **conventional commits** with `type(scope): subject` format:

```
feat(widgets): add antenna pattern 3D visualizer
fix(content): correct decibels formula in vi lesson
docs(codebase): update widget architecture section
refactor(i18n): simplify language fallback logic
test(glossary): add auto-link plugin tests
chore(deps): update astro to 5.0.1
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `refactor` — code refactoring (no feature change)
- `test` — test additions/changes
- `chore` — dependencies, config, non-code changes

**DO NOT:**
- Reference plan phases or finding codes (e.g., "per Phase 1" or "F13 fix")
- Use AI attribution ("Claude-generated", "AI-assisted")
- Make multi-purpose commits — one concern per commit

---

## Testing

### Unit Tests (Vitest)

```typescript
// packages/widgets/src/lib/linkBudget.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLinkBudget } from './linkBudget';

describe('calculateLinkBudget', () => {
  it('should add gains and subtract losses', () => {
    const result = calculateLinkBudget({
      txPower: 20,       // dBm
      pathLoss: -150,    // dB
      antennaGain: 10,   // dBi
    });
    expect(result).toBe(20 - 150 + 10); // -120 dBm
  });

  it('should handle zero gains gracefully', () => {
    const result = calculateLinkBudget({
      txPower: 0,
      pathLoss: 0,
      antennaGain: 0,
    });
    expect(result).toBe(0);
  });
});
```

### E2E Tests

- Lighthouse CI runs on every PR (mobile perf gate)
- axe-core accessibility gate
- Lychee link checker (nightly)

### Coverage Target

Aim for >80% on `packages/` (core logic). Lessons and components: write tests for complex interactive logic.

---

## TypeScript Configuration

**Base config** (`tsconfig.base.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

**Per-workspace overrides:** `packages/*/tsconfig.json` and `apps/web/tsconfig.json` extend base.

---

## Design Tokens & Styling

### Colors

Defined in `packages/ui/src/tokens.css` and exported as CSS custom properties:

```css
:root {
  --color-bg: #0e1414;         /* Dark background */
  --color-surface: #1a2020;    /* Surface/card background */
  --color-accent-500: #88e1e6; /* Cyan primary accent */
  --color-accent-600: #5fc7ce; /* Accent darker variant */
  --color-text: #e5e7eb;       /* Light text on dark bg */
  --color-text-muted: #9ca3af; /* Muted text */
  /* ... more grays and semantic colors ... */
}
```

**Use in CSS:**
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-accent-500);
  color: var(--color-text);
}
```

**Use in Astro components:**
```astro
<button class="bg-accent-500 text-white hover:bg-accent-600">Click me</button>
```

**Dark-first principle:** Theme is dark by default. Print media automatically inverts colors via print stylesheet (light background, dark text).

### Typography

- **Body (sans):** System stack — Inter, system-ui, sans-serif (no @fontsource imports)
- **Headings (sans):** System stack — same as body (intentional uniformity)
- **Monospace:** System stack — monospace, IBM Plex Mono (fallback)
- **Base size:** 16px; scales responsively (1.2x mobile, 1.5x tablet)

### Dark Mode

- **Default:** Dark theme always (not OS preference)
- **CSS-only:** No JavaScript theme toggle — dark mode is the canonical color scheme
- **Print:** Automatically inverts to light background with dark text via `@media print` rules
- **Reduced motion:** All animations pause if `prefers-reduced-motion: reduce` is set

### Reduced Motion

- All animations auto-pause if `prefers-reduced-motion: reduce`
- WebGL widgets auto-pause animation loops
- Test: `@media (prefers-reduced-motion: reduce) { ... }`

---

## CI/CD Integration

### Pre-commit (Local)

Run before committing:
```bash
pnpm lint          # ESLint
pnpm format        # Prettier (in check mode; use --write to auto-fix)
pnpm test          # Vitest
```

### CI Pipeline (GitHub Actions)

1. **Lint:** ESLint 9, Prettier check
2. **Validate:** Zod schemas, citation existence, i18n parity
3. **Build:** Full Astro build with widget code-splitting
4. **Test:** Vitest + coverage
5. **Bundle check:** size-limit per widget (≤150KB gzipped)
6. **Lighthouse:** Mobile perf gate (≥90 score)
7. **a11y:** axe-core accessibility gate
8. **Link check:** Lychee (on PR diffs)

All must pass for merge to main.

---

## Documentation in Code

### Function/Class Comments

```typescript
/**
 * Calculate RF link budget for a given scenario.
 * 
 * @param txPower Transmitter power in dBm
 * @param pathLoss Path loss in dB (positive value)
 * @param antennaGain Antenna gain in dBi
 * @returns Received power in dBm
 * @example
 * const rx = calculateLinkBudget(30, 150, 10);  // -110 dBm
 */
export function calculateLinkBudget(txPower: number, pathLoss: number, antennaGain: number): number {
  return txPower - pathLoss + antennaGain;
}
```

### Tricky Logic Comments

```typescript
// J2 perturbation (oblateness of Earth) dominates for LEO
// Simplified: dω/dt ≈ 1.5 * J2 * (Re/a)^2 * (5*cos²(i) - 1) / (1-e²)²
const J2_PERTURBATION = 1.5 * J2_COEFFICIENT * ...;
```

**DO NOT** reference plan phases, finding codes, or audit labels. Explain the *why* (physical principle, trade-off, invariant).

---

## Monorepo Structure & Dependencies

### Workspace Packages

```
packages/
├── widgets/        (React components + utils for MDX)
├── ui/             (Design tokens + shared chrome components)
├── glossary/       (Glossary lookup + remark plugin)
├── citations/      (Citation component + validation)
└── i18n/           (i18n utilities)
```

### Import Rules

- **Apps can import from packages:** `import { X } from '@rfcn-space-handbook/ui'`
- **Packages can import from other packages** if it makes sense (e.g., `widgets` → `ui`)
- **No circular deps:** pnpm + Turborepo catch these at build time
- **Types are free:** Always OK to import types from another package

### Publishing

Currently internal-only (not published to npm). If/when we publish:
- Increment version in `packages/*/package.json`
- `pnpm publish` from each package
- Tag release in git

---

## Performance Budget & Lighthouse Targets

**Enforced in CI for every PR:**

| Metric | Target | Fail at |
|--------|--------|---------|
| Lighthouse mobile score (median lesson) | 90–100 | <85 |
| Lighthouse mobile score (widget-heavy) | 80–90 | <75 |
| LCP (large content paint) | <2.5s | >3.0s |
| FCP (first content paint) | <1.2s | >1.5s |
| CLS (cumulative layout shift) | <0.1 | >0.15 |
| Total page size | ≤200KB (no widget) | >250KB |

**Widget chunk sizes** (size-limit.json):
- Each widget chunk: ≤150KB gzipped
- Total widget JS: ≤500KB gzipped (all chunks combined, split across lessons)

---

See `PLATFORM_BLUEPRINT.md` §6 for content authoring standards, sourcing policy, and citation format.
