import type { MMLLesson } from "./mmlTypes";

export type LessonBadge = "cinematic" | "quick-win" | "challenge";

export interface BadgeMeta {
  id: LessonBadge;
  glyph: string;
  label: { en: string; es: string };
  /** CSS color token used for the badge's accent. */
  tone: string;
}

export const BADGE_META: Record<LessonBadge, BadgeMeta> = {
  cinematic: {
    id: "cinematic",
    glyph: "★",
    label: { en: "Most cinematic", es: "Más cinematográfica" },
    tone: "#c4b5fd",
  },
  "quick-win": {
    id: "quick-win",
    glyph: "🎯",
    label: { en: "Quick win", es: "Victoria rápida" },
    tone: "#34d399",
  },
  challenge: {
    id: "challenge",
    glyph: "⚡",
    label: { en: "Challenge", es: "Reto" },
    tone: "#fbbf24",
  },
};

/** A handful of curated picks that get the cinematic badge regardless of
 *  the heuristic. These are visually striking lessons we want to surface. */
const CURATED_CINEMATIC = new Set<string>([
  "mml-22", // SVD
  "mml-23", // Eigendecomposition / SVD intuition
  "mml-49", // PCA in practice
  "mml-50", // GMM
  "mml-7",  // Basis & rank
]);

/** Lessons explicitly tagged as challenges. */
const CURATED_CHALLENGE = new Set<string>([]);

const CINEMATIC_VIZ = new Set<string>([
  "svd-flow",
  "pca-3d",
  "kernel-projection-3d",
  "matrix-transform-3d",
  "optimizer-race",
  "eigenspace-3d",
]);

/**
 * Picks 0–2 badges for a lesson based on its content. Heuristics are
 * intentionally conservative so badges stay rare enough to mean something.
 */
export function getLessonBadges(lesson: MMLLesson): LessonBadge[] {
  const badges = new Set<LessonBadge>();

  // Cinematic — explicit pick OR has at least one signature 3D viz.
  const hasCinematicViz = lesson.visualizations.some((v) =>
    CINEMATIC_VIZ.has(v.type),
  );
  if (CURATED_CINEMATIC.has(lesson.id) || hasCinematicViz) {
    badges.add("cinematic");
  }

  // Challenge — 5+ exercises, OR explicitly tagged.
  if (CURATED_CHALLENGE.has(lesson.id) || lesson.exercises.length >= 5) {
    badges.add("challenge");
  }

  // Quick win — short body (≤ 4 paragraphs) AND 0–2 exercises AND not already
  // cinematic. Helps surface bite-size lessons for in-betweens.
  const paragraphs = lesson.content.length;
  const isShort = paragraphs <= 4;
  const fewExercises = lesson.exercises.length <= 2;
  if (isShort && fewExercises && !badges.has("cinematic") && !badges.has("challenge")) {
    badges.add("quick-win");
  }

  return Array.from(badges);
}
