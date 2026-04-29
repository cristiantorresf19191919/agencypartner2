"use client";

import React from "react";
import { MMLChapterGlyph } from "./MMLChapterGlyph";
import { getChapterAccent } from "@/lib/mmlChapterAccents";
import styles from "./MMLLessonHero.module.css";

interface MMLLessonHeroProps {
  chapter: string;
  chapterNumber: number;
  title: string;
  intro: string;
  /** Lesson 1-based index in the course (e.g. step 7 of 53). */
  step?: number;
  totalSteps?: number;
  vizCount?: number;
  exerciseCount?: number;
  readMinutes?: number;
  lang?: "en" | "es";
}

export function MMLLessonHero({
  chapter,
  chapterNumber,
  title,
  intro,
  step,
  totalSteps,
  vizCount,
  exerciseCount,
  readMinutes,
  lang = "en",
}: MMLLessonHeroProps) {
  const accent = getChapterAccent(chapterNumber);
  const tagline = accent.tagline[lang] ?? accent.tagline.en;
  const minLabel = lang === "es" ? "min de lectura" : "min read";
  const vizLabel =
    vizCount && vizCount === 1
      ? lang === "es" ? "viz." : "viz."
      : lang === "es" ? "vizs." : "vizs.";
  const exLabel =
    exerciseCount && exerciseCount === 1
      ? lang === "es" ? "ejercicio" : "exercise"
      : lang === "es" ? "ejercicios" : "exercises";

  return (
    <section
      className={styles.hero}
      style={{
        // Expose accent vars for downstream tints.
        ["--mml-accent" as string]: accent.hex,
        ["--mml-accent-soft" as string]: accent.soft,
        ["--mml-accent-glow" as string]: accent.glow,
      }}
      data-chapter={chapterNumber}
    >
      <div className={styles.aurora} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>
              {lang === "es" ? "Cap." : "Ch."} {chapterNumber} · {tagline}
            </span>
            {step && totalSteps ? (
              <span className={styles.position}>
                {step} <span className={styles.positionSep}>/</span> {totalSteps}
              </span>
            ) : null}
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.chapter}>{chapter}</p>
        </header>

        <div className={styles.glyphSlot} aria-hidden="true">
          <MMLChapterGlyph glyph={accent.glyph} accent={accent.hex} />
        </div>
      </div>

      <p className={styles.intro}>{intro}</p>

      <div className={styles.statsRow}>
        {readMinutes ? (
          <span className={styles.stat}>
            <span className={styles.statValue}>⏱ {readMinutes}</span>
            <span className={styles.statLabel}>{minLabel}</span>
          </span>
        ) : null}
        {vizCount && vizCount > 0 ? (
          <span className={styles.stat}>
            <span className={styles.statValue}>◇ {vizCount}</span>
            <span className={styles.statLabel}>{vizLabel}</span>
          </span>
        ) : null}
        {exerciseCount && exerciseCount > 0 ? (
          <span className={styles.stat}>
            <span className={styles.statValue}>✓ {exerciseCount}</span>
            <span className={styles.statLabel}>{exLabel}</span>
          </span>
        ) : null}
      </div>
    </section>
  );
}

export default MMLLessonHero;
