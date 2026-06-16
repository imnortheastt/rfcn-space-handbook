---
phase: 3
title: "Homepage & Landing"
status: completed
effort: "4h"
dependencies: ["phase-01", "phase-02"]
---

# Phase 3: Homepage & Landing

## Overview

Build the homepage at `/[lang]/index.astro` with hero section, domain cards, feature highlights, and footer. Design follows Unsloth.ai style with dark background, cyan accents, and clean typography. Each domain card links to its respective learning path.

## Requirements

### Functional
- Hero section with site tagline and CTA button
- Three domain cards: RF, Core Network, Space
- Feature highlights section (bilingual, open-source, math-friendly)
- Footer with navigation links, GitHub link, license info

### Non-Functional
- Hero CTA button uses cyan accent with hover state
- Domain cards have hover lift effect
- Footer uses muted colors, smaller text
- Page works for both `/en/` and `/vi/` routes

## Related Code Files

### Create
| File | Purpose |
|------|---------|
| `apps/web/src/pages/[lang]/index.astro` | Homepage route |
| `apps/web/src/components/Hero.astro` | Hero section component |
| `apps/web/src/components/DomainCard.astro` | Reusable domain card |
| `apps/web/src/components/FeatureHighlight.astro` | Feature item component |
| `apps/web/src/components/Footer.astro` | Global footer |

### Modify
| File | Purpose |
|------|---------|
| `apps/web/src/layouts/BaseLayout.astro` | Add Footer component |
| `packages/ui/src/base.css` | Add homepage section styles |

### Delete
- None (existing `apps/web/src/pages/index.astro` may redirect to `/en/`)

## Implementation Steps

1. **Create Hero.astro component**
   ```astro
   ---
   interface Props {
     lang: 'en' | 'vi';
   }
   const { lang } = Astro.props;
   
   const content = {
     en: {
       tagline: 'Master RF, Core Network, and Space Systems',
       subtitle: 'A bilingual technical handbook for engineers',
       cta: 'Start Learning'
     },
     vi: {
       tagline: 'Làm chủ RF, Core Network và Hệ thống Không gian',
       subtitle: 'Sổ tay kỹ thuật song ngữ cho kỹ sư',
       cta: 'Bắt đầu học'
     }
   };
   ---
   
   <section class="hero">
     <h1 class="hero-title">{content[lang].tagline}</h1>
     <p class="hero-subtitle">{content[lang].subtitle}</p>
     <a href={`/${lang}/rf/`} class="hero-cta">
       {content[lang].cta}
     </a>
   </section>
   ```

2. **Add hero styles to base.css**
   ```css
   .hero {
     text-align: center;
     padding: var(--space-16) var(--space-4);
     max-width: var(--measure);
     margin: 0 auto;
   }
   
   .hero-title {
     font-size: clamp(2rem, 5vw, 3rem);
     font-weight: 700;
     line-height: 1.2;
     margin-bottom: var(--space-4);
   }
   
   .hero-subtitle {
     font-size: var(--font-size-lg);
     color: var(--color-muted);
     margin-bottom: var(--space-8);
   }
   
   .hero-cta {
     display: inline-block;
     padding: var(--space-3) var(--space-6);
     background-color: var(--color-accent-500);
     color: var(--color-bg);
     font-weight: 600;
     border-radius: 6px;
     text-decoration: none;
     transition: background-color 0.15s ease, transform 0.15s ease;
   }
   
   .hero-cta:hover {
     background-color: var(--color-accent-400);
     transform: translateY(-2px);
   }
   ```

3. **Create DomainCard.astro component**
   ```astro
   ---
   interface Props {
     title: string;
     description: string;
     href: string;
     icon?: string; // Optional SVG or emoji
   }
   const { title, description, href, icon = '📡' } = Astro.props;
   ---
   
   <a href={href} class="domain-card">
     <span class="domain-card-icon">{icon}</span>
     <h3 class="domain-card-title">{title}</h3>
     <p class="domain-card-desc">{description}</p>
   </a>
   ```

