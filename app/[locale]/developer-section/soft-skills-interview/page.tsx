"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOFT_SKILLS_QUESTIONS, type SoftSkillCategory } from "@/lib/softSkillsInterviewData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  RecordVoiceOver as SoftSkillsIcon,
  ArrowForward as ArrowRight,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import Link from "next/link";
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
];

const CATEGORY_COLORS: Record<SoftSkillCategory, { bg: string; color: string }> = {
  Communication: { bg: "rgba(96, 165, 250, 0.2)", color: "#60a5fa" },
  Teamwork: { bg: "rgba(74, 222, 128, 0.2)", color: "#4ade80" },
  "Problem Solving": { bg: "rgba(251, 146, 60, 0.2)", color: "#fb923c" },
  Leadership: { bg: "rgba(168, 85, 247, 0.2)", color: "#a855f7" },
  Adaptability: { bg: "rgba(103, 232, 249, 0.2)", color: "#67e8f9" },
  "Conflict Resolution": { bg: "rgba(244, 114, 182, 0.2)", color: "#f472b6" },
  "Time Management": { bg: "rgba(250, 204, 21, 0.2)", color: "#facc15" },
  "Growth Mindset": { bg: "rgba(34, 211, 238, 0.2)", color: "#22d3ee" },
};

export default function SoftSkillsInterviewPage() {
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<SoftSkillCategory | "all">("all");

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "all") return SOFT_SKILLS_QUESTIONS;
    return SOFT_SKILLS_QUESTIONS.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: SOFT_SKILLS_QUESTIONS.length };
    CATEGORIES.forEach((cat) => {
      stats[cat] = SOFT_SKILLS_QUESTIONS.filter((q) => q.category === cat).length;
    });
    return stats;
  }, []);

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SoftSkillsIcon fontSize="small" />
          <span>{language === "es" ? "Entrevistas Conductuales" : "Behavioral Interviews"}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {language === "es" ? "Preguntas de Soft Skills" : "Soft Skills Questions"}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {language === "es"
            ? "40 preguntas de entrevista conductual con frameworks STAR, ejemplos de respuestas y errores comunes a evitar."
            : "40 behavioral interview questions with STAR frameworks, sample answers, and common mistakes to avoid."}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <SoftSkillsIcon fontSize="small" />
            {SOFT_SKILLS_QUESTIONS.length} {language === "es" ? "Preguntas" : "Questions"}
          </span>
          <span className={styles.badge}>{CATEGORIES.length} {language === "es" ? "Categorías" : "Categories"}</span>
          <span className={styles.badge}>STAR Framework</span>
        </div>
      </section>

      {/* Category Filter */}
      <section className={styles.listSection}>
        <div className={styles.filterBar} style={{ flexWrap: "wrap", gap: "0.5rem" }}>
          <span className={styles.filterLabel}>
            <FilterIcon fontSize="small" style={{ marginRight: "0.5rem" }} />
            {language === "es" ? "Filtrar por categoría" : "Filter by category"}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginLeft: "auto" }}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid",
                borderColor: selectedCategory === "all" ? "rgba(167, 139, 250, 0.5)" : "rgba(255, 255, 255, 0.1)",
                background: selectedCategory === "all" ? "rgba(167, 139, 250, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: selectedCategory === "all" ? "#a78bfa" : "rgba(255, 255, 255, 0.7)",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {language === "es" ? "Todas" : "All"} ({categoryStats.all})
            </button>
            {CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat];
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid",
                    borderColor: isActive ? colors.color + "80" : "rgba(255, 255, 255, 0.1)",
                    background: isActive ? colors.bg : "rgba(255, 255, 255, 0.03)",
                    color: isActive ? colors.color : "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat} ({categoryStats[cat]})
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "1rem", color: "rgba(255, 255, 255, 0.5)", fontSize: "0.875rem" }}>
          {language === "es"
            ? `Mostrando ${filteredQuestions.length} de ${SOFT_SKILLS_QUESTIONS.length} preguntas`
            : `Showing ${filteredQuestions.length} of ${SOFT_SKILLS_QUESTIONS.length} questions`}
        </div>

        <ul className={styles.grid}>
          {filteredQuestions.map((question, i) => {
            const colors = CATEGORY_COLORS[question.category];
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
                      style={{ background: colors.bg, color: colors.color }}
                    >
                      {question.category}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>
                      #{question.questionNumber}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle} style={{ fontSize: "1rem", lineHeight: 1.4 }}>
                    {question.title}
                  </h3>
                  <p className={styles.cardCategory} style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "0.5rem" }}>
                    {question.question.length > 100 ? question.question.substring(0, 100) + "..." : question.question}
                  </p>
                  <div className={styles.cardCta}>
                    <span>{language === "es" ? "Ver respuesta" : "View Answer"}</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-interview")}>
            {language === "es" ? "Entrevistas React" : "React Interviews"}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            {language === "es" ? "Retos de Algoritmos" : "Algorithm Challenges"}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {language === "es" ? "Volver al Developer Hub" : "Back to Developer Hub"}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
