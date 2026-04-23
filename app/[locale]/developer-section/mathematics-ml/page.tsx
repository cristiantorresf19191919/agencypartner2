"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { MML_COURSE_LESSONS } from "@/lib/mmlCourseData";
import type { MMLLesson } from "@/lib/mmlTypes";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Functions as FunctionsIcon,
  ArrowForward as ArrowRight,
  School as SchoolIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as AutoAwesomeIcon,
  ViewInAr as ViewInArIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";
import mmlStyles from "@/components/math-ml/MathML.module.css";

interface ChapterGroup {
  number: number;
  name: string;
  lessons: MMLLesson[];
}

function groupByChapter(lessons: MMLLesson[]): ChapterGroup[] {
  const chapters: ChapterGroup[] = [];
  const seen = new Map<number, number>();

  for (const lesson of lessons) {
    if (!seen.has(lesson.chapterNumber)) {
      seen.set(lesson.chapterNumber, chapters.length);
      chapters.push({
        number: lesson.chapterNumber,
        name: lesson.chapter,
        lessons: [],
      });
    }
    const idx = seen.get(lesson.chapterNumber);
    if (idx !== undefined) {
      chapters[idx].lessons.push(lesson);
    }
  }
  return chapters;
}

const CHAPTER_ACCENTS: Array<{ hue: string; name: string }> = [
  { hue: "#34D399", name: "emerald" }, // 1
  { hue: "#60A5FA", name: "blue" },    // 2
  { hue: "#C4B5FD", name: "violet" },  // 3
  { hue: "#FBBF24", name: "amber" },   // 4
  { hue: "#F472B6", name: "pink" },    // 5
  { hue: "#22D3EE", name: "cyan" },    // 6
  { hue: "#FB7185", name: "rose" },    // 7
  { hue: "#2DD4BF", name: "teal" },    // 8
  { hue: "#A78BFA", name: "indigo" },  // 9
  { hue: "#A3E635", name: "lime" },    // 10
  { hue: "#FB923C", name: "orange" },  // 11
  { hue: "#E879F9", name: "fuchsia" }, // 12
];

function accentFor(n: number) {
  return CHAPTER_ACCENTS[(n - 1) % CHAPTER_ACCENTS.length];
}

