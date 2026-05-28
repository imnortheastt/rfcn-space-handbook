import { getCollection } from 'astro:content';
import type { Locale } from './i18n';

/**
 * Finds the sibling lesson entry in the opposite language
 * by matching parityId and targetLang.
 *
 * Returns undefined if no parity sibling exists (vi-only or en-only exception).
 */
export async function getParitySibling(
  parityId: string,
  targetLang: Locale,
) {
  const all = await getCollection('lessons');
  return all.find(
    (entry) =>
      entry.data.parityId === parityId && entry.data.lang === targetLang,
  );
}

/**
 * Returns the canonical URL path for a lesson entry.
 */
export function lessonPath(
  lang: Locale,
  domain: string,
  slug: string,
): string {
  return `/${lang}/${domain}/${slug}`;
}
