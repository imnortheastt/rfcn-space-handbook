import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: '../../content',
    // Use the full path relative to base (minus extension) as the entry ID.
    // Without this, two files named "01-decibels.mdx" in en/ and vi/ would
    // both resolve to id "decibels" and one would silently overwrite the other.
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    // ── Identity ──────────────────────────────────────────────────────────
    id: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'vi']),
    parityId: z.string(),
    domain: z.enum(['rf', 'core-network', 'space', 'bridges']),
    track: z.string(),
    unit: z.string(),
    order: z.number().int().nonnegative(),

    // ── Pedagogical metadata ──────────────────────────────────────────────
    level: z.enum(['L0', 'L1', 'L2', 'L3', 'L4', 'L5']),
    estimatedReadingMinutes: z.number().int().positive(),
    prerequisites: z.array(z.string()).default([]),
    spiralRevisits: z.array(z.string()).default([]),

    // ── Editorial ─────────────────────────────────────────────────────────
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    authors: z.array(z.string()),
    reviewers: z.array(z.string()).optional(),
    publishedAt: z.coerce.date(),
    lastVerified: z.coerce.date(),
    lastReviewedAt: z.coerce.date().optional(),

    // ── Standards & citations ─────────────────────────────────────────────
    standards: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            title: z.string().optional(),
            cite: z.string(),
          }),
        ]),
      )
      .default([]),

    // ── Frontier flag ─────────────────────────────────────────────────────
    // Set true for 6G/NTN/NewSpace frontier lessons — triggers a visual badge
    researchFrontier: z.boolean().default(false),

    // ── Discoverability ───────────────────────────────────────────────────
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional(),

    // ── Widget bundle hints ───────────────────────────────────────────────
    // Declares which React island bundles are needed for code-splitting hints
    widgets: z.array(z.string()).optional(),

    // ── License ───────────────────────────────────────────────────────────
    license: z.literal('CC-BY-SA-4.0'),

    // ── Publication status ────────────────────────────────────────────────
    status: z.enum(['draft', 'published', 'review']).default('draft'),

    // ── i18n exception ────────────────────────────────────────────────────
    // 'vi-only': lesson ships without an English pair
    // 'en-only': lesson ships without a Vietnamese pair (e.g. EN-only research notes)
    parityException: z.enum(['vi-only', 'en-only']).optional(),
  }),
});

export const collections = { lessons };