4. **Add domain card styles**
   ```css
   .domain-cards {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: var(--space-6);
     padding: var(--space-12) var(--space-4);
     max-width: 1000px;
     margin: 0 auto;
   }
   
   .domain-card {
     display: block;
     padding: var(--space-6);
     background-color: var(--color-surface);
     border: 1px solid var(--color-border);
     border-radius: 8px;
     text-decoration: none;
     transition: transform 0.15s ease, border-color 0.15s ease;
   }
   
   .domain-card:hover {
     transform: translateY(-4px);
     border-color: var(--color-accent-500);
   }
   
   .domain-card-icon {
     font-size: 2rem;
     margin-bottom: var(--space-3);
     display: block;
   }
   
   .domain-card-title {
     font-size: var(--font-size-xl);
     font-weight: 600;
     color: var(--color-fg);
     margin-bottom: var(--space-2);
   }
   
   .domain-card-desc {
     font-size: var(--font-size-sm);
     color: var(--color-muted);
     line-height: 1.5;
   }
   ```

5. **Create FeatureHighlight.astro component**
   ```astro
   ---
   interface Props {
     icon: string;
     title: string;
     description: string;
   }
   const { icon, title, description } = Astro.props;
   ---
   
   <div class="feature-item">
     <span class="feature-icon">{icon}</span>
     <h4 class="feature-title">{title}</h4>
     <p class="feature-desc">{description}</p>
   </div>
   ```

6. **Add feature section styles**
   ```css
   .features-section {
     padding: var(--space-12) var(--space-4);
     background-color: var(--color-surface);
   }
   
   .features-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
     gap: var(--space-8);
     max-width: 1000px;
     margin: 0 auto;
   }
   
   .feature-item {
     text-align: center;
   }
   
   .feature-icon {
     font-size: 2rem;
     margin-bottom: var(--space-3);
     display: block;
   }
   
   .feature-title {
     font-size: var(--font-size-base);
     font-weight: 600;
     color: var(--color-fg);
     margin-bottom: var(--space-2);
   }
   
   .feature-desc {
     font-size: var(--font-size-sm);
     color: var(--color-muted);
   }
   ```

7. **Create Footer.astro component**
   ```astro
   ---
   interface Props {
     lang: 'en' | 'vi';
   }
   const { lang } = Astro.props;
   ---
   
   <footer class="site-footer">
     <div class="footer-inner">
       <div class="footer-nav">
         <a href={`/${lang}/rf/`}>RF</a>
         <a href={`/${lang}/core-network/`}>Core Network</a>
         <a href={`/${lang}/space/`}>Space</a>
         <a href={`/${lang}/glossary/`}>Glossary</a>
       </div>
       <div class="footer-meta">
         <a href="https://github.com/user/rfcn-space-handbook" target="_blank" rel="noopener">
           GitHub
         </a>
         <span>MIT License</span>
       </div>
       <p class="footer-copyright">
         © {new Date().getFullYear()} RFCN Space Handbook
       </p>
     </div>
   </footer>
   ```

8. **Add footer styles**
   ```css
   .site-footer {
     padding: var(--space-8) var(--space-4);
     border-top: 1px solid var(--color-border);
     margin-top: var(--space-16);
   }
   
   .footer-inner {
     max-width: var(--measure-wide);
     margin: 0 auto;
     text-align: center;
   }
   
   .footer-nav {
     display: flex;
     justify-content: center;
     gap: var(--space-6);
     margin-bottom: var(--space-4);
     flex-wrap: wrap;
   }
   
   .footer-nav a {
     color: var(--color-muted);
     text-decoration: none;
     font-size: var(--font-size-sm);
   }
   
   .footer-nav a:hover {
     color: var(--color-accent-500);
   }
   
   .footer-meta {
     display: flex;
     justify-content: center;
     gap: var(--space-4);
     margin-bottom: var(--space-4);
     font-size: var(--font-size-sm);
     color: var(--color-muted);
   }
   
   .footer-meta a {
     color: var(--color-muted);
   }
   
   .footer-copyright {
     font-size: var(--font-size-sm);
     color: var(--color-muted);
   }
   ```

