"use client";

import { useLocale } from "@/lib/useLocale";
import { TYPESCRIPT_COURSE_LESSONS } from "@/lib/typescriptCourseData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  Code as CodeIcon,
  ArrowForward as ArrowRight,
  School as SchoolIcon,
  IntegrationInstructions as TsIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function TypeScriptCourseLandingPage() {
  const { createLocalizedPath } = useLocale();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>TypeScript from Scratch</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Learn TypeScript with the Enriched Editor
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Types, interfaces, unions, and functions. Monaco-powered editor with TypeScript autocomplete, run in-browser, and verify—learn by doing.
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <TsIcon fontSize="small" />
            TypeScript
          </span>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            Monaco + Autocomplete
          </span>
          <span className={styles.badge}>{TYPESCRIPT_COURSE_LESSONS.length} Steps</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>Course Steps</span>
          <span className={styles.count}>{TYPESCRIPT_COURSE_LESSONS.length} lessons</span>
        </div>
        <ul className={styles.grid}>
          {TYPESCRIPT_COURSE_LESSONS.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/typescript-course/${lesson.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.difficulty}
                    style={{ background: "rgba(49, 120, 198, 0.2)", color: "#3178c6" }}
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
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/blog/typescript-advanced")}>
            TypeScript Blog
          </Link>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Back to Developer Hub
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
