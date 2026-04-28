"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLang } from "@/lib/i18n";
import { APOLLO_CHALLENGES } from "@/lib/apolloChallengesData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { Code as CodeIcon, ArrowForward as ArrowRight, Hub as ApolloIcon } from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

export default function ApolloChallengesListPage() {
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill} style={{ background: "linear-gradient(120deg, rgba(137, 80, 252, 0.2), rgba(49, 24, 131, 0.22))" }}>
          <ApolloIcon fontSize="small" />
          <span>{t("apollo-challenges-pill") || "Apollo GraphQL Challenges"}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("apollo-challenges-title") || "Apollo Client + GraphQL Challenges"}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("apollo-challenges-subtitle") || "Master Apollo Client, queries, mutations, caching, and real-world GraphQL patterns through hands-on coding exercises."}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            Apollo Client + GraphQL
          </span>
          <span className={styles.badge}>{t("react-challenges-badge-editor") || "Interactive Editor"}</span>
          <span className={styles.badge}>{APOLLO_CHALLENGES.length} {t("react-challenges-count-label") || "challenges"}</span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t("apollo-challenges-all-label") || "All Challenges"}</span>
          <span className={styles.count}>{APOLLO_CHALLENGES.length} {t("react-challenges-count-label") || "challenges"}</span>
        </div>
        <ul className={styles.grid}>
          {APOLLO_CHALLENGES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/apollo-graphql-challenges/${c.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={`${styles.difficulty} ${styles[c.difficulty.toLowerCase()]}`}>
                    {c.difficulty}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{pickLang(language, c.titleEs, c.title)}</h3>
                <p className={styles.cardCategory} style={{ fontSize: "13px", color: "#9fc4ff" }}>
                  {c.description.split("\n")[0].substring(0, 100)}...
                </p>
                <div className={styles.cardCta}>
                  <span>{t("react-challenges-start") || "Start Challenge"}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/apollo-graphql")}>
            {t("apollo-challenges-back-to-course") || "Apollo GraphQL Course"}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t("back-to-dev-hub") || "Developer Hub"}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
