# Design Tokens Quick Reference
## Color, Typography, Spacing Constants for Copy-Paste

**Date:** 2026-06-04  
**Purpose:** Fast lookup for exact values during implementation  
**Format:** Copy-paste ready for CSS/Tailwind config  

---

## 🎨 COLOR TOKENS

### Primary Colors (unsloth.ai-inspired)

**Cyan Accent Palette:**
```css
--color-cyan-50: #f0fdf9;
--color-cyan-100: #e0fbf7;
--color-cyan-200: #b3f5f0;
--color-cyan-300: #88e1e6;    /* Primary accent */
--color-cyan-400: #6dd8e0;    /* Hover state */
--color-cyan-500: #5ccfd8;    /* Active state */
--color-cyan-600: #4ac7d0;    /* Darker hover */
--color-cyan-700: #2ba3a3;
--color-cyan-800: #1f7e7e;
--color-cyan-900: #0f3f3f;
```

### Secondary Colors (MDN-inspired)

**Blue Alternative:**
```css
--color-blue-50: #f0f4f8;
--color-blue-100: #d9e7f7;
--color-blue-400: #0a84ff;    /* MDN primary */
--color-blue-500: #0872e0;
--color-blue-600: #0860cc;
```

### Neutral Grays

**Light Mode (default):**
```css
--color-gray-50: #f9f9fa;
--color-gray-100: #f5f5f5;
--color-gray-200: #e0e0e6;
--color-gray-300: #d0d0d6;
--color-gray-400: #a0a0a6;
--color-gray-500: #808086;
--color-gray-600: #626873;
--color-gray-700: #4a4a52;
--color-gray-800: #2a2a32;
--color-gray-900: #1c1b22;     /* Dark text */
```

### Dark Mode Backgrounds

```css
--color-dark-bg-primary: #1f2937;      /* Main background */
--color-dark-bg-secondary: #111827;    /* Card background */
--color-dark-border: #374151;          /* Dark borders */
--color-dark-text: #e8eaed;            /* Light text */
--color-dark-text-muted: #9ca3af;      /* Muted text */
```

### Semantic Colors

```css
--color-success: #10b981;   /* Green */
--color-warning: #f59e0b;   /* Amber */
--color-error: #ef4444;     /* Red */
--color-info: #3b82f6;      /* Blue */
```

### Syntax Highlighting Colors

```css
--syntax-string: #10b981;       /* Green */
--syntax-keyword: #0a84ff;      /* Blue */
--syntax-comment: #9ca3af;      /* Gray */
--syntax-number: #f59e0b;       /* Amber */
--syntax-function: #3b82f6;     /* Blue */
--syntax-operator: #1c1b22;     /* Default text */
```

---

## 🔤 TYPOGRAPHY TOKENS

### Font Families

```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';

--font-mono: 'Fira Code', 'Roboto Mono', 'Courier New', monospace;

--font-display: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes

```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
--font-size-4xl: 32px;
--font-size-5xl: 40px;
--font-size-6xl: 48px;
--font-size-7xl: 56px;
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights

```css
--line-height-tight: 1.2;       /* Headlines */
--line-height-snug: 1.3;        /* Subheadings */
--line-height-normal: 1.5;      /* Default */
--line-height-relaxed: 1.6;     /* Body text (optimal readability) */
--line-height-loose: 1.8;       /* Open spacing */
```

### Letter Spacing

```css
--letter-spacing-tighter: -0.02em;   /* Headlines */
--letter-spacing-tight: -0.01em;     /* Subheadings */
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
```

### Typography Presets

**Heading 1:**
```
Font Size: 48px
Font Weight: 700 (Bold)
Line Height: 1.2
Letter Spacing: -0.02em
Margin Bottom: 32px
```

**Heading 2:**
```
Font Size: 36px
Font Weight: 600 (Semibold)
Line Height: 1.3
Letter Spacing: -0.01em
Margin Bottom: 24px
```

**Heading 3:**
```
Font Size: 24px
Font Weight: 600 (Semibold)
Line Height: 1.4
Letter Spacing: 0
Margin Bottom: 16px
```

**Body Text:**
```
Font Size: 16px
Font Weight: 400 (Regular)
Line Height: 1.6
Letter Spacing: 0
Color: --color-gray-600 (light) or --color-dark-text-muted (dark)
Margin Bottom: 16px
```

**Code/Monospace:**
```
Font Size: 14px
Font Weight: 400 (Regular)
Line Height: 1.5
Font Family: --font-mono
Color: --syntax-operator
```

---

## 📏 SPACING TOKENS

### Base Unit: 4px

```css
--spacing-xs: 4px;          /* 1 unit */
--spacing-sm: 8px;          /* 2 units */
--spacing-base: 16px;       /* 4 units - DEFAULT */
--spacing-md: 16px;         /* 4 units */
--spacing-lg: 24px;         /* 6 units */
--spacing-xl: 32px;         /* 8 units */
--spacing-2xl: 48px;        /* 12 units */
--spacing-3xl: 64px;        /* 16 units */
--spacing-4xl: 96px;        /* 24 units */
```

