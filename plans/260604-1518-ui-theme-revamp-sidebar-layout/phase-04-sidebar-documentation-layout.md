---
phase: 4
title: "Sidebar Documentation Layout"
status: pending
priority: P2
effort: "4h"
dependencies: [1, 2]
---

# Phase 4: Sidebar Documentation Layout

## Overview

Implement a documentation-style layout with persistent sidebar navigation (like unsloth.ai/docs). The sidebar shows domain hierarchy (tracks → units → lessons) and highlights current location.

## Requirements

- Functional: Sidebar visible on domain index and lesson pages
- Functional: Collapsible track/unit sections
- Functional: Current lesson highlighted
- Functional: Sidebar scrolls independently from main content
- Non-functional: Sidebar hidden on mobile (≤768px), accessible via hamburger
- Non-functional: Smooth transitions for collapse/expand

## Architecture

```
DocsLayout.astro (new layout for documentation pages)
├─ Header (existing, full-width)
├─ <div class="docs-container">
│   ├─ <aside class="docs-sidebar">
│   │   ├─ DomainNav.astro (track/unit tree)
│   │   └─ Sticky positioning
│   └─ <main class="docs-content">
│       └─ <slot /> (lesson content)
└─ Footer (existing)
```

Layout modes:
- **Homepage** (`/[lang]/`): Full-width, no sidebar (existing BaseLayout)
- **Domain index** (`/[lang]/rf/`): Sidebar + roadmap content
- **Lesson pages** (`/[lang]/rf/track/unit/lesson`): Sidebar + lesson content

## Related Code Files

- Create: `apps/web/src/layouts/DocsLayout.astro`
- Create: `apps/web/src/components/DocsSidebar.astro`
- Create: `apps/web/src/components/SidebarNav.astro`
- Modify: `apps/web/src/pages/[lang]/[domain]/index.astro` (use DocsLayout)
- Modify: `apps/web/src/layouts/LessonLayout.astro` (use DocsLayout)
- Modify: `packages/ui/src/base.css` (sidebar styles)

## Implementation Steps

1. **Create DocsLayout.astro**
   ```astro
   ---
   import '../styles/global.css';
   import Header from '../components/Header.astro';
   import Footer from '../components/Footer.astro';
   import DocsSidebar from '../components/DocsSidebar.astro';
   
   interface Props {
     lang: 'en' | 'vi';
     domain: 'rf' | 'core-network' | 'space';
     title: string;
     currentPath?: string;
   }
   
   const { lang, domain, title, currentPath } = Astro.props;
   ---
   <!doctype html>
   <html lang={lang}>
     <head><!-- same as BaseLayout --></head>
     <body>
       <Header lang={lang} />
       <div class="docs-container">
         <DocsSidebar lang={lang} domain={domain} currentPath={currentPath} />
         <main class="docs-content">
           <slot />
         </main>
       </div>
       <Footer lang={lang} />
     </body>
   </html>
   ```

2. **Create DocsSidebar.astro**
   - Load curriculum.json for domain
   - Build tree: domain → tracks → units → lessons
   - Render collapsible sections with `<details>` + `<summary>`
   - Highlight current path with `.active` class

3. **Create SidebarNav.astro (tree rendering)**
   ```astro
   ---
   interface Track { title: string; units: Unit[] }
   interface Unit { title: string; lessons: Lesson[] }
   interface Lesson { slug: string; title: string; href: string }
   
   interface Props {
     tracks: Track[];
     currentPath?: string;
     lang: 'en' | 'vi';
   }
   ---
   <nav class="sidebar-nav" aria-label="Documentation">
     {tracks.map((track) => (
       <details class="sidebar-track" open>
         <summary class="sidebar-track-title">{track.title}</summary>
         <ul class="sidebar-units">
           {track.units.map((unit) => (
             <li>
               <details class="sidebar-unit" open>
                 <summary class="sidebar-unit-title">{unit.title}</summary>
                 <ul class="sidebar-lessons">
                   {unit.lessons.map((lesson) => (
                     <li>
                       <a 
                         href={lesson.href}
                         class:list={['sidebar-lesson', { active: currentPath === lesson.href }]}
                       >
                         {lesson.title}
                       </a>
                     </li>
                   ))}
                 </ul>
               </details>
             </li>
           ))}
         </ul>
       </details>
     ))}
   </nav>
   ```

4. **Add sidebar styles to base.css**
   ```css
   .docs-container {
     display: flex;
     min-height: calc(100vh - 4rem);
   }
   
   .docs-sidebar {
     width: 280px;
     flex-shrink: 0;
     position: sticky;
     top: 4rem; /* below header */
     height: calc(100vh - 4rem);
     overflow-y: auto;
     border-right: 1px solid var(--color-border);
     background: var(--color-surface);
     padding: var(--space-4);
   }
   
   .docs-content {
     flex: 1;
     min-width: 0;
     padding: var(--space-6);
     max-width: var(--measure-wide);
   }
   
   /* Sidebar nav tree */
   .sidebar-track-title { font-weight: 600; cursor: pointer; }
   .sidebar-unit-title { font-size: var(--font-size-sm); cursor: pointer; }
   .sidebar-lesson { 
     display: block;
     padding: var(--space-1) var(--space-2);
     color: var(--color-muted);
     text-decoration: none;
     font-size: var(--font-size-sm);
     border-radius: 4px;
   }
   .sidebar-lesson:hover { color: var(--color-fg); }
   .sidebar-lesson.active {
     color: var(--color-accent-500);
     background: rgba(136, 225, 230, 0.1);
   }
   
   /* Mobile: hide sidebar */
   @media (max-width: 768px) {
     .docs-sidebar { display: none; }
     .docs-content { padding: var(--space-4); }
   }
   ```

5. **Update domain index pages to use DocsLayout**
   - Replace `BaseLayout` import with `DocsLayout`
   - Pass domain and lang props

6. **Update LessonLayout to use DocsLayout**
   - Wrap existing lesson content in DocsLayout
   - Extract domain from frontmatter or URL
   - Pass currentPath for highlighting

## Success Criteria

- [ ] Sidebar visible on domain index pages (≥769px viewport)
- [ ] Sidebar visible on lesson pages (≥769px viewport)
- [ ] Track/unit sections collapsible
- [ ] Current lesson highlighted with accent color
- [ ] Sidebar scrolls independently
- [ ] Sidebar hidden on mobile, content full-width
- [ ] Hamburger menu still works for mobile nav
- [ ] No layout shift when navigating between lessons

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Sidebar performance with large curriculum | Use `<details>` for native lazy rendering |
| Scroll position lost on navigation | Use View Transitions API or manual scroll restore |
| Mobile UX degradation | Hamburger menu covers sidebar use case |
