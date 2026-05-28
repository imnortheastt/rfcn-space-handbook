import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import { remarkGlossaryAutoLink } from '@rfcn-space-handbook/glossary';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const glossaryPath = join(__dirname, '../../data/glossary.json');

// data/glossary.json is committed to the repo — no conditional needed.
const glossaryRemarkPlugin = [remarkGlossaryAutoLink, { glossaryPath }];

export default defineConfig({
  output: 'static',

  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: false,
  }),

  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  markdown: {
    // glossary auto-link runs first (before remarkMath) so term text is not inside math nodes
    remarkPlugins: [glossaryRemarkPlugin, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { output: 'htmlAndMathml' }],
      [rehypeMermaid, { strategy: 'pre-mermaid' }],
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['katex'],
    },
    resolve: {
      alias: [
        // MDX files in content/ live outside the app root. Vite resolves
        // imports relative to the importer path, so workspace packages can't
        // be found via node_modules traversal from ../../content/.
        // These aliases map only the exact root entry point; subpath imports
        // (e.g. /bibliography.astro) are left unmatched and resolved normally
        // via the workspace symlink in node_modules.
        {
          find: /^@rfcn-space-handbook\/widgets$/,
          replacement: join(__dirname, '../../packages/widgets/src/index.ts'),
        },
        {
          find: /^@rfcn-space-handbook\/citations$/,
          replacement: join(__dirname, '../../packages/citations/src/index.ts'),
        },
      ],
    },
  },

  redirects: {
    '/': '/en/',
  },
});
