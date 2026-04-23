"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bolt as BoltIcon,
  EmojiEvents as TrophyIcon,
  Replay as ReplayIcon,
  PlayArrow as PlayIcon,
  Timer as TimerIcon,
  LocalFireDepartment as FireIcon,
} from "@mui/icons-material";
import type { MMLExercise } from "@/lib/mmlTypes";
import styles from "../MathML.module.css";

// Exercise components each expect a narrower exercise type; we unify at the
// call site by picking the matching component for the current round.
type ExerciseComp = React.ComponentType<{
  exercise: MMLExercise;
  onCorrect: () => void;
}>;

/* eslint-disable @typescript-eslint/no-explicit-any */
const MultipleChoice = dynamic(
  () => import("../exercises/MultipleChoice").then((m) => m.MultipleChoice as any),
  { ssr: false },
) as ExerciseComp;
const NumericInput = dynamic(
  () => import("../exercises/NumericInput").then((m) => m.NumericInput as any),
  { ssr: false },
) as ExerciseComp;
const MatrixInput = dynamic(
  () => import("../exercises/MatrixInput").then((m) => m.MatrixInput as any),
  { ssr: false },
) as ExerciseComp;
const VectorInput = dynamic(
  () => import("../exercises/VectorInput").then((m) => m.VectorInput as any),
  { ssr: false },
) as ExerciseComp;
const SliderExplore = dynamic(
  () => import("../exercises/SliderExplore").then((m) => m.SliderExplore as any),
  { ssr: false },
) as ExerciseComp;
const DragToMatch = dynamic(
  () => import("../exercises/DragToMatch").then((m) => m.DragToMatch as any),
  { ssr: false },
) as ExerciseComp;
/* eslint-enable @typescript-eslint/no-explicit-any */

function pickComponent(type: MMLExercise["type"]): ExerciseComp | null {
  switch (type) {
    case "multiple-choice":
      return MultipleChoice;
    case "numeric-input":
      return NumericInput;
    case "matrix-input":
      return MatrixInput;
    case "vector-input":
      return VectorInput;
    case "slider-explore":
      return SliderExplore;
    case "drag-to-match":
      return DragToMatch;
    default:
      return null;
  }
}

const ROUND_MS = 30_000;

interface ConceptGameProps {
  exercises: MMLExercise[];
  lang: string;
  title?: string;
  localizeExercise: (ex: MMLExercise, lang: string) => MMLExercise;
}

type Phase = "idle" | "playing" | "result" | "done";

