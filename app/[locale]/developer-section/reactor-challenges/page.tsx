"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { REACTOR_CHALLENGES, REACTOR_TOPICS, type ReactorChallenge } from "@/lib/reactorChallengesData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowRight,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "./ReactorChallenges.module.css";

type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard";
type TopicFilter = "all" | string;

function filterChallenges(
  challenges: ReactorChallenge[],
  searchQuery: string,
  difficultyFilter: DifficultyFilter,
  topicFilter: TopicFilter
): ReactorChallenge[] {
  const q = searchQuery.trim().toLowerCase();
  return challenges.filter((c) => {
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    if (topicFilter !== "all" && c.topicSlug !== topicFilter) return false;
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q)
    );
  });
}

function getCompletedChallenges(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("reactor-challenges-completed");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export default function ReactorChallengesPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTopicFilterOpen, setIsTopicFilterOpen] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);
  const topicFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCompleted(getCompletedChallenges());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (topicFilterRef.current && !topicFilterRef.current.contains(e.target as Node)) {
        setIsTopicFilterOpen(false);
      }
    };
    if (isFilterOpen || isTopicFilterOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFilterOpen, isTopicFilterOpen]);

  const filtered = useMemo(
    () => filterChallenges(REACTOR_CHALLENGES, searchQuery, difficultyFilter, topicFilter),
    [searchQuery, difficultyFilter, topicFilter]
  );

  const groupedByTopic = useMemo(() => {
    const map = new Map<string, ReactorChallenge[]>();
    for (const c of filtered) {
      if (!map.has(c.topicSlug)) map.set(c.topicSlug, []);
      map.get(c.topicSlug)!.push(c);
    }
    return REACTOR_TOPICS.filter((t) => map.has(t.slug)).map((t) => ({
      ...t,
      challenges: map.get(t.slug)!,
    }));
  }, [filtered]);

  const completedCount = completed.size;
  const totalCount = REACTOR_CHALLENGES.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const difficultyLabel = useCallback(
    (d: DifficultyFilter) => {
      if (d === "all") return t("reactor-filter-all") || "All Levels";
      if (d === "Easy") return t("challenge-difficulty-easy");
      if (d === "Medium") return t("challenge-difficulty-medium");
      return t("reactor-filter-hard") || "Hard";
    },
    [t]
  );

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <BoltIcon fontSize="small" />
          <span>{t("reactor-challenges-pill") || "Spring Reactor"}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("reactor-challenges-title") || "Reactor Challenges"}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("reactor-challenges-subtitle") || "Master reactive programming with hands-on Kotlin challenges. Write, run, and validate your Reactor code."}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <BoltIcon style={{ fontSize: 16 }} /> Kotlin
          </span>
          <span className={styles.badge}>
            {t("reactor-badge-run") || "Run & Validate"}
          </span>
          <span className={styles.badge}>
            {REACTOR_CHALLENGES.length} {t("challenges-count") || "challenges"}
          </span>
          <span className={styles.badge}>
            {REACTOR_TOPICS.length} {t("reactor-badge-topics") || "topics"}
          </span>
        </div>
      </section>

      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <p className={styles.progressLabel}>
          {completedCount}/{totalCount} {t("reactor-progress-completed") || "completed"} ({progressPercent}%)
        </p>
      </div>

      <section className={styles.contentSection}>
        <div className={styles.searchFilterBar}>
          <div className={styles.searchWrapper}>
            <SearchIcon className={styles.searchIcon} aria-hidden />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t("reactor-search-placeholder") || "Search challenges..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Difficulty filter */}
          <div className={styles.filterWrapper} ref={filterRef}>
            <button
              type="button"
              className={styles.filterTrigger}
              onClick={() => setIsFilterOpen((o) => !o)}
              aria-expanded={isFilterOpen}
            >
              <FilterIcon fontSize="small" />
              <span>{difficultyLabel(difficultyFilter)}</span>
            </button>
            <div className={`${styles.filterDropdown} ${isFilterOpen ? styles.filterDropdownOpen : ""}`}>
              {(["all", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map((d) => (
                <button
                  key={d}
                  className={styles.filterOption}
                  aria-selected={difficultyFilter === d}
                  onClick={() => { setDifficultyFilter(d); setIsFilterOpen(false); }}
                >
                  {difficultyLabel(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Topic filter */}
          <div className={styles.filterWrapper} ref={topicFilterRef}>
            <button
              type="button"
              className={styles.filterTrigger}
              onClick={() => setIsTopicFilterOpen((o) => !o)}
              aria-expanded={isTopicFilterOpen}
            >
              <FilterIcon fontSize="small" />
              <span>{topicFilter === "all" ? (t("reactor-filter-all-topics") || "All Topics") : REACTOR_TOPICS.find((tp) => tp.slug === topicFilter)?.label}</span>
            </button>
            <div className={`${styles.filterDropdown} ${isTopicFilterOpen ? styles.filterDropdownOpen : ""}`}>
              <button
                className={styles.filterOption}
                aria-selected={topicFilter === "all"}
                onClick={() => { setTopicFilter("all"); setIsTopicFilterOpen(false); }}
              >
                {t("reactor-filter-all-topics") || "All Topics"}
              </button>
              {REACTOR_TOPICS.map((tp) => (
                <button
                  key={tp.slug}
                  className={styles.filterOption}
                  aria-selected={topicFilter === tp.slug}
                  onClick={() => { setTopicFilter(tp.slug); setIsTopicFilterOpen(false); }}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          <span className={styles.resultsCount}>
            {filtered.length}/{REACTOR_CHALLENGES.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {groupedByTopic.length === 0 ? (
            <motion.div
              key="empty"
              className={styles.emptyState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SearchIcon className={styles.emptyIcon} />
              <p>{t("reactor-search-no-results") || "No challenges match your search."}</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {groupedByTopic.map((group, gi) => (
                <motion.div
                  key={group.slug}
                  className={styles.topicGroup}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05, duration: 0.3 }}
                >
                  <div className={styles.topicHeader}>
                    <BoltIcon className={styles.topicIcon} />
                    <h2 className={styles.topicTitle}>{group.label}</h2>
                    <span className={styles.topicCount}>
                      {group.challenges.filter((c) => completed.has(c.id)).length}/{group.challenges.length}
                    </span>
                  </div>

                  <ul className={styles.grid}>
                    {group.challenges.map((c, i) => {
                      const isCompleted = completed.has(c.id);
                      return (
                        <motion.li
                          key={c.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: gi * 0.05 + i * 0.03, duration: 0.25 }}
                        >
                          <Link
                            href={createLocalizedPath(`/developer-section/reactor-challenges/${c.id}`)}
                            className={`${styles.card} ${isCompleted ? styles.cardCompleted : ""}`}
                          >
                            <div className={styles.cardTop}>
                              <span className={`${styles.difficulty} ${styles[c.difficulty.toLowerCase()]}`}>
                                {c.difficulty === "Easy"
                                  ? t("challenge-difficulty-easy")
                                  : c.difficulty === "Medium"
                                    ? t("challenge-difficulty-medium")
                                    : t("reactor-filter-hard") || "Hard"}
                              </span>
                              <span className={styles.challengeNumber}>#{i + 1}</span>
                            </div>
                            <h3 className={styles.cardTitle}>{c.title}</h3>
                            <p className={styles.cardDesc}>{c.description.split("\n")[0]}</p>
                            <div className={styles.cardCta}>
                              <span>{isCompleted ? (t("reactor-review") || "Review") : (t("reactor-solve") || "Solve")}</span>
                              <ArrowRight className={styles.ctaArrow} />
                            </div>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className={styles.footerActions}>
        <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
          ← {t("challenges-back-to-landing") || "Back to Challenges"}
        </a>
        <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
          {t("challenges-back-hub") || "Developer Hub"}
        </a>
      </div>

      <Footer />
    </main>
  );
}
