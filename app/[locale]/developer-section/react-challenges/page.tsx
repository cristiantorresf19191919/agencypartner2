"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { REACT_CHALLENGES } from "@/lib/reactChallengesData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { Code as CodeIcon, ArrowForward as ArrowRight, Psychology as BrainIcon } from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function ReactChallengesListPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <BrainIcon fontSize="small" />
          <span>React Challenges</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          React & TypeScript Challenges
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Master React hooks, rendering behavior, TypeScript patterns, and performance optimization.
          Solution unlocks after 10 attempts.
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            React + TypeScript
          </span>
          <span className={styles.badge}>Interactive Editor</span>
          <span className={styles.badge}>{REACT_CHALLENGES.length} Challenges</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>All Challenges</span>
          <span className={styles.count}>{REACT_CHALLENGES.length} challenges</span>
        </div>
        <ul className={styles.grid}>
          {REACT_CHALLENGES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/react-challenges/${c.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={`${styles.difficulty} ${styles[c.difficulty.toLowerCase()]}`}>
                    {c.difficulty}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardCategory} style={{ fontSize: "13px", color: "#9fc4ff" }}>
                  {c.description.split("\n")[0].substring(0, 100)}...
                </p>
                <div className={styles.cardCta}>
                  <span>Solve Challenge</span>
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
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Back to Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
