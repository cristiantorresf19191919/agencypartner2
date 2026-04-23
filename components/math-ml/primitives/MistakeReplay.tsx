"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReplayRounded as ReplayIcon,
  ExpandMore as ExpandMoreIcon,
  WarningAmberRounded as WarningIcon,
} from "@mui/icons-material";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

interface Step {
  latex?: string;
  explanation: string;
  explanationEs?: string;
  highlight?: boolean;
}

interface Props {
  steps: Step[];
  /** When true, the replay is expanded on mount. */
  autoOpen?: boolean;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function MistakeReplay({ steps, autoOpen = true }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [open, setOpen] = useState(autoOpen);

  if (!steps || steps.length === 0) return null;

  const heading =
    lang === "es"
      ? "Repasa la solución correcta"
      : "Replay the correct solution";
  const sub =
    lang === "es"
      ? "Resaltamos el paso donde un error típico aparece."
      : "We highlight the step where a typical mistake appears.";
  const toggle = lang === "es" ? (open ? "Ocultar" : "Mostrar") : open ? "Hide" : "Show";

  return (
    <div className={styles.mistakeReplay}>
      <button
        type="button"
        className={styles.mistakeReplayHead}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className={styles.mistakeReplayIcon}>
          <ReplayIcon fontSize="small" />
        </div>
        <div className={styles.mistakeReplayHeadText}>
          <div className={styles.mistakeReplayTitle}>{heading}</div>
          <div className={styles.mistakeReplaySub}>{sub}</div>
        </div>
        <span className={styles.mistakeReplayToggle}>
          {toggle}
          <ExpandMoreIcon
            className={`${styles.mistakeReplayChev} ${open ? styles.mistakeReplayChevOpen : ""}`}
            fontSize="small"
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            className={styles.mistakeReplayList}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            {steps.map((step, i) => {
              const exp = pick(lang, step.explanationEs, step.explanation);
              return (
                <li
                  key={`mstep-${i}`}
                  className={`${styles.mistakeReplayItem} ${step.highlight ? styles.mistakeReplayItemHot : ""}`}
                >
                  <div className={styles.mistakeReplayIndex}>
                    {step.highlight ? (
                      <WarningIcon fontSize="small" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className={styles.mistakeReplayBody}>
                    {step.latex && (
                      <div className={styles.mistakeReplayMath}>
                        <MathContent text={`$$${step.latex}$$`} as="div" />
                      </div>
                    )}
                    <MathContent
                      text={exp}
                      as="p"
                      className={styles.mistakeReplayText}
                    />
                  </div>
                </li>
              );
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MistakeReplay;