export function ConceptGame({
  exercises,
  lang,
  title,
  localizeExercise,
}: ConceptGameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS);
  const [shake, setShake] = useState(false);
  const rafRef = useRef<number | null>(null);
  const roundStartRef = useRef<number>(0);
  const answeredRef = useRef<boolean>(false);

  const total = exercises.length;
  const totalPossible = total * 200;

  const labels = useMemo(() => {
    if (lang === "es") {
      return {
        heading: "Reto dinámico",
        subheading:
          "Pon a prueba tu comprensión. Puntos por acierto + racha + velocidad.",
        start: "Comenzar reto",
        round: "Ronda",
        streak: "Racha",
        score: "Puntos",
        correct: "¡Correcto!",
        incorrect: "Tiempo agotado",
        next: "Siguiente",
        finish: "Terminar",
        finalTitle: "¡Reto completado!",
        replay: "Jugar de nuevo",
        gold: "Dominio oro",
        silver: "Plata sólida",
        bronze: "Bronce constante",
        keepGoing: "Sigue practicando",
        bestStreak: "Mejor racha",
        timeUp: "Se acabó el tiempo",
      };
    }
    return {
      heading: "Concept Challenge",
      subheading:
        "Put your understanding to the test. Score + streak + speed all count.",
      start: "Start Challenge",
      round: "Round",
      streak: "Streak",
      score: "Score",
      correct: "Correct!",
      incorrect: "Time's up",
      next: "Next",
      finish: "Finish",
      finalTitle: "Challenge complete!",
      replay: "Play again",
      gold: "Gold Mastery",
      silver: "Solid Silver",
      bronze: "Steady Bronze",
      keepGoing: "Keep practicing",
      bestStreak: "Best streak",
      timeUp: "Time's up",
    };
  }, [lang]);

  const clearTimer = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startRound = useCallback(() => {
    answeredRef.current = false;
    roundStartRef.current = performance.now();
    setTimeLeft(ROUND_MS);
    setWasCorrect(null);
    setPhase("playing");

    const tick = (now: number) => {
      const elapsed = now - roundStartRef.current;
      const remaining = Math.max(0, ROUND_MS - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (!answeredRef.current) {
          answeredRef.current = true;
          setStreak(0);
          setWasCorrect(false);
          setPhase("result");
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const handleCorrect = useCallback(() => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    clearTimer();
    const elapsed = performance.now() - roundStartRef.current;
    const speedBonus = elapsed < 10_000 ? 50 : elapsed < 20_000 ? 25 : 0;
    const newStreak = streak + 1;
    const streakBonus = newStreak >= 3 ? 50 : 0;
    const roundScore = 100 + speedBonus + streakBonus;
    setScore((s) => s + roundScore);
    setStreak(newStreak);
    setBestStreak((b) => Math.max(b, newStreak));
    setWasCorrect(true);
    setPhase("result");
  }, [streak, clearTimer]);

  const advance = useCallback(() => {
    const next = roundIndex + 1;
    if (next >= total) {
      setPhase("done");
      return;
    }
    setRoundIndex(next);
    startRound();
  }, [roundIndex, total, startRound]);

  const reset = useCallback(() => {
    setPhase("idle");
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWasCorrect(null);
    setTimeLeft(ROUND_MS);
  }, []);

  // Auto-advance after result briefly
  useEffect(() => {
    if (phase !== "result") return;
    if (!wasCorrect) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [phase, wasCorrect]);

  // Idle / start screen
  if (phase === "idle") {
    return (
      <section className={styles.gameSection}>
        <div className={styles.gameCardIdle}>
          <div className={styles.gameIconPulse}>
            <BoltIcon />
          </div>
          <div className={styles.gameIdleHeading}>{labels.heading}</div>
          <p className={styles.gameIdleSub}>{labels.subheading}</p>
          {title && <div className={styles.gameIdleTitle}>{title}</div>}
          <div className={styles.gameIdleMeta}>
            <span>{total} rounds</span>
            <span className={styles.gameIdleDot} />
            <span>{totalPossible} max pts</span>
          </div>
          <button
            type="button"
            className={styles.gameStartBtn}
            onClick={() => {
              setRoundIndex(0);
              setScore(0);
              setStreak(0);
              setBestStreak(0);
              startRound();
            }}
          >
            <PlayIcon fontSize="small" />
            {labels.start}
          </button>
        </div>
      </section>
    );
  }

  // End screen
  if (phase === "done") {
    const correct = Math.round(score / 100);
    const pct = total > 0 ? correct / total : 0;
    const rating =
      pct >= 0.85
        ? { name: labels.gold, tone: "#FBBF24" }
        : pct >= 0.6
          ? { name: labels.silver, tone: "#E2E8F0" }
          : pct >= 0.3
            ? { name: labels.bronze, tone: "#F59E0B" }
            : { name: labels.keepGoing, tone: "#94A3B8" };
    return (
      <section className={styles.gameSection}>
        <motion.div
          className={styles.gameCardEnd}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.gameTrophy} style={{ color: rating.tone }}>
            <TrophyIcon fontSize="large" />
          </div>
          <div className={styles.gameEndHeading}>{labels.finalTitle}</div>
          <div
            className={styles.gameEndRating}
            style={{ color: rating.tone }}
          >
            {rating.name}
          </div>
          <div className={styles.gameEndStats}>
            <div className={styles.gameStatBlock}>
              <div className={styles.gameStatValue}>{score}</div>
              <div className={styles.gameStatLabel}>{labels.score}</div>
            </div>
            <div className={styles.gameStatDivider} />
            <div className={styles.gameStatBlock}>
              <div className={styles.gameStatValue}>
                {Math.min(correct, total)}/{total}
              </div>
              <div className={styles.gameStatLabel}>correct</div>
            </div>
            <div className={styles.gameStatDivider} />
            <div className={styles.gameStatBlock}>
              <div className={styles.gameStatValue}>
                <FireIcon
                  fontSize="small"
                  style={{ verticalAlign: "middle", color: "#F59E0B" }}
                />{" "}
                {bestStreak}
              </div>
              <div className={styles.gameStatLabel}>{labels.bestStreak}</div>
            </div>
          </div>
          <button
            type="button"
            className={styles.gameResetBtn}
            onClick={reset}
          >
            <ReplayIcon fontSize="small" />
            {labels.replay}
          </button>
        </motion.div>
      </section>
    );
  }

  const currentRaw = exercises[roundIndex];
  const current = localizeExercise(currentRaw, lang);
  const Comp = pickComponent(current.type);

  const progress = 1 - timeLeft / ROUND_MS;
  const ringCirc = 2 * Math.PI * 18;
  const ringOffset = ringCirc * (1 - progress);
  const timeSec = Math.ceil(timeLeft / 1000);

  return (
    <section className={styles.gameSection}>
      <motion.div
        className={styles.gameCard}
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.gameHud}>
          <div className={styles.gameHudRound}>
            <span className={styles.gameHudLabel}>{labels.round}</span>
            <span className={styles.gameHudValue}>
              {roundIndex + 1}
              <span className={styles.gameHudValueDim}>/{total}</span>
            </span>
          </div>

          <div className={styles.gameRingWrap}>
            <svg width={44} height={44} viewBox="0 0 44 44">
              <circle
                cx={22}
                cy={22}
                r={18}
                stroke="rgba(148,163,184,0.18)"
                strokeWidth={3}
                fill="none"
              />
              <motion.circle
                cx={22}
                cy={22}
                r={18}
                stroke={timeLeft < 10_000 ? "#F59E0B" : "#10B981"}
                strokeWidth={3}
                fill="none"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  transition: "stroke 0.3s ease",
                }}
              />
            </svg>
            <span className={styles.gameRingTime}>
              <TimerIcon style={{ fontSize: 10, verticalAlign: "middle" }} />{" "}
              {timeSec}
            </span>
          </div>

          <div className={styles.gameHudStreak}>
            <FireIcon fontSize="small" />
            <span className={styles.gameHudValue}>{streak}</span>
          </div>

          <div className={styles.gameHudScore}>
            <BoltIcon fontSize="small" />
            <span className={styles.gameHudValue}>{score}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`round-${roundIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={styles.gameRoundBody}
          >
            {Comp ? (
              <Comp
                exercise={current}
                onCorrect={handleCorrect}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {phase === "result" && (
          <motion.div
            className={
              wasCorrect
                ? styles.gameResultBarCorrect
                : styles.gameResultBarWrong
            }
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={styles.gameResultText}>
              {wasCorrect ? `✓ ${labels.correct}` : `✗ ${labels.timeUp}`}
            </span>
            <button
              type="button"
              className={styles.gameNextBtn}
              onClick={advance}
            >
              {roundIndex + 1 >= total ? labels.finish : labels.next} →
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default ConceptGame;
