"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Functions as FunctionsIcon } from "@mui/icons-material";
import Link from "next/link";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { MML_COURSE_LESSONS, getMMLLessonById } from "@/lib/mmlCourseData";
import { recordLessonVisit } from "@/lib/courseProgress";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import CourseSidebar from "@/components/Layout/CourseSidebar";
import { MMLLessonRenderer } from "@/components/math-ml/MMLLessonRenderer";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import mmlStyles from "@/components/math-ml/MathML.module.css";

export default function MMLLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const lesson = getMMLLessonById(slug);
  const prevLesson = lesson?.prevStep
    ? getMMLLessonById(lesson.prevStep)
    : undefined;
  const nextLesson = lesson?.nextStep
    ? getMMLLessonById(lesson.nextStep)
    : undefined;

  const titleOf = (l: typeof lesson) =>
    l ? (lang === "es" && l.titleEs ? l.titleEs : l.title) : "";

  useEffect(() => {
    if (lesson) {
      recordLessonVisit("mathematics-ml", {
        id: lesson.id,
        title: titleOf(lesson),
        href: `/developer-section/mathematics-ml/${lesson.id}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link
            href={createLocalizedPath("/developer-section/mathematics-ml")}
          >
            {t("course-back-to-course")}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <CourseSidebar
        lessons={MML_COURSE_LESSONS.map((l) => ({
          id: l.id,
          step: l.step,
          title: l.title,
        }))}
        coursePath="/developer-section/mathematics-ml"
        courseTitle="Mathematics for ML"
        courseIcon={<FunctionsIcon fontSize="small" />}
        currentSlug={slug}
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
      />

      <div className={playStyles.courseMain}>
        <MMLLessonRenderer lesson={lesson} />

        <nav className={mmlStyles.lessonNavFancy}>
          {prevLesson ? (
            <Link
              href={createLocalizedPath(
                `/developer-section/mathematics-ml/${prevLesson.id}`
              )}
              className={mmlStyles.lessonNavCard}
            >
              <span className={mmlStyles.lessonNavCardLabel}>
                <ArrowBackIcon style={{ fontSize: 14 }} />
                {lang === "es" ? "Lección anterior" : "Previous lesson"}
              </span>
              <span className={mmlStyles.lessonNavCardTitle}>
                {titleOf(prevLesson)}
              </span>
            </Link>
          ) : (
            <span className={mmlStyles.lessonNavCardEmpty} />
          )}
          {nextLesson ? (
            <Link
              href={createLocalizedPath(
                `/developer-section/mathematics-ml/${nextLesson.id}`
              )}
              className={`${mmlStyles.lessonNavCard} ${mmlStyles.lessonNavCardNext}`}
            >
              <span className={mmlStyles.lessonNavCardLabel}>
                {lang === "es" ? "Siguiente lección" : "Next lesson"}
                <ArrowForwardIcon style={{ fontSize: 14 }} />
              </span>
              <span className={mmlStyles.lessonNavCardTitle}>
                {titleOf(nextLesson)}
              </span>
            </Link>
          ) : (
            <Link
              href={createLocalizedPath("/developer-section/mathematics-ml")}
              className={`${mmlStyles.lessonNavCard} ${mmlStyles.lessonNavCardNext}`}
            >
              <span className={mmlStyles.lessonNavCardLabel}>
                <MenuBookIcon style={{ fontSize: 14 }} />
                {lang === "es" ? "Volver al curso" : "Back to course"}
              </span>
              <span className={mmlStyles.lessonNavCardTitle}>
                {lang === "es"
                  ? "Índice de capítulos"
                  : "Chapter index"}
              </span>
            </Link>
          )}
        </nav>
      </div>

      <Footer />
    </main>
  );
}
