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

export default function MathMLLandingPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
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

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("mml-course-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
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
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <FunctionsIcon fontSize="small" />
            Interactive Math
          </span>
          <span className={styles.badge}>Mafs + Three.js</span>
          <span className={styles.badge}>
            {MML_COURSE_LESSONS.length} {t("course-step")}
          </span>
          <span className={styles.badge}>
            {chapters.length} chapters
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
            return (
              <div key={chapter.number} className={mmlStyles.chapterAccordion}>
                <button
                  type="button"
                  className={mmlStyles.chapterHeader}
                  onClick={() => toggleChapter(chapter.number)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    border: "none",
                    color: "inherit",
                    font: "inherit",
                    textAlign: "left",
                  }}
                >
                  <div className={mmlStyles.chapterName}>
                    <span className={mmlStyles.chapterNumber}>
                      {chapter.number}
                    </span>
                    {chapter.name}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span className={mmlStyles.chapterLessonCount}>
                      {chapter.lessons.length} lesson
                      {chapter.lessons.length !== 1 ? "s" : ""}
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
                          {chapter.lessons.map((lesson, i) => (
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
                                className={styles.card}
                              >
                                <div className={styles.cardTop}>
                                  <span className={mmlStyles.accentStep}>
                                    {t("course-step")} {lesson.step}
                                  </span>
                                </div>
                                <h3 className={styles.cardTitle}>
                                  {lesson.title}
                                </h3>
                                <p
                                  className={styles.cardCategory}
                                  style={{
                                    fontSize: "13px",
                                    color: "#6EE7B7",
                                    marginTop: "8px",
                                  }}
                                >
                                  {lesson.content[0]
                                    ? `${lesson.content[0].substring(0, 100)}...`
                                    : ""}
                                </p>
                                <div className={styles.cardCta}>
                                  <span>{t("course-start-lesson")}</span>
                                  <ArrowRight className={styles.ctaArrow} />
                                </div>
                              </Link>
                            </motion.li>
                          ))}
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
