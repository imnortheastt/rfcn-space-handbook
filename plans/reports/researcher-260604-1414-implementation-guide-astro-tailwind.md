# Implementation Guide: Design System for Astro/Tailwind
## Quick Start & Best Practices

**Date:** 2026-06-04  
**Reference:** unsloth.ai + MDN design research  
**Audience:** Frontend developers implementing the design system  

---

## Quick Start Checklist

```
PROJECT SETUP
□ Copy tailwind.config.js to project root
□ Create src/styles/global.css with @tailwind directives
□ Install dependencies: tailwindcss, postcss, autoprefixer
□ Create src/components/ directory structure
□ Set up dark mode detection script in Layout.astro

COMPONENT IMPLEMENTATION (Priority Order)
□ Layout.astro (main wrapper, dark mode logic)
□ Button.astro (primary, secondary, tertiary)
□ Card.astro (basic card with hover states)
□ Heading.astro (H1-H6 abstraction)
□ Header.astro (navigation, logo, CTA)
□ CodeBlock.astro (syntax highlighting)
□ Hero.astro (landing section)
□ Sidebar.astro (documentation nav)

DESIGN SYSTEM VALIDATION
□ Color contrast check (WCAG AA 4.5:1)
□ Responsive testing (mobile, tablet, desktop)
□ Focus indicators visible (keyboard nav)
□ Dark mode works in all components
□ Button states (hover, active, disabled)
□ Link styling consistent
□ Code blocks display correctly
□ Form inputs accessible

OPTIMIZATION & POLISH
□ Minify CSS
□ Tree-shake unused Tailwind utilities
□ Test animation performance
□ Verify load times
□ Accessibility audit (axe, Lighthouse)
□ Create style guide page
```

---

## File Structure Setup

```bash
# Create directory structure
mkdir -p src/components/{Layout,Navigation,Typography,Forms,Utilities}
mkdir -p src/styles
mkdir -p src/layouts

# Directory hierarchy
src/
├── components/
│   ├── Layout/
│   │   ├── Container.astro
│   │   ├── Grid.astro
│   │   └── Hero.astro
│   ├── Navigation/
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   ├── Breadcrumb.astro
│   │   └── Footer.astro
│   ├── Typography/
│   │   ├── Heading.astro
│   │   ├── Paragraph.astro
│   │   └── Link.astro
│   ├── Button.astro
│   ├── Card.astro
│   ├── CodeBlock.astro
│   └── Forms/
│       ├── Input.astro
│       ├── Label.astro
│       └── Select.astro
├── layouts/
│   ├── Base.astro
│   ├── Documentation.astro
│   └── Landing.astro
├── styles/
│   ├── global.css
│   ├── typography.css (optional)
│   └── components.css (optional)
└── pages/
    ├── index.astro
    ├── docs/
    │   └── [...slug].astro
    └── style-guide.astro
```

---

## Step 1: Configure Tailwind

### `tailwind.config.js`

Copy from the provided template file. Key customizations:

```javascript
// Key sections to customize for your project:

colors: {
  // Change accent color if not using cyan
  // Example: use blue (#0a84ff) from MDN instead
}

fontFamily: {
  // Verify system fonts work in your target browsers
  // Add web fonts only if necessary for branding
}

extend: {
  // Add project-specific utilities here
  // Keep base tokens in tailwind.config.js
}
```

### PostCSS & Tailwind Configuration

```bash
# Install Tailwind
npm install -D tailwindcss postcss autoprefixer

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create tailwind.config.js (use provided template)
# Copy template file to project root
```

---

## Step 2: Global Styles

### `src/styles/global.css`

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* ============================================
   BASE STYLES
   ============================================ */

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-200;
  }

  /* Typography defaults */
  h1 {
    @apply text-5xl md:text-6xl font-bold leading-tight tracking-tighter mb-6;
  }

  h2 {
    @apply text-4xl md:text-5xl font-semibold leading-snug tracking-tight mb-4;
  }

  h3 {
    @apply text-2xl md:text-3xl font-semibold leading-snug mb-3;
  }

  p {
    @apply leading-relaxed mb-4 text-gray-700 dark:text-gray-300;
  }

  a {
    @apply text-cyan-400 hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200 transition-colors duration-150 underline;
  }

  code {
    @apply font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-red-600 dark:text-red-400;
  }

  pre {
    @apply bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-700;
  }
}

