"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Stack, Heading, Text } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion, AnimatePresence } from "framer-motion";
import {
  AutoAwesome as Sparkles,
  Code as Code2,
  ArrowForward as ArrowRight,
  Support as SupportIcon,
  Terminal as TerminalIcon,
  IntegrationInstructions as KotlinIcon,
  EmojiEvents as ChallengesIcon,
  Psychology as ReactIcon,
  PhoneAndroid as AndroidIcon,
  School as SchoolIcon,
  CallMerge as InteropIcon,
  Palette as CssIcon,
  DataObject as TsIcon,
  RecordVoiceOver as SoftSkillsIcon,
  QuestionAnswer as InterviewIcon,
  Storage as BackendIcon,
  Bolt as ReactiveIcon,
  History as HistoryIcon,
  LocalFireDepartment as FireIcon,
  Route as RouteIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Close as CloseIcon,
  NewReleases as NewReleasesIcon,
  Keyboard as KeyboardIcon,
  SportsEsports as GameIcon,
  BugReport as BugIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import HeroSearch from "@/components/Search/HeroSearch";
import Footer from "@/components/Footer/Footer";
import styles from "./DeveloperSection.module.css";

// Card data organized by content type
type ContentCategory = "blog" | "playground" | "course" | "challenge" | "interview" | "game";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";

type TopicTag = "react" | "kotlin" | "typescript" | "css" | "interview" | "android" | "spring" | "general";

interface ContentCard {
  id: string;
  category: ContentCategory;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  ctaKey: string;
  difficulty: DifficultyLevel;
  tags: TopicTag[];
}

// Filter chip definitions
const filterChips: Array<{ id: TopicTag | "all"; labelKey: string }> = [
  { id: "all", labelKey: "hub-filter-all" },
  { id: "react", labelKey: "hub-filter-react" },
  { id: "kotlin", labelKey: "hub-filter-kotlin" },
  { id: "typescript", labelKey: "hub-filter-typescript" },
  { id: "css", labelKey: "hub-filter-css" },
  { id: "interview", labelKey: "hub-filter-interview" },
];

// Grouped content: Blog (articles) | Playgrounds | Courses | Challenges | Interview Prep
const contentGroups: Array<{
  id: ContentCategory;
  sectionKey: string;
  cards: ContentCard[];
}> = [
  {
    id: "blog",
    sectionKey: "hub-section-blog",
    cards: [
      {
        id: "blog",
        category: "blog",
        href: "/developer-section/blog",
        icon: Code2,
        titleKey: "nav-blog",
        descKey: "nav-blog-desc",
        ctaKey: "explore-blog",
        difficulty: "beginner",
        tags: ["general"],
      },
    ],
  },
  {
    id: "playground",
    sectionKey: "hub-section-playgrounds",
    cards: [
      {
        id: "playground",
        category: "playground",
        href: "/developer-section/playground",
        icon: TerminalIcon,
        titleKey: "live-code-lab-title",
        descKey: "live-code-lab-desc",
        ctaKey: "open-playground",
        difficulty: "beginner",
        tags: ["react", "typescript"],
      },
      {
        id: "kotlin-playground",
        category: "playground",
        href: "/developer-section/kotlin-playground",
        icon: KotlinIcon,
        titleKey: "kotlin-playground-title",
        descKey: "kotlin-playground-desc",
        ctaKey: "open-kotlin",
        difficulty: "beginner",
        tags: ["kotlin"],
      },
    ],
  },
  {
    id: "course",
    sectionKey: "hub-section-courses",
    cards: [
      {
        id: "kotlin-course",
        category: "course",
        href: "/developer-section/kotlin-course",
        icon: SchoolIcon,
        titleKey: "kotlin-course-card-title",
        descKey: "kotlin-course-card-desc",
        ctaKey: "start-course",
        difficulty: "intermediate",
        tags: ["kotlin"],
      },
      {
        id: "kotlin-java-interop",
        category: "course",
        href: "/developer-section/kotlin-java-interop",
        icon: InteropIcon,
        titleKey: "kotlin-java-interop-card-title",
        descKey: "kotlin-java-interop-card-desc",
        ctaKey: "start-course",
        difficulty: "intermediate",
        tags: ["kotlin"],
      },
      {
        id: "react-course",
        category: "course",
        href: "/developer-section/react-course",
        icon: ReactIcon,
        titleKey: "react-course-card-title",
        descKey: "react-course-card-desc",
        ctaKey: "start-course",
        difficulty: "beginner",
        tags: ["react"],
      },
      {
        id: "typescript-course",
        category: "course",
        href: "/developer-section/typescript-course",
        icon: TsIcon,
        titleKey: "typescript-course-card-title",
        descKey: "typescript-course-card-desc",
        ctaKey: "start-course",
        difficulty: "beginner",
        tags: ["typescript"],
      },
      {
        id: "css-course",
        category: "course",
        href: "/developer-section/css-course",
        icon: CssIcon,
        titleKey: "css-course-card-title",
        descKey: "css-course-card-desc",
        ctaKey: "start-course",
        difficulty: "beginner",
        tags: ["css"],
      },
      {
        id: "android-kotlin",
        category: "course",
        href: "/developer-section/android-kotlin",
        icon: AndroidIcon,
        titleKey: "android-playbook-card-title",
        descKey: "android-playbook-card-desc",
        ctaKey: "start-learning",
        difficulty: "intermediate",
        tags: ["kotlin", "android"],
      },
      {
        id: "spring-reactive",
        category: "course",
        href: "/developer-section/blog/spring-reactive-programming",
        icon: ReactiveIcon,
        titleKey: "spring-reactive-card-title",
        descKey: "spring-reactive-card-desc",
        ctaKey: "start-course",
        difficulty: "advanced",
        tags: ["kotlin", "spring"],
      },
      {
        id: "reactor-flux",
        category: "course",
        href: "/developer-section/reactor-flux",
        icon: ReactiveIcon,
        titleKey: "reactor-flux-card-title",
        descKey: "reactor-flux-card-desc",
        ctaKey: "start-course",
        difficulty: "advanced",
        tags: ["kotlin", "spring"],
      },
    ],
  },
  {
    id: "challenge",
    sectionKey: "hub-section-challenges",
    cards: [
      {
        id: "challenges",
        category: "challenge",
        href: "/developer-section/challenges",
        icon: ChallengesIcon,
        titleKey: "coding-challenges-card-title",
        descKey: "coding-challenges-card-desc",
        ctaKey: "start-challenges",
        difficulty: "intermediate",
        tags: ["typescript", "react"],
      },
      {
        id: "react-challenges",
        category: "challenge",
        href: "/developer-section/react-challenges",
        icon: ReactIcon,
        titleKey: "react-challenges-card-title",
        descKey: "react-challenges-card-desc",
        ctaKey: "solve-react-challenges",
        difficulty: "advanced",
        tags: ["react"],
      },
    ],
  },
  {
    id: "interview",
    sectionKey: "hub-section-interviews",
    cards: [
      {
        id: "react-interview",
        category: "interview",
        href: "/developer-section/react-interview",
        icon: InterviewIcon,
        titleKey: "react-interview-card-title",
        descKey: "react-interview-card-desc",
        ctaKey: "practice-interviews",
        difficulty: "intermediate",
        tags: ["react", "interview"],
      },
      {
        id: "soft-skills-interview",
        category: "interview",
        href: "/developer-section/soft-skills-interview",
        icon: SoftSkillsIcon,
        titleKey: "soft-skills-interview-card-title",
        descKey: "soft-skills-interview-card-desc",
        ctaKey: "practice-soft-skills",
        difficulty: "beginner",
        tags: ["interview"],
      },
      {
        id: "backend-interview",
        category: "interview",
        href: "/developer-section/backend-interview",
        icon: BackendIcon,
        titleKey: "backend-interview-card-title",
        descKey: "backend-interview-card-desc",
        ctaKey: "practice-backend",
        difficulty: "advanced",
        tags: ["kotlin", "spring", "interview"],
      },
    ],
  },
  {
    id: "game",
    sectionKey: "hub-section-games",
    cards: [
      {
        id: "reactor-game",
        category: "game",
        href: "/developer-section/reactor-game",
        icon: GameIcon,
        titleKey: "reactor-game-card-title",
        descKey: "reactor-game-card-desc",
        ctaKey: "reactor-game-card-cta",
        difficulty: "beginner",
        tags: ["kotlin", "spring"],
      },
      {
        id: "react19-game",
        category: "game",
        href: "/developer-section/react19-game",
        icon: BugIcon,
        titleKey: "react19-game-card-title",
        descKey: "react19-game-card-desc",
        ctaKey: "react19-game-card-cta",
        difficulty: "beginner",
        tags: ["react"],
      },
    ],
  },
];

// All cards flat for lookups
const allCards = contentGroups.flatMap((g) => g.cards);

// Learning paths definitions
const learningPaths = [
  {
    id: "frontend",
    emoji: "⚛️",
    titleKey: "hub-path-frontend-title",
    descKey: "hub-path-frontend-desc",
    className: "pathFrontend",
    cardIds: ["react-course", "typescript-course", "css-course", "react-challenges", "react-interview"],
  },
  {
    id: "kotlin",
    emoji: "🚀",
    titleKey: "hub-path-kotlin-title",
    descKey: "hub-path-kotlin-desc",
    className: "pathKotlin",
    cardIds: ["kotlin-course", "kotlin-java-interop", "android-kotlin", "spring-reactive", "reactor-flux"],
  },
  {
    id: "interview",
    emoji: "💼",
    titleKey: "hub-path-interview-title",
    descKey: "hub-path-interview-desc",
    className: "pathInterview",
    cardIds: ["react-interview", "soft-skills-interview", "backend-interview", "challenges"],
  },
];

// Changelog data for "What's New" banner
const CHANGELOG_VERSION = "2026-02-v2";
const changelogItems = [
  { emoji: "🎯", textKey: "hub-changelog-filters" },
  { emoji: "⌨️", textKey: "hub-changelog-shortcuts" },
  { emoji: "📊", textKey: "hub-changelog-stats" },
];

// localStorage helpers
const RECENTLY_VISITED_KEY = "dev-hub-recent";
const STREAK_KEY = "dev-hub-streak";
const CHANGELOG_DISMISSED_KEY = "dev-hub-changelog-dismissed";
const MAX_RECENT = 3;

function getRecentlyVisited(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VISITED_KEY) || "[]");
  } catch {
    return [];
  }
}

