/**
 * Builds a structured domain listing by joining curriculum.json with
 * Astro content collection entries. Used by the domain index page.
 */
import { getCollection } from 'astro:content';
import type { Locale } from './i18n';
import { lessonPath } from './content-paths';
import curriculumRaw from '../../../../data/curriculum.json';

export interface LessonView {
  slug: string;
  title: string;
  level: string;
  order: number;
  minutes: number;
  status: string;
  published: boolean;
  href?: string;
}

export interface UnitView {
  id: string;
  title: string;
  lessonCount: number;
  lessons: LessonView[];
}

export interface TrackView {
  id: string;
  title: string;
  units: UnitView[];
}

type CurriculumLesson = {
  id: string;
  title: { en: string; vi: string };
  level: string;
};

type CurriculumUnit = {
  id: string;
  title: { en: string; vi: string };
  lessons: CurriculumLesson[];
};

type CurriculumTrack = {
  id: string;
  title: { en: string; vi: string };
  units: CurriculumUnit[];
};

type CurriculumDomain = {
  title: { en: string; vi: string };
  tracks: CurriculumTrack[];
};

export async function buildDomainListing(
  lang: Locale,
  domain: string,
): Promise<TrackView[]> {
  const allEntries = await getCollection('lessons');

  // Build a map: slug → entry for target lang
  const langMap = new Map<string, (typeof allEntries)[0]>();
  for (const entry of allEntries) {
    if (entry.data.lang === lang && entry.data.domain === domain) {
      langMap.set(entry.data.slug, entry);
    }
  }

  // EN fallback map for missing vi metadata
  const enMap = new Map<string, (typeof allEntries)[0]>();
  if (lang !== 'en') {
    for (const entry of allEntries) {
      if (entry.data.lang === 'en' && entry.data.domain === domain) {
        enMap.set(entry.data.slug, entry);
      }
    }
  }

  const domains = (curriculumRaw as { domains: Record<string, CurriculumDomain> }).domains;
  const domainData = domains[domain];
  if (!domainData) return [];

  const tracks: TrackView[] = [];

  for (const track of domainData.tracks) {
    const unitViews: UnitView[] = [];

    for (const unit of track.units ?? []) {
      const lessonViews: LessonView[] = [];
      const ordered: Array<{ lesson: CurriculumLesson; order: number }> = [];

      for (let ci = 0; ci < unit.lessons.length; ci++) {
        const cl = unit.lessons[ci]!;
        const entry = langMap.get(cl.id) ?? enMap.get(cl.id);
        const order = entry?.data.order ?? ci + 1;
        ordered.push({ lesson: cl, order });
      }

      // Sort by frontmatter order (fallback: curriculum array position)
      ordered.sort((a, b) => a.order - b.order);

      for (const { lesson: cl, order } of ordered) {
        const entry = langMap.get(cl.id);
        const fallback = enMap.get(cl.id);
        const resolved = entry ?? fallback;

        const status = resolved?.data.status ?? 'draft';
        const minutes = resolved?.data.estimatedReadingMinutes ?? 0;
        const published = status === 'published';
        const title = (lang === 'en'
          ? cl.title.en
          : (cl.title.vi ?? cl.title.en)) || cl.title.en;

        const lessonView: LessonView = {
          slug: cl.id,
          title,
          level: cl.level,
          order,
          minutes,
          status,
          published,
          href: published ? lessonPath(lang, domain, cl.id) : undefined,
        };

        lessonViews.push(lessonView);
      }

      const unitTitle = (lang === 'en'
        ? unit.title.en
        : (unit.title.vi ?? unit.title.en)) || unit.title.en;

      unitViews.push({
        id: unit.id,
        title: unitTitle,
        lessonCount: lessonViews.length,
        lessons: lessonViews,
      });
    }

    const trackTitle = (lang === 'en'
      ? track.title.en
      : (track.title.vi ?? track.title.en)) || track.title.en;

    tracks.push({
      id: track.id,
      title: trackTitle,
      units: unitViews,
    });
  }

  return tracks;
}
