"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MMLLesson } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "./BigIdea.module.css";

interface BigIdeaProps {
  lesson: MMLLesson;
  lang: "en" | "es";
}

/**
 * BigIdea — a poster-style lead card auto-derived from existing lesson fields.
 *
 *   • Headline: `keyTakeaways[0]` (the lesson's most important idea)
 *   • Sub-line: `mlConnection.ifRemoved` (the "without this you can't do X" hook)
 *
 * Renders nothing if neither field is populated. Spanish locale prefers
 * `keyTakeawaysEs[0]` and `mlConnection.ifRemovedEs` when present.
 */
export function BigIdea({ lesson, lang }: BigIdeaProps) {
  const reduced = useReducedMotion() ?? false;

  const headline =
    lang === "es" && lesson.keyTakeawaysEs?.[0]
      ? lesson.keyTakeawaysEs[0]
      : lesson.keyTakeaways?.[0];

  const removed =
    lang === "es" && lesson.mlConnection?.ifRemovedEs
      ? lesson.mlConnection.ifRemovedEs
      : lesson.mlConnection?.ifRemoved;

  if (!headline && !removed) return null;

  const badgeText = lang === "es" ? "Idea clave" : "Big idea";
  const removedLabel = lang === "es" ? "Sin esto:" : "Without this:";

  return (
    <motion.section
      className={styles.card}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      aria-label={badgeText}
    >
      <div className={styles.head}>
        <span className={styles.icon} aria-hidden="true">
          ★
        </span>
        <span className={styles.badge}>{badgeText}</span>
      </div>

      {headline && (
        <MathContent
          text={headline}
          as="p"
          className={styles.headline}
        />
      )}

      {removed && (
        <div className={styles.removedRow}>
          <span className={styles.removedLabel}>{removedLabel}</span>
          <MathContent
            text={removed}
            as="p"
            className={styles.removedText}
          />
        </div>
      )}
    </motion.section>
  );
}

export default BigIdea;
