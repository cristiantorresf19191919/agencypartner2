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
import { LessonNavCard } from "@/components/CourseNav/LessonNavCard";
import { getChapterAccent } from "@/lib/mmlChapterAccents";
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

  const stripPreview = (raw: string): string => {
    return raw
      .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\$\$([^$]+)\$\$/g, "$1")
      .replace(/\$([^$]+)\$/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\\([a-zA-Z]+)/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140);
  };

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

        <LessonNavCard
          prev={
            prevLesson
              ? {
                  href: createLocalizedPath(
                    `/developer-section/mathematics-ml/${prevLesson.id}`,
                  ),
                  title: titleOf(prevLesson),
                  step: prevLesson.step,
                  preview:
                    (lang === "es" && prevLesson.contentEs?.[0]) ||
                    prevLesson.content?.[0]
                      ? stripPreview(
                          (lang === "es" && prevLesson.contentEs?.[0]) ||
                            prevLesson.content[0],
                        )
                      : undefined,
                  accent: getChapterAccent(prevLesson.chapterNumber).hex,
                }
              : null
          }
          next={
            nextLesson
              ? {
                  href: createLocalizedPath(
                    `/developer-section/mathematics-ml/${nextLesson.id}`,
                  ),
                  title: titleOf(nextLesson),
                  step: nextLesson.step,
                  preview:
                    (lang === "es" && nextLesson.contentEs?.[0]) ||
                    nextLesson.content?.[0]
                      ? stripPreview(
                          (lang === "es" && nextLesson.contentEs?.[0]) ||
                            nextLesson.content[0],
                        )
                      : undefined,
                  accent: getChapterAccent(nextLesson.chapterNumber).hex,
                }
              : {
                  href: createLocalizedPath(
                    "/developer-section/mathematics-ml",
                  ),
                  title:
                    lang === "es"
                      ? "Índice de capítulos"
                      : "Chapter index",
                  preview:
                    lang === "es"
                      ? "Has llegado al final del curso. Vuelve a la portada."
                      : "You've reached the end of the course. Head back to the index.",
                  accent: getChapterAccent(lesson.chapterNumber).hex,
                }
          }
          prevLabel={lang === "es" ? "Anterior" : "Previous"}
          nextLabel={lang === "es" ? "Siguiente" : "Next"}
        />
      </div>

      <Footer />
    </main>
  );
}
