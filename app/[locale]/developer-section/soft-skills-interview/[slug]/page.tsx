"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SOFT_SKILLS_QUESTIONS,
  type SoftSkillCategory,
  type SoftSkillDifficulty,
  getCategoryLabel,
  getDifficultyLabel,
} from "@/lib/softSkillsInterviewData";
import { getStore, updateStore } from "@/lib/devHubStore";
import { SR_RATINGS, reviewCard, newCard } from "@/lib/spacedRepetition";
import type { SRQuality } from "@/lib/spacedRepetition";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Lightbulb as TipIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  HelpOutline as QuestionIcon,
  ContentCopy as CopyIcon,
  Timer as TimerIcon,
  VisibilityOff as HideIcon,
  Visibility as ShowIcon,
  EditNote as StarIcon,
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
  "Culture Fit": { bg: "rgba(236, 72, 153, 0.15)", color: "#ec4899" },
  "Career & Recruiter": { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444" },
};

const DIFFICULTY_COLORS: Record<SoftSkillDifficulty, { bg: string; color: string }> = {
  Junior: { bg: "rgba(74, 222, 128, 0.15)", color: "#4ade80" },
  Mid: { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" },
  Senior: { bg: "rgba(168, 85, 247, 0.15)", color: "#a855f7" },
};

type StarState = {
  situation: string;
  task: string;
  action: string;
  result: string;
};

const INITIAL_STAR: StarState = { situation: "", task: "", action: "", result: "" };

export default function SoftSkillQuestionPage() {
  const params = useParams();
  const { createLocalizedPath } = useLocale();
  const { language, t } = useLanguage();
  const slug = params?.slug as string;
  const [srRated, setSrRated] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [star, setStar] = useState<StarState>(INITIAL_STAR);
  const [copied, setCopied] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const es = language === "es";

  const question = useMemo(() => SOFT_SKILLS_QUESTIONS.find((q) => q.id === slug), [slug]);
  const questionIndex = useMemo(() => SOFT_SKILLS_QUESTIONS.findIndex((q) => q.id === slug), [slug]);
  const prevQuestion = questionIndex > 0 ? SOFT_SKILLS_QUESTIONS[questionIndex - 1] : null;
  const nextQuestion =
    questionIndex < SOFT_SKILLS_QUESTIONS.length - 1 ? SOFT_SKILLS_QUESTIONS[questionIndex + 1] : null;

  const handleSRRate = useCallback(
    (quality: SRQuality) => {
      const store = getStore();
      const questionId = `soft-skills-${slug}`;
      const current = store.interviewSR[questionId] || newCard();
      const updated = reviewCard(current, quality);
      updateStore({
        interviewSR: { ...store.interviewSR, [questionId]: updated },
      });
      setSrRated(true);
    },
    [slug],
  );

  const handleCopyAnswer = useCallback(async () => {
    if (!question) return;
    try {
      await navigator.clipboard.writeText(question.sampleAnswer[language]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [question, language]);

  const starCompiled = useMemo(() => {
    const parts: string[] = [];
    if (star.situation.trim()) parts.push(`${es ? "Situación" : "Situation"}: ${star.situation.trim()}`);
    if (star.task.trim()) parts.push(`${es ? "Tarea" : "Task"}: ${star.task.trim()}`);
    if (star.action.trim()) parts.push(`${es ? "Acción" : "Action"}: ${star.action.trim()}`);
    if (star.result.trim()) parts.push(`${es ? "Resultado" : "Result"}: ${star.result.trim()}`);
    return parts.join("\n\n");
  }, [star, es]);

  const starProgress = useMemo(() => {
    const fields = [star.situation, star.task, star.action, star.result];
    return fields.filter((f) => f.trim().length > 20).length;
  }, [star]);

  const handleStartTimer = () => {
    setTimerStarted(true);
    setElapsed(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      setElapsed(diff);
      if (diff >= 180) clearInterval(interval);
    }, 1000);
  };

  if (!question) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", padding: "6rem 1rem" }}>
        <DeveloperHeader />
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h1>{es ? "Pregunta no encontrada" : "Question not found"}</h1>
          <Link
            href={createLocalizedPath("/developer-section/soft-skills-interview")}
            style={{ color: "#a78bfa", marginTop: "1rem", display: "inline-block" }}
          >
            {es ? "Volver a Soft Skills" : "Back to Soft Skills"}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const colors = CATEGORY_COLORS[question.category];
  const diffColors = DIFFICULTY_COLORS[question.difficulty];

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
            {es ? "Volver a Soft Skills" : "Back to Soft Skills"}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
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
              {getCategoryLabel(question.category, language)}
            </span>
            <span
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: diffColors.bg,
                color: diffColors.color,
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {getDifficultyLabel(question.difficulty, language)}
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem" }}>
              #{question.questionNumber} {es ? "de" : "of"} {SOFT_SKILLS_QUESTIONS.length}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            {question.title[language]}
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
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: colors.color,
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {es ? "La Pregunta" : "The Question"}
              </h2>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                &ldquo;{question.question[language]}&rdquo;
              </p>

              {/* Practice Timer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {!timerStarted ? (
                  <button
                    type="button"
                    onClick={handleStartTimer}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(167, 139, 250, 0.3)",
                      background: "rgba(167, 139, 250, 0.1)",
                      color: "#a78bfa",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <TimerIcon fontSize="small" />
                    {es ? "Iniciar práctica (3 min)" : "Start practice (3 min)"}
                  </button>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "0.5rem",
                      background: elapsed >= 180 ? "rgba(239, 68, 68, 0.15)" : "rgba(74, 222, 128, 0.15)",
                      color: elapsed >= 180 ? "#f87171" : "#4ade80",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <TimerIcon fontSize="small" />
                    {formatTime(elapsed)} / 3:00
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* STAR Answer Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            background: "rgba(167, 139, 250, 0.05)",
            border: "1px solid rgba(167, 139, 250, 0.2)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <StarIcon style={{ color: "#a78bfa" }} />
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#a78bfa", margin: 0 }}>
              {es ? "Constructor de Respuesta STAR" : "STAR Answer Builder"}
            </h3>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {starProgress}/4
            </span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "1rem" }}>
            {es
              ? "Practica tu respuesta escribiendo cada parte del marco STAR. Al menos 20 caracteres cuentan como completo."
              : "Practice your answer by writing each part of the STAR framework. At least 20 characters counts as complete."}
          </p>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            <StarField
              label={es ? "Situación — el contexto" : "Situation — the context"}
              placeholder={
                es
                  ? "Describe brevemente el escenario: dónde, cuándo, con quién."
                  : "Briefly describe the scenario: where, when, with whom."
              }
              value={star.situation}
              onChange={(v) => setStar((s) => ({ ...s, situation: v }))}
              complete={star.situation.trim().length > 20}
            />
            <StarField
              label={es ? "Tarea — tu responsabilidad" : "Task — your responsibility"}
              placeholder={
                es
                  ? "¿Qué tenías que lograr? ¿Cuál era tu rol específico?"
                  : "What did you need to accomplish? What was your specific role?"
              }
              value={star.task}
              onChange={(v) => setStar((s) => ({ ...s, task: v }))}
              complete={star.task.trim().length > 20}
            />
            <StarField
              label={es ? "Acción — lo que hiciste" : "Action — what you did"}
              placeholder={
                es
                  ? "Los pasos específicos que tomaste tú (no 'nosotros'). Sé concreto."
                  : "Specific steps YOU took (not 'we'). Be concrete."
              }
              value={star.action}
              onChange={(v) => setStar((s) => ({ ...s, action: v }))}
              complete={star.action.trim().length > 20}
              multiline
            />
            <StarField
              label={es ? "Resultado — el impacto medible" : "Result — the measurable impact"}
              placeholder={
                es
                  ? "Resultado cuantificable. Números, métricas o impacto concreto."
                  : "Quantifiable outcome. Numbers, metrics, or concrete impact."
              }
              value={star.result}
              onChange={(v) => setStar((s) => ({ ...s, result: v }))}
              complete={star.result.trim().length > 20}
            />
          </div>

          {starProgress === 4 && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(74, 222, 128, 0.1)",
                border: "1px solid rgba(74, 222, 128, 0.25)",
                color: "#4ade80",
                fontSize: "0.8125rem",
              }}
            >
              {es
                ? "✓ Respuesta STAR completa. Compara con la respuesta de muestra abajo."
                : "✓ STAR answer complete. Compare with the sample answer below."}
            </div>
          )}

          {starCompiled && (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(starCompiled);
              }}
              style={{
                marginTop: "0.75rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.03)",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              <CopyIcon fontSize="small" style={{ fontSize: "0.875rem" }} />
              {es ? "Copiar mi respuesta" : "Copy my answer"}
            </button>
          )}
        </motion.div>

        {/* Context */}
        <Section
          title={es ? "Contexto" : "Context"}
          body={question.context[language]}
          delay={0.2}
        />

        {/* Why Interviewers Ask This */}
        <AccentSection
          icon={<TipIcon style={{ color: "#a78bfa", flexShrink: 0, marginTop: "0.125rem" }} />}
          title={es ? "¿Por Qué Lo Preguntan?" : "Why Interviewers Ask This"}
          color="#a78bfa"
          bg="rgba(167, 139, 250, 0.05)"
          border="rgba(167, 139, 250, 0.15)"
          body={question.whyAsked[language]}
          delay={0.25}
        />

        {/* Common Mistakes */}
        <AccentListSection
          icon={<WarningIcon style={{ color: "#f87171", flexShrink: 0, marginTop: "0.125rem" }} />}
          title={es ? "Errores Comunes a Evitar" : "Common Mistakes to Avoid"}
          color="#f87171"
          bg="rgba(239, 68, 68, 0.05)"
          border="rgba(239, 68, 68, 0.15)"
          items={question.commonMistakes[language]}
          delay={0.3}
        />

        {/* Answer Framework */}
        <AccentSection
          icon={<CheckIcon style={{ color: "#4ade80", flexShrink: 0, marginTop: "0.125rem" }} />}
          title={es ? "Marco de Respuesta (STAR)" : "Answer Framework (STAR)"}
          color="#4ade80"
          bg="rgba(34, 197, 94, 0.05)"
          border="rgba(34, 197, 94, 0.15)"
          body={question.answerFramework[language]}
          delay={0.35}
        />

        {/* Sample Answer (reveal) */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
              {es ? "Ejemplo de Respuesta" : "Sample Answer"}
            </h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowSampleAnswer((s) => !s)}
                style={smallBtnStyle}
              >
                {showSampleAnswer ? <HideIcon fontSize="small" /> : <ShowIcon fontSize="small" />}
                {showSampleAnswer
                  ? es
                    ? "Ocultar"
                    : "Hide"
                  : es
                    ? "Mostrar"
                    : "Show"}
              </button>
              <button type="button" onClick={handleCopyAnswer} style={smallBtnStyle}>
                <CopyIcon fontSize="small" />
                {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
              </button>
            </div>
          </div>
          {showSampleAnswer ? (
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.8,
                color: "rgba(255, 255, 255, 0.8)",
                fontStyle: "italic",
                whiteSpace: "pre-line",
              }}
            >
              &ldquo;{question.sampleAnswer[language]}&rdquo;
            </p>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}>
              {es
                ? "Respuesta oculta. Intenta responder primero en el constructor STAR, luego revela para comparar."
                : "Answer hidden. Try responding in the STAR builder first, then reveal to compare."}
            </p>
          )}
        </motion.div>

        {/* Key Points */}
        <AccentListSection
          title={es ? "Puntos Clave" : "Key Points"}
          color="#60a5fa"
          bg="rgba(59, 130, 246, 0.05)"
          border="rgba(59, 130, 246, 0.15)"
          items={question.keyPoints[language]}
          delay={0.45}
        />

        {/* Follow-up Questions */}
        <AccentListSection
          title={es ? "Preguntas de Seguimiento" : "Follow-up Questions"}
          color="rgba(255, 255, 255, 0.9)"
          bg="rgba(255, 255, 255, 0.02)"
          border="rgba(255, 255, 255, 0.06)"
          items={question.followUpQuestions[language]}
          delay={0.5}
          textColor="rgba(255, 255, 255, 0.7)"
        />

        {/* Spaced Repetition Rating */}
        {!srRated ? (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(167, 107, 249, 0.08)",
              border: "1px solid rgba(167, 107, 249, 0.2)",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)", marginBottom: "12px" }}>
              {t("sr-how-well")}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {SR_RATINGS.map((r) => (
                <button
                  type="button"
                  key={r.quality}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "white",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSRRate(r.quality)}
                >
                  {t(r.labelKey)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "16px", textAlign: "center", color: "#34d399", fontSize: "0.85rem" }}>
            {t("sr-rated-thanks")}
          </div>
        )}

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
            marginTop: "2rem",
          }}
        >
          {prevQuestion ? (
            <Link
              href={createLocalizedPath(`/developer-section/soft-skills-interview/${prevQuestion.id}`)}
              style={navLinkStyle()}
            >
              <BackIcon style={{ width: "1rem", height: "1rem" }} />
              <span>{es ? "Anterior" : "Previous"}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextQuestion && (
            <Link
              href={createLocalizedPath(`/developer-section/soft-skills-interview/${nextQuestion.id}`)}
              style={navLinkStyle(true)}
            >
              <span>{es ? "Siguiente" : "Next"}</span>
              <NextIcon style={{ width: "1rem", height: "1rem" }} />
            </Link>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

// ----- Subcomponents & helpers -----

function StarField({
  label,
  placeholder,
  value,
  onChange,
  complete,
  multiline,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  complete: boolean;
  multiline?: boolean;
}) {
  const commonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(10, 10, 15, 0.5)",
    color: "#fff",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  };
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          marginBottom: "0.375rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: complete ? "#4ade80" : "rgba(255, 255, 255, 0.75)",
        }}
      >
        {complete && <CheckIcon style={{ fontSize: "0.875rem" }} />}
        {label}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={commonStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={commonStyle}
        />
      )}
    </label>
  );
}

