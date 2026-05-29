// roadmap-layout.ts — pure build-time layout fn, no DOM
// Computes SVG node positions for a domain's tracks → units → lessons DAG.
// All lessons render with "draft" status — lesson published states are not
// reflected here intentionally (no lesson slugs in new DAG are published yet).

export type LessonStatus = 'draft';

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  status: LessonStatus;
  level: string; // e.g. "L1"
  href: string;
}

export interface TrackLabel {
  id: string;
  title: string;
  y: number;
  height: number;
  hasUnits: boolean;
}

export interface RoadmapLayout {
  width: number;
  height: number;
  nodes: LayoutNode[];
  trackLabels: TrackLabel[];
}

// ── Layout constants ─────────────────────────────────────────────────────────
const LABEL_W = 160;     // left track label column width
const LESSON_W = 80;     // lesson box width
const LESSON_H = 24;     // lesson box height
const LESSON_GAP = 4;    // gap between lesson boxes horizontally
const UNIT_GAP = 12;     // gap between units within a track
const TRACK_PAD_Y = 10;  // vertical padding within a track band
const TRACK_GAP = 8;     // gap between track bands
const SHELL_H = 44;      // height of a shell-only (no units) track band
const SVG_PAD_X = 12;    // left/right SVG padding
const SVG_PAD_Y = 12;    // top/bottom SVG padding

// Level index for opacity modulation (L0=0 … L5=5)
const LEVEL_ORDER = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
export function levelIndex(level: string): number {
  const i = LEVEL_ORDER.indexOf(level);
  return i >= 0 ? i : 1;
}

interface RawLesson {
  id: string;
  title: { en: string; vi?: string };
  level: string;
}
interface RawUnit {
  id: string;
  title: { en: string; vi?: string };
  lessons: RawLesson[];
}
interface RawTrack {
  id: string;
  title: { en: string; vi?: string };
  units: RawUnit[];
}

export function computeLayout(
  tracks: RawTrack[],
  lang: 'en' | 'vi',
  domain: string,
): RoadmapLayout {
  const nodes: LayoutNode[] = [];
  const trackLabels: TrackLabel[] = [];

  let curY = SVG_PAD_Y;
  let maxX = 0;

  for (const track of tracks) {
    const trackTitle = (lang === 'vi' && track.title.vi) ? track.title.vi : track.title.en;

    if (track.units.length === 0) {
      // Shell-only track: single flat band
      trackLabels.push({
        id: track.id,
        title: trackTitle,
        y: curY,
        height: SHELL_H,
        hasUnits: false,
      });
      curY += SHELL_H + TRACK_GAP;
      continue;
    }

    // Track with units: compute height from max unit lesson count
    let maxUnitRows = 0;
    for (const unit of track.units) {
      maxUnitRows = Math.max(maxUnitRows, unit.lessons.length);
    }
    const trackH = TRACK_PAD_Y * 2 + maxUnitRows * (LESSON_H + LESSON_GAP) - LESSON_GAP;

    trackLabels.push({
      id: track.id,
      title: trackTitle,
      y: curY,
      height: trackH,
      hasUnits: true,
    });

    // Position units left-to-right
    let curX = SVG_PAD_X + LABEL_W;

    for (const unit of track.units) {
      const unitX = curX;
      const unitY = curY + TRACK_PAD_Y;

      for (let li = 0; li < unit.lessons.length; li++) {
        const lesson = unit.lessons[li]!;
        const lessonTitle = (lang === 'vi' && lesson.title.vi) ? lesson.title.vi : lesson.title.en;
        const lx = unitX;
        const ly = unitY + li * (LESSON_H + LESSON_GAP);

        nodes.push({
          id: `${track.id}-${unit.id}-${lesson.id}`,
          x: lx,
          y: ly,
          w: LESSON_W,
          h: LESSON_H,
          title: lessonTitle,
          status: 'draft',
          level: lesson.level ?? 'L1',
          href: `/${lang}/${domain}/${lesson.id}`,
        });
      }

      const unitRight = unitX + LESSON_W;
      maxX = Math.max(maxX, unitRight);
      curX = unitRight + UNIT_GAP;
    }

    maxX = Math.max(maxX, curX - UNIT_GAP);
    curY += trackH + TRACK_GAP;
  }

  const width = maxX + SVG_PAD_X;
  const height = curY - TRACK_GAP + SVG_PAD_Y;

  return { width, height, nodes, trackLabels };
}
