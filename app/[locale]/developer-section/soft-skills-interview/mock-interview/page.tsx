"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SOFT_SKILLS_QUESTIONS,
  type SoftSkillCategory,
  type SoftSkillDifficulty,
  type SoftSkillQuestion,
  getCategoryLabel,
  getDifficultyLabel,
  shuffleQuestions,
} from "@/lib/softSkillsInterviewData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Timer as TimerIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  Replay as ReplayIcon,
  RecordVoiceOver as VoiceIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Link from "next/link";

type MockConfig = {
  count: 5 | 10 | 15;
  category: SoftSkillCategory | "all";
  difficulty: SoftSkillDifficulty | "all";
  timePerQuestion: 120 | 180 | 300; // seconds
};

type Phase = "setup" | "running" | "summary";

type PerQuestionResult = {
  questionId: string;
  timeSpent: number; // seconds
  selfRating: "strong" | "ok" | "weak" | null;
  reviewed: boolean;
};

const DEFAULT_CONFIG: MockConfig = {
  count: 5,
  category: "all",
  difficulty: "all",
  timePerQuestion: 180,
};

const CATEGORIES: (SoftSkillCategory | "all")[] = [
  "all",
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

const DIFFICULTIES: (SoftSkillDifficulty | "all")[] = ["all", "Junior", "Mid", "Senior"];

export default function MockInterviewPage() {
  const { createLocalizedPath } = useLocale();
  const { language } = useLanguage();
  const es = language === "es";

  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<MockConfig>(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState<SoftSkillQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<PerQuestionResult[]>([]);
  const intervalRef = useRef<number | null>(null);

  const pool = useMemo(() => {
    let result = SOFT_SKILLS_QUESTIONS;
    if (config.category !== "all") {
      result = result.filter((q) => q.category === config.category);
    }
    if (config.difficulty !== "all") {
      result = result.filter((q) => q.difficulty === config.difficulty);
    }
    return result;
  }, [config.category, config.difficulty]);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setElapsed(0);
    const start = Date.now();
    intervalRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const handleStart = () => {
    const shuffled = shuffleQuestions(pool).slice(0, Math.min(config.count, pool.length));
    if (shuffled.length === 0) return;
    setQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
    setPhase("running");
    startTimer();
  };

  const handleNext = (rating: PerQuestionResult["selfRating"]) => {
    if (!currentQuestion) return;
    const record: PerQuestionResult = {
      questionId: currentQuestion.id,
      timeSpent: elapsed,
      selfRating: rating,
      reviewed: showAnswer,
    };
    const nextResults = [...results, record];
    setResults(nextResults);

    if (isLast) {
      stopTimer();
      setPhase("summary");
    } else {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
      startTimer();
    }
  };

  const handleRestart = () => {
    stopTimer();
    setPhase("setup");
    setQuestions([]);
    setResults([]);
    setCurrentIndex(0);
    setShowAnswer(false);
    setElapsed(0);
  };

  const handleAbort = () => {
    stopTimer();
    setPhase("setup");
  };

  // ---------------- SETUP ----------------
  if (phase === "setup") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a12 100%)",
          color: "#fff",
        }}
      >
        <DeveloperHeader />
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "7rem 1.5rem 4rem" }}>
          <Link
            href={createLocalizedPath("/developer-section/soft-skills-interview")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.875rem",
              textDecoration: "none",
              marginBottom: "2rem",
            }}
          >
            <BackIcon style={{ width: "1rem", height: "1rem" }} />
            {es ? "Volver a Soft Skills" : "Back to Soft Skills"}
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "0.75rem" }}
          >
            {es ? "Modo Entrevista Simulada" : "Mock Interview Mode"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.6, marginBottom: "2rem" }}
          >
            {es
              ? "Simula una entrevista real. Preguntas aleatorias con temporizador. Al final, autoevalúa tu desempeño por pregunta."
              : "Simulate a real interview. Random questions with a timer. At the end, self-rate your performance question by question."}
          </motion.p>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <Label>{es ? "Número de preguntas" : "Number of questions"}</Label>
            <ChipRow>
              {[5, 10, 15].map((n) => (
                <Chip
                  key={n}
                  active={config.count === n}
                  onClick={() => setConfig((c) => ({ ...c, count: n as 5 | 10 | 15 }))}
                >
                  {n}
                </Chip>
              ))}
            </ChipRow>

            <Label>{es ? "Tiempo por pregunta" : "Time per question"}</Label>
            <ChipRow>
              {[120, 180, 300].map((s) => (
                <Chip
                  key={s}
                  active={config.timePerQuestion === s}
                  onClick={() => setConfig((c) => ({ ...c, timePerQuestion: s as 120 | 180 | 300 }))}
                >
                  {formatMinutes(s)}
                </Chip>
              ))}
            </ChipRow>

            <Label>{es ? "Categoría" : "Category"}</Label>
            <ChipRow>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  active={config.category === cat}
                  onClick={() => setConfig((c) => ({ ...c, category: cat }))}
                >
                  {cat === "all" ? (es ? "Todas" : "All") : getCategoryLabel(cat, language)}
                </Chip>
              ))}
            </ChipRow>

            <Label>{es ? "Nivel" : "Level"}</Label>
            <ChipRow>
              {DIFFICULTIES.map((d) => (
                <Chip
                  key={d}
                  active={config.difficulty === d}
                  onClick={() => setConfig((c) => ({ ...c, difficulty: d }))}
                >
                  {d === "all" ? (es ? "Todos" : "All") : getDifficultyLabel(d, language)}
                </Chip>
              ))}
            </ChipRow>

            <div
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: "1rem",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {es
                ? `Disponibles con estos filtros: ${pool.length} preguntas. Se usarán ${Math.min(config.count, pool.length)}.`
                : `Available with these filters: ${pool.length} questions. ${Math.min(config.count, pool.length)} will be used.`}
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={pool.length === 0}
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              background:
                pool.length === 0
                  ? "rgba(255, 255, 255, 0.05)"
                  : "linear-gradient(135deg, #a78bfa, #ec4899)",
              border: "none",
              color: pool.length === 0 ? "rgba(255, 255, 255, 0.4)" : "#fff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: pool.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <PlayIcon />
            {es ? "Iniciar Entrevista" : "Start Interview"}
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  // ---------------- RUNNING ----------------
  if (phase === "running" && currentQuestion) {
    const overTime = elapsed >= config.timePerQuestion;
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a12 100%)",
          color: "#fff",
        }}
      >
        <DeveloperHeader />
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "7rem 1.5rem 4rem" }}>
          {/* Progress + abort */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <VoiceIcon style={{ color: "#a78bfa" }} />
              <span style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.75)", fontWeight: 600 }}>
                {es ? "Pregunta" : "Question"} {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAbort}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "rgba(255, 255, 255, 0.65)",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              <CloseIcon fontSize="small" />
              {es ? "Cancelar" : "Abort"}
            </button>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((currentIndex) / questions.length) * 100}%`,
                background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Timer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              padding: "0.625rem 1rem",
              borderRadius: "0.75rem",
              background: overTime ? "rgba(239, 68, 68, 0.1)" : "rgba(167, 139, 250, 0.08)",
              border: `1px solid ${overTime ? "rgba(239, 68, 68, 0.3)" : "rgba(167, 139, 250, 0.25)"}`,
              color: overTime ? "#f87171" : "#a78bfa",
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <TimerIcon fontSize="small" />
            {formatTime(elapsed)} / {formatTime(config.timePerQuestion)}
            {overTime && (
              <span style={{ fontSize: "0.75rem", fontWeight: 400, marginLeft: "0.5rem" }}>
                {es ? "sobre tiempo" : "over time"}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question card */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "1rem",
                  padding: "2rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      background: "rgba(167, 139, 250, 0.15)",
                      color: "#a78bfa",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {getCategoryLabel(currentQuestion.category, language)}
                  </span>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {getDifficultyLabel(currentQuestion.difficulty, language)}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    marginBottom: "1rem",
                  }}
                >
                  {currentQuestion.title[language]}
                </h2>
                <p
                  style={{
                    fontSize: "1.0625rem",
                    lineHeight: 1.65,
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  &ldquo;{currentQuestion.question[language]}&rdquo;
                </p>
              </div>

              {/* Reveal sample answer */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "1rem",
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: showAnswer ? "0.75rem" : 0,
                  }}
                >
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.6)", fontWeight: 600 }}>
                    {es ? "Respuesta de muestra" : "Sample answer"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAnswer((s) => !s)}
                    style={{
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
                    }}
                  >
                    {showAnswer ? <HideIcon fontSize="small" /> : <ShowIcon fontSize="small" />}
                    {showAnswer ? (es ? "Ocultar" : "Hide") : es ? "Revelar" : "Reveal"}
                  </button>
                </div>
                {showAnswer && (
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: 1.75,
                      color: "rgba(255, 255, 255, 0.75)",
                      whiteSpace: "pre-line",
                      fontStyle: "italic",
                    }}
                  >
                    {currentQuestion.sampleAnswer[language]}
                  </p>
                )}
              </div>

              {/* Self-rate + next */}
              <div
                style={{
                  background: "rgba(167, 139, 250, 0.05)",
                  border: "1px solid rgba(167, 139, 250, 0.2)",
                  borderRadius: "1rem",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.75)", marginBottom: "0.75rem" }}>
                  {es
                    ? "¿Cómo te sentiste con tu respuesta?"
                    : "How did you feel about your answer?"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <RatingButton
                    label={es ? "Débil — practicar más" : "Weak — practice more"}
                    color="#f87171"
                    onClick={() => handleNext("weak")}
                  />
                  <RatingButton
                    label={es ? "Aceptable" : "Okay"}
                    color="#facc15"
                    onClick={() => handleNext("ok")}
                  />
                  <RatingButton
                    label={es ? "Fuerte" : "Strong"}
                    color="#4ade80"
                    onClick={() => handleNext("strong")}
                  />
                  <button
                    type="button"
                    onClick={() => handleNext(null)}
                    style={{
                      marginLeft: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.625rem 1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(255, 255, 255, 0.03)",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    {isLast ? (es ? "Finalizar" : "Finish") : es ? "Saltar" : "Skip"}
                    <NextIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer />
      </main>
    );
  }

  // ---------------- SUMMARY ----------------
  if (phase === "summary") {
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const strongCount = results.filter((r) => r.selfRating === "strong").length;
    const okCount = results.filter((r) => r.selfRating === "ok").length;
    const weakCount = results.filter((r) => r.selfRating === "weak").length;

    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a12 100%)",
          color: "#fff",
        }}
      >
        <DeveloperHeader />
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "7rem 1.5rem 4rem" }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                background: "rgba(74, 222, 128, 0.15)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                color: "#4ade80",
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              <CheckIcon fontSize="small" />
              {es ? "Entrevista completada" : "Interview complete"}
            </div>

            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
              {es ? "Resumen de tu sesión" : "Session summary"}
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", marginBottom: "2rem" }}>
              {es
                ? `${questions.length} preguntas · tiempo total ${formatTime(totalTime)}`
                : `${questions.length} questions · total time ${formatTime(totalTime)}`}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <StatCard label={es ? "Fuerte" : "Strong"} value={strongCount} color="#4ade80" />
              <StatCard label={es ? "Aceptable" : "Okay"} value={okCount} color="#facc15" />
              <StatCard label={es ? "A practicar" : "To practice"} value={weakCount} color="#f87171" />
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "1rem",
                padding: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
                {es ? "Detalles por pregunta" : "Per-question breakdown"}
              </h2>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {results.map((r, i) => {
                  const q = questions.find((question) => question.id === r.questionId);
                  if (!q) return null;
                  return (
                    <Link
                      key={r.questionId}
                      href={createLocalizedPath(`/developer-section/soft-skills-interview/${q.id}`)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto auto",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        borderRadius: "0.625rem",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        color: "inherit",
                        textDecoration: "none",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)", width: "1.5rem" }}>
                        #{i + 1}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.9)" }}>
                        {q.title[language]}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255, 255, 255, 0.5)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatTime(r.timeSpent)}
                      </span>
                      <RatingBadge rating={r.selfRating} es={es} />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleRestart}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "0.75rem",
                  background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ReplayIcon />
                {es ? "Nueva entrevista" : "New interview"}
              </button>
              <Link
                href={createLocalizedPath("/developer-section/soft-skills-interview")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "0.75rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {es ? "Volver al banco" : "Back to question bank"}
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return null;
}

// ---------- Subcomponents ----------

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "rgba(255, 255, 255, 0.5)",
        marginBottom: "0.5rem",
        marginTop: "1rem",
      }}
    >
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>{children}</div>;
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.5rem 0.875rem",
        borderRadius: "0.5rem",
        border: "1px solid",
        borderColor: active ? "rgba(167, 139, 250, 0.5)" : "rgba(255, 255, 255, 0.1)",
        background: active ? "rgba(167, 139, 250, 0.15)" : "rgba(255, 255, 255, 0.03)",
        color: active ? "#a78bfa" : "rgba(255, 255, 255, 0.7)",
        fontSize: "0.8125rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

function RatingButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.625rem 1rem",
        borderRadius: "0.5rem",
        border: `1px solid ${color}33`,
        background: `${color}1A`,
        color,
        fontSize: "0.8125rem",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        background: `${color}10`,
        border: `1px solid ${color}33`,
      }}
    >
      <div style={{ fontSize: "2rem", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "0.25rem" }}>
        {label}
      </div>
    </div>
  );
}

function RatingBadge({
  rating,
  es,
}: {
  rating: PerQuestionResult["selfRating"];
  es: boolean;
}) {
  if (rating === null) {
    return (
      <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)" }}>
        {es ? "Sin calificar" : "Unrated"}
      </span>
    );
  }
  const map: Record<"strong" | "ok" | "weak", { color: string; label: { en: string; es: string } }> = {
    strong: { color: "#4ade80", label: { en: "Strong", es: "Fuerte" } },
    ok: { color: "#facc15", label: { en: "Okay", es: "OK" } },
    weak: { color: "#f87171", label: { en: "Weak", es: "Débil" } },
  };
  const item = map[rating];
  return (
    <span
      style={{
        padding: "0.25rem 0.625rem",
        borderRadius: "9999px",
        background: `${item.color}1A`,
        color: item.color,
        fontSize: "0.7rem",
        fontWeight: 600,
      }}
    >
      {es ? item.label.es : item.label.en}
    </span>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatMinutes(seconds: number): string {
  const m = seconds / 60;
  return m === Math.floor(m) ? `${m} min` : `${m.toFixed(1)} min`;
}
