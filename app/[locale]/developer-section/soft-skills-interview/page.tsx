"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SOFT_SKILLS_QUESTIONS,
  type SoftSkillCategory,
  type SoftSkillDifficulty,
  getCategoryLabel,
  getDifficultyLabel,
  shuffleQuestions,
} from "@/lib/softSkillsInterviewData";
import { getStore } from "@/lib/devHubStore";
import { getDueIds } from "@/lib/spacedRepetition";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  RecordVoiceOver as SoftSkillsIcon,
  ArrowForward as ArrowRight,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Shuffle as ShuffleIcon,
  PlayCircleOutline as PlayIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../challenges/ChallengesPage.module.css";

const CATEGORIES: SoftSkillCategory[] = [
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Leadership",
  "Adaptability",
  "Conflict Resolution",
  "Time Management",
  "Growth Mindset",
  "Culture Fit",
  "Career & Recruiter",
];

const DIFFICULTIES: SoftSkillDifficulty[] = ["Junior", "Mid", "Senior"];

const CATEGORY_COLORS: Record<SoftSkillCategory, { bg: string; color: string }> = {
  Communication: { bg: "rgba(96, 165, 250, 0.2)", color: "#60a5fa" },
  Teamwork: { bg: "rgba(74, 222, 128, 0.2)", color: "#4ade80" },
  "Problem Solving": { bg: "rgba(251, 146, 60, 0.2)", color: "#fb923c" },
  Leadership: { bg: "rgba(168, 85, 247, 0.2)", color: "#a855f7" },
  Adaptability: { bg: "rgba(103, 232, 249, 0.2)", color: "#67e8f9" },
  "Conflict Resolution": { bg: "rgba(244, 114, 182, 0.2)", color: "#f472b6" },
  "Time Management": { bg: "rgba(250, 204, 21, 0.2)", color: "#facc15" },
  "Growth Mindset": { bg: "rgba(34, 211, 238, 0.2)", color: "#22d3ee" },
  "Culture Fit": { bg: "rgba(236, 72, 153, 0.2)", color: "#ec4899" },
  "Career & Recruiter": { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" },
};

const DIFFICULTY_COLORS: Record<SoftSkillDifficulty, { bg: string; color: string }> = {
  Junior: { bg: "rgba(74, 222, 128, 0.15)", color: "#4ade80" },
  Mid: { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" },
  Senior: { bg: "rgba(168, 85, 247, 0.15)", color: "#a855f7" },
};

export default function SoftSkillsInterviewPage() {
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<SoftSkillCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<SoftSkillDifficulty | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const store = getStore();
  const dueIds = getDueIds(store.interviewSR)
    .filter((id) => id.startsWith("soft-skills-"))
    .map((id) => id.replace("soft-skills-", ""));
  const dueQuestions = SOFT_SKILLS_QUESTIONS.filter((q) => dueIds.includes(q.id));

  const filteredQuestions = useMemo(() => {
    let result = SOFT_SKILLS_QUESTIONS;
    if (selectedCategory !== "all") {
      result = result.filter((q) => q.category === selectedCategory);
    }
    if (selectedDifficulty !== "all") {
      result = result.filter((q) => q.difficulty === selectedDifficulty);
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (q) =>
          q.title[language].toLowerCase().includes(query) ||
          q.question[language].toLowerCase().includes(query) ||
          getCategoryLabel(q.category, language).toLowerCase().includes(query),
      );
    }
    return result;
  }, [selectedCategory, selectedDifficulty, searchQuery, language]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: SOFT_SKILLS_QUESTIONS.length };
    CATEGORIES.forEach((cat) => {
      stats[cat] = SOFT_SKILLS_QUESTIONS.filter((q) => q.category === cat).length;
    });
    return stats;
  }, []);

  const handleRandomQuestion = () => {
    const pool = filteredQuestions.length > 0 ? filteredQuestions : SOFT_SKILLS_QUESTIONS;
    const random = pool[Math.floor(Math.random() * pool.length)];
    router.push(createLocalizedPath(`/developer-section/soft-skills-interview/${random.id}`));
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSearchQuery("");
  };

  const es = language === "es";

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SoftSkillsIcon fontSize="small" />
          <span>{es ? "Entrevistas Conductuales" : "Behavioral Interviews"}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {es ? "Preguntas de Soft Skills" : "Soft Skills Questions"}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {es
            ? "60 preguntas de entrevista conductual grabadas con ojos de reclutador. Frameworks STAR, respuestas de muestra, errores comunes y preguntas de seguimiento. Totalmente bilingüe."
            : "60 recruiter-grade behavioral interview questions with STAR frameworks, sample answers, common mistakes, and follow-ups. Fully bilingual."}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <SoftSkillsIcon fontSize="small" />
            {SOFT_SKILLS_QUESTIONS.length} {es ? "Preguntas" : "Questions"}
          </span>
          <span className={styles.badge}>
            {CATEGORIES.length} {es ? "Categorías" : "Categories"}
          </span>
          <span className={styles.badge}>STAR Framework</span>
          <span className={styles.badge}>{es ? "Bilingüe EN/ES" : "Bilingual EN/ES"}</span>
        </div>

        {/* Interactive CTA row */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          <Link
            href={createLocalizedPath("/developer-section/soft-skills-interview/mock-interview")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2))",
              border: "1px solid rgba(167, 139, 250, 0.4)",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            <PlayIcon fontSize="small" />
            {es ? "Modo Entrevista Simulada" : "Mock Interview Mode"}
          </Link>
          <button
            type="button"
            onClick={handleRandomQuestion}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <ShuffleIcon fontSize="small" />
            {es ? "Pregunta Aleatoria" : "Random Question"}
          </button>
        </div>
      </section>

      {/* Search + Filters */}
      <section className={styles.listSection}>
        {/* Search */}
        <div
          style={{
            position: "relative",
            marginBottom: "1rem",
            maxWidth: "640px",
          }}
        >
          <SearchIcon
            fontSize="small"
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={es ? "Buscar preguntas, categorías..." : "Search questions, categories..."}
            aria-label={es ? "Buscar" : "Search"}
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem 0.625rem 2.5rem",
              borderRadius: "0.625rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.03)",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div className={styles.filterBar} style={{ flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span className={styles.filterLabel}>
            {es ? "Nivel" : "Level"}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginLeft: "auto" }}>
            <button
              type="button"
              onClick={() => setSelectedDifficulty("all")}
              style={difficultyBtnStyle(selectedDifficulty === "all")}
            >
              {es ? "Todos" : "All"}
            </button>
            {DIFFICULTIES.map((d) => {
              const colors = DIFFICULTY_COLORS[d];
              const isActive = selectedDifficulty === d;
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  style={{
                    ...difficultyBtnStyle(isActive),
                    borderColor: isActive ? colors.color + "80" : "rgba(255, 255, 255, 0.1)",
                    background: isActive ? colors.bg : "rgba(255, 255, 255, 0.03)",
                    color: isActive ? colors.color : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {getDifficultyLabel(d, language)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className={styles.filterBar} style={{ flexWrap: "wrap", gap: "0.5rem" }}>
          <span className={styles.filterLabel}>
            <FilterIcon fontSize="small" style={{ marginRight: "0.5rem" }} />
            {es ? "Categoría" : "Category"}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginLeft: "auto" }}>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              style={categoryBtnStyle(selectedCategory === "all")}
            >
              {es ? "Todas" : "All"} ({categoryStats.all})
            </button>
            {CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat];
              const isActive = selectedCategory === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...categoryBtnStyle(isActive),
                    borderColor: isActive ? colors.color + "80" : "rgba(255, 255, 255, 0.1)",
                    background: isActive ? colors.bg : "rgba(255, 255, 255, 0.03)",
                    color: isActive ? colors.color : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {getCategoryLabel(cat, language)} ({categoryStats[cat]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Result counter + reset */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "1rem 0",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.875rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span>
            {es
              ? `Mostrando ${filteredQuestions.length} de ${SOFT_SKILLS_QUESTIONS.length} preguntas`
              : `Showing ${filteredQuestions.length} of ${SOFT_SKILLS_QUESTIONS.length} questions`}
          </span>
          {(selectedCategory !== "all" || selectedDifficulty !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.25rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {es ? "Limpiar filtros" : "Reset filters"}
            </button>
          )}
        </div>

        {dueQuestions.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fbbf24", marginBottom: "12px" }}>
              🔄 {t("sr-due-title")} ({dueQuestions.length})
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "10px",
              }}
            >
              {dueQuestions.map((q) => (
                <Link
                  key={q.id}
                  href={createLocalizedPath(`/developer-section/soft-skills-interview/${q.id}`)}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(251, 191, 36, 0.08)",
                    border: "1px solid rgba(251, 191, 36, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  {q.question[language]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredQuestions.length === 0 ? (
          <div
            style={{
              padding: "3rem 1rem",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            {es
              ? "No se encontraron preguntas con los filtros actuales."
              : "No questions match the current filters."}
          </div>
        ) : (
          <ul className={styles.grid}>
            {filteredQuestions.map((question, i) => {
              const catColors = CATEGORY_COLORS[question.category];
              const diffColors = DIFFICULTY_COLORS[question.difficulty];
              return (
                <motion.li
                  key={question.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.3 }}
                >
                  <Link
                    href={createLocalizedPath(`/developer-section/soft-skills-interview/${question.id}`)}
                    className={styles.card}
                  >
                    <div className={styles.cardTop}>
                      <span
                        className={styles.difficulty}
                        style={{ background: catColors.bg, color: catColors.color }}
                      >
                        {getCategoryLabel(question.category, language)}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>
                        #{question.questionNumber}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle} style={{ fontSize: "1rem", lineHeight: 1.4 }}>
                      {question.title[language]}
                    </h3>
                    <p
                      className={styles.cardCategory}
                      style={{
                        fontSize: "0.8125rem",
                        color: "rgba(255, 255, 255, 0.5)",
                        marginTop: "0.5rem",
                      }}
                    >
                      {question.question[language].length > 100
                        ? question.question[language].substring(0, 100) + "..."
                        : question.question[language]}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "0.375rem",
                          background: diffColors.bg,
                          color: diffColors.color,
                          fontWeight: 600,
                        }}
                      >
                        {getDifficultyLabel(question.difficulty, language)}
                      </span>
                    </div>
                    <div className={styles.cardCta}>
                      <span>{es ? "Ver respuesta" : "View Answer"}</span>
                      <ArrowRight className={styles.ctaArrow} />
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-interview")}>
            {es ? "Entrevistas React" : "React Interviews"}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            {es ? "Retos de Algoritmos" : "Algorithm Challenges"}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {es ? "Volver al Developer Hub" : "Back to Developer Hub"}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function categoryBtnStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: "0.375rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid",
    borderColor: isActive ? "rgba(167, 139, 250, 0.5)" : "rgba(255, 255, 255, 0.1)",
    background: isActive ? "rgba(167, 139, 250, 0.15)" : "rgba(255, 255, 255, 0.03)",
    color: isActive ? "#a78bfa" : "rgba(255, 255, 255, 0.7)",
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };
}

function difficultyBtnStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: "0.375rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid",
    borderColor: isActive ? "rgba(167, 139, 250, 0.5)" : "rgba(255, 255, 255, 0.1)",
    background: isActive ? "rgba(167, 139, 250, 0.15)" : "rgba(255, 255, 255, 0.03)",
    color: isActive ? "#a78bfa" : "rgba(255, 255, 255, 0.7)",
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };
}