### Component-Specific Spacing

```css
/* Padding */
--padding-button-vertical: 12px;
--padding-button-horizontal: 24px;
--padding-card: 24px;
--padding-section: 32px;
--padding-hero: 64px;

/* Gaps */
--gap-card-grid: 24px;
--gap-feature-grid: 24px;
--gap-section: 32px;

/* Margins */
--margin-heading-bottom: 24px;
--margin-paragraph-bottom: 16px;
--margin-section-bottom: 64px;
```

### Container Widths

```css
--max-width-prose: 65ch;              /* Optimal reading width */
--max-width-container: 1200px;        /* Main content max width */
--max-width-container-md: 900px;      /* Medium container */
--max-width-full: 100%;
```

### Padding (Left/Right)

```css
/* Mobile */
--padding-mobile-horizontal: 16px;

/* Tablet */
--padding-tablet-horizontal: 24px;

/* Desktop */
--padding-desktop-horizontal: 32px;
```

---

## 🎯 INTERACTIVE TOKENS

### Border Radius

```css
--border-radius-none: 0;
--border-radius-sm: 4px;
--border-radius-md: 6px;      /* Default for inputs, buttons */
--border-radius-lg: 8px;      /* Default for cards */
--border-radius-xl: 12px;
--border-radius-2xl: 16px;
--border-radius-full: 9999px;
```

### Border Colors

```css
--border-color-light: #e0e0e6;
--border-color-dark: #374151;
--border-color-emphasis: #88e1e6;    /* Cyan */
```

### Border Widths

```css
--border-width-1: 1px;
--border-width-2: 2px;
--border-width-4: 4px;
```

### Box Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 16px -2px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 16px 24px -4px rgba(0, 0, 0, 0.1);
--shadow-hover: 0 8px 16px rgba(136, 225, 230, 0.3);    /* Cyan glow */
```

### Transitions

```css
--transition-duration-fastest: 75ms;
--transition-duration-faster: 100ms;
--transition-duration-fast: 150ms;
--transition-duration-default: 200ms;
--transition-duration-slow: 300ms;
--transition-duration-slower: 500ms;

--transition-easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--transition-easing-in: cubic-bezier(0.4, 0, 1, 1);
--transition-easing-out: cubic-bezier(0, 0, 0.2, 1);
--transition-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🔘 COMPONENT STATE TOKENS

### Button States

**Primary Button:**
```
Default: bg-cyan-400 text-gray-900
Hover: bg-cyan-500 shadow-lg translate-y-[-2px]
Active: bg-cyan-600 translate-y-0
Focus: ring-2 ring-offset-2 ring-cyan-400
Disabled: opacity-50 cursor-not-allowed
```

**Secondary Button:**
```
Default: border border-gray-300 bg-white text-gray-900
Hover: bg-gray-50
Active: bg-gray-100
Focus: ring-2 ring-offset-2 ring-gray-400
Disabled: opacity-50 cursor-not-allowed
```

### Input States

**Default:**
```
Border: 1px solid #e0e0e6
Background: #ffffff (light) / #111827 (dark)
Text Color: #1c1b22 (light) / #ffffff (dark)
Padding: 12px 16px
```

**Focus:**
```
Border: 1px solid #88e1e6
Outline: 2px solid #88e1e6
Outline Offset: 2px
```

**Disabled:**
```
Background: #f5f5f5 (light) / #0f1419 (dark)
Color: #9ca3af
Opacity: 0.5
Cursor: not-allowed
```

### Link States

**Default:**
```
Color: #88e1e6 (cyan)
Text Decoration: underline (optional)
Transition: color 150ms ease
```

**Hover:**
```
Color: #6dd8e0 (darker cyan)
Text Decoration: underline
```

**Active:**
```
Color: #5ccfd8
Text Decoration: underline
```

**Focus:**
```
Outline: 2px solid currentColor
Outline Offset: 2px
```

---

## 🎨 TAILWIND CLASS MAPPINGS

### Color Classes

```tailwind
/* Background Colors */
bg-white              → #ffffff
bg-cyan-400           → #88e1e6
bg-gray-50            → #f9f9fa
bg-gray-900           → #1c1b22
dark:bg-gray-900      → #1f2937
dark:bg-gray-800      → #111827

/* Text Colors */
text-gray-900         → #1c1b22
text-cyan-400         → #88e1e6
dark:text-white       → #ffffff
dark:text-gray-300    → #9ca3af

/* Border Colors */
border-gray-200       → #e0e0e6
border-gray-700       → #4a4a52
dark:border-gray-800  → #1f2937
```

### Spacing Classes