export default function MathMLLandingPage() {
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const chapters = groupByChapter(MML_COURSE_LESSONS);
  const [openChapters, setOpenChapters] = useState<Set<number>>(
    new Set(chapters.slice(0, 2).map((c) => c.number))
  );

  const toggleChapter = (num: number) => {
    const next = new Set(openChapters);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    setOpenChapters(next);
  };

  const totalViz = MML_COURSE_LESSONS.reduce(
    (acc, l) => acc + l.visualizations.length,
    0,
  );
  const totalExercises = MML_COURSE_LESSONS.reduce(
    (acc, l) => acc + l.exercises.length,
    0,
  );

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />
      <div className={mmlStyles.mmlAurora} aria-hidden="true" />
      <div className={mmlStyles.mmlAuroraSweep} aria-hidden="true" />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("mml-course-pill")}</span>
        </div>
        <motion.h1
          className={`${styles.title} ${mmlStyles.mmlHeroTitle}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("mml-course-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("mml-course-subtitle")}
        </motion.p>
        <div className={`${styles.heroBadges} ${mmlStyles.mmlHeroBadges}`}>
          <span className={`${styles.badge} ${mmlStyles.mmlBadgeEmerald}`}>
            <AutoAwesomeIcon fontSize="small" />
            {lang === "es" ? "Matemáticas interactivas" : "Interactive Math"}
          </span>
          <span className={`${styles.badge} ${mmlStyles.mmlBadgeBlue}`}>
            <ViewInArIcon fontSize="small" />
            {totalViz} {lang === "es" ? "visualizaciones" : "visualizations"}
          </span>
          <span className={`${styles.badge} ${mmlStyles.mmlBadgeViolet}`}>
            <QuizIcon fontSize="small" />
            {totalExercises} {lang === "es" ? "ejercicios" : "exercises"}
          </span>
          <span className={`${styles.badge} ${mmlStyles.mmlBadgeAmber}`}>
            <FunctionsIcon fontSize="small" />
            {MML_COURSE_LESSONS.length} {t("course-step")}
          </span>
          <span className={`${styles.badge} ${mmlStyles.mmlBadgeGhost}`}>
            {chapters.length} {lang === "es" ? "capítulos" : "chapters"}
          </span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t("course-steps-label")}</span>
          <span className={styles.count}>
            {MML_COURSE_LESSONS.length} {t("course-lessons-count")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {chapters.map((chapter) => {
            const isOpen = openChapters.has(chapter.number);
            const accent = accentFor(chapter.number);
            const accentSoft = `${accent.hue}29`;
            const accentGhost = `${accent.hue}12`;
            return (
              <div
                key={chapter.number}
                className={mmlStyles.chapterAccordion}
                style={{
                  ["--chapter-accent" as string]: accent.hue,
                  ["--chapter-accent-soft" as string]: accentSoft,
                  ["--chapter-accent-ghost" as string]: accentGhost,
                }}
              >
                <button
                  type="button"
                  className={mmlStyles.chapterHeader}
                  onClick={() => toggleChapter(chapter.number)}
                  aria-expanded={isOpen}
                >
                  <div className={mmlStyles.chapterName}>
                    <span className={mmlStyles.chapterNumber}>
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <span className={mmlStyles.chapterNameText}>
                      {chapter.name}
                    </span>
                  </div>
                  <div className={mmlStyles.chapterHeaderRight}>
                    <span className={mmlStyles.chapterLessonCount}>
                      {chapter.lessons.length}{" "}
                      {lang === "es"
                        ? chapter.lessons.length === 1
                          ? "lección"
                          : "lecciones"
                        : chapter.lessons.length === 1
                          ? "lesson"
                          : "lessons"}
                    </span>
                    <ChevronRightIcon
                      className={`${mmlStyles.chapterChevron} ${
                        isOpen ? mmlStyles.chapterChevronOpen : ""
                      }`}
                      fontSize="small"
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className={mmlStyles.chapterLessons}>
                        <ul className={styles.grid}>
                          {chapter.lessons.map((lesson, i) => {
                            const vizCount = lesson.visualizations.length;
                            const exCount = lesson.exercises.length;
                            return (
                              <motion.li
                                key={lesson.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: i * 0.03,
                                  duration: 0.25,
                                }}
                              >
                                <Link
                                  href={createLocalizedPath(
                                    `/developer-section/mathematics-ml/${lesson.id}`
                                  )}
                                  className={`${styles.card} ${mmlStyles.lessonCard}`}
                                >
                                  <div className={styles.cardTop}>
                                    <span
                                      className={mmlStyles.lessonStepChip}
                                    >
                                      {t("course-step")} {lesson.step}
                                    </span>
                                    <div className={mmlStyles.lessonMetaChips}>
                                      {vizCount > 0 && (
                                        <span
                                          className={`${mmlStyles.lessonMetaChip} ${mmlStyles.lessonMetaChipViz}`}
                                          title={
                                            lang === "es"
                                              ? "Visualizaciones"
                                              : "Visualizations"
                                          }
                                        >
                                          <ViewInArIcon
                                            style={{ fontSize: 12 }}
                                          />
                                          {vizCount}
                                        </span>
                                      )}
                                      {exCount > 0 && (
                                        <span
                                          className={`${mmlStyles.lessonMetaChip} ${mmlStyles.lessonMetaChipEx}`}
                                          title={
                                            lang === "es"
                                              ? "Ejercicios"
                                              : "Exercises"
                                          }
                                        >
                                          <QuizIcon style={{ fontSize: 12 }} />
                                          {exCount}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <h3 className={styles.cardTitle}>
                                    {lesson.title}
                                  </h3>
                                  <p className={mmlStyles.lessonCardExcerpt}>
                                    {lesson.content[0]
                                      ? `${lesson.content[0].substring(0, 120)}…`
                                      : ""}
                                  </p>
                                  <div className={styles.cardCta}>
                                    <span>{t("course-start-lesson")}</span>
                                    <ArrowRight className={styles.ctaArrow} />
                                  </div>
                                </Link>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.footerActions}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section")}
          >
            {t("back-to-dev-hub")}
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
