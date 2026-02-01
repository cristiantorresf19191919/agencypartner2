"use client";

import { useLocale } from "@/lib/useLocale";
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
  const { createLocalizedPath } = useLocale();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>Kotlin from Scratch</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Learn Kotlin from the Ground Up
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Official Kotlin tour content with an interactive multi-file editor.
          Practice challenges with run and submit validation—learn by doing.
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
          <span className={styles.badge}>{KOTLIN_COURSE_LESSONS.length} Steps</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>Course Steps</span>
          <span className={styles.count}>{KOTLIN_COURSE_LESSONS.length} lessons</span>
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
                    Step {lesson.step}
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
                  <span>Start Lesson</span>
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
            Kotlin Playground
          </a>
          <a
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/kotlin-java-interop")}
          >
            Kotlin Java InterOp
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            Algorithm Challenges
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Back to Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
