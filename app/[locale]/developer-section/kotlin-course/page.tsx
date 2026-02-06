"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getKotlinLessonForLocale } from "@/lib/courseTranslations";
import { KOTLIN_COURSE_LESSONS } from "@/lib/kotlinCourseData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  Code as CodeIcon,
  ArrowForward as ArrowRight,
  School as SchoolIcon,
  IntegrationInstructions as KotlinIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function KotlinCourseLandingPage() {
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("kotlin-course-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("kotlin-course-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("kotlin-course-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <KotlinIcon fontSize="small" />
            Kotlin
          </span>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            Multi-file Editor
          </span>
          <span className={styles.badge}>{KOTLIN_COURSE_LESSONS.length} {t("course-step")}</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t("kotlin-course-steps-label")}</span>
          <span className={styles.count}>{KOTLIN_COURSE_LESSONS.length} {t("kotlin-course-lessons-count")}</span>
        </div>
        <ul className={styles.grid}>
          {KOTLIN_COURSE_LESSONS.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.difficulty}
                    style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}
                  >
                    {t("course-step")} {lesson.step}
                  </span>
                </div>
                {(() => {
                  const translated = getKotlinLessonForLocale(locale as "en" | "es", lesson.id);
                  const firstText = translated?.content?.find((c): c is string => typeof c === "string");
                  return (
                    <>
                      <h3 className={styles.cardTitle}>{translated?.title ?? lesson.title}</h3>
                      <p
                        className={styles.cardCategory}
                        style={{ fontSize: "13px", color: "#9fc4ff", marginTop: "8px" }}
                      >
                        {firstText ? `${firstText.substring(0, 100)}...` : ""}
                      </p>
                    </>
                  );
                })()}
                <div className={styles.cardCta}>
                  <span>{t("course-start-lesson")}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/kotlin-playground")}
          >
            {t("kotlin-playground-link")}
          </a>
          <a
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/kotlin-java-interop")}
          >
            {t("kotlin-java-interop-link")}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            {t("algorithm-challenges-link")}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t("back-to-dev-hub")}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