function trackVisit(cardId: string) {
  const recent = getRecentlyVisited().filter((id) => id !== cardId);
  recent.unshift(cardId);
  localStorage.setItem(RECENTLY_VISITED_KEY, JSON.stringify(recent.slice(0, 10)));
}

function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (data.lastDate === today) return data.count || 1;
    if (data.lastDate === yesterday) {
      const newCount = (data.count || 0) + 1;
      localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count: newCount }));
      return newCount;
    }
    // Streak broken
    localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count: 1 }));
    return 1;
  } catch {
    return 1;
  }
}

export default function DeveloperSectionPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [activeFilter, setActiveFilter] = useState<TopicTag | "all">("all");
  const [showChangelog, setShowChangelog] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentIds(getRecentlyVisited().slice(0, MAX_RECENT));
    setStreak(getStreak());

    // Check if changelog was dismissed
    try {
      const dismissed = localStorage.getItem(CHANGELOG_DISMISSED_KEY);
      if (dismissed !== CHANGELOG_VERSION) {
        setShowChangelog(true);
      }
    } catch { /* noop */ }
  }, []);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcuts (? key to toggle overlay)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "?") {
        setShowShortcuts((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
      }
      // Quick filters: 1-6 keys
      if (e.key >= "1" && e.key <= "6" && !e.metaKey && !e.ctrlKey) {
        const filterIndex = parseInt(e.key) - 1;
        if (filterIndex < filterChips.length) {
          setActiveFilter(filterChips[filterIndex].id);
        }
      }
      // Home key: scroll to top
      if (e.key === "Home" && !e.metaKey && !e.ctrlKey) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDismissChangelog = useCallback(() => {
    setShowChangelog(false);
    try {
      localStorage.setItem(CHANGELOG_DISMISSED_KEY, CHANGELOG_VERSION);
    } catch { /* noop */ }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCardClick = useCallback(
    (cardId: string) => {
      trackVisit(cardId);
    },
    []
  );

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.removeProperty("--mouse-x");
    e.currentTarget.style.removeProperty("--mouse-y");
  }, []);

  const recentCards = recentIds
    .map((id) => allCards.find((c) => c.id === id))
    .filter(Boolean) as ContentCard[];

  const totalResources = allCards.length;
  const totalCourses = contentGroups.find((g) => g.id === "course")?.cards.length || 0;
  const totalChallenges = contentGroups.find((g) => g.id === "challenge")?.cards.length || 0;

  // Filter logic — when a filter is active, only show cards matching the tag
  const filteredGroups = contentGroups.map((group) => ({
    ...group,
    cards: activeFilter === "all"
      ? group.cards
      : group.cards.filter((card) => card.tags.includes(activeFilter as TopicTag)),
  })).filter((group) => group.cards.length > 0);

  const difficultyKey = (level: DifficultyLevel) =>
    level === "beginner"
      ? "hub-level-beginner"
      : level === "intermediate"
      ? "hub-level-intermediate"
      : "hub-level-advanced";

  const shortcutsList = [
    { keys: "?", descKey: "hub-shortcut-toggle" },
    { keys: "1–6", descKey: "hub-shortcut-filters" },
    { keys: "Esc", descKey: "hub-shortcut-close" },
    { keys: "Home", descKey: "hub-shortcut-top" },
  ];

  return (
    <main>
      <DeveloperHeader />
      <div className={styles.developerSection}>
        {/* Background Effects */}
        <div className={styles.backgroundEffects}>
          <div className={styles.radialGradient} />
          <div className={styles.blurGradient} />
          <div className={styles.gridPattern} />
        </div>

        <div className={styles.content}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.headerSection}
          >
            <div className={styles.pill}>
              <Sparkles className={styles.pillIcon} />
              <span>{t("dev-hub-pill")}</span>
            </div>

            <Heading className={styles.title}>
              {t("developer-section-title")}
            </Heading>

            <Text className={styles.subtitle}>
              {t("developer-section-subtitle")}
            </Text>

            <div className={styles.heroSearchWrapper}>
              <HeroSearch />
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className={styles.statsBar}
          >
            <div className={styles.statItem}>
              <span className={styles.statIcon}>📚</span>
              <span className={styles.statValue}>{totalResources}</span>
              <span className={styles.statLabel}>{t("hub-stats-resources")}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🎓</span>
              <span className={styles.statValue}>{totalCourses}</span>
              <span className={styles.statLabel}>{t("hub-stats-courses")}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🏆</span>
              <span className={styles.statValue}>{totalChallenges}</span>
              <span className={styles.statLabel}>{t("hub-stats-challenges")}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🔥</span>
              <span className={styles.statValue}>{streak}</span>
              <span className={styles.statLabel}>
                {t("hub-stats-streak")} ({t("hub-stats-days")})
              </span>
            </div>
          </motion.div>

          {/* What's New Changelog Banner */}
          <AnimatePresence>
            {showChangelog && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.35 }}
                className={styles.changelogBanner}
              >
                <div className={styles.changelogContent}>
                  <div className={styles.changelogLeft}>
                    <NewReleasesIcon className={styles.changelogIcon} />
                    <span className={styles.changelogTitle}>{t("hub-changelog-title")}</span>
                  </div>
                  <div className={styles.changelogItems}>
                    {changelogItems.map((item) => (
                      <span key={item.textKey} className={styles.changelogItem}>
                        <span>{item.emoji}</span>
                        <span>{t(item.textKey)}</span>
                      </span>
                    ))}
                  </div>
                  <button
                    className={styles.changelogClose}
                    onClick={handleDismissChangelog}
                    aria-label="Dismiss"
                  >
                    <CloseIcon className={styles.changelogCloseIcon} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Topic Filter Chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={styles.filterBar}
          >
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                className={`${styles.filterChip} ${activeFilter === chip.id ? styles.filterChipActive : ""}`}
                onClick={() => setActiveFilter(chip.id)}
              >
                {t(chip.labelKey)}
              </button>
            ))}
          </motion.div>

          {/* Continue Learning */}
          <AnimatePresence>
            {recentCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className={styles.continueLearning}
              >
                <div className={styles.continueHeader}>
                  <HistoryIcon className={styles.continueIcon} />
                  <h2 className={styles.continueTitle}>{t("hub-continue-learning")}</h2>
                </div>
                <div className={styles.continueGrid}>
                  {recentCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.a
                        key={card.id}
                        href={createLocalizedPath(card.href)}
                        className={styles.continueCard}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className={styles.continueCardIcon}>
                          <Icon />
                        </div>
                        <div className={styles.continueCardInfo}>
                          <div className={styles.continueCardTitle}>{t(card.titleKey)}</div>
                          <div className={styles.continueCardSub}>{t("hub-recently-visited")}</div>
                        </div>
                        <ArrowRight className={styles.continueCardArrow} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Sections: Blog | Playgrounds | Courses | Challenges | Interview Prep */}
          <div className={styles.contentSections} ref={contentRef}>
            {filteredGroups.map((group, groupIndex) => (
              <motion.section
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + groupIndex * 0.08, duration: 0.5 }}
                className={styles.contentSection}
              >
                <h2 className={styles.sectionTitle}>{t(group.sectionKey)}</h2>
                <div className={styles.navGrid}>
                  {group.cards.map((card, cardIndex) => {
                    const Icon = card.icon;
                    return (
                      <motion.a
                        key={card.id}
                        href={createLocalizedPath(card.href)}
                        className={styles.blogCard}
                        data-category={card.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.15 + groupIndex * 0.08 + cardIndex * 0.03,
                          duration: 0.4,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className={styles.glowEffect} />

                        {/* Difficulty Badge */}
                        <span
                          className={`${styles.difficultyBadge} ${styles[card.difficulty]}`}
                        >
                          {t(difficultyKey(card.difficulty))}
                        </span>

                        <div className={styles.cardContent}>
                          <div className={styles.iconContainer}>
                            <Icon className={styles.icon} />
                          </div>

                          <Heading level={2} className={styles.cardTitle}>
                            {t(card.titleKey)}
                          </Heading>

                          <Text className={styles.cardDescription}>
                            {t(card.descKey)}
                          </Text>

                          <div className={styles.ctaLink}>
                            <span>{t(card.ctaKey)}</span>
                            <ArrowRight className={styles.ctaArrow} />
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Learning Paths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className={styles.learningPaths}
          >
            <div className={styles.pathsHeader}>
              <h2 className={styles.pathsTitle}>{t("hub-paths-title")}</h2>
              <p className={styles.pathsSubtitle}>{t("hub-paths-subtitle")}</p>
            </div>
            <div className={styles.pathsGrid}>
              {learningPaths.map((path) => (
                <motion.a
                  key={path.id}
                  href={createLocalizedPath(
                    allCards.find((c) => c.id === path.cardIds[0])?.href || "/developer-section"
                  )}
                  className={`${styles.pathCard} ${styles[path.className]}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(path.cardIds[0])}
                >
                  <span className={styles.pathEmoji}>{path.emoji}</span>
                  <h3 className={styles.pathName}>{t(path.titleKey)}</h3>
                  <p className={styles.pathDesc}>{t(path.descKey)}</p>
                  <div className={styles.pathMeta}>
                    <span className={styles.pathCount}>
                      {path.cardIds.length} {t("hub-path-items")}
                    </span>
                    <span className={styles.pathCta}>
                      {t("hub-path-start")}
                      <ArrowRight className={styles.pathCtaArrow} />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={styles.helpSection}
          >
            <motion.a
              href={createLocalizedPath("/asesorias")}
              className={styles.helpCard}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.helpGlowEffect} />
              <div className={styles.helpContent}>
                <div className={styles.helpIconContainer}>
                  <SupportIcon className={styles.helpIcon} />
                </div>

                <Heading level={2} className={styles.helpTitle}>
                  {t("developer-section-need-help-title")}
                </Heading>

                <Text className={styles.helpDescription}>
                  {t("developer-section-need-help-desc")}
                </Text>

                <div className={styles.helpCtaLink}>
                  <span>{t("developer-section-need-help-cta")}</span>
                  <ArrowRight className={styles.helpCtaArrow} />
                </div>
              </div>
            </motion.a>
          </motion.div>
        </div>

        {/* Keyboard Shortcuts Floating Button */}
        <button
          className={styles.shortcutsBtn}
          onClick={() => setShowShortcuts((prev) => !prev)}
          aria-label={t("hub-shortcuts-label")}
          title={t("hub-shortcuts-label")}
        >
          <KeyboardIcon className={styles.shortcutsBtnIcon} />
        </button>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className={styles.scrollTopBtn}
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUpIcon className={styles.scrollTopIcon} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Overlay */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.shortcutsOverlay}
              onClick={() => setShowShortcuts(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className={styles.shortcutsModal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.shortcutsHeader}>
                  <KeyboardIcon className={styles.shortcutsHeaderIcon} />
                  <h3 className={styles.shortcutsTitle}>{t("hub-shortcuts-title")}</h3>
                  <button
                    className={styles.shortcutsClose}
                    onClick={() => setShowShortcuts(false)}
                  >
                    <CloseIcon className={styles.shortcutsCloseIcon} />
                  </button>
                </div>
                <div className={styles.shortcutsList}>
                  {shortcutsList.map((item) => (
                    <div key={item.keys} className={styles.shortcutRow}>
                      <kbd className={styles.shortcutKbd}>{item.keys}</kbd>
                      <span className={styles.shortcutDesc}>{t(item.descKey)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