/* ============================================
   COMPONENTS
   ============================================ */

@layer components {
  /* Containers */
  .container {
    @apply max-w-container mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Buttons - use Astro Button component instead */
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-cyan-400 text-gray-900 hover:bg-cyan-500 hover:shadow-lg hover:-translate-y-0.5 active:bg-cyan-600 active:translate-y-0;
  }

  .btn-secondary {
    @apply btn border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800;
  }

  /* Cards */
  .card {
    @apply rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm;
  }

  .card-interactive {
    @apply card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer;
  }

  /* Focus indicators */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400;
  }

  /* Prose for markdown content */
  .prose {
    @apply max-w-prose mx-auto;
  }

  .prose h2 {
    @apply mt-8 pt-8 border-t border-gray-200 dark:border-gray-700;
  }

  .prose li {
    @apply my-2 ml-6;
  }

  /* Utility classes */
  .transition-smooth {
    @apply transition-all duration-200 ease-out;
  }

  .truncate-lines-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* ============================================
   UTILITIES
   ============================================ */

@layer utilities {
  /* Scrolling */
  .smooth-scroll {
    scroll-behavior: smooth;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Visually hidden (accessible) */
  .sr-only {
    @apply absolute w-px h-px p-0 -m-px overflow-hidden border-0 whitespace-nowrap clip-path-inset;
  }

  /* Animations */
  .fade-in {
    animation: fadeIn 300ms ease-in;
  }

  .fade-in-up {
    animation: fadeInUp 300ms ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

---

## Step 3: Layout Component

### `src/layouts/Base.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description = 'RFCN Space Handbook', ogImage } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <!-- Meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Fonts (optional - system fonts used by default) -->
    
    <title>{title}</title>
    
    <!-- Dark mode detection -->
    <script is:inline>
      // Check user preference and system setting
      if (localStorage.theme === 'dark' || 
          (!('theme' in localStorage) && 
           window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    </script>
  </head>
  
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
    <!-- Skip to main content link (accessibility) -->
    <a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>
    
    <!-- Header -->
    <slot name="header" />
    
    <!-- Main content -->
    <main id="main" role="main">
      <slot />
    </main>
    
    <!-- Footer -->
    <slot name="footer" />
    
    <!-- Dark mode toggle script -->
    <script is:inline>
      window.toggleDarkMode = function() {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
          html.classList.remove('dark');
          localStorage.theme = 'light';
        } else {
          html.classList.add('dark');
          localStorage.theme = 'dark';
        }
      };
    </script>
  </body>
</html>
```

---

## Step 4: Core Components

### `src/components/Button.astro`

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  ariaLabel?: string;
}

const {
  variant = 'primary',
  size = 'md',
  disabled = false,
  href,
  type = 'button',
  class: customClass = '',
  ariaLabel,
} = Astro.props;

const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses = {
  primary: 'bg-cyan-400 text-gray-900 hover:bg-cyan-500 hover:shadow-lg hover:-translate-y-0.5 active:bg-cyan-600 focus:ring-cyan-400 dark:bg-cyan-400 dark:text-gray-900',
  secondary: 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-400',
  tertiary: 'text-cyan-400 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-gray-800 focus:ring-cyan-400',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${customClass}`;

const Element = href ? 'a' : 'button';
---

<Element
  class={classes}
  href={href}
  type={href ? undefined : type}
  disabled={disabled && !href ? true : undefined}
  aria-label={ariaLabel}
  {...(href ? {} : { type })}
>
  <slot />
</Element>

<style>
  button:disabled:hover {
    transform: none;
    box-shadow: none;
  }

  a:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
</style>
```

### `src/components/Card.astro`

```astro
---
interface Props {
  interactive?: boolean;
  class?: string;
}

const { interactive = false, class: customClass = '' } = Astro.props;

const classes = `
  rounded-lg border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-900
  p-6 shadow-sm
  ${interactive ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200' : ''}
  ${customClass}
`;
---

<div class={classes.trim()}>
  <slot />
</div>
```

### `src/components/Heading.astro`

```astro
---
interface Props {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  class?: string;
}

const { level, class: customClass = '' } = Astro.props;

const sizeClasses = {
  1: 'text-5xl md:text-6xl font-bold tracking-tighter',
  2: 'text-4xl md:text-5xl font-semibold tracking-tight',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-semibold',
  6: 'text-base md:text-lg font-semibold',
};

const Tag = `h${level}` as const;
const marginClasses = level === 1 ? 'mb-6' : 'mb-4';
---

<Tag class={`${sizeClasses[level]} ${marginClasses} text-gray-900 dark:text-white ${customClass}`}>
  <slot />
</Tag>
```

---

## Step 5: Dark Mode Implementation

### Dark Mode Toggle Component

```astro
<!-- src/components/ThemeToggle.astro -->
---
---

<button
  id="theme-toggle"
  aria-label="Toggle dark mode"
  class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
>
  <svg id="sun-icon" class="w-5 h-5 text-yellow-500 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM4.464 6.464A1 1 0 003.05 5.05l-.707.707a1 1 0 001.414 1.414l.707-.707z" clip-rule="evenodd" />
  </svg>
  
  <svg id="moon-icon" class="w-5 h-5 text-blue-400 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  
  toggle?.addEventListener('click', () => {
    const html = document.documentElement;
    
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      html.classList.add('dark');
      localStorage.theme = 'dark';
    }
  });
</script>
```

---

## Step 6: Accessibility Checklist

### Before Launch

```
CONTRAST & COLOR
☐ Text contrast ≥ 4.5:1 (WCAG AA)
☐ Large text contrast ≥ 3:1 (WCAG AA)
☐ Color not sole differentiator
☐ Focus indicators clearly visible

KEYBOARD NAVIGATION
☐ Tab order is logical
☐ Focus indicator on all interactive elements
☐ No keyboard traps
☐ Skip-to-content link works
☐ Shortcut keys documented

SEMANTICS & MARKUP
☐ Proper heading hierarchy (H1 → H2 → H3)
☐ Semantic HTML (nav, main, aside, article)
☐ Forms have labels for all inputs
☐ Images have descriptive alt text
☐ Lists use proper list elements

ARIA & LABELS
☐ aria-label on icon-only buttons
☐ aria-expanded on collapsible sections
☐ aria-current on active nav links
☐ ARIA attributes only when needed
☐ No ARIA conflicts with native HTML

TESTING TOOLS
☐ axe DevTools scan (0 violations)
☐ Lighthouse accessibility score > 90
☐ Screen reader testing (VoiceOver, NVDA)
☐ Keyboard-only navigation test
☐ Mobile accessibility check
```

### Testing Commands

```bash
# Install axe DevTools browser extension
# Run Lighthouse audit in Chrome DevTools
# Test with screen reader (macOS: VoiceOver, Windows: NVDA)

# Keyboard navigation test:
# Tab through all elements, use Enter/Space to activate
# Verify focus visible throughout
# No keyboard traps or dead ends
```

---

## Step 7: Performance Optimization

### CSS Optimization

```bash
# Tailwind automatically tree-shakes unused classes
# Verify in production build

# Check final CSS size:
wc -c dist/_astro/*.css

# Target: < 30KB gzipped for entire CSS
```

### Image Optimization

```astro
<!-- Use Astro's Image component -->
---
import { Image } from 'astro:assets';
import screenshot from '../assets/screenshot.png';
---

<Image
  src={screenshot}
  alt="Screenshot of feature"
  width={1200}
  height={600}
  format="webp"
  quality="high"
/>
```

### Font Optimization

```css
/* System fonts (already optimized, no requests) */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* If using web fonts, load with font-display: swap */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}
```

---

## Step 8: Testing Checklist

### Responsive Design Testing

```
Breakpoints to test:
□ Mobile: 320px, 375px, 425px
□ Tablet: 768px, 820px, 1024px
□ Desktop: 1280px, 1440px, 1920px

Components to test:
□ Navigation (hamburger on mobile)
□ Images (scaling, compression)
□ Code blocks (horizontal scroll on mobile)
□ Forms (input sizing on small screens)
□ Grids (2-3 column on mobile → 3 on desktop)
```

### Browser Compatibility

```
Minimum support:
□ Chrome 90+
□ Firefox 88+
□ Safari 14+
□ Edge 90+
□ Mobile: iOS 12+, Android 5+

Test in:
□ Chrome (desktop + mobile)
□ Firefox (desktop)
□ Safari (macOS + iOS)
□ Edge (Windows)
```

### Dark Mode Testing

```
□ All colors readable in dark mode
□ Images look good on dark backgrounds
□ Code blocks display correctly
□ Links visible with dark backgrounds
□ Transitions smooth between modes
□ Auto-detection works
□ Manual toggle works
```

---

## Step 9: Creating a Style Guide

### `src/pages/style-guide.astro`

```astro
---
import BaseLayout from '../layouts/Base.astro';
import Button from '../components/Button.astro';
import Card from '../components/Card.astro';
import Heading from '../components/Heading.astro';
---

<BaseLayout title="Style Guide">
  <div class="container py-20">
    <Heading level={1}>Design System Style Guide</Heading>
    
    <section class="mt-12">
      <Heading level={2}>Colors</Heading>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="rounded-lg p-4 bg-cyan-400 h-32 flex items-end">
          <span class="text-gray-900 font-mono text-sm">#88e1e6</span>
        </div>
        <!-- More color swatches... -->
      </div>
    </section>

    <section class="mt-12">
      <Heading level={2}>Typography</Heading>
      <Heading level={3}>Headings</Heading>
      <Heading level={1}>H1 - 48px Bold</Heading>
      <Heading level={2}>H2 - 36px Semibold</Heading>
      <Heading level={3}>H3 - 24px Semibold</Heading>
      <!-- More typography examples... -->
    </section>

    <section class="mt-12">
      <Heading level={2}>Buttons</Heading>
      <div class="flex flex-wrap gap-4 mt-6">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="tertiary">Tertiary Button</Button>
        <Button variant="primary" disabled>Disabled Button</Button>
      </div>
    </section>

    <section class="mt-12">
      <Heading level={2}>Cards</Heading>
      <Card class="mt-6 max-w-sm">
        <Heading level={3}>Card Title</Heading>
        <p>Card content with description and details.</p>
      </Card>
    </section>
  </div>
</BaseLayout>
```

---

## Common Issues & Solutions

### Issue: Dark Mode Not Detecting Preference

**Solution:**
```astro
<script is:inline>
  // Check localStorage first, then system preference
  if (localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!('theme' in localStorage)) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
</script>
```

### Issue: Tailwind Classes Not Being Applied

**Solution:**
- Verify `content` array in `tailwind.config.js` includes all template files
- Check file extensions match (`.astro`, `.ts`, `.tsx`)
- Restart Tailwind build process
- Clear `.astro/` cache directory

### Issue: Focus Indicators Not Visible

**Solution:**
```css
/* Ensure focus-ring is applied to all interactive elements */
button, a, input, select, textarea {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400;
}
```

### Issue: Responsive Classes Not Working on Mobile

**Solution:**
```astro
<!-- Ensure viewport meta tag is present -->
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- Test in browser DevTools with device emulation -->
<!-- Mobile-first: use sm:, md:, lg: for larger screens -->
<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
  Content
</div>
```

---

## Next Steps

1. **Copy template files** to your project
2. **Configure Tailwind** with `tailwind.config.js`
3. **Create base components** (Button, Card, Heading, Layout)
4. **Test responsive design** across devices
5. **Validate accessibility** with axe & Lighthouse
6. **Create style guide page** for team reference
7. **Optimize performance** for production
8. **Document custom utilities** for team

---

**Status:** IMPLEMENTATION GUIDE COMPLETE  
**Ready for:** Development team to begin building components  
**Support:** Refer to component specifications and Tailwind docs
