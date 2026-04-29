/**
 * Per-category accent palette for blog posts. Mirrors the MML chapter-accent
 * pattern: each top-level category gets a distinct color so the post hero,
 * code-block borders, inline links, share rail, and TOC active dot all flow
 * from the same accent variables.
 */

import { blogCategories, type BlogCategory } from "./blogCategories";

export type BlogAccentName =
  | "cyan"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "orange"
  | "fuchsia"
  | "lime";

export interface BlogAccent {
  name: BlogAccentName;
  hex: string;
  soft: string;
  glow: string;
  /** Top-level category id this accent represents (when looked up from a post). */
  categoryId?: string;
  /** Localised category label shown in the eyebrow. */
  categoryTitle?: string;
}

const PALETTE: Record<BlogAccentName, { hex: string; soft: string; glow: string }> = {
  cyan:    { hex: "#7cf4ff", soft: "rgba(124, 244, 255, 0.10)", glow: "rgba(124, 244, 255, 0.28)" },
  blue:    { hex: "#60a5fa", soft: "rgba(96, 165, 250, 0.12)",  glow: "rgba(96, 165, 250, 0.30)" },
  violet:  { hex: "#c4b5fd", soft: "rgba(196, 181, 253, 0.12)", glow: "rgba(167, 139, 250, 0.30)" },
  emerald: { hex: "#34d399", soft: "rgba(52, 211, 153, 0.12)",  glow: "rgba(52, 211, 153, 0.28)" },
  amber:   { hex: "#fbbf24", soft: "rgba(251, 191, 36, 0.12)",  glow: "rgba(251, 191, 36, 0.32)" },
  rose:    { hex: "#fb7185", soft: "rgba(251, 113, 133, 0.12)", glow: "rgba(251, 113, 133, 0.30)" },
  orange:  { hex: "#fb923c", soft: "rgba(251, 146, 60, 0.12)",  glow: "rgba(251, 146, 60, 0.32)" },
  fuchsia: { hex: "#e879f9", soft: "rgba(232, 121, 249, 0.12)", glow: "rgba(232, 121, 249, 0.30)" },
  lime:    { hex: "#a3e635", soft: "rgba(163, 230, 53, 0.12)",  glow: "rgba(163, 230, 53, 0.32)" },
};

/** Top-level blog-category id → accent name. Curated, not auto-generated. */
const CATEGORY_TO_ACCENT: Record<string, BlogAccentName> = {
  "react-development": "cyan",
  "performance-optimization": "amber",
  "nextjs-framework": "blue",
  "cloud-infrastructure": "orange",
  "build-tools": "lime",
  "testing-quality": "emerald",
  "security-authentication": "rose",
  "state-management": "violet",
  "design-patterns-architecture": "violet",
  "ai-llms": "emerald",
  "typescript": "blue",
  "career-soft-skills": "fuchsia",
  "mobile-development": "violet",
  "accessibility-ux": "rose",
  "forms-data": "amber",
  "design-systems": "fuchsia",
  "developer-tools-workflow": "cyan",
  "data-structures-algorithms": "lime",
};

const FALLBACK: BlogAccent = {
  name: "cyan",
  ...PALETTE.cyan,
};

export function getBlogAccentByCategoryId(categoryId: string): BlogAccent {
  const accentName = CATEGORY_TO_ACCENT[categoryId] ?? "cyan";
  const cat = blogCategories.find((c) => c.id === categoryId);
  return {
    name: accentName,
    ...PALETTE[accentName],
    categoryId,
    categoryTitle: cat?.title,
  };
}

/** Find which top-level category owns a post id, then return that category's accent. */
export function getBlogAccentForSlug(slug: string): BlogAccent {
  for (const cat of blogCategories) {
    if (cat.posts.some((p) => p.id === slug || p.slug === slug)) {
      return getBlogAccentByCategoryId(cat.id);
    }
  }
  return FALLBACK;
}

export function getAllBlogAccents(): Array<BlogAccent & { categoryId: string }> {
  return blogCategories.map((cat) => ({
    ...getBlogAccentByCategoryId(cat.id),
    categoryId: cat.id,
  }));
}

export type { BlogCategory };
