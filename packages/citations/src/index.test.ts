import { describe, it, expect } from 'vitest';
import { citationSchema, citationsSchema } from './schema';

// ---------------------------------------------------------------------------
// Schema validation — standard (3GPP) entry
// ---------------------------------------------------------------------------

describe('citationSchema — standard', () => {
  const valid3gpp = {
    type: 'standard',
    id: '3gpp-ts-38-211',
    issuer: '3GPP',
    version: 'TS 38.211 Rel-17',
    title: 'NR; Physical channels and modulation',
    url: 'https://www.3gpp.org/ftp/Specs/archive/38_series/38.211/',
    verifiedAt: '2024-11-01',
  };

  it('accepts a valid 3GPP standard entry', () => {
    const result = citationSchema.safeParse(valid3gpp);
    expect(result.success).toBe(true);
  });

  it('rejects a standard entry missing verifiedAt', () => {
    const { verifiedAt: _, ...incomplete } = valid3gpp;
    const result = citationSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('rejects a standard entry with a non-https URL', () => {
    const result = citationSchema.safeParse({ ...valid3gpp, url: 'ftp://example.com' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Schema validation — RFC entry
// ---------------------------------------------------------------------------

describe('citationSchema — rfc', () => {
  const validRfc = {
    type: 'rfc',
    id: 'rfc-8174',
    number: 8174,
    title: 'Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words',
    authors: ['B. Leiba'],
    date: '2017-05',
    url: 'https://www.rfc-editor.org/rfc/rfc8174',
    verifiedAt: '2024-11-01',
  };

  it('accepts a valid RFC entry', () => {
    const result = citationSchema.safeParse(validRfc);
    expect(result.success).toBe(true);
  });

  it('rejects RFC with bad date format', () => {
    const result = citationSchema.safeParse({ ...validRfc, date: '2017/05' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Schema validation — textbook entry
// ---------------------------------------------------------------------------

describe('citationSchema — textbook', () => {
  const validTextbook = {
    type: 'textbook',
    id: 'tse-viswanath-2005',
    authors: ['David Tse', 'Pramod Viswanath'],
    title: 'Fundamentals of Wireless Communication',
    publisher: 'Cambridge University Press',
    year: 2005,
    isbn: '978-0521845274',
  };

  it('accepts a valid textbook entry', () => {
    const result = citationSchema.safeParse(validTextbook);
    expect(result.success).toBe(true);
  });

  it('rejects textbook with empty authors array', () => {
    const result = citationSchema.safeParse({ ...validTextbook, authors: [] });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Array schema
// ---------------------------------------------------------------------------

describe('citationsSchema', () => {
  it('accepts an array of mixed citation types', () => {
    const db = [
      {
        type: 'standard',
        id: 'std-1',
        issuer: 'ITU-T',
        version: 'G.711',
        title: 'Pulse code modulation',
        url: 'https://www.itu.int/rec/T-REC-G.711',
        verifiedAt: '2024-01-01',
      },
      {
        type: 'rfc',
        id: 'rfc-791',
        number: 791,
        title: 'Internet Protocol',
        authors: ['J. Postel'],
        date: '1981-09',
        url: 'https://www.rfc-editor.org/rfc/rfc791',
        verifiedAt: '2024-01-01',
      },
    ];
    const result = citationsSchema.safeParse(db);
    expect(result.success).toBe(true);
  });

  it('rejects an array containing a malformed entry', () => {
    const db = [{ type: 'standard', id: 'bad', issuer: '', version: '', title: '' }];
    const result = citationsSchema.safeParse(db);
    expect(result.success).toBe(false);
  });
});
