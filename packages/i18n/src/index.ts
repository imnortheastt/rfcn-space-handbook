// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Lang = 'en' | 'vi';

// ---------------------------------------------------------------------------
// Language labels & helpers
// ---------------------------------------------------------------------------

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export function getOppositeLang(lang: Lang): Lang {
  return lang === 'en' ? 'vi' : 'en';
}

// ---------------------------------------------------------------------------
// UI strings — single source of truth for all locale copy
// ---------------------------------------------------------------------------

export const UI_STRINGS = {
  en: {
    homeCtaLabel: 'Start learning',
    langSwitcherLabel: 'Tiếng Việt',
    langSwitcherAriaLabel: 'Switch to Vietnamese',
    noTranslationBanner:
      'This page is not yet available in Vietnamese — showing English original.',
    noTranslationBannerReverse:
      'This page is not yet available in English — showing Vietnamese original.',
    searchPlaceholder: 'Search lessons…',
    breadcrumbHome: 'Home',
    foundErrorLabel: 'Found an error? Open an issue on GitHub',
    standardsBaselinePrefix: 'Standards baseline:',
    loading: 'Loading…',
    error: 'An error occurred.',
  },
  vi: {
    homeCtaLabel: 'Bắt đầu học',
    langSwitcherLabel: 'English',
    langSwitcherAriaLabel: 'Chuyển sang tiếng Anh',
    noTranslationBanner:
      'Trang này chưa có bản tiếng Việt — đang hiển thị bản tiếng Anh.',
    noTranslationBannerReverse:
      'Trang này chưa có bản tiếng Anh — đang hiển thị bản tiếng Việt.',
    searchPlaceholder: 'Tìm kiếm bài học…',
    breadcrumbHome: 'Trang chủ',
    foundErrorLabel: 'Phát hiện lỗi? Mở issue trên GitHub',
    standardsBaselinePrefix: 'Tiêu chuẩn tham chiếu:',
    loading: 'Đang tải…',
    error: 'Đã xảy ra lỗi.',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof UI_STRINGS)['en'];

/**
 * Returns the localised string for the given key and language.
 */
export function t(lang: Lang, key: UiKey): string {
  return UI_STRINGS[lang][key];
}

// ---------------------------------------------------------------------------
// Parity sibling resolver
// ---------------------------------------------------------------------------

export interface LessonStub {
  /** Unique parity identifier shared by the EN/VI pair */
  parityId: string;
  /** Content language */
  lang: Lang;
  /** URL-safe slug for this lesson */
  slug: string;
  /** Content domain (e.g. "rf") */
  domain: string;
}

/**
 * Given a flat list of all lessons, finds the sibling lesson in `targetLang`
 * that shares the same `parityId`.
 *
 * Returns `undefined` if no sibling exists (lesson has no translation yet).
 */
export function resolveParitySibling<T extends LessonStub>(
  allLessons: T[],
  parityId: string,
  targetLang: Lang,
): T | undefined {
  if (!parityId) return undefined;
  return allLessons.find((l) => l.parityId === parityId && l.lang === targetLang);
}
