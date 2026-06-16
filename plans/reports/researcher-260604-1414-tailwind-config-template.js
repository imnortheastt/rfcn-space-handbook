/**
 * Tailwind CSS Configuration
 * Based on UI/UX research of unsloth.ai + MDN (developer.mozilla.org)
 *
 * Usage:
 * - Copy this to your Astro project as: tailwind.config.js
 * - Customize colors and fonts as needed
 * - Extend theme for project-specific tokens
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for Tailwind to scan
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './public/**/*.html',
  ],

  // Dark mode: use 'class' strategy (add 'dark' class to html)
  darkMode: 'class',

  // Theme extensions based on design research
  theme: {
    extend: {
      // ============================================
      // COLOR PALETTE
      // ============================================
      colors: {
        // Primary brand colors (unsloth.ai-inspired)
        cyan: {
          50: '#f0fdf9',
          100: '#e0fbf7',
          200: '#b3f5f0',
          300: '#88e1e6', // Primary accent
          400: '#6dd8e0',
          500: '#5ccfd8',
          600: '#4ac7d0',
          700: '#2ba3a3',
          800: '#1f7e7e',
          900: '#0f3f3f',
        },

        // Secondary brand colors (MDN-inspired)
        blue: {
          50: '#f0f4f8',
          100: '#d9e7f7',
          400: '#0a84ff', // MDN primary
          500: '#0872e0',
          600: '#0860cc',
        },

        // Neutral/grayscale palette
        gray: {
          50: '#f9f9fa',
          100: '#f5f5f5',
          200: '#e0e0e6',
          300: '#d0d0d6',
          400: '#a0a0a6',
          500: '#808086',
          600: '#626873',
          700: '#4a4a52',
          800: '#2a2a32',
          900: '#1c1b22', // MDN dark text
        },

        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Dark mode backgrounds
        dark: {
          bg: '#1f2937',        // Primary dark background
          card: '#111827',      // Card/elevated background
          border: '#374151',    // Border color
          text: '#e8eaed',      // Light text
          muted: '#9ca3af',     // Muted text
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        // System font stack (no web fonts = faster)
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],

        // Monospace for code
        mono: [
          '"Fira Code"',
          '"Roboto Mono"',
          '"Courier New"',
          'monospace',
        ],
      },

      // Font sizes (modular scale)
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
        '7xl': '56px',
      },

      // Line heights for readability
      lineHeight: {
        tight: '1.2',   // Headlines
        snug: '1.3',    // Subheadings
        normal: '1.5',  // Default
        relaxed: '1.6', // Body text (optimal readability)
        loose: '1.8',   // Open spacing
      },

      // Letter spacing for headlines
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
      },

      // ============================================
      // SPACING & SIZING
      // ============================================
      spacing: {
        // 4px base unit (Tailwind standard)
        'gutter': '16px',      // Default component padding
        'section': '24px',     // Section spacing
        'section-lg': '32px',  // Large section spacing
        'hero': '64px',        // Hero/banner padding
      },

      // Border radius
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },

      // ============================================
      // LAYOUT & CONTAINERS
      // ============================================
      maxWidth: {
        // Content containers
        'container': '1200px',  // Max width for main content
        'container-md': '900px', // Medium container
        'prose': '65ch',        // Optimal reading width
      },

      // Gap/padding presets
      gap: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },

      // ============================================
      // EFFECTS & TRANSITIONS
      // ============================================
      transitionDuration: {
        fastest: '75ms',
        faster: '100ms',
        fast: '150ms',
        default: '200ms',
        slow: '300ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Box shadows for depth
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 16px -2px rgba(0, 0, 0, 0.1)',
        'xl': '0 16px 24px -4px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 16px rgba(136, 225, 230, 0.3)', // Cyan glow
      },

      // Animation keyframes
      animation: {
        'fade-in': 'fadeIn 300ms ease-in',
        'slide-in': 'slideIn 300ms ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },

  // Plugins for additional utilities
  plugins: [
    // Plugin function to add custom utilities
    function ({ addUtilities }) {
      const newUtilities = {
        '.transition-all': {
          '@apply transition-all duration-200 ease-out': {},
        },
        '.focus-ring': {
          '@apply outline-none ring-2 ring-offset-2 ring-cyan-400': {},
        },
        '.focus-ring-blue': {
          '@apply outline-none ring-2 ring-offset-2 ring-blue-400': {},
        },
        '.truncate-lines-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.truncate-lines-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.smooth-scroll': {
          'scroll-behavior': 'smooth',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
