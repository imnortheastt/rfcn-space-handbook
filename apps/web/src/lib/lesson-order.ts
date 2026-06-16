/**
 * Flattens curriculum.json into an ordered lesson list per domain,
 * enabling prev/next navigation that respects track → unit → lesson order.
 */
import curriculum from '../../../../data/curriculum.json';

export interface LessonRef {
  id: string;
  title: { en: string; vi: string };
}

type CurriculumDomain = {
  tracks: Array<{
    units: Array<{
      lessons: LessonRef[];
    }>;
  }>;
};

/**
 * Returns a flat ordered array of {id, title} for every lesson in the domain.
 * Order mirrors the curriculum.json track → unit → lesson nesting.
 */
export function getFlatLessons(domain: string): LessonRef[] {
  const domainData = (curriculum.domains as Record<string, CurriculumDomain>)[domain];
  if (!domainData) return [];

  const result: LessonRef[] = [];
  for (const track of domainData.tracks) {
    for (const unit of track.units) {
      for (const lesson of unit.lessons) {
        result.push({ id: lesson.id, title: lesson.title });
      }
    }
  }
  return result;
}

export interface PrevNext {
  prev: LessonRef | null;
  next: LessonRef | null;
}

/**
 * Given a domain and current lesson slug, returns the adjacent lessons.
 * Returns null for prev/next when at the boundary of the curriculum.
 */
export function getPrevNext(domain: string, slug: string): PrevNext {
  const lessons = getFlatLessons(domain);
  const idx = lessons.findIndex((l) => l.id === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? (lessons[idx - 1] ?? null) : null,
    next: idx < lessons.length - 1 ? (lessons[idx + 1] ?? null) : null,
  };
}
