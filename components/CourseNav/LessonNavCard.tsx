"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import styles from "./LessonNavCard.module.css";

export interface LessonNavCardItem {
  href: string;
  title: string;
  /** Short, plain-text preview (~ 1 sentence). */
  preview?: string;
  /** Course-step index (e.g. 7 / 53). */
  step?: number;
  /** When provided, paints the card border + accent glow. */
  accent?: string;
  /** Optional emoji or short label rendered in the corner. */
  glyph?: React.ReactNode;
}

interface Props {
  prev?: LessonNavCardItem | null;
  next?: LessonNavCardItem | null;
  prevLabel?: string;
  nextLabel?: string;
}

/**
 * Two stacked cards rendered at the bottom of every lesson — Previous /
 * Next — with a one-line preview, course step, and optional chapter glyph.
 * Drop-in replacement for bare "← Prev | Next →" links.
 */
export function LessonNavCard({
  prev,
  next,
  prevLabel = "Previous",
  nextLabel = "Next",
}: Props) {
  if (!prev && !next) return null;
  return (
    <nav className={styles.row} aria-label="Lesson navigation">
      {prev ? (
        <Link
          href={prev.href}
          className={`${styles.card} ${styles.cardPrev}`}
          style={{
            ["--card-accent" as string]: prev.accent ?? "var(--mml-accent, #7cf4ff)",
          }}
          aria-label={`${prevLabel}: ${prev.title}`}
        >
          <span className={styles.dirRow}>
            <ArrowBackIcon fontSize="small" className={styles.arrow} />
            <span className={styles.dirLabel}>{prevLabel}</span>
            {prev.step ? <span className={styles.step}>· {prev.step}</span> : null}
          </span>
          <span className={styles.title}>{prev.title}</span>
          {prev.preview ? <span className={styles.preview}>{prev.preview}</span> : null}
          {prev.glyph ? <span className={styles.glyph}>{prev.glyph}</span> : null}
        </Link>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.href}
          className={`${styles.card} ${styles.cardNext}`}
          style={{
            ["--card-accent" as string]: next.accent ?? "var(--mml-accent, #7cf4ff)",
          }}
          aria-label={`${nextLabel}: ${next.title}`}
        >
          <span className={`${styles.dirRow} ${styles.dirRowEnd}`}>
            {next.step ? <span className={styles.step}>{next.step} ·</span> : null}
            <span className={styles.dirLabel}>{nextLabel}</span>
            <ArrowForwardIcon fontSize="small" className={styles.arrow} />
          </span>
          <span className={`${styles.title} ${styles.titleEnd}`}>{next.title}</span>
          {next.preview ? <span className={`${styles.preview} ${styles.previewEnd}`}>{next.preview}</span> : null}
          {next.glyph ? <span className={`${styles.glyph} ${styles.glyphEnd}`}>{next.glyph}</span> : null}
        </Link>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}
    </nav>
  );
}

export default LessonNavCard;
