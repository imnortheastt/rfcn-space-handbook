import { describe, it, expect } from 'vitest';
import { curriculumSchema, unitSchema, unitSchemaRefined, lessonSchema } from './index';

// ---------------------------------------------------------------------------
// Minimal valid curriculum fixture
// ---------------------------------------------------------------------------

const minimalLesson = {
  id: '01-vectors',
  title: { en: 'Vectors', vi: 'Vectơ' },
  level: 'L1',
};

const minimalUnit = {
  id: 'vector-calculus',
  title: { en: 'Vector Calculus', vi: 'Giải tích vectơ' },
  lessons: [minimalLesson],
};

const minimalTrack = {
  id: 'r0',
  title: { en: 'Math & Physics Foundations', vi: 'Nền tảng toán & vật lý' },
  levels: ['L1', 'L2'],
  units: [minimalUnit],
};

const minimalCurriculum = {
  domains: {
    rf: {
      title: { en: 'RF Engineering', vi: 'Kỹ thuật vô tuyến' },
      tracks: [minimalTrack],
    },
    'core-network': {
      title: { en: 'Core Network', vi: 'Mạng lõi' },
      tracks: [{ ...minimalTrack, id: 'n0' }],
    },
    space: {
      title: { en: 'Space Engineering', vi: 'Kỹ thuật không gian' },
      tracks: [{ ...minimalTrack, id: 's0' }],
    },
  },
  bridges: [
    {
      id: 'b1',
      title: { en: 'From Antenna to Base Station', vi: 'Từ ăng-ten đến trạm gốc' },
      links: ['rf', 'core-network'],
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('curriculumSchema', () => {
  it('accepts a valid minimal curriculum', () => {
    const result = curriculumSchema.safeParse(minimalCurriculum);
    expect(result.success).toBe(true);
  });

  it('rejects curriculum missing the bridges array', () => {
    const { bridges: _, ...noBridges } = minimalCurriculum;
    const result = curriculumSchema.safeParse(noBridges);
    expect(result.success).toBe(false);
  });

  it('rejects curriculum missing a required domain', () => {
    const { domains: { space: _, ...domainsWithoutSpace } } = minimalCurriculum;
    const result = curriculumSchema.safeParse({ ...minimalCurriculum, domains: domainsWithoutSpace });
    expect(result.success).toBe(false);
  });
});

describe('unitSchema duplicate lesson ID check', () => {
  it('rejects a unit with duplicate lesson IDs', () => {
    const unitWithDupes = {
      ...minimalUnit,
      lessons: [minimalLesson, minimalLesson], // same id twice
    };
    const result = unitSchemaRefined.safeParse(unitWithDupes);
    expect(result.success).toBe(false);
  });

  it('accepts a unit with distinct lesson IDs', () => {
    const twoLessons = {
      ...minimalUnit,
      lessons: [
        minimalLesson,
        { id: '02-gradient', title: { en: 'Gradient', vi: 'Gradient' }, level: 'L1' },
      ],
    };
    const result = unitSchema.safeParse(twoLessons);
    expect(result.success).toBe(true);
  });
});

describe('lessonSchema', () => {
  it('rejects a lesson with an invalid level', () => {
    const result = lessonSchema.safeParse({ ...minimalLesson, level: 'L9' });
    expect(result.success).toBe(false);
  });

  it('rejects a lesson id with uppercase', () => {
    const result = lessonSchema.safeParse({ ...minimalLesson, id: 'Vectors' });
    expect(result.success).toBe(false);
  });
});
