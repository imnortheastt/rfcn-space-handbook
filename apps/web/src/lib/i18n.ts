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
  tocLabel: 'On this page',
  prevLesson: 'Previous',
  nextLesson: 'Next',
  // Command palette
  searchOpenLabel: 'Search',
  searchModalPlaceholder: 'Search lessons…',
  searchNoResults: 'No results for',
  searchDevFallback: 'Search is available in the production build',
  searchHintNavigate: '↑↓ navigate',
  searchHintOpen: '↵ open',
  searchHintClose: 'esc close',
  domainRf: 'RF',
  domainCoreNetwork: 'Core Network',
  domainSpace: 'Space',
  groupPages: 'Pages',
  unitLabel: 'Unit',
  lessonsCount: 'lessons',
  comingSoon: 'Coming soon',
  visualMapToggle: 'View visual curriculum map',
  minRead: 'min read',
  visitedLabel: 'Visited',
} as const;

// Record<…, string> keeps the key-parity guarantee without `as const`
// narrowing values to English string literals (which would force VI values
// to equal the English text — a ts(2322) on every translated string).
type UIKeys = Record<keyof typeof en, string>;

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
    tocLabel: 'Trong trang này',
    prevLesson: 'Bài trước',
    nextLesson: 'Bài tiếp theo',
    // Command palette
    searchOpenLabel: 'Tìm kiếm',
    searchModalPlaceholder: 'Tìm bài học…',
    searchNoResults: 'Không có kết quả cho',
    searchDevFallback: 'Tìm kiếm khả dụng trong bản dựng production',
    searchHintNavigate: '↑↓ điều hướng',
    searchHintOpen: '↵ mở',
    searchHintClose: 'esc đóng',
    domainRf: 'RF',
    domainCoreNetwork: 'Mạng lõi',
    domainSpace: 'Không gian',
    groupPages: 'Trang',
    unitLabel: 'Đơn vị',
    lessonsCount: 'bài học',
    comingSoon: 'Sắp ra mắt',
    visualMapToggle: 'Xem bản đồ chương trình trực quan',
    minRead: 'phút đọc',
    visitedLabel: 'Đã xem',
  } satisfies UIKeys,
} as const;

export function t(lang: Locale, key: keyof UIKeys): string {
  return ui[lang][key];
}

export const SUPPORTED_LOCALES: Locale[] = ['en', 'vi'];

export function isValidLocale(lang: string): lang is Locale {
  return SUPPORTED_LOCALES.includes(lang as Locale);
}
