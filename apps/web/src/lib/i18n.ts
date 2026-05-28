export type Locale = 'en' | 'vi';

export function getOppositeLang(lang: Locale): Locale {
  return lang === 'en' ? 'vi' : 'en';
}

export function getLessonUrl(
  lang: Locale,
  domain: string,
  slug: string,
): string {
  return `/${lang}/${domain}/${slug}`;
}

// UI strings keyed by locale — all copy lives here, never hardcoded in components.
// The `en` block is the source of truth for keys. `UIKeys` enforces that every
// locale provides exactly the same keys as English — a dropped VI key is a
// compile-time error, not a silent undefined at runtime.
const en = {
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
} as const;

type UIKeys = typeof en;

export const ui = {
  en,
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
  } satisfies UIKeys,
} as const;

export function t(lang: Locale, key: keyof UIKeys): string {
  return ui[lang][key];
}

export const SUPPORTED_LOCALES: Locale[] = ['en', 'vi'];

export function isValidLocale(lang: string): lang is Locale {
  return SUPPORTED_LOCALES.includes(lang as Locale);
}
