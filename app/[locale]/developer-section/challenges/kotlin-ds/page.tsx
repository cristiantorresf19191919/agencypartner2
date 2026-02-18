"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowRight,
  ExpandMore as ExpandIcon,
  EmojiEvents as TrophyIcon,
  School as LearnIcon,
} from "@mui/icons-material";
import { DS_TOPICS, DS_CHALLENGES, getDSChallengesByTopic } from "@/lib/kotlinDSChallengesData";
import type { DSTopic, KotlinDSChallenge } from "@/lib/kotlinDSChallengesData";
import styles from "./KotlinDSList.module.css";
import landingStyles from "../ChallengesLanding.module.css";

export default function KotlinDSChallengesPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(["arrays"]));
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("kotlin-ds-completed");
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch { return new Set(); }
    }
    return new Set();
  });

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const filteredTopics = useMemo(() => {
    return DS_TOPICS.map(topic => {
      const challenges = getDSChallengesByTopic(topic.id).filter(c => {
        const matchesSearch = !searchQuery ||
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = selectedDifficulty === "all" || c.difficulty === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
      });
      return { topic, challenges };
    }).filter(t => t.challenges.length > 0);
  }, [searchQuery, selectedDifficulty]);

  const totalChallenges = DS_CHALLENGES.length;
  const completedCount = completedChallenges.size;
  const progressPercent = totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;

  return (
    <main className={landingStyles.page}>
      <DeveloperHeader />
      <div className={landingStyles.backgroundGlow} />
      <div className={landingStyles.backgroundGrid} />

      {/* Hero */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroBadge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TrophyIcon fontSize="small" />
          <span>Kotlin Data Structures</span>
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Master Data Structures in Kotlin
        </motion.h1>
        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          110 challenges across 10 topics. Learn why each data structure matters, solve real problems, and build deep understanding.
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className={styles.progressCard}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Your Progress</span>
            <span className={styles.progressCount}>{completedCount}/{totalChallenges} completed</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Filters */}
      <section className={styles.filtersSection}>
        <div className={styles.searchBar}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.difficultyFilters}>
          <FilterIcon className={styles.filterIcon} />
          {["all", "Easy", "Medium", "Hard"].map(d => (
            <button
              key={d}
              className={`${styles.filterBtn} ${selectedDifficulty === d ? styles.filterActive : ""}`}
              onClick={() => setSelectedDifficulty(d)}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>
      </section>

      {/* Topics + Challenges */}
      <section className={styles.topicsSection}>
        {filteredTopics.map(({ topic, challenges }, topicIdx) => {
          const topicCompleted = challenges.filter(c => completedChallenges.has(c.id)).length;
          const isExpanded = expandedTopics.has(topic.id);

          return (
            <motion.div
              key={topic.id}
              className={styles.topicCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: topicIdx * 0.05, duration: 0.3 }}
              style={{ "--topic-color": topic.color } as React.CSSProperties}
            >
              <button
                className={styles.topicHeader}
                onClick={() => toggleTopic(topic.id)}
              >
                <div className={styles.topicIcon}>{topic.icon}</div>
                <div className={styles.topicInfo}>
                  <h2 className={styles.topicName}>{topic.name}</h2>
                  <p className={styles.topicDesc}>{topic.description}</p>
                </div>
                <div className={styles.topicMeta}>
                  <span className={styles.topicProgress}>{topicCompleted}/{challenges.length}</span>
                  <ExpandIcon className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ""}`} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className={styles.challengeList}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    {/* Teaching Section */}
                    <div className={styles.topicTeaching}>
                      <LearnIcon className={styles.teachingIcon} />
                      <div>
                        <h4 className={styles.teachingTitle}>Why learn {topic.name}?</h4>
                        <p className={styles.teachingText}>{topic.whyLearn}</p>
                        <p className={styles.teachingUse}><strong>Real-world:</strong> {topic.realWorldUse}</p>
                        <p className={styles.teachingComplexity}><strong>Complexity:</strong> {topic.bigO}</p>
                      </div>
                    </div>

                    {/* Challenge Items */}
                    {challenges.map((challenge, idx) => {
                      const isCompleted = completedChallenges.has(challenge.id);
                      return (
                        <Link
                          key={challenge.id}
                          href={createLocalizedPath(`/developer-section/challenges/kotlin-ds/${challenge.id}`)}
                          className={`${styles.challengeItem} ${isCompleted ? styles.completed : ""}`}
                        >
                          <span className={styles.challengeNumber}>{idx + 1}</span>
                          <div className={styles.challengeInfo}>
                            <span className={styles.challengeTitle}>{challenge.title}</span>
                            <span className={styles.challengeConcept}>{challenge.conceptOverview.slice(0, 80)}...</span>
                          </div>
                          <span className={`${styles.difficulty} ${styles[challenge.difficulty.toLowerCase()]}`}>
                            {challenge.difficulty}
                          </span>
                          <span className={styles.challengeScore}>{challenge.maxScore} pts</span>
                          {isCompleted ? (
                            <CheckIcon className={styles.checkIcon} />
                          ) : (
                            <ArrowRight className={styles.arrowIcon} />
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>

      <div className={landingStyles.footerActions}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <a className={landingStyles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            Back to Challenges
          </a>
          <a className={landingStyles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
