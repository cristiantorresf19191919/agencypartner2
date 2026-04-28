"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLang } from "@/lib/i18n";
import { JAVA_COURSE_LESSONS } from "@/lib/javaCourseData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  Code as CodeIcon,
  ArrowForward as ArrowRight,
  School as SchoolIcon,
  LocalCafe as JavaIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function JavaCourseLandingPage() {
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("java-course-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("java-course-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("java-course-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <JavaIcon fontSize="small" />
            Java 17
          </span>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            Monaco + TypeScript
          </span>
          <span className={styles.badge}>{JAVA_COURSE_LESSONS.length} {t("course-step")}</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t("course-steps-label")}</span>
          <span className={styles.count}>{JAVA_COURSE_LESSONS.length} {t("course-lessons-count")}</span>
        </div>
        <ul className={styles.grid}>
          {JAVA_COURSE_LESSONS.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/java-course/${lesson.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.difficulty}
                    style={{ background: "rgba(237, 139, 0, 0.2)", color: "#ED8B00" }}
                  >
                    {t("course-step")} {lesson.step}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{pickLang(language, lesson.titleEs, lesson.title)}</h3>
                <p
                  className={styles.cardCategory}
                  style={{ fontSize: "13px", color: "#ffd59a", marginTop: "8px" }}
                >
                  {lesson.content[0] ? `${lesson.content[0].substring(0, 100)}...` : ""}
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
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/blog")}>
            {t("nav-blog")}
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
