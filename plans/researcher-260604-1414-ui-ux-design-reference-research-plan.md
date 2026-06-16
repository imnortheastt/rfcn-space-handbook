# UI/UX Design Reference Research Plan

**Date:** 2026-06-04  
**Researcher:** Design Reference Analyst  
**Output:** Comprehensive design guide for Astro/Tailwind implementation  

---

## Research Scope

### Primary Sites
1. **unsloth.ai** — Modern SaaS design patterns
2. **developer.mozilla.org (MDN)** — Documentation-focused design patterns

### Design Dimensions to Analyze

#### For unsloth.ai
- [ ] Color palette (hex values, dark/light modes, accent colors)
- [ ] Typography system (font families, sizing scale, weights, line heights)
- [ ] Layout patterns (hero sections, card grids, feature sections, footer)
- [ ] Navigation design (navbar structure, menu patterns, CTA placement)
- [ ] Interactive elements (button states, link styling, hover effects, transitions)
- [ ] Code block styling (syntax highlighting, language badges, copy buttons)
- [ ] Spacing/grid system (margins, padding, container widths)
- [ ] Visual hierarchy (contrast, emphasis, whitespace)

#### For MDN (developer.mozilla.org)
- [ ] Documentation layout structure (main content + sidebar)
- [ ] Sidebar navigation patterns (expand/collapse, active states, breadcrumbs)
- [ ] Content hierarchy (H1-H6 sizing and spacing)
- [ ] Code syntax highlighting (colors, background, line numbers)
- [ ] Search UX (autocomplete, keyboard nav, filters)
- [ ] Responsive behavior (breakpoints, mobile nav, tablet layout)
- [ ] Typography (body font, code font, link styling)
- [ ] Color scheme (backgrounds, text, borders, emphasis)

---

## Deliverables

### 1. Design Reference Guide
**Output:** `/Users/imnortheast/Workspace/personal/rfcn-space-handbook/plans/reports/researcher-260604-1414-ui-ux-design-reference-guide.md`

**Sections:**
- Executive summary (key takeaways for each site)
- unsloth.ai design system breakdown
- MDN design system breakdown
- Comparative analysis (similarities, differences, best practices)
- Implementation recommendations for Astro/Tailwind
- Component patterns to implement
- Color palette recommendations
- Typography specifications
- Spacing/layout grid system

### 2. Tailwind Configuration Suggestions
- Color tokens from reference sites
- Typography scale
- Spacing scale
- Custom components

---

## Research Approach

### Phase 1: Visual Analysis (Manual)
- Screenshot each site
- Document visual patterns
- Extract design decisions

### Phase 2: Code Analysis
- Inspect CSS/Tailwind classes
- Extract design tokens
- Identify responsive patterns

### Phase 3: Pattern Documentation
- Create reusable component specifications
- Document interaction patterns
- Create implementation guide

### Phase 4: Synthesis
- Compare approaches
- Identify best practices
- Create unified guide for Astro/Tailwind

---

## Success Criteria

- Comprehensive color palette extracted (hex values)
- Typography system documented (fonts, sizes, weights)
- Layout patterns clearly specified with spacing
- Navigation patterns documented with state variations
- Interactive element specifications (hover, focus, active states)
- Mobile-first responsive approach documented
- Tailwind implementation examples provided
- Ready-to-implement component specifications

---

## Unresolved Questions

1. Should the guide prioritize unsloth.ai's modern SaaS aesthetic or MDN's documentation-first approach?
2. What specific Astro components will use these patterns (already deployed)?
3. Dark mode support required? (Both sites support it)
4. Accessibility requirements (WCAG level)?
5. Animation/transition preferences?

---

## Status

**Status:** READY FOR RESEARCH  
**Next Step:** Fetch and analyze both sites, create comprehensive guide
