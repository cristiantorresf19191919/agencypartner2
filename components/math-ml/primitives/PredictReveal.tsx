"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Psychology as PsychologyIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import type { PredictRevealSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

interface Props {
  spec: PredictRevealSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function PredictReveal({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [numericAnswer, setNumericAnswer] = useState<string>("");
  const [vectorAnswer, setVectorAnswer] = useState<string[]>(() =>
    spec.prediction.kind === "vector"
      ? Array.from({ length: spec.prediction.dim }, () => "")
      : [],
  );
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [committed, setCommitted] = useState<boolean>(false);
  const [revealIdx, setRevealIdx] = useState(0);

  const title =
    pick(lang, spec.titleEs, spec.title) ??
    (lang === "es" ? "Predice y descubre" : "Predict and reveal");
  const setup = pick(lang, spec.setupEs, spec.setup);
  const promptQ = pick(lang, spec.promptQuestionEs, spec.promptQuestion);

  const predictLabel = lang === "es" ? "Comprobar" : "Commit";
  const revealLabel = lang === "es" ? "Revelar siguiente paso" : "Reveal next step";
  const correctLabel = lang === "es" ? "¡Correcto!" : "Correct!";
  const wrongLabel = lang === "es" ? "Aún no" : "Not quite";

  const evaluate = (): "correct" | "wrong" | "skipped" => {
    const p = spec.prediction;
    if (p.kind === "numeric") {
      const v = parseFloat(numericAnswer);
      if (!Number.isFinite(v)) return "skipped";
      const tol = p.tolerance ?? 0.01;
      return Math.abs(v - p.answer) <= tol ? "correct" : "wrong";
    }
    if (p.kind === "vector") {
      const parsed = vectorAnswer.map((s) => parseFloat(s));
      if (parsed.some((v) => !Number.isFinite(v))) return "skipped";
      const tol = p.tolerance ?? 0.01;
      const ok = parsed.every(
        (v, i) => Math.abs(v - p.answer[i]) <= tol,
      );
      return ok ? "correct" : "wrong";
    }
    if (p.kind === "multiple-choice") {
      if (mcSelected === null) return "skipped";
      return mcSelected === p.correctIndex ? "correct" : "wrong";
    }
    return "skipped";
  };

  const verdict = committed ? evaluate() : null;
  const total = spec.steps.length;
  const revealedSteps = spec.steps.slice(0, revealIdx);

  const commit = () => {
    setCommitted(true);
    setRevealIdx(1);
  };

  const revealNext = () => setRevealIdx((r) => Math.min(total, r + 1));
  const skip = () => {
    setCommitted(true);
    setRevealIdx(Math.max(1, total));
  };

  const optionsEs =
    spec.prediction.kind === "multiple-choice"
      ? spec.prediction.optionsEs
      : undefined;
  const options =
    spec.prediction.kind === "multiple-choice"
      ? (lang === "es" && optionsEs ? optionsEs : spec.prediction.options)
      : [];

  return (
    <section className={styles.predictReveal}>
      <div className={styles.predictRevealHead}>
        <div className={styles.predictRevealIcon}>
          <PsychologyIcon fontSize="small" />
        </div>
        <div className={styles.predictRevealHeadText}>
          <span className={styles.predictRevealTag}>
            {lang === "es" ? "Predice primero" : "Predict first"}
          </span>
          <div className={styles.predictRevealTitle}>{title}</div>
        </div>
      </div>

      <div className={styles.predictRevealSetup}>
        <MathContent text={setup} as="div" />
      </div>

      <div className={styles.predictRevealQuestion}>
        <MathContent text={promptQ} as="span" />
      </div>

      <div className={styles.predictRevealInput}>
        {spec.prediction.kind === "numeric" && (
          <input
            type="number"
            inputMode="decimal"
            step={0.01}
            disabled={committed}
            value={numericAnswer}
            onChange={(e) => setNumericAnswer(e.target.value)}
            placeholder={lang === "es" ? "Tu respuesta" : "Your answer"}
            className={styles.predictRevealNumInput}
            aria-label="Prediction"
          />
        )}
        {spec.prediction.kind === "vector" && (
          <div className={styles.predictRevealVectorRow}>
            {vectorAnswer.map((val, i) => (
              <input
                key={`v-${i}`}
                type="number"
                inputMode="decimal"
                step={0.01}
                disabled={committed}
                value={val}
                onChange={(e) =>
                  setVectorAnswer((prev) => {
                    const next = prev.slice();
                    next[i] = e.target.value;
                    return next;
                  })
                }
                className={styles.predictRevealNumInput}
                aria-label={`Component ${i + 1}`}
              />
            ))}
          </div>
        )}
        {spec.prediction.kind === "multiple-choice" && (
          <div className={styles.predictRevealOptions}>
            {options.map((opt, i) => (
              <button
                key={`mc-${i}`}
                type="button"
                disabled={committed}
                className={`${styles.predictRevealOption} ${
                  mcSelected === i ? styles.predictRevealOptionSelected : ""
                }`}
                onClick={() => setMcSelected(i)}
              >
                <span className={styles.predictRevealOptionIndex}>
                  {String.fromCharCode(65 + i)}
                </span>
                <MathContent text={opt} as="span" />
              </button>
            ))}
          </div>
        )}

        {!committed && (
          <div className={styles.predictRevealActions}>
            <button
              type="button"
              className={styles.predictRevealCommit}
              onClick={commit}
            >
              {predictLabel}
            </button>
            <button
              type="button"
              className={styles.predictRevealSkip}
              onClick={skip}
            >
              <VisibilityIcon fontSize="small" />
              {lang === "es" ? "Saltar a la solución" : "Skip to solution"}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {verdict && verdict !== "skipped" && (
          <motion.div
            className={`${styles.predictRevealVerdict} ${
              verdict === "correct"
                ? styles.predictRevealVerdictCorrect
                : styles.predictRevealVerdictWrong
            }`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {verdict === "correct" ? (
              <CheckIcon fontSize="small" />
            ) : (
              <CancelIcon fontSize="small" />
            )}
            <span>{verdict === "correct" ? correctLabel : wrongLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {committed && (
        <div className={styles.predictRevealSteps}>
          <div className={styles.predictRevealStepsHead}>
            <span className={styles.predictRevealStepsTag}>
              {lang === "es" ? "Solución paso a paso" : "Step-by-step solution"}
            </span>
            <span className={styles.predictRevealProgress}>
              {revealIdx} / {total}
            </span>
          </div>
          <ol className={styles.predictRevealStepsList}>
            <AnimatePresence initial={false}>
              {revealedSteps.map((step, i) => {
                const exp = pick(lang, step.explanationEs, step.explanation);
                return (
                  <motion.li
                    key={`step-${i}`}
                    className={styles.predictRevealStep}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className={styles.predictRevealStepIndex}>{i + 1}</div>
                    <div className={styles.predictRevealStepBody}>
                      {step.latex && (
                        <MathContent
                          text={`$$${step.latex}$$`}
                          as="div"
                          className={styles.predictRevealStepLatex}
                        />
                      )}
                      <MathContent
                        text={exp}
                        as="p"
                        className={styles.predictRevealStepText}
                      />
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
          {revealIdx < total && (
            <div className={styles.predictRevealStepsControls}>
              <button
                type="button"
                onClick={revealNext}
                className={styles.predictRevealRevealBtn}
              >
                <VisibilityIcon fontSize="small" />
                {revealLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PredictReveal;
