"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb as LightbulbIcon,
  WarningAmberRounded as WarningIcon,
  PlayArrow as PlayIcon,
  RestartAlt as RestartIcon,
} from "@mui/icons-material";
import type { StepSolutionSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

/* ------------------------------------------------------------------ */
/* AnalogyCard                                                         */
/* ------------------------------------------------------------------ */

export function AnalogyCard({ text }: { text: string }) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  return (
    <motion.aside
      className={styles.analogyCard}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.analogyIcon}>
        <LightbulbIcon fontSize="small" />
      </div>
      <div className={styles.analogyBody}>
        <div className={styles.analogyLabel}>
          {lang === "es" ? "Analogía" : "Analogy"}
        </div>
        <MathContent text={text} as="div" className={styles.analogyText} />
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* PitfallCallout                                                      */
/* ------------------------------------------------------------------ */

export function PitfallCallout({ text }: { text: string }) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  return (
    <motion.aside
      className={styles.pitfallCard}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.pitfallIcon}>
        <WarningIcon fontSize="small" />
      </div>
      <div className={styles.pitfallBody}>
        <div className={styles.pitfallLabel}>
          {lang === "es" ? "Ten cuidado" : "Watch out"}
        </div>
        <MathContent text={text} as="div" className={styles.pitfallText} />
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* StepwiseSolution                                                    */
/* ------------------------------------------------------------------ */

export function StepwiseSolution({ spec }: { spec: StepSolutionSpec }) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [revealed, setRevealed] = useState(0);

  const title =
    (lang === "es" && spec.titleEs) ||
    spec.title ||
    (lang === "es" ? "Resolución paso a paso" : "Step-by-step solution");

  const total = spec.steps.length;
  const isAllRevealed = revealed >= total;
  const showStep = (lang === "es" ? "Mostrar paso" : "Reveal step") + ` ${revealed + 1}`;
  const restart = lang === "es" ? "Reiniciar" : "Restart";

  return (
    <section className={styles.stepSolver}>
      <div className={styles.stepSolverHead}>
        <span className={styles.stepSolverTag}>
          {lang === "es" ? "Resuélvelo conmigo" : "Solve with me"}
        </span>
        <div className={styles.stepSolverTitle}>{title}</div>
        <div className={styles.stepSolverProgress}>
          {revealed} / {total}
        </div>
      </div>

      <ol className={styles.stepSolverList}>
        <AnimatePresence initial={false}>
          {spec.steps.slice(0, revealed).map((step, i) => {
            const explanation =
              (lang === "es" && step.explanationEs) || step.explanation;
            return (
              <motion.li
                key={`step-${i}`}
                className={styles.stepSolverItem}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                <div className={styles.stepSolverIndex}>{i + 1}</div>
                <div className={styles.stepSolverStepBody}>
                  {step.latex && (
                    <div className={styles.stepSolverMath}>
                      <MathContent text={`$$${step.latex}$$`} as="div" />
                    </div>
                  )}
                  <MathContent
                    text={explanation}
                    as="p"
                    className={styles.stepSolverExplanation}
                  />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      <div className={styles.stepSolverControls}>
        {!isAllRevealed ? (
          <button
            type="button"
            className={styles.stepSolverBtn}
            onClick={() => setRevealed((r) => Math.min(total, r + 1))}
          >
            <PlayIcon fontSize="small" />
            {showStep}
          </button>
        ) : (
          <button
            type="button"
            className={styles.stepSolverBtnGhost}
            onClick={() => setRevealed(0)}
          >
            <RestartIcon fontSize="small" />
            {restart}
          </button>
        )}
      </div>
    </section>
  );
}
