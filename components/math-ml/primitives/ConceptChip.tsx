"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { getConcept } from "@/lib/mmlConcepts";
import styles from "../MathML.module.css";

interface Props {
  conceptId: string;
  displayText?: string;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function ConceptChip({ conceptId, displayText }: Props) {
  const { language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const lang = language === "es" ? "es" : "en";
  const concept = getConcept(conceptId);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: "top" | "bottom" } | null>(null);
  const chipRef = useRef<HTMLSpanElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!open || !chipRef.current) return;
    const rect = chipRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const belowSpace = vh - rect.bottom;
    const placement: "top" | "bottom" = belowSpace < 280 ? "top" : "bottom";
    const top =
      placement === "bottom"
        ? rect.bottom + window.scrollY + 8
        : rect.top + window.scrollY - 8;
    const left = rect.left + rect.width / 2 + window.scrollX;
    setCoords({ top, left, placement });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        popRef.current?.contains(e.target as Node) ||
        chipRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!concept) {
    return <span>{displayText ?? conceptId}</span>;
  }

  const term = pick(lang, concept.termEs, concept.term);
  const label = displayText ?? term;
  const oneLiner = pick(lang, concept.oneLinerEs, concept.oneLiner);
  const definition = pick(lang, concept.definitionEs, concept.definition);
  const exampleText = pick(lang, concept.exampleTextEs, concept.exampleText);
  const tagColor = concept.tagColor ?? "emerald";
  const deepDiveLabel = lang === "es" ? "Ver lección" : "Deep dive";

  return (
    <>
      <span
        ref={chipRef}
        className={`${styles.conceptChip} ${styles[`conceptChipTag_${tagColor}`] ?? ""}`}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        aria-expanded={open}
        aria-describedby={`concept-${conceptId}`}
      >
        {label}
        <span className={styles.conceptChipMark} aria-hidden="true">
          ⓘ
        </span>
      </span>

      {typeof window !== "undefined" && coords &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popRef}
                id={`concept-${conceptId}`}
                role="dialog"
                className={`${styles.conceptPop} ${styles[`conceptPopTag_${tagColor}`] ?? ""}`}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  transform:
                    coords.placement === "bottom"
                      ? "translate(-50%, 0)"
                      : "translate(-50%, -100%)",
                }}
                initial={{ opacity: 0, y: coords.placement === "bottom" ? -6 : 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: coords.placement === "bottom" ? -6 : 6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.2, 0.9, 0.3, 1.05] }}
              >
                <div className={styles.conceptPopHead}>
                  <span className={styles.conceptPopTag}>
                    {lang === "es" ? "Concepto" : "Concept"}
                  </span>
                  <div className={styles.conceptPopTerm}>{term}</div>
                </div>
                <MathContent
                  text={oneLiner}
                  as="p"
                  className={styles.conceptPopOneLiner}
                />
                <div className={styles.conceptPopDivider} />
                <MathContent
                  text={definition}
                  as="div"
                  className={styles.conceptPopBody}
                />
                {(concept.exampleLatex || exampleText) && (
                  <div className={styles.conceptPopExample}>
                    <div className={styles.conceptPopExampleLabel}>
                      {lang === "es" ? "Ejemplo" : "Example"}
                    </div>
                    {concept.exampleLatex && (
                      <MathContent
                        text={`$${concept.exampleLatex}$`}
                        as="div"
                      />
                    )}
                    {exampleText && (
                      <MathContent
                        text={exampleText}
                        as="p"
                        className={styles.conceptPopExampleText}
                      />
                    )}
                  </div>
                )}
                {concept.lessonId && (
                  <Link
                    className={styles.conceptPopLink}
                    href={createLocalizedPath(
                      `/developer-section/mathematics-ml/${concept.lessonId}`,
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {deepDiveLabel}
                    <ArrowForwardIcon fontSize="small" />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

export default ConceptChip;
