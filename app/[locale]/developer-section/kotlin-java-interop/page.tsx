"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { KOTLIN_JAVA_INTEROP_LESSONS } from "@/lib/kotlinJavaInteropData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  Code as CodeIcon,
  ArrowForward as ArrowRight,
  School as SchoolIcon,
  IntegrationInstructions as InteropIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function KotlinJavaInteropCoursePage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("kotlin-java-interop-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("kotlin-java-interop-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("kotlin-java-interop-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <InteropIcon fontSize="small" />
            Interop
          </span>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            Kotlin + Java
          </span>
          <span className={styles.badge}>{KOTLIN_JAVA_INTEROP_LESSONS.length} {t("course-lessons-count")}</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t("course-steps-label")}</span>
          <span className={styles.count}>{KOTLIN_JAVA_INTEROP_LESSONS.length} {t("course-lessons-count")}</span>
        </div>
        <ul className={styles.grid}>
          {KOTLIN_JAVA_INTEROP_LESSONS.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/kotlin-java-interop/${lesson.id}`)}
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
                <h3 className={styles.cardTitle}>{lesson.title}</h3>
                <p
                  className={styles.cardCategory}
                  style={{ fontSize: "13px", color: "#9fc4ff", marginTop: "8px" }}
                >
                  {lesson.content[0]?.substring(0, 100)}...
                </p>
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
          <Link
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/kotlin-course")}
          >
            {t("kotlin-course-pill")}
          </Link>
          <Link
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/kotlin-playground")}
          >
            {t("kotlin-playground-link")}
          </Link>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t("back-to-dev-hub")}
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
