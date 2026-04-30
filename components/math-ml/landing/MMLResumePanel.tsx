"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowForward as ArrowRight, PlayArrow as PlayIcon } from "@mui/icons-material";
import { MML_COURSE_LESSONS } from "@/lib/mmlCourseData";
import { getAllProgress } from "@/lib/courseProgress";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getChapterAccent } from "@/lib/mmlChapterAccents";
import styles from "./MMLResumePanel.module.css";

const COURSE_ID = "mathematics-ml";

interface Stats {
  lessons: number;
  visualizations: number;
  exercises: number;
  hours: number;
}

function computeStats(): Stats {
  const lessons = MML_COURSE_LESSONS.length;
  let visualizations = 0;
  let exercises = 0;
  let words = 0;
  for (const lesson of MML_COURSE_LESSONS) {
    visualizations += lesson.visualizations.length;
    exercises += lesson.exercises.length;
    for (const p of lesson.content) {
      if (typeof p === "string") {
        words += p.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  // ~220 wpm reading + ~3 min per exercise + ~1 min per viz interaction
  const minutes = Math.round(words / 220 + exercises * 3 + visualizations);
  return {
    lessons,
    visualizations,
    exercises,
    hours: Math.max(1, Math.round(minutes / 60)),
  };
}

export function MMLResumePanel() {
  const { createLocalizedPath } = useLocale();
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";

  const [resume, setResume] = useState<{
    lessonId: string;
    title: string;
    href: string;
    chapterNumber: number;
    step: number;
    completedCount: number;
  } | null>(null);

  const stats = useMemo(computeStats, []);

  useEffect(() => {
    const refresh = () => {
      const map = getAllProgress();
      const p = map[COURSE_ID];
      if (!p?.lastLessonId) {
        setResume(null);
        return;
      }
      const lesson = MML_COURSE_LESSONS.find((l) => l.id === p.lastLessonId);
      if (!lesson) {
        setResume(null);
        return;
      }
      const completedCount = Object.keys(p.completed ?? {}).length;
      setResume({
        lessonId: lesson.id,
        title: (lang === "es" && lesson.titleEs) || lesson.title,
        href: p.lastLessonHref ?? `/developer-section/mathematics-ml/${lesson.id}`,
        chapterNumber: lesson.chapterNumber,
        step: lesson.step,
        completedCount,
      });
    };
    refresh();
    window.addEventListener("course-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("course-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [lang]);

  const totalLessons = MML_COURSE_LESSONS.length;
  const fraction = resume ? Math.min(1, resume.completedCount / totalLessons) : 0;
  const accent = resume ? getChapterAccent(resume.chapterNumber) : null;

  return (
    <section
      className={styles.panel}
      style={
        accent
          ? ({
              ["--panel-accent" as string]: accent.hex,
              ["--panel-accent-soft" as string]: accent.soft,
              ["--panel-accent-glow" as string]: accent.glow,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles.aurora} aria-hidden="true" />

      <div className={styles.layout}>
        {/* Left: stats grid */}
        <div className={styles.stats}>
          <StatTile
            value={String(stats.lessons)}
            label={lang === "es" ? "lecciones" : "lessons"}
            tone="cyan"
          />
          <StatTile
            value={String(stats.visualizations)}
            label={lang === "es" ? "visualizaciones" : "visualizations"}
            tone="violet"
          />
          <StatTile
            value={String(stats.exercises)}
            label={lang === "es" ? "ejercicios" : "exercises"}
            tone="amber"
          />
          <StatTile
            value={`~${stats.hours} h`}
            label={lang === "es" ? "lectura aprox." : "of math"}
            tone="emerald"
          />
        </div>

        {/* Right: resume CTA, only when there's progress */}
        {resume ? (
          <Link
            href={createLocalizedPath(resume.href)}
            className={styles.resumeCard}
            aria-label={`${lang === "es" ? "Continuar" : "Resume"}: ${resume.title}`}
          >
            <ProgressRing fraction={fraction} />
            <div className={styles.resumeBody}>
              <span className={styles.resumeEyebrow}>
                {lang === "es" ? "Continuar" : "Resume"}
              </span>
              <h3 className={styles.resumeTitle}>{resume.title}</h3>
              <span className={styles.resumeMeta}>
                {lang === "es" ? "Lección" : "Lesson"} {resume.step} ·{" "}
                {Math.round(fraction * 100)}%{" "}
                {lang === "es" ? "completado" : "complete"}
              </span>
            </div>
            <span className={styles.resumeCta}>
              <PlayIcon fontSize="small" />
              <ArrowRight fontSize="small" />
            </span>
          </Link>
        ) : (
          <Link
            href={createLocalizedPath("/developer-section/mathematics-ml/mml-1")}
            className={`${styles.resumeCard} ${styles.resumeCardEmpty}`}
          >
            <div className={styles.resumeBody}>
              <span className={styles.resumeEyebrow}>
                {lang === "es" ? "Empezar" : "Begin"}
              </span>
              <h3 className={styles.resumeTitle}>
                {lang === "es"
                  ? "Lección 1 — Por qué necesitamos matemáticas"
                  : "Lesson 1 — Why Math for ML"}
              </h3>
              <span className={styles.resumeMeta}>
                {lang === "es"
                  ? "Comienza el viaje con el motor del ML"
                  : "Start the journey with the engine of ML"}
              </span>
            </div>
            <span className={styles.resumeCta}>
              <PlayIcon fontSize="small" />
              <ArrowRight fontSize="small" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

interface StatTileProps {
  value: string;
  label: string;
  tone: "cyan" | "violet" | "amber" | "emerald";
}

function StatTile({ value, label, tone }: StatTileProps) {
  return (
    <motion.div
      className={`${styles.tile} ${styles[`tone_${tone}`]}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.tileValue}>{value}</span>
      <span className={styles.tileLabel}>{label}</span>
    </motion.div>
  );
}

function ProgressRing({ fraction }: { fraction: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * Math.max(0, Math.min(1, fraction));
  return (
    <span className={styles.ringSlot} aria-hidden="true">
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle
          cx={36}
          cy={36}
          r={r}
          fill="none"
          stroke="rgba(255, 255, 255, 0.10)"
          strokeWidth={4}
        />
        <motion.circle
          cx={36}
          cy={36}
          r={r}
          fill="none"
          stroke="var(--panel-accent, #7cf4ff)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference - dash }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 36 36)"
          style={{ filter: "drop-shadow(0 0 8px var(--panel-accent-glow, rgba(124, 244, 255, 0.55)))" }}
        />
        <text
          x={36}
          y={41}
          textAnchor="middle"
          fontSize={14}
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

export default MMLResumePanel;
