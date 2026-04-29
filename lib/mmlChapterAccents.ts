/**
 * Per-chapter accent metadata for the Math-for-ML course. Used by the
 * hero block, progress dots, prerequisite rail and viz stages so that
 * each chapter has a distinct visual identity.
 */

export type ChapterAccentName = "cyan" | "blue" | "emerald" | "violet" | "amber" | "rose" | "orange";
export type MMLGlyph =
  | "sigma"
  | "vectors"
  | "norm-ball"
  | "matrix-spin"
  | "gradient"
  | "bell-curve"
  | "descent-path"
  | "scatter"
  | "ellipse"
  | "clusters"
  | "hyperplane";

export interface ChapterAccent {
  /** CSS hex token. Mirrored as `--mml-chapter-accent` on the lesson root. */
  hex: string;
  /** Soft variant for backgrounds (typically rgba 10–15%). */
  soft: string;
  /** Glow variant for shadows (typically rgba 28–35%). */
  glow: string;
  name: ChapterAccentName;
  glyph: MMLGlyph;
  /** Short EN/ES tagline used as eyebrow context. */
  tagline: { en: string; es: string };
}

const ACCENTS: Record<ChapterAccentName, { hex: string; soft: string; glow: string }> = {
  cyan:    { hex: "#7cf4ff", soft: "rgba(124, 244, 255, 0.10)", glow: "rgba(124, 244, 255, 0.28)" },
  blue:    { hex: "#60a5fa", soft: "rgba(96, 165, 250, 0.12)",  glow: "rgba(96, 165, 250, 0.30)" },
  emerald: { hex: "#34d399", soft: "rgba(52, 211, 153, 0.12)",  glow: "rgba(52, 211, 153, 0.28)" },
  violet:  { hex: "#c4b5fd", soft: "rgba(196, 181, 253, 0.12)", glow: "rgba(167, 139, 250, 0.30)" },
  amber:   { hex: "#fbbf24", soft: "rgba(251, 191, 36, 0.12)",  glow: "rgba(251, 191, 36, 0.32)" },
  rose:    { hex: "#fb7185", soft: "rgba(251, 113, 133, 0.12)", glow: "rgba(251, 113, 133, 0.30)" },
  orange:  { hex: "#fb923c", soft: "rgba(251, 146, 60, 0.12)",  glow: "rgba(251, 146, 60, 0.32)" },
};

const CHAPTER_TABLE: Record<
  number,
  { name: ChapterAccentName; glyph: MMLGlyph; tagline: { en: string; es: string } }
> = {
  1:  { name: "cyan",    glyph: "sigma",         tagline: { en: "Foundations",         es: "Fundamentos" } },
  2:  { name: "blue",    glyph: "vectors",       tagline: { en: "Linear Algebra",      es: "Álgebra lineal" } },
  3:  { name: "emerald", glyph: "norm-ball",     tagline: { en: "Analytic Geometry",   es: "Geometría analítica" } },
  4:  { name: "violet",  glyph: "matrix-spin",   tagline: { en: "Matrix Decompositions", es: "Descomposiciones" } },
  5:  { name: "amber",   glyph: "gradient",      tagline: { en: "Vector Calculus",     es: "Cálculo vectorial" } },
  6:  { name: "rose",    glyph: "bell-curve",    tagline: { en: "Probability",          es: "Probabilidad" } },
  7:  { name: "orange",  glyph: "descent-path",  tagline: { en: "Continuous Optimization", es: "Optimización" } },
  8:  { name: "cyan",    glyph: "scatter",       tagline: { en: "When Models Meet Data", es: "Modelos y datos" } },
  9:  { name: "emerald", glyph: "scatter",       tagline: { en: "Linear Regression",   es: "Regresión lineal" } },
  10: { name: "violet",  glyph: "ellipse",       tagline: { en: "Principal Component Analysis", es: "PCA" } },
  11: { name: "amber",   glyph: "clusters",      tagline: { en: "Gaussian Mixture Models", es: "Mezclas gaussianas" } },
  12: { name: "rose",    glyph: "hyperplane",    tagline: { en: "Support Vector Machines", es: "SVM" } },
};

const FALLBACK = CHAPTER_TABLE[2];

export function getChapterAccent(chapterNumber: number | undefined): ChapterAccent {
  const entry = (chapterNumber && CHAPTER_TABLE[chapterNumber]) || FALLBACK;
  const palette = ACCENTS[entry.name];
  return {
    hex: palette.hex,
    soft: palette.soft,
    glow: palette.glow,
    name: entry.name,
    glyph: entry.glyph,
    tagline: entry.tagline,
  };
}

export function getChapterAccentByName(name: ChapterAccentName): { hex: string; soft: string; glow: string } {
  return ACCENTS[name];
}
