"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Functions as FunctionsIcon } from "@mui/icons-material";
import Link from "next/link";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { MML_COURSE_LESSONS, getMMLLessonById } from "@/lib/mmlCourseData";
import CourseSidebar from "@/components/Layout/CourseSidebar";
import { MMLLessonRenderer } from "@/components/math-ml/MMLLessonRenderer";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import mmlStyles from "@/components/math-ml/MathML.module.css";

export default function MMLLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const lesson = getMMLLessonById(slug);

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

        <nav className={mmlStyles.lessonNav}>
          {lesson.prevStep ? (
            <Link
              href={createLocalizedPath(
                `/developer-section/mathematics-ml/${lesson.prevStep}`
              )}
              className={mmlStyles.lessonNavLink}
            >
              ← Previous lesson
            </Link>
          ) : (
            <span />
          )}
          {lesson.nextStep ? (
            <Link
              href={createLocalizedPath(
                `/developer-section/mathematics-ml/${lesson.nextStep}`
              )}
              className={mmlStyles.lessonNavLink}
            >
              Next lesson →
            </Link>
          ) : (
            <Link
              href={createLocalizedPath("/developer-section/mathematics-ml")}
              className={mmlStyles.lessonNavLink}
            >
              Back to course
            </Link>
          )}
        </nav>
      </div>

      <Footer />
    </main>
  );
}
