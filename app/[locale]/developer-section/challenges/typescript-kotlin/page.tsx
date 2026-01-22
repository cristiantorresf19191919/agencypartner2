"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { CHALLENGES } from "@/lib/challengesData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { EmojiEvents as TrophyIcon, ArrowForward as ArrowRight, Code as CodeIcon } from "@mui/icons-material";
import Link from "next/link";
import styles from "../ChallengesPage.module.css";

export default function ChallengesListPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <TrophyIcon fontSize="small" />
          <span>{t('challenges-pill')}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t('challenges-title')}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t('challenges-subtitle')}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            {t('challenges-badge-typescript-kotlin')}
          </span>
          <span className={styles.badge}>{t('challenges-badge-run-submit')}</span>
          <span className={styles.badge}>{CHALLENGES.length} {t('challenges-count')}</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t('challenges-filter-difficulty')}</span>
          <span className={styles.count}>{CHALLENGES.length} {t('challenges-count')}</span>
        </div>
        <ul className={styles.grid}>
          {CHALLENGES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/challenges/${c.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={`${styles.difficulty} ${styles[c.difficulty.toLowerCase()]}`}>
                    {c.difficulty === 'Easy' ? t('challenge-difficulty-easy') : t('challenge-difficulty-medium')}
                  </span>
                  <span className={styles.score}>{c.maxScore} {t('challenge-pts')}</span>
                </div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardCategory}>
                  {c.category === 'Problem Solving (Basic)' 
                    ? t('challenge-category-basic')
                    : t('challenge-category-intermediate')}
                </p>
                <div className={styles.cardMeta}>
                  <span>{t('challenges-card-success')} {c.successRate}</span>
                </div>
                <div className={styles.cardCta}>
                  <span>{t('challenges-card-solve')}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <div className={styles.footerActions}>
        <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
          ← {t('challenges-back-to-landing')}
        </a>
        <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")} style={{ marginLeft: '16px' }}>
          {t('challenges-back-hub')}
        </a>
      </div>

      <Footer />
    </main>
  );
}
