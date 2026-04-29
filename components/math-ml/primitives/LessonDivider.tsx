"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./LessonDivider.module.css";

const GLYPHS = ["∇", "⊗", "↻", "◇", "∂", "∑", "∮", "∝"] as const;

interface Props {
  /** Index that picks which glyph to show — usually paragraph index. */
  index: number;
}

/**
 * Replaces the plain horizontal rule between lesson paragraphs with a tiny
 * SVG-style math glyph that pulses on scroll-into-view. Rotates through
 * eight glyphs so consecutive dividers don't feel repetitive.
 */
export function LessonDivider({ index }: Props) {
  const reduced = useReducedMotion() ?? false;
  const glyph = GLYPHS[Math.abs(index) % GLYPHS.length];

  return (
    <motion.div
      className={styles.divider}
      aria-hidden="true"
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span className={styles.line} />
      <motion.span
        className={styles.glyph}
        initial={reduced ? { scale: 1 } : { scale: 0.6, rotate: -20 }}
        whileInView={reduced ? {} : { scale: [0.6, 1.15, 1], rotate: [-20, 4, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {glyph}
      </motion.span>
      <span className={styles.line} />
    </motion.div>
  );
}

export default LessonDivider;