9. **Create homepage page `[lang]/index.astro`**
   ```astro
   ---
   import BaseLayout from '../../layouts/BaseLayout.astro';
   import Hero from '../../components/Hero.astro';
   import DomainCard from '../../components/DomainCard.astro';
   import FeatureHighlight from '../../components/FeatureHighlight.astro';
   
   export function getStaticPaths() {
     return [
       { params: { lang: 'en' } },
       { params: { lang: 'vi' } }
     ];
   }
   
   const { lang } = Astro.params as { lang: 'en' | 'vi' };
   
   const domains = {
     en: [
       { title: 'RF Fundamentals', description: 'Decibels, antennas, propagation, and signal processing', href: `/${lang}/rf/`, icon: '📡' },
       { title: 'Core Network', description: '4G/5G architecture, protocols, and mobility management', href: `/${lang}/core-network/`, icon: '🌐' },
       { title: 'Space Systems', description: 'Satellite communications, orbits, and link budgets', href: `/${lang}/space/`, icon: '🛰️' }
     ],
     vi: [
       { title: 'Cơ bản RF', description: 'Decibel, anten, truyền sóng và xử lý tín hiệu', href: `/${lang}/rf/`, icon: '📡' },
       { title: 'Core Network', description: 'Kiến trúc 4G/5G, giao thức và quản lý di động', href: `/${lang}/core-network/`, icon: '🌐' },
       { title: 'Hệ thống Không gian', description: 'Thông tin vệ tinh, quỹ đạo và link budget', href: `/${lang}/space/`, icon: '🛰️' }
     ]
   };
   
   const features = {
     en: [
       { icon: '🌍', title: 'Bilingual', description: 'Full content in English and Vietnamese' },
       { icon: '📐', title: 'Math-Friendly', description: 'LaTeX equations rendered beautifully' },
       { icon: '🔓', title: 'Open Source', description: 'MIT licensed, contribute on GitHub' }
     ],
     vi: [
       { icon: '🌍', title: 'Song ngữ', description: 'Nội dung đầy đủ bằng tiếng Anh và tiếng Việt' },
       { icon: '📐', title: 'Thân thiện toán học', description: 'Công thức LaTeX hiển thị đẹp' },
       { icon: '🔓', title: 'Mã nguồn mở', description: 'Giấy phép MIT, đóng góp trên GitHub' }
     ]
   };
   ---
   
   <BaseLayout title="RFCN Space Handbook" lang={lang}>
     <Hero lang={lang} />
     
     <section class="domain-cards">
       {domains[lang].map(d => (
         <DomainCard {...d} />
       ))}
     </section>
     
     <section class="features-section">
       <div class="features-grid">
         {features[lang].map(f => (
           <FeatureHighlight {...f} />
         ))}
       </div>
     </section>
   </BaseLayout>
   ```

10. **Update BaseLayout.astro**
    - Import and render `<Footer lang={lang} />` before closing `</body>`

## Success Criteria

- [ ] Homepage renders at `/en/` and `/vi/`
- [ ] Hero section displays tagline, subtitle, and CTA button
- [ ] CTA button links to RF domain
- [ ] Three domain cards render with correct links
- [ ] Domain cards have hover lift effect
- [ ] Feature highlights section renders with icons
- [ ] Footer displays with nav links, GitHub link, copyright
- [ ] All text is localized per language

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Routing conflict with existing pages | Low | Medium | Check existing `pages/` structure; use `[lang]` dynamic route |
| Content not fully translated | Medium | Low | Start with English; add Vietnamese strings progressively |
| Emoji rendering inconsistent | Low | Low | Fallback is acceptable; can replace with SVG icons later |
| Footer overlaps content on short pages | Low | Low | Use `min-height: 100vh` or flexbox sticky footer pattern |

## Notes

- Domain icons use emoji for simplicity; can upgrade to Lucide/Heroicons in future
- CTA links to RF as "start here" domain; can be changed
- GitHub link placeholder needs actual repo URL
- Vietnamese translations should be reviewed by native speaker
