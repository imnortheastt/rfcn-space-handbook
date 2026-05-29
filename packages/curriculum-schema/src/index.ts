import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const bilingualTitle = z.object({
  en: z.string().min(1),
  vi: z.string().min(1),
});

const levelEnum = z.enum(['L0', 'L1', 'L2', 'L3', 'L4', 'L5']);

const domainIdEnum = z.enum(['rf', 'core-network', 'space']);

// ---------------------------------------------------------------------------
// Lesson — leaf node
// ---------------------------------------------------------------------------

export const lessonSchema = z.object({
  /** kebab-case slug, unique within the containing unit */
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lesson id must be kebab-case'),
  title: bilingualTitle,
  level: levelEnum,
});

// ---------------------------------------------------------------------------
// Unit
// ---------------------------------------------------------------------------

export const unitSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Unit id must be kebab-case'),
  title: bilingualTitle,
  lessons: z.array(lessonSchema).min(1),
});

// Post-parse check: no duplicate lesson IDs within a unit
export const unitSchemaRefined = unitSchema.refine(
  (unit) => {
    const ids = unit.lessons.map((l) => l.id);
    return ids.length === new Set(ids).size;
  },
  { message: 'Duplicate lesson IDs within unit' },
);

// ---------------------------------------------------------------------------
// Track
// ---------------------------------------------------------------------------

export const trackSchema = z.object({
  id: z.string().regex(/^[rns]\d+$/, 'Track id must match R/N/S followed by digits (e.g. r0, n3, s11)'),
  title: bilingualTitle,
  levels: z.array(levelEnum).min(1),
  units: z.array(unitSchemaRefined),
});

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------

export const domainSchema = z.object({
  title: bilingualTitle,
  tracks: z.array(trackSchema).min(1),
});

// ---------------------------------------------------------------------------
// Bridge — cross-domain link node
// ---------------------------------------------------------------------------

export const bridgeSchema = z.object({
  id: z.string().regex(/^b\d+$/, 'Bridge id must be b1, b2, etc.'),
  title: bilingualTitle,
  links: z.array(domainIdEnum).min(2),
});

// ---------------------------------------------------------------------------
// Top-level Curriculum
// ---------------------------------------------------------------------------

export const curriculumSchema = z.object({
  domains: z.object({
    rf: domainSchema,
    'core-network': domainSchema,
    space: domainSchema,
  }),
  bridges: z.array(bridgeSchema).min(1),
});

// ---------------------------------------------------------------------------
// Exported TypeScript types
// ---------------------------------------------------------------------------

export type Lesson = z.infer<typeof lessonSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Track = z.infer<typeof trackSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type Bridge = z.infer<typeof bridgeSchema>;
export type Curriculum = z.infer<typeof curriculumSchema>;
