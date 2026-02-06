"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { EmojiEvents as TrophyIcon, Psychology as ReactIcon, Code as CodeIcon, School as SchoolIcon, ArrowForward as ArrowRight } from "@mui/icons-material";
import Link from "next/link";
import { CHALLENGES } from "@/lib/challengesData";
import { REACT_CHALLENGES } from "@/lib/reactChallengesData";
import { REACT19_LESSONS } from "@/lib/react19InterviewData";
import styles from "./ChallengesLanding.module.css";

export default function ChallengesLandingPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  // Ensure we have the data
  const challengesCount = CHALLENGES?.length || 0;
  const reactChallengesCount = REACT_CHALLENGES?.length || 0;
  const react19LessonsCount = REACT19_LESSONS?.length || 0;

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
          {t('challenges-landing-title')}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t('challenges-landing-subtitle')}
        </motion.p>
      </section>

      <section className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <Link
              href={createLocalizedPath("/developer-section/challenges/typescript-kotlin")}
              className={styles.challengeCard}
              style={{ display: 'block' }}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardGradient1} />
              <div className={styles.cardGradient2} />

              <div className={styles.cardContent}>
                <div className={styles.iconContainer}>
                  <CodeIcon className={styles.icon} />
                </div>

                <h2 className={styles.cardTitle}>
                  {t('challenges-card-typescript-kotlin-title')}
                </h2>

                <p className={styles.cardDescription}>
                  {t('challenges-card-typescript-kotlin-desc')}
                </p>

                <div className={styles.cardStats}>
                  <span className={styles.stat}>
                    {challengesCount} {t('challenges-count')}
                  </span>
                  <span className={styles.stat}>
                    {t('challenges-badge-typescript-kotlin')}
                  </span>
                </div>

                <div className={styles.cardCta}>
                  <span>{t('challenges-card-start')}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <Link
              href={createLocalizedPath("/developer-section/react-challenges")}
              className={styles.challengeCard}
              style={{ display: 'block' }}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardGradient1} />
              <div className={styles.cardGradient2} />

              <div className={styles.cardContent}>
                <div className={styles.iconContainer}>
                  <ReactIcon className={styles.icon} />
                </div>

                <h2 className={styles.cardTitle}>
                  {t('challenges-card-react-title')}
                </h2>

                <p className={styles.cardDescription}>
                  {t('challenges-card-react-desc')}
                </p>

                <div className={styles.cardStats}>
                  <span className={styles.stat}>
                    {reactChallengesCount} {t('challenges-count')}
                  </span>
                  <span className={styles.stat}>
                    {t('challenges-badge-react-typescript')}
                  </span>
                </div>

                <div className={styles.cardCta}>
                  <span>{t('challenges-card-start')}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <Link
              href={createLocalizedPath("/developer-section/react-interview")}
              className={styles.challengeCard}
              style={{ display: 'block' }}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardGradient1} />
              <div className={styles.cardGradient2} />

              <div className={styles.cardContent}>
                <div className={styles.iconContainer}>
                  <SchoolIcon className={styles.icon} />
                </div>

                <h2 className={styles.cardTitle}>
                  {t('challenges-react-19-title')}
                </h2>

                <p className={styles.cardDescription}>
                  {t('challenges-react-19-desc')}
                </p>

                <div className={styles.cardStats}>
                  <span className={styles.stat}>
                    {react19LessonsCount} {t('challenges-react-19-lessons')}
                  </span>
                  <span className={styles.stat}>
                    {t('challenges-react-19-features')}
                  </span>
                </div>

                <div className={styles.cardCta}>
                  <span>{t('start-learning')}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
          {t('challenges-back-hub')}
        </a>
      </div>

      <Footer />
    </main>
  );
}