```tailwind
p-4  → padding: 16px
p-6  → padding: 24px
p-8  → padding: 32px

m-4  → margin: 16px
m-6  → margin: 24px
m-8  → margin: 32px

gap-4 → gap: 16px
gap-6 → gap: 24px

mb-4  → margin-bottom: 16px
mb-6  → margin-bottom: 24px
```

### Typography Classes

```tailwind
text-xs    → 12px
text-sm    → 14px
text-base  → 16px
text-lg    → 18px
text-xl    → 20px
text-2xl   → 24px
text-3xl   → 28px
text-4xl   → 32px
text-5xl   → 40px
text-6xl   → 48px

font-normal      → 400
font-medium      → 500
font-semibold    → 600
font-bold        → 700

leading-tight    → 1.2
leading-snug     → 1.3
leading-normal   → 1.5
leading-relaxed  → 1.6
```

### Rounded Classes

```tailwind
rounded-md  → border-radius: 6px
rounded-lg  → border-radius: 8px
rounded-xl  → border-radius: 12px
rounded-2xl → border-radius: 16px
```

---

## 📐 RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */
default (0px)        /* Mobile */
sm: 640px            /* Small screens */
md: 768px            /* Medium screens (tablet) */
lg: 1024px           /* Large screens (desktop) */
xl: 1280px           /* Extra large */
2xl: 1536px          /* Ultra-wide */
```

### Common Responsive Patterns

```html
<!-- 1 column mobile, 2 columns tablet, 3 columns desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Full width mobile, centered with padding desktop -->
<div class="w-full md:max-w-container md:mx-auto">

<!-- Hidden on mobile, visible on tablet+ -->
<div class="hidden md:block">

<!-- Full padding mobile, reduced desktop -->
<div class="px-4 sm:px-6 lg:px-8">
```

---

## 🌙 DARK MODE IMPLEMENTATION

### CSS Variables (Recommended)

```css
:root {
  /* Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f9f9fa;
  --text-primary: #1c1b22;
  --text-secondary: #626873;
  --border-color: #e0e0e6;
}

html.dark {
  /* Dark Mode */
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #e8eaed;
  --text-secondary: #9ca3af;
  --border-color: #374151;
}
```

### Tailwind Dark Mode Classes

```html
<!-- Text color adapts to dark mode -->
<p class="text-gray-900 dark:text-white">

<!-- Background adapts to dark mode -->
<div class="bg-white dark:bg-gray-900">

<!-- Border adapts to dark mode -->
<div class="border border-gray-200 dark:border-gray-800">

<!-- Combine multiple -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800">
```

---

## ✅ QUICK COPY-PASTE SECTIONS

### Basic Color Setup (CSS)

```css
:root {
  /* Brand Colors */
  --color-primary: #88e1e6;
  --color-primary-dark: #6dd8e0;
  --color-primary-light: #b3f5f0;

  /* Neutral */
  --color-bg: #ffffff;
  --color-text: #1c1b22;
  --color-text-muted: #626873;
  --color-border: #e0e0e6;

  /* Semantic */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

html.dark {
  --color-bg: #1f2937;
  --color-text: #e8eaed;
  --color-text-muted: #9ca3af;
  --color-border: #374151;
}
```

### Basic Button Styles (Tailwind)

```html
<!-- Primary -->
<button class="px-6 py-3 bg-cyan-400 text-gray-900 font-semibold rounded-md hover:bg-cyan-500 hover:shadow-lg transition-all">
  Button
</button>

<!-- Secondary -->
<button class="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-md hover:bg-gray-50 transition-all">
  Button
</button>

<!-- With focus ring -->
<button class="px-6 py-3 bg-cyan-400 text-gray-900 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400">
  Button
</button>
```

### Card Styles (Tailwind)

```html
<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
  <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Title</h3>
  <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Content</p>
</div>
```

---

## 📋 TOKEN USAGE CHECKLIST

Use this when implementing components:

- [ ] Color selected from palette (not custom)
- [ ] Font size from scale (not custom)
- [ ] Line height appropriate for element
- [ ] Spacing uses base unit (4px scale)
- [ ] Border radius from preset options
- [ ] Transition duration specified (default: 200ms)
- [ ] Box shadow from preset options
- [ ] Focus ring applied to interactive elements
- [ ] Dark mode equivalent defined
- [ ] Responsive variants tested (mobile, tablet, desktop)

---

## 🔗 References

- **Tailwind Config:** `researcher-260604-1414-tailwind-config-template.js`
- **Component Specs:** `researcher-260604-1414-component-specs-astro-tailwind.md`
- **Design Guide:** `researcher-260604-1414-ui-ux-design-reference-guide.md`
- **Implementation:** `researcher-260604-1414-implementation-guide-astro-tailwind.md`

---

**Last Updated:** 2026-06-04  
**Status:** Ready for Implementation  
**Format:** Copy-Paste Ready
