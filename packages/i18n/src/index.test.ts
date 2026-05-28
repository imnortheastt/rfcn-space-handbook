import { describe, it, expect } from 'vitest';
import {
  getOppositeLang,
  resolveParitySibling,
  t,
  LANG_LABELS,
  type LessonStub,
} from './index';

describe('getOppositeLang', () => {
  it("returns 'vi' when given 'en'", () => {
    expect(getOppositeLang('en')).toBe('vi');
  });

  it("returns 'en' when given 'vi'", () => {
    expect(getOppositeLang('vi')).toBe('en');
  });
});

describe('LANG_LABELS', () => {
  it('has correct English label', () => {
    expect(LANG_LABELS.en).toBe('English');
  });

  it('has correct Vietnamese label', () => {
    expect(LANG_LABELS.vi).toBe('Tiếng Việt');
  });
});

describe('t()', () => {
  it('returns English search placeholder', () => {
    expect(t('en', 'searchPlaceholder')).toBe('Search lessons…');
  });

  it('returns Vietnamese search placeholder', () => {
    expect(t('vi', 'searchPlaceholder')).toBe('Tìm kiếm bài học…');
  });

  it('returns Vietnamese homeCtaLabel', () => {
    expect(t('vi', 'homeCtaLabel')).toBe('Bắt đầu học');
  });

  it('returns English loading string', () => {
    expect(t('en', 'loading')).toBe('Loading…');
  });
});

describe('resolveParitySibling', () => {
  const lessons: LessonStub[] = [
    { parityId: 'ofdm-intro', lang: 'en', slug: 'ofdm-introduction', domain: 'rf' },
    { parityId: 'ofdm-intro', lang: 'vi', slug: 'gioi-thieu-ofdm', domain: 'rf' },
    { parityId: 'mimo-basics', lang: 'en', slug: 'mimo-basics', domain: 'rf' },
  ];

  it('finds the Vietnamese sibling for an English lesson', () => {
    const sibling = resolveParitySibling(lessons, 'ofdm-intro', 'vi');
    expect(sibling).toBeDefined();
    expect(sibling?.slug).toBe('gioi-thieu-ofdm');
    expect(sibling?.lang).toBe('vi');
  });

  it('finds the English sibling for a Vietnamese lesson', () => {
    const sibling = resolveParitySibling(lessons, 'ofdm-intro', 'en');
    expect(sibling?.slug).toBe('ofdm-introduction');
  });

  it('returns undefined when no sibling exists in target lang', () => {
    const sibling = resolveParitySibling(lessons, 'mimo-basics', 'vi');
    expect(sibling).toBeUndefined();
  });

  it('returns undefined for empty parityId', () => {
    const sibling = resolveParitySibling(lessons, '', 'vi');
    expect(sibling).toBeUndefined();
  });
});
