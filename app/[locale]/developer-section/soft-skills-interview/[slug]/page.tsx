"use client";

import { useParams } from "next/navigation";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOFT_SKILLS_QUESTIONS, type SoftSkillCategory } from "@/lib/softSkillsInterviewData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  RecordVoiceOver as SoftSkillsIcon,
  Lightbulb as TipIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  HelpOutline as QuestionIcon,
} from "@mui/icons-material";
import Link from "next/link";

const CATEGORY_COLORS: Record<SoftSkillCategory, { bg: string; color: string }> = {
  Communication: { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" },
  Teamwork: { bg: "rgba(74, 222, 128, 0.15)", color: "#4ade80" },
  "Problem Solving": { bg: "rgba(251, 146, 60, 0.15)", color: "#fb923c" },
  Leadership: { bg: "rgba(168, 85, 247, 0.15)", color: "#a855f7" },
  Adaptability: { bg: "rgba(103, 232, 249, 0.15)", color: "#67e8f9" },
  "Conflict Resolution": { bg: "rgba(244, 114, 182, 0.15)", color: "#f472b6" },
  "Time Management": { bg: "rgba(250, 204, 21, 0.15)", color: "#facc15" },
  "Growth Mindset": { bg: "rgba(34, 211, 238, 0.15)", color: "#22d3ee" },
};

export default function SoftSkillQuestionPage() {
  const params = useParams();
  const { createLocalizedPath } = useLocale();
  const { language } = useLanguage();
  const slug = params?.slug as string;

  const question = SOFT_SKILLS_QUESTIONS.find((q) => q.id === slug);
  const questionIndex = SOFT_SKILLS_QUESTIONS.findIndex((q) => q.id === slug);
  const prevQuestion = questionIndex > 0 ? SOFT_SKILLS_QUESTIONS[questionIndex - 1] : null;
  const nextQuestion = questionIndex < SOFT_SKILLS_QUESTIONS.length - 1 ? SOFT_SKILLS_QUESTIONS[questionIndex + 1] : null;

  if (!question) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", padding: "6rem 1rem" }}>
        <DeveloperHeader />
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h1>{language === "es" ? "Pregunta no encontrada" : "Question not found"}</h1>
          <Link
            href={createLocalizedPath("/developer-section/soft-skills-interview")}
            style={{ color: "#a78bfa", marginTop: "1rem", display: "inline-block" }}
          >
            {language === "es" ? "Volver a Soft Skills" : "Back to Soft Skills"}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const colors = CATEGORY_COLORS[question.category];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a12 100%)",
        color: "#fff",
      }}
    >
      <DeveloperHeader />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "7rem 1.5rem 4rem" }}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem" }}
        >
          <Link
            href={createLocalizedPath("/developer-section/soft-skills-interview")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.875rem",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            <BackIcon style={{ width: "1rem", height: "1rem" }} />
            {language === "es" ? "Volver a Soft Skills" : "Back to Soft Skills"}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span
              style={{
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                background: colors.bg,
                color: colors.color,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {question.category}
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem" }}>
              #{question.questionNumber} of {SOFT_SKILLS_QUESTIONS.length}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, lineHeight: 1.3, marginBottom: "1.5rem" }}>
            {question.title}
          </h1>
        </motion.div>

        {/* The Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <QuestionIcon style={{ color: colors.color, flexShrink: 0, marginTop: "0.125rem" }} />
            <div>
              <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: colors.color, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {language === "es" ? "La Pregunta" : "The Question"}
              </h2>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                "{question.question}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.9)" }}>
            {language === "es" ? "Contexto" : "Context"}
          </h3>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.7)" }}>
            {question.context}
          </p>
        </motion.div>

        {/* Why Interviewers Ask This */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: "rgba(167, 139, 250, 0.05)",
            border: "1px solid rgba(167, 139, 250, 0.15)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <TipIcon style={{ color: "#a78bfa", flexShrink: 0, marginTop: "0.125rem" }} />
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#a78bfa" }}>
                {language === "es" ? "¿Por Qué Lo Preguntan?" : "Why Interviewers Ask This"}
              </h3>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)" }}>
                {question.whyAsked}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <WarningIcon style={{ color: "#f87171", flexShrink: 0, marginTop: "0.125rem" }} />
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#f87171" }}>
                {language === "es" ? "Errores Comunes a Evitar" : "Common Mistakes to Avoid"}
              </h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {question.commonMistakes.map((mistake, i) => (
                  <li key={i} style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)", marginBottom: "0.5rem" }}>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Answer Framework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: "rgba(34, 197, 94, 0.05)",
            border: "1px solid rgba(34, 197, 94, 0.15)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <CheckIcon style={{ color: "#4ade80", flexShrink: 0, marginTop: "0.125rem" }} />
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#4ade80" }}>
                {language === "es" ? "Marco de Respuesta (STAR)" : "Answer Framework (STAR)"}
              </h3>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)", whiteSpace: "pre-line" }}>
                {question.answerFramework}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sample Answer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.9)" }}>
            {language === "es" ? "Ejemplo de Respuesta" : "Sample Answer"}
          </h3>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "rgba(255, 255, 255, 0.8)", fontStyle: "italic", whiteSpace: "pre-line" }}>
            "{question.sampleAnswer}"
          </p>
        </motion.div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            background: "rgba(59, 130, 246, 0.05)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#60a5fa" }}>
            {language === "es" ? "Puntos Clave" : "Key Points"}
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {question.keyPoints.map((point, i) => (
              <li key={i} style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)", marginBottom: "0.5rem" }}>
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Follow-up Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.9)" }}>
            {language === "es" ? "Preguntas de Seguimiento" : "Follow-up Questions"}
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {question.followUpQuestions.map((q, i) => (
              <li key={i} style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.7)", marginBottom: "0.5rem" }}>
                {q}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {prevQuestion ? (
            <Link
              href={createLocalizedPath(`/developer-section/soft-skills-interview/${prevQuestion.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
              }}
            >
              <BackIcon style={{ width: "1rem", height: "1rem" }} />
              <span>{language === "es" ? "Anterior" : "Previous"}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextQuestion && (
            <Link
              href={createLocalizedPath(`/developer-section/soft-skills-interview/${nextQuestion.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(167, 139, 250, 0.1)",
                border: "1px solid rgba(167, 139, 250, 0.2)",
                borderRadius: "0.75rem",
                color: "#a78bfa",
                textDecoration: "none",
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
              }}
            >
              <span>{language === "es" ? "Siguiente" : "Next"}</span>
              <NextIcon style={{ width: "1rem", height: "1rem" }} />
            </Link>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
