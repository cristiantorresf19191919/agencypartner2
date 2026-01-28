"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { ANDROID_LESSONS } from "@/lib/androidKotlinData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { Code as CodeIcon, ArrowForward as ArrowRight, School as SchoolIcon, PhoneAndroid as AndroidIcon } from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function AndroidKotlinLandingPage() {
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
          <span>Modern Android Developer Playbook</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Zero-to-Hero Android Development
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Learn modern Android development with Jetpack Compose, Kotlin Coroutines, and Clean Architecture.
          Interactive lessons with code editors and real-world examples.
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <AndroidIcon fontSize="small" />
            Jetpack Compose
          </span>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            Kotlin
          </span>
          <span className={styles.badge}>{ANDROID_LESSONS.length} Levels</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>All Levels</span>
          <span className={styles.count}>{ANDROID_LESSONS.length} levels</span>
        </div>
        <ul className={styles.grid}>
          {ANDROID_LESSONS.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/android-kotlin/${lesson.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                    Level {lesson.level}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{lesson.title}</h3>
                <p className={styles.cardCategory} style={{ fontSize: "13px", color: "#9fc4ff" }}>
                  {lesson.concept}
                </p>
                <p className={styles.cardCategory} style={{ fontSize: "12px", color: "#7cf4ff", marginTop: "8px" }}>
                  {lesson.description.substring(0, 120)}...
                </p>
                <div className={styles.cardCta}>
                  <span>Start Level</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            Algorithm Challenges
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-challenges")}>
            React Challenges
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
