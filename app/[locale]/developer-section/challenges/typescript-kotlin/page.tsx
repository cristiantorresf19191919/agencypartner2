"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { CHALLENGES, type Challenge } from "@/lib/challengesData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowRight,
  Code as CodeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../ChallengesPage.module.css";

type DifficultyFilter = "all" | "Easy" | "Medium";

function filterChallenges(
  challenges: Challenge[],
  searchQuery: string,
  difficultyFilter: DifficultyFilter
): Challenge[] {
  const q = searchQuery.trim().toLowerCase();
  return challenges.filter((c) => {
    const matchesDifficulty =
      difficultyFilter === "all" || c.difficulty === difficultyFilter;
    if (!matchesDifficulty) return false;
    if (!q) return true;
    const inTitle = c.title.toLowerCase().includes(q);
    const inDesc = c.description.toLowerCase().includes(q);
    const inCategory = c.category.toLowerCase().includes(q);
    return inTitle || inDesc || inCategory;
  });
}

export default function ChallengesListPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFilterOpen]);

  const filteredChallenges = useMemo(
    () => filterChallenges(CHALLENGES, searchQuery, difficultyFilter),
    [searchQuery, difficultyFilter]
  );

  const formatResultsCount = useCallback(
    (shown: number, total: number) =>
      t("challenges-results-count")
        .replace("{shown}", String(shown))
        .replace("{total}", String(total)),
    [t]
  );

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <TrophyIcon fontSize="small" />
          <span>{t("challenges-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("challenges-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("challenges-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            {t("challenges-badge-typescript-kotlin")}
          </span>
          <span className={styles.badge}>{t("challenges-badge-run-submit")}</span>
          <span className={styles.badge}>
            {CHALLENGES.length} {t("challenges-count")}
          </span>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.searchFilterBar}>
          <div className={styles.searchWrapper}>
            <SearchIcon className={styles.searchIcon} aria-hidden />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t("challenges-search-placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t("challenges-search-placeholder")}
              autoComplete="off"
            />
          </div>
          <div className={styles.filterWrapper} ref={filterRef}>
            <button
              type="button"
              className={styles.filterTrigger}
              onClick={() => setIsFilterOpen((o) => !o)}
              aria-expanded={isFilterOpen}
              aria-haspopup="listbox"
              aria-label={t("challenges-filter-difficulty")}
            >
              <FilterIcon fontSize="small" />
              <span>
                {difficultyFilter === "all"
                  ? t("challenges-filter-all")
                  : difficultyFilter === "Easy"
                    ? t("challenges-filter-easy-only")
                    : t("challenges-filter-medium-only")}
              </span>
            </button>
            <div
              className={`${styles.filterDropdown} ${isFilterOpen ? styles.filterDropdownOpen : ""}`}
              role="listbox"
            >
              <button
                role="option"
                aria-selected={difficultyFilter === "all"}
                className={styles.filterOption}
                onClick={() => {
                  setDifficultyFilter("all");
                  setIsFilterOpen(false);
                }}
              >
                {t("challenges-filter-all")}
              </button>
              <button
                role="option"
                aria-selected={difficultyFilter === "Easy"}
                className={styles.filterOption}
                onClick={() => {
                  setDifficultyFilter("Easy");
                  setIsFilterOpen(false);
                }}
              >
                {t("challenge-difficulty-easy")}
              </button>
              <button
                role="option"
                aria-selected={difficultyFilter === "Medium"}
                className={styles.filterOption}
                onClick={() => {
                  setDifficultyFilter("Medium");
                  setIsFilterOpen(false);
                }}
              >
                {t("challenge-difficulty-medium")}
              </button>
            </div>
          </div>
          <span className={styles.resultsCount}>
            {formatResultsCount(filteredChallenges.length, CHALLENGES.length)}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filteredChallenges.length === 0 ? (
            <motion.div
              key="empty"
              className={styles.emptyState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SearchIcon className={styles.emptyIcon} />
              <p>{t("challenges-search-no-results")}</p>
            </motion.div>
          ) : (
            <motion.ul
              key="grid"
              className={styles.grid}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredChallenges.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.025, 0.4),
                    duration: 0.3,
                  }}
                >
                  <Link
                    href={createLocalizedPath(
                      `/developer-section/challenges/${c.id}`
                    )}
                    className={styles.card}
                  >
                    <div className={styles.cardTop}>
                      <span
                        className={`${styles.difficulty} ${styles[c.difficulty.toLowerCase()]}`}
                      >
                        {c.difficulty === "Easy"
                          ? t("challenge-difficulty-easy")
                          : t("challenge-difficulty-medium")}
                      </span>
                      <span className={styles.score}>
                        {c.maxScore} {t("challenge-pts")}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <p className={styles.cardCategory}>
                      {c.category === "Problem Solving (Basic)"
                        ? t("challenge-category-basic")
                        : t("challenge-category-intermediate")}
                    </p>
                    <div className={styles.cardMeta}>
                      <SuccessIcon className={styles.cardMetaIcon} />
                      <span>
                        {t("challenges-card-success")} {c.successRate}
                      </span>
                    </div>
                    <div className={styles.cardCta}>
                      <span>{t("challenges-card-solve")}</span>
                      <ArrowRight className={styles.ctaArrow} />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </section>

      <div className={styles.footerActions}>
        <a
          className={styles.secondaryLink}
          href={createLocalizedPath("/developer-section/challenges")}
        >
          ← {t("challenges-back-to-landing")}
        </a>
        <a
          className={styles.secondaryLink}
          href={createLocalizedPath("/developer-section")}
          style={{ marginLeft: "16px" }}
        >
          {t("challenges-back-hub")}
        </a>
      </div>

      <Footer />
    </main>
  );
}
