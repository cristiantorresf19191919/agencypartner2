"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { REACT19_LESSONS } from "@/lib/react19InterviewData";
import { getReact19LessonForLocale } from "@/lib/reactInterviewTranslations";
import {
  REACT_INTERVIEW_CATEGORIES,
  REACT_INTERVIEW_QUESTIONS,
  type ReactInterviewCategoryId,
} from "@/lib/reactInterviewQuestionsData";
import { getStore } from "@/lib/devHubStore";
import { getDueIds } from "@/lib/spacedRepetition";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  Code as CodeIcon,
  ArrowForward as ArrowRight,
  School as SchoolIcon,
  Search as SearchIcon,
  AutoAwesome as SparkleIcon,
  LibraryBooks as LibraryIcon,
} from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

function React19FeaturesShowcase({ t }: { t: (key: string) => string }) {
  return (
    <div className={styles.react19Showcase}>
      <h2 className={styles.showcaseTitle}>
        {t("react-interview-showcase-title-pre")}{" "}
        <span className={styles.gradient}>{t("react-interview-showcase-title-gradient")}</span>
      </h2>
      <p className={styles.showcaseSubtitle}>{t("react-interview-showcase-subtitle")}</p>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.lightning}`}>&#9889;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-1-title")}</h3>
          </div>
          <p className={styles.featureDesc}>{t("react-interview-feature-1-desc")}</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.check}`}>&#10003;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-2-title")}</h3>
          </div>
          <p className={styles.featureDesc}>{t("react-interview-feature-2-desc")}</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.eye}`}>&#9737;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-3-title")}</h3>
          </div>
          <p className={styles.featureDesc}>{t("react-interview-feature-3-desc")}</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.bolt}`}>&#8635;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-4-title")}</h3>
          </div>
          <p className={styles.featureDesc}>{t("react-interview-feature-4-desc")}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReactInterviewLandingPage() {
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const localizedLessons = REACT19_LESSONS.map((lesson) => {
    const translated = getReact19LessonForLocale(locale, lesson.id);
    return translated ?? lesson;
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ReactInterviewCategoryId | "all">(
    "core",
  );
  const deferredSearch = useDeferredValue(search);

  const filteredQuestions = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    return REACT_INTERVIEW_QUESTIONS.filter((q) => {
      if (activeCategory !== "all" && q.category !== activeCategory) return false;
      if (term && !q.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [deferredSearch, activeCategory]);

  const store = getStore();
  const dueIds = getDueIds(store.interviewSR);
  const due19Ids = dueIds
    .filter((id) => id.startsWith("react-interview-") && !id.startsWith("react-interview-q-"))
    .map((id) => id.replace("react-interview-", ""));
  const dueClassicSlugs = dueIds
    .filter((id) => id.startsWith("react-interview-q-"))
    .map((id) => id.replace("react-interview-q-", ""));
  const dueLessons = localizedLessons.filter((l) => due19Ids.includes(l.id));
  const dueQuestions = REACT_INTERVIEW_QUESTIONS.filter((q) =>
    dueClassicSlugs.includes(q.slug),
  );

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("react-interview-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("react-interview-page-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("react-interview-page-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" /> React 19
          </span>
          <span className={styles.badge}>
            {REACT19_LESSONS.length} {t("react-interview-lessons-count").toLowerCase()}
          </span>
          <span className={styles.badge}>
            {REACT_INTERVIEW_QUESTIONS.length} {t("react-interview-questions-count")}
          </span>
        </div>
      </section>

      {/* Due review banner (combined) */}
      {(dueLessons.length > 0 || dueQuestions.length > 0) && (
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 24px" }}>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#fbbf24",
              marginBottom: 12,
            }}
          >
            🔄 {t("sr-due-title")} ({dueLessons.length + dueQuestions.length})
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 10,
            }}
          >
            {dueLessons.map((l) => (
              <Link
                key={`19-${l.id}`}
                href={createLocalizedPath(`/developer-section/react-interview/${l.id}`)}
                style={dueLinkStyle}
              >
                ⚡ {l.title}
              </Link>
            ))}
            {dueQuestions.map((q) => (
              <Link
                key={`q-${q.slug}`}
                href={createLocalizedPath(`/developer-section/react-interview/q/${q.slug}`)}
                style={dueLinkStyle}
              >
                📘 {q.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============== TRACK 1: REACT 19 ============== */}
      <section style={sectionWrap}>
        <div style={trackHeader}>
          <span style={trackIconBubble}>
            <SparkleIcon style={{ color: "#7cf4ff" }} />
          </span>
          <div>
            <h2 style={trackTitleStyle}>{t("react-interview-section-react19-title")}</h2>
            <p style={trackDescStyle}>{t("react-interview-section-react19-desc")}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <React19FeaturesShowcase t={t} />
        </motion.div>

        <ul className={styles.grid} style={{ marginTop: 28 }}>
          {localizedLessons.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/react-interview/${lesson.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.difficulty}
                    style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}
                  >
                    {t("react-interview-lesson-label")} {lesson.lessonNumber}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{lesson.title}</h3>
                <p className={styles.cardCategory} style={{ fontSize: 13, color: "#9fc4ff" }}>
                  {lesson.concept}
                </p>
                <p
                  className={styles.cardCategory}
                  style={{ fontSize: 12, color: "#7cf4ff", marginTop: 8 }}
                >
                  {lesson.description.substring(0, 120)}...
                </p>
                <div className={styles.cardCta}>
                  <span>{t("react-interview-start-lesson")}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ============== TRACK 2: CLASSIC Q&A ============== */}
      <section style={sectionWrap}>
        <div style={trackHeader}>
          <span style={{ ...trackIconBubble, background: "rgba(167, 107, 249, 0.12)" }}>
            <LibraryIcon style={{ color: "#c4a1ff" }} />
          </span>
          <div>
            <h2 style={trackTitleStyle}>{t("react-interview-section-classic-title")}</h2>
            <p style={trackDescStyle}>{t("react-interview-section-classic-desc")}</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 520, margin: "20px auto 16px" }}>
          <SearchIcon
            fontSize="small"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("react-interview-search-placeholder")}
            aria-label={t("react-interview-search-placeholder")}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: 10,
              border: "1px solid rgba(124, 244, 255, 0.25)",
              background: "rgba(11, 16, 32, 0.6)",
              color: "white",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        {/* Category filter chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <FilterChip
            label={`${t("react-interview-filter-all")} (${REACT_INTERVIEW_QUESTIONS.length})`}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {REACT_INTERVIEW_CATEGORIES.filter((c) => c.count > 0).map((c) => (
            <FilterChip
              key={c.id}
              label={`${c.label} (${c.count})`}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
            />
          ))}
        </div>

        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>
            {activeCategory === "all"
              ? t("react-interview-filter-all")
              : REACT_INTERVIEW_CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </span>
          <span className={styles.count}>
            {filteredQuestions.length} {t("react-interview-questions-count")}
          </span>
        </div>

        {filteredQuestions.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: 40,
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 14,
            }}
          >
            {t("react-interview-no-results")}
          </p>
        ) : (
          <ul className={styles.grid}>
            {filteredQuestions.map((q, i) => (
              <motion.li
                key={q.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.01, 0.3), duration: 0.3 }}
              >
                <Link
                  href={createLocalizedPath(
                    `/developer-section/react-interview/q/${q.slug}`,
                  )}
                  className={styles.card}
                >
                  <div className={styles.cardTop}>
                    <span
                      className={styles.difficulty}
                      style={{
                        background: "rgba(167, 107, 249, 0.18)",
                        color: "#c4a1ff",
                      }}
                    >
                      {REACT_INTERVIEW_CATEGORIES.find((c) => c.id === q.category)?.label}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.4)" }}>
                      #{q.num}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle} style={{ fontSize: "1rem", lineHeight: 1.3 }}>
                    {q.title}
                  </h3>
                  <div className={styles.cardCta}>
                    <span>{t("react-interview-view-answer")}</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/challenges")}
          >
            {t("algorithm-challenges-link")}
          </a>
          <a
            className={styles.secondaryLink}
            href={createLocalizedPath("/developer-section/react-challenges")}
          >
            {t("react-challenges-link")}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t("back-to-dev-hub")}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        border: active
          ? "1px solid rgba(167, 107, 249, 0.6)"
          : "1px solid rgba(255, 255, 255, 0.12)",
        background: active ? "rgba(167, 107, 249, 0.15)" : "rgba(255, 255, 255, 0.04)",
        color: active ? "#c4a1ff" : "rgba(255, 255, 255, 0.75)",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

const sectionWrap: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "48px 24px",
};

const trackHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 16,
  marginBottom: 8,
};

const trackIconBubble: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "rgba(124, 244, 255, 0.12)",
  flexShrink: 0,
};

const trackTitleStyle: React.CSSProperties = {
  fontSize: "clamp(1.3rem, 2.4vw, 1.8rem)",
  fontWeight: 700,
  color: "white",
  margin: 0,
  lineHeight: 1.2,
};

const trackDescStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255, 255, 255, 0.65)",
  margin: "6px 0 0",
  maxWidth: 720,
  lineHeight: 1.5,
};

const dueLinkStyle: React.CSSProperties = {
  padding: "12px 16px",
  background: "rgba(251, 191, 36, 0.08)",
  border: "1px solid rgba(251, 191, 36, 0.2)",
  borderRadius: 8,
  color: "white",
  fontSize: "0.85rem",
  textDecoration: "none",
};