function Section({ title, body, delay }: { title: string; body: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "1rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.9)" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255, 255, 255, 0.7)" }}>{body}</p>
    </motion.div>
  );
}

function AccentSection({
  icon,
  title,
  color,
  bg,
  border,
  body,
  delay,
}: {
  icon?: React.ReactNode;
  title: string;
  color: string;
  bg: string;
  border: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "1rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        {icon}
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color }}>{title}</h3>
          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.8)",
              whiteSpace: "pre-line",
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function AccentListSection({
  icon,
  title,
  color,
  bg,
  border,
  items,
  delay,
  textColor = "rgba(255, 255, 255, 0.8)",
}: {
  icon?: React.ReactNode;
  title: string;
  color: string;
  bg: string;
  border: string;
  items: string[];
  delay: number;
  textColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "1rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        {icon}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color }}>{title}</h3>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {items.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  color: textColor,
                  marginBottom: "0.5rem",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

const smallBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  padding: "0.375rem 0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.03)",
  color: "rgba(255, 255, 255, 0.75)",
  fontSize: "0.75rem",
  cursor: "pointer",
};

function navLinkStyle(accent = false): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    background: accent ? "rgba(167, 139, 250, 0.1)" : "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${accent ? "rgba(167, 139, 250, 0.2)" : "rgba(255, 255, 255, 0.08)"}`,
    borderRadius: "0.75rem",
    color: accent ? "#a78bfa" : "rgba(255, 255, 255, 0.8)",
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
