"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllProgress } from "@/lib/courseProgress";
import { getChapterAccent } from "@/lib/mmlChapterAccents";
import { MMLChapterGlyph } from "@/components/math-ml/primitives/MMLChapterGlyph";
import styles from "./ChapterOverviewGrid.module.css";

export interface ChapterCardData {
  number: number;
  name: string;
  lessonIds: string[];
  /** First-paragraph snippet from the first lesson — used as a description. */
  blurb?: string;
}

interface Props {
  chapters: ChapterCardData[];
  /** Callback when a card is clicked. Parent decides whether to scroll, open
   *  the accordion, or navigate. */
  onSelect?: (chapterNumber: number) => void;
}

const COURSE_ID = "mathematics-ml";

export function ChapterOverviewGrid({ chapters, onSelect }: Props) {
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => {
      const map = getAllProgress();
      const completed = map[COURSE_ID]?.completed ?? {};
      const lastVisited = map[COURSE_ID]?.lastLessonId;
      const set = new Set<string>(Object.keys(completed));
      // Treat the most-recently-visited lesson as "in progress" so the ring
      // shows partial fill even before the first completion.
      if (lastVisited) set.add(lastVisited);
      setCompletedSet(set);
    };
    refresh();
    window.addEventListener("course-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("course-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const totalCount = useMemo(
    () => chapters.reduce((acc, c) => acc + c.lessonIds.length, 0),
    [chapters],
  );

  const visitedCount = useMemo(
    () =>
      chapters.reduce(
        (acc, c) => acc + c.lessonIds.filter((id) => completedSet.has(id)).length,
        0,
      ),
    [chapters, completedSet],
  );

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          {lang === "es" ? "Capítulos del curso" : "Course chapters"}
        </span>
        <h2 className={styles.title}>
          {lang === "es"
            ? "Doce capítulos, una historia"
            : "Twelve chapters, one story"}
        </h2>
        <p className={styles.subtitle}>
          {lang === "es"
            ? `${visitedCount} de ${totalCount} lecciones tocadas. Da clic en un capítulo para abrir sus lecciones abajo.`
            : `${visitedCount} of ${totalCount} lessons touched. Tap a chapter to open its lessons below.`}
        </p>
      </header>

      <ul className={styles.grid} role="list">
        {chapters.map((c, idx) => {
          const accent = getChapterAccent(c.number);
          const visited = c.lessonIds.filter((id) => completedSet.has(id)).length;
          const fraction = c.lessonIds.length > 0 ? visited / c.lessonIds.length : 0;
          return (
            <motion.li
              key={c.number}
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                className={styles.card}
                style={{
                  ["--chapter-accent" as string]: accent.hex,
                  ["--chapter-accent-soft" as string]: accent.soft,
                  ["--chapter-accent-glow" as string]: accent.glow,
                }}
                onClick={() => onSelect?.(c.number)}
                aria-label={`Open chapter ${c.number}: ${c.name}`}
              >
                <span className={styles.chapterNum}>
                  {String(c.number).padStart(2, "0")}
                </span>
                <div className={styles.glyphSlot}>
                  <MMLChapterGlyph glyph={accent.glyph} accent={accent.hex} />
                </div>
                <h3 className={styles.cardTitle}>{c.name}</h3>
                {c.blurb ? <p className={styles.cardBlurb}>{c.blurb}</p> : null}
                <div className={styles.cardFooter}>
                  <ProgressRing
                    fraction={fraction}
                    visited={visited}
                    total={c.lessonIds.length}
                    accent={accent.hex}
                  />
                  <span className={styles.lessonCount}>
                    {c.lessonIds.length}{" "}
                    {lang === "es"
                      ? c.lessonIds.length === 1
                        ? "lección"
                        : "lecciones"
                      : c.lessonIds.length === 1
                        ? "lesson"
                        : "lessons"}
                  </span>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

interface RingProps {
  fraction: number;
  visited: number;
  total: number;
  accent: string;
}

function ProgressRing({ fraction, visited, total, accent }: RingProps) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * Math.max(0, Math.min(1, fraction));
  return (
    <span className={styles.ring} aria-label={`${visited}/${total} lessons touched`}>
      <svg width={48} height={48} viewBox="0 0 48 48">
        <circle
          cx={24}
          cy={24}
          r={r}
          fill="none"
          stroke="rgba(255, 255, 255, 0.10)"
          strokeWidth={3}
        />
        <motion.circle
          cx={24}
          cy={24}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference - dash }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 24 24)"
          style={{ filter: `drop-shadow(0 0 5px ${accent}aa)` }}
        />
        <text
          x={24}
          y={28}
          textAnchor="middle"
          fontSize={11}
          fontWeight={800}
          fill="currentColor"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {Math.round(fraction * 100)}%
        </text>
      </svg>
    </span>
  );
}

export default ChapterOverviewGrid;
