---
phase: 5
title: "Integration Testing"
status: pending
priority: P2
effort: "1h"
dependencies: [1, 2, 3, 4]
---

# Phase 5: Integration Testing

## Overview

Verify all theme and layout changes work correctly across browsers, devices, and scenarios. Manual verification + visual regression baseline.

## Requirements

- Functional: All phases integrated and working together
- Non-functional: No regressions in existing functionality
- Non-functional: Performance not degraded

## Test Matrix

### Theme Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Fresh visit, no localStorage | Light theme |
| Fresh visit, OS dark mode | Dark theme |
| `localStorage.theme = 'dark'` | Dark theme |
| `localStorage.theme = 'light'` + OS dark | Light theme |
| Toggle click in light mode | Switches to dark, saves pref |
| Toggle click in dark mode | Switches to light, saves pref |
| Page navigation after toggle | Theme persists |
| Hard refresh after toggle | Theme persists |

### Roadmap Visibility

| Scenario | Expected Result |
|----------|-----------------|
| Roadmap in light theme | All boxes visible, text readable |
| Roadmap in dark theme | All boxes visible, text readable |
| L0-L1 lessons | Visible, subtle tier |
| L4-L5 lessons | Visible, prominent tier |
| Theme toggle on roadmap page | Boxes update colors immediately |

### Layout Scenarios

| Page | Desktop (≥769px) | Mobile (≤768px) |
|------|------------------|-----------------|
| Homepage (`/en/`) | Full-width, no sidebar | Full-width |
| Domain index (`/en/rf/`) | Sidebar + content | No sidebar, hamburger |
| Lesson page | Sidebar + content | No sidebar, hamburger |
| Current lesson in sidebar | Highlighted with accent | N/A |

### Cross-Browser

| Browser | Version | Test |
|---------|---------|------|
| Chrome | Latest | Full |
| Firefox | Latest | Full |
| Safari | Latest | Theme + layout |
| Mobile Safari | iOS 15+ | Layout + touch |
| Chrome Android | Latest | Layout + touch |

## Implementation Steps

1. **Build and run dev server**
   ```bash
   pnpm build
   pnpm preview
   ```

2. **Theme persistence tests**
   - Open DevTools → Application → Local Storage
   - Clear localStorage
   - Verify light theme on fresh load
   - Toggle to dark, verify localStorage updated
   - Refresh, verify dark persists
   - Toggle to light, refresh, verify light persists

3. **Roadmap visibility tests**
   - Navigate to `/en/rf/`
   - Screenshot roadmap in light theme
   - Toggle to dark
   - Screenshot roadmap in dark theme
   - Verify all lesson boxes visible in both
   - Verify text contrast (eyeball check or DevTools audit)

4. **Sidebar layout tests**
   - Desktop: Verify sidebar visible on domain index
   - Desktop: Verify sidebar visible on lesson page
   - Desktop: Click lesson in sidebar, verify navigation
   - Desktop: Verify current lesson highlighted
   - Mobile: Resize to 768px, verify sidebar hidden
   - Mobile: Verify hamburger menu works

5. **Accessibility audit**
   - Run Lighthouse accessibility audit
   - Verify focus indicators on theme toggle
   - Verify sidebar navigable by keyboard
   - Check color contrast ratios

6. **Performance check**
   - Lighthouse performance score
   - No significant regression from baseline
   - Theme switch < 16ms (no visible delay)

## Success Criteria

- [ ] All theme scenarios pass
- [ ] Roadmap visible in both themes (screenshot evidence)
- [ ] Sidebar layout works on desktop
- [ ] Mobile layout degrades gracefully
- [ ] Lighthouse accessibility ≥ 90
- [ ] No console errors
- [ ] No layout shift on theme toggle
- [ ] No FOUC on page load

## Artifacts

- Screenshots: `plans/260604-1518-ui-theme-revamp-sidebar-layout/screenshots/`
  - `light-homepage.png`
  - `dark-homepage.png`
  - `light-roadmap.png`
  - `dark-roadmap.png`
  - `sidebar-desktop.png`
  - `mobile-hamburger.png`

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Browser-specific rendering issues | Test in all target browsers |
| Mobile touch target too small | Verify 44x44px minimum |
