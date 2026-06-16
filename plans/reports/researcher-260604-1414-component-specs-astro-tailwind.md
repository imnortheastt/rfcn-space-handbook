# Component Specifications for Astro/Tailwind
## Design Reference Implementation Guide

**Date:** 2026-06-04  
**Based On:** unsloth.ai + MDN design research  
**Target Stack:** Astro + Tailwind CSS + TypeScript  

---

## Table of Contents

1. [Button Components](#button-components)
2. [Card Components](#card-components)
3. [Navigation Components](#navigation-components)
4. [Typography Components](#typography-components)
5. [Code Block Component](#code-block-component)
6. [Layout Components](#layout-components)
7. [Form Components](#form-components)
8. [Interactive States](#interactive-states)

---

## Button Components

### Primary Button (CTA)

**Purpose:** Main call-to-action, high emphasis, primary workflow

**Specifications:**
```
Background: Cyan (#88e1e6) / Light: Cyan (#0a84ff)
Text Color: Dark (#0f1419) / Light: White (#ffffff)
Padding: 12px 24px (vertical × horizontal)
Border Radius: 6px
Font Weight: 600 (semibold)
Font Size: 14-16px
Border: None
Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

Hover State:
- Background: Darker cyan (#6dd8e0)
- Transform: translateY(-2px)
- Box Shadow: 0 8px 16px rgba(136, 225, 230, 0.3)

Active/Pressed State:
- Background: Darkest cyan (#5ccfd8)
- Transform: translateY(0)
- Box Shadow: 0 4px 8px rgba(136, 225, 230, 0.2)

Focus State:
- Outline: 2px solid #0f1419
- Outline Offset: 2px
- Border Radius: maintained

Disabled State:
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects
```

**Astro Component (`Button.astro`):**
```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  class?: string;
}

const {
  variant = 'primary',
  size = 'md',
  disabled = false,
  class: customClass = '',
} = Astro.props;

const baseClasses = 'font-semibold transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClasses = {
  primary: 'bg-cyan-400 text-gray-900 dark:bg-cyan-400 dark:text-dark-bg hover:bg-cyan-500 hover:shadow-lg hover:-translate-y-0.5 focus:ring-cyan-300',
  secondary: 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border focus:ring-gray-400',
  tertiary: 'text-cyan-400 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-dark-card focus:ring-cyan-300',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
---

<button
  class={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${customClass}`}
  disabled={disabled}
>
  <slot />
</button>

<style is:global>
  button:disabled:hover {
    transform: none;
    box-shadow: none;
  }
</style>
```

### Secondary Button

**Purpose:** Alternative actions, lower emphasis, less critical workflows

**Specifications:**
```
Background: Transparent
Border: 1px solid #374151 (dark: #4b5563)
Text Color: #1c1b22 (dark: #ffffff)
Padding: 12px 24px
Border Radius: 6px
Font Weight: 600
Font Size: 14-16px
Transition: all 200ms ease

Hover State:
- Background: #f5f5f5 (light) / #1a2025 (dark)
- Border Color: #2a2a32 (light) / #6b7280 (dark)

Active State:
- Background: More opaque
- Border Color: Darker
```

### Tertiary Button (Text Link)

**Purpose:** Lightweight actions, links within content

**Specifications:**
```
Background: Transparent
Border: None
Text Color: #88e1e6 (cyan, matches primary)
Padding: 4px 8px
Font Weight: 500
Text Decoration: Optional underline
Transition: color 150ms ease

Hover State:
- Text Color: #6dd8e0 (darker cyan)
- Text Decoration: Underline (if not already)

Focus State:
- Outline: 2px solid #88e1e6
- Outline Offset: 2px
```

---

## Card Components

### Basic Card

**Purpose:** Content container with visual elevation

**Specifications:**
```
Background: #ffffff (light) / #111827 (dark)
Border: 1px solid #e0e0e6 (light) / #374151 (dark)
Border Radius: 8px
Padding: 24px
Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
Transition: all 200ms ease

Hover State (interactive):
- Box Shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Transform: translateY(-2px)

Focus State (if clickable):
- Outline: 2px solid #0a84ff
- Outline Offset: 2px
```

**Astro Component (`Card.astro`):**
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

<div class={classes}>
  <slot />
</div>
```

### Feature Card (with Icon)

**Purpose:** Display feature with icon, title, description

**Structure:**
```
┌─────────────────────┐
│  Icon (48×48)       │
│  Title (H3)         │
│  Description (P)    │
└─────────────────────┘
```

**Specifications:**
```
Icon Size: 48px × 48px
Icon Color: Cyan (#88e1e6) or Blue (#0a84ff)
Icon Margin Bottom: 16px

Title:
- Font Size: 20px
- Font Weight: 600
- Margin Bottom: 12px
- Line Height: 1.3

Description:
- Font Size: 16px
- Font Weight: 400
- Line Height: 1.6
- Color: #626873 (gray-600)
- Margin: 0
```

---

## Navigation Components

### Header Navigation

**Specifications:**
```
Height: 64px (desktop) / 56px (mobile)
Background: #ffffff (light) / #111827 (dark)
Border Bottom: 1px solid #e0e0e6 (light) / #374151 (dark)
Padding: 0 32px (desktop) / 0 16px (mobile)
Position: sticky top-0
Z-Index: 40

Logo:
- Size: 32px height
- Font Weight: 700
- Font Size: 20px
- Color: Accent color (#88e1e6 or #0a84ff)

Navigation Links:
- Font Size: 14px
- Font Weight: 500
- Color: #1c1b22 (light) / #ffffff (dark)
- Padding: 8px 12px
- Border Radius: 4px
- Hover: Background #f5f5f5 (light) / #1a2025 (dark)
- Active: Font Weight 600, underline or background

CTA Button:
- Right-aligned
- Margin Left: Auto
```

**Astro Component (`Header.astro`):**
```astro
---
const navItems = [
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/api' },
  { label: 'Examples', href: '/examples' },
  { label: 'Blog', href: '/blog' },
];

const currentPath = new URL(Astro.request.url).pathname;
---

<header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  <nav class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <a href="/" class="font-bold text-xl text-cyan-400">Logo</a>
    
    <div class="hidden md:flex items-center gap-8">
      {navItems.map(item => (
        <a
          href={item.href}
          class={`text-sm font-medium transition-colors ${
            currentPath === item.href
              ? 'text-cyan-400 font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {item.label}
        </a>
      ))}
    </div>
    
    <button class="btn btn-primary">Get Started</button>
  </nav>
</header>
```

### Sidebar Navigation (Documentation)

**Specifications:**
```
Width: 300px (desktop)
Background: #ffffff (light) / #111827 (dark)
Border Right: 1px solid #e0e0e6 (light) / #374151 (dark)
Position: sticky top-16 (below header)
Max Height: calc(100vh - 64px)
Overflow: auto
Padding: 24px 0

Link Styling:
- Font Size: 14px
- Font Weight: 400
- Padding: 8px 16px
- Color: #626873 (light) / #9ca3af (dark)
- Border Left: 2px solid transparent
- Hover: Background #f5f5f5 (light) / #1a2025 (dark)

Active Link:
- Border Left Color: #88e1e6 (cyan)
- Text Color: #1c1b22 (light) / #ffffff (dark)
- Font Weight: 600
- Background: #f9f9fa (light) / #1f2937 (dark)

Nested Items:
- Margin Left: 16px
- Font Size: 13px
- Color: Slightly muted

Section Headers:
- Font Size: 12px
- Font Weight: 700
- Text Transform: uppercase
- Letter Spacing: 0.05em
- Color: #9ca3af
- Padding: 12px 16px
- Margin Top: 16px
```

---

## Typography Components

### Heading (H1-H6)

**Specifications:**

| Level | Size | Weight | Line Height | Letter Spacing | Margin Bottom |
|-------|------|--------|-------------|----------------|---------------|
| H1 | 48px | 700 | 1.2 | -0.02em | 32px |
| H2 | 36px | 600 | 1.3 | -0.01em | 24px |
| H3 | 24px | 600 | 1.4 | 0 | 16px |
| H4 | 20px | 600 | 1.4 | 0 | 12px |
| H5 | 18px | 600 | 1.4 | 0 | 12px |
| H6 | 16px | 600 | 1.5 | 0 | 8px |

**Astro Component (`Heading.astro`):**
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
  3: 'text-2xl md:text-3xl font-semibold tracking-tight',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-semibold',
  6: 'text-base md:text-lg font-semibold',
};

const Tag = `h${level}` as const;
---

<Tag class={`${sizeClasses[level]} mb-6 text-gray-900 dark:text-white ${customClass}`}>
  <slot />
</Tag>
```

### Paragraph

**Specifications:**
```
Font Size: 16px
Font Weight: 400
Line Height: 1.6 (relaxed)
Color: #626873 (light) / #9ca3af (dark)
Margin Bottom: 16px
Last Paragraph Margin: 0
```

### Code (Inline)

**Specifications:**
```
Font Family: Monospace (Fira Code, Roboto Mono)
Font Size: 13px
Font Weight: 400
Background: #f5f5f5 (light) / #1a2025 (dark)
Color: #c62828 (red-tinted)
Padding: 2px 6px
Border Radius: 4px
Margin: 0 2px
```

---

## Code Block Component

### Syntax-Highlighted Code Block

**Specifications:**
```
Background: #f5f5f5 (light) / #111827 (dark)
Border: 1px solid #e0e0e6 (light) / #374151 (dark)
Border Radius: 8px
Padding: 16px
Font Family: Monospace
Font Size: 13px
Line Height: 1.5
Overflow X: auto
Margin: 24px 0

Language Badge (top-right):
- Position: absolute
- Top: 12px
- Right: 12px
- Font Size: 12px
- Font Weight: 500
- Text Transform: uppercase
- Color: #9ca3af
- Letter Spacing: 0.05em

Copy Button:
- Position: absolute
- Top: 12px
- Right: 12px (if no language badge) or 80px
- Size: 20px × 20px
- Icon: Copy icon
- Background: Transparent, hover gray-200
- Opacity: 0 (hidden until hover)
- Transition: opacity 200ms ease

Line Numbers (optional):
- Position: Left margin
- Color: #9ca3af
- Font Size: 12px
- Text Align: right
- Width: 40px
- Padding Right: 12px
- User Select: none

Syntax Highlighting Colors:
- String: #10b981 (green)
- Keyword: #0a84ff (blue)
- Comment: #9ca3af (gray)
- Number: #f59e0b (amber)
- Function: #3b82f6 (blue)
- Operator: Default text color
```

**Astro Component (`CodeBlock.astro`):**
```astro
---
interface Props {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  title?: string;
}

const { code, language, showLineNumbers = false, title } = Astro.props;
---

<div class="relative bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-800 my-6 overflow-hidden">
  {title && (
    <div class="px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <span class="text-sm font-mono text-gray-700 dark:text-gray-300">{title}</span>
    </div>
  )}
  
  <div class="relative">
    <span class="absolute top-3 right-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {language}
    </span>
    
    <button
      class="absolute top-3 right-16 p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors opacity-0 hover:opacity-100"
      data-copy-btn
    >
      <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v2h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h4V3z" />
      </svg>
    </button>
    
    <pre class="p-4 overflow-x-auto text-sm leading-relaxed text-gray-900 dark:text-gray-100 font-mono"><code set:html={code} /></pre>
  </div>
</div>

<script>
  document.querySelectorAll('[data-copy-btn]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.nextElementSibling?.textContent || '';
      await navigator.clipboard.writeText(code);
      btn.textContent = '✓ Copied';
      setTimeout(() => {
        btn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v2h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h4V3z" /></svg>';
      }, 2000);
    });
  });
</script>
```

---

## Layout Components

### Hero Section

**Specifications:**
```
Background: Gradient or solid dark color
Padding: 96px 32px (top/bottom, left/right)
Min Height: 500px
Display: flex, align-items center

Container:
- Max Width: 1200px
- Margin: 0 auto

Title (H1):
- Font Size: 56px (64px on ultra-wide)
- Font Weight: 700
- Margin Bottom: 24px
- Color: White / Light text

Subtitle (P):
- Font Size: 20px
- Font Weight: 400
- Line Height: 1.6
- Color: Light gray
- Margin Bottom: 32px
- Max Width: 500px

CTA Buttons:
- Layout: Flex, gap 16px
- Primary + Secondary button
```

### Grid Layout (Features)

**Specifications:**
```
Container: Max width 1200px, centered
Padding: 64px 32px

Grid:
- Desktop (lg): 3 columns, gap 24px
- Tablet (md): 2 columns, gap 24px
- Mobile: 1 column, gap 16px

Card Padding: 24px
Card Border Radius: 8px
Card Min Height: 250px
```

---

## Form Components

### Text Input

**Specifications:**
```
Width: 100%
Padding: 12px 16px
Border: 1px solid #e0e0e6 (light) / #374151 (dark)
Border Radius: 6px
Font Size: 16px
Font Family: sans
Line Height: 1.5
Background: #ffffff (light) / #111827 (dark)
Color: Text primary
Transition: border-color 200ms ease

Focus State:
- Border Color: #88e1e6 (cyan)
- Outline: 2px solid #88e1e6
- Outline Offset: 2px

Placeholder:
- Color: #9ca3af (gray)
- Font Weight: 400

Disabled State:
- Background: #f5f5f5 (light) / #0f1419 (dark)
- Color: #9ca3af
- Cursor: not-allowed
- Opacity: 0.5
```

### Form Label

**Specifications:**
```
Font Size: 14px
Font Weight: 600
Color: #1c1b22 (light) / #ffffff (dark)
Margin Bottom: 8px
Display: block
```

---

## Interactive States

### Hover States

**General Rule:** Combine color + transform + shadow (never color alone)

```
Button Hover:
- Color change
- Transform: translateY(-2px)
- Shadow increase
- Duration: 200ms

Link Hover:
- Color change + underline
- Duration: 150ms

Card Hover (interactive):
- Shadow increase
- Transform: translateY(-2px)
- Duration: 200ms
```

### Focus States

**Keyboard Navigation:**
- Outline: 2px solid accent color
- Outline Offset: 2px
- Border Radius: maintained
- Visible on all interactive elements

### Active States

**Pressed/Selected:**
- Darker color variant
- Reduced shadow
- Optional: slight scale down (98%)
- Duration: 100ms

### Disabled States

**Unavailable/Inactive:**
- Opacity: 0.5 or 0.6
- Cursor: not-allowed
- No hover effects
- Background/border unchanged but muted

---

## Accessibility Checklist

- [ ] All interactive elements have focus indicators
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus order is logical (tab navigation)
- [ ] Keyboard shortcuts are documented
- [ ] Images have alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Skip-to-content link present
- [ ] Semantic HTML used (nav, main, aside, article)
- [ ] ARIA attributes used when semantic HTML insufficient

---

## File Structure for Components

```
src/components/
├── Button.astro
├── Card.astro
├── Heading.astro
├── CodeBlock.astro
├── Header.astro
├── Sidebar.astro
├── Footer.astro
├── Hero.astro
├── Navigation/
│   ├── Navbar.astro
│   ├── Breadcrumb.astro
│   └── SidebarNav.astro
├── Layout/
│   ├── Main.astro
│   ├── Grid.astro
│   └── Container.astro
├── Forms/
│   ├── Input.astro
│   ├── Label.astro
│   ├── Select.astro
│   └── TextArea.astro
└── Typography/
    ├── Paragraph.astro
    ├── Link.astro
    └── List.astro
```

---

## Implementation Priority

**Phase 1 (MVP):**
1. Button (primary, secondary)
2. Card
3. Heading
4. Paragraph
5. Header/Navigation

**Phase 2 (Core):**
6. CodeBlock
7. Layout (container, grid)
8. Hero
9. Sidebar

**Phase 3 (Polish):**
10. Form components
11. Advanced interactions
12. Animations

---

**Status:** COMPONENT SPECIFICATIONS COMPLETE  
**Ready for:** Implementation in Astro + Tailwind  
**Dependencies:** tailwind.config.js (from previous report)
