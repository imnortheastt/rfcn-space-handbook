import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared field validators
// ---------------------------------------------------------------------------

const httpsUrl = z.string().url().regex(/^https?:\/\//, 'URL must start with http:// or https://');

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

// ---------------------------------------------------------------------------
// Discriminated union by citation type (blueprint §6.2)
// ---------------------------------------------------------------------------

const standardCitationSchema = z.object({
  type: z.literal('standard'),
  /** Internal unique key used by <Cite id="..."> */
  id: z.string().min(1),
  /** Issuing body, e.g. "3GPP" or "ITU-T" */
  issuer: z.string().min(1),
  /** Standard number / version string, e.g. "TS 38.211 Rel-17" */
  version: z.string().min(1),
  title: z.string().min(1),
  url: httpsUrl,
  /** ISO date when the URL was last verified accessible */
  verifiedAt: isoDate,
});

const textbookCitationSchema = z.object({
  type: z.literal('textbook'),
  id: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
  edition: z.string().optional(),
  publisher: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  isbn: z.string().optional(),
  url: httpsUrl.optional(),
});

const paperCitationSchema = z.object({
  type: z.literal('paper'),
  id: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
  /** Conference or journal name */
  venue: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  url: httpsUrl.optional(),
  doi: z.string().optional(),
});

const rfcCitationSchema = z.object({
  type: z.literal('rfc'),
  id: z.string().min(1),
  /** RFC number, e.g. 8174 */
  number: z.number().int().positive(),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  /** Publication date as YYYY-MM */
  date: z.string().regex(/^\d{4}-\d{2}$/),
  url: httpsUrl,
  verifiedAt: isoDate,
});

export const citationSchema = z.discriminatedUnion('type', [
  standardCitationSchema,
  textbookCitationSchema,
  paperCitationSchema,
  rfcCitationSchema,
]);

export const citationsSchema = z.array(citationSchema);

export type Citation = z.infer<typeof citationSchema>;
export type CitationsDB = z.infer<typeof citationsSchema>;
