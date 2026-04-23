"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ExpandMore as ExpandMoreIcon,
  ArrowForward as ArrowForwardIcon,
  AccountTree as AccountTreeIcon,
} from "@mui/icons-material";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { getConcept } from "@/lib/mmlConcepts";
import styles from "../MathML.module.css";

interface Props {
  conceptIds: string[];
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function PrerequisitesRail({ conceptIds }: Props) {
  const { language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const lang = language === "es" ? "es" : "en";
  const [openId, setOpenId] = useState<string | null>(null);

  const concepts = conceptIds
    .map((id) => getConcept(id))
    .filter((c): c is NonNullable<ReturnType<typeof getConcept>> => Boolean(c));

  if (concepts.length === 0) return null;

  const heading =
    lang === "es" ? "Conceptos que usarás" : "Concepts you'll lean on";
  const sub =
    lang === "es"
      ? "Toca cualquiera para ver la definición y un ejemplo."
      : "Tap any to see its definition and a worked example.";
  const deepDiveLabel = lang === "es" ? "Ver lección completa" : "Open lesson";

  return (
    <section className={styles.prereqRail}>
      <div className={styles.prereqRailHead}>
        <div className={styles.prereqRailIcon}>
          <AccountTreeIcon fontSize="small" />
        </div>
        <div className={styles.prereqRailHeadText}>
          <div className={styles.prereqRailTitle}>{heading}</div>
          <div className={styles.prereqRailSub}>{sub}</div>
        </div>
        <span className={styles.prereqRailCount}>
          {concepts.length}{" "}
          {lang === "es"
            ? concepts.length === 1
              ? "concepto"
              : "conceptos"
            : concepts.length === 1
              ? "concept"
              : "concepts"}
        </span>
      </div>

      <div className={styles.prereqRailGrid}>
        {concepts.map((c) => {
          const isOpen = openId === c.id;
          const term = pick(lang, c.termEs, c.term);
          const oneLiner = pick(lang, c.oneLinerEs, c.oneLiner);
          const definition = pick(lang, c.definitionEs, c.definition);
          const exampleText = pick(lang, c.exampleTextEs, c.exampleText);
          const tagColor = c.tagColor ?? "emerald";
          return (
            <div
              key={c.id}
              className={`${styles.prereqCard} ${styles[`prereqCardTag_${tagColor}`] ?? ""} ${isOpen ? styles.prereqCardOpen : ""}`}
            >
              <button
                type="button"
                className={styles.prereqCardHead}
                onClick={() => setOpenId(isOpen ? null : c.id)}
                aria-expanded={isOpen}
              >
                <span className={styles.prereqCardBullet} />
                <div className={styles.prereqCardTermWrap}>
                  <div className={styles.prereqCardTerm}>{term}</div>
                  <div className={styles.prereqCardOneLiner}>
                    <MathContent text={oneLiner} as="span" />
                  </div>
                </div>
                <ExpandMoreIcon
                  className={`${styles.prereqCardChevron} ${isOpen ? styles.prereqCardChevronOpen : ""}`}
                  fontSize="small"
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.prereqCardBody}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className={styles.prereqCardBodyInner}>
                      <MathContent
                        text={definition}
                        as="p"
                        className={styles.prereqCardDef}
                      />
                      {(c.exampleLatex || exampleText) && (
                        <div className={styles.prereqCardExample}>
                          <div className={styles.prereqCardExampleLabel}>
                            {lang === "es" ? "Ejemplo" : "Example"}
                          </div>
                          {c.exampleLatex && (
                            <MathContent
                              text={`$${c.exampleLatex}$`}
                              as="div"
                            />
                          )}
                          {exampleText && (
                            <MathContent
                              text={exampleText}
                              as="p"
                              className={styles.prereqCardExampleText}
                            />
                          )}
                        </div>
                      )}
                      {c.lessonId && (
                        <Link
                          href={createLocalizedPath(
                            `/developer-section/mathematics-ml/${c.lessonId}`,
                          )}
                          className={styles.prereqCardLink}
                        >
                          {deepDiveLabel}
                          <ArrowForwardIcon fontSize="small" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PrerequisitesRail;
