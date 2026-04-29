"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DerivationSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { FormulaChain } from "../formula-anim/FormulaChain";
import styles from "./DerivationFlow.module.css";

interface Props {
  spec: DerivationSpec;
}

/**
 * Step-by-step derivation: a FormulaChain on the left (or top) drives a
 * reveal on the right, where each row shows the *why* of the morph that
 * just happened. Rows fade in sequentially when the block scrolls into
 * view.
 */
export function DerivationFlow({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const reduced = useReducedMotion() ?? false;

  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(reduced ? spec.steps.length : 0);

  useEffect(() => {
    if (reduced) {
      setRevealed(spec.steps.length);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || played) continue;
          played = true;
          observer.disconnect();
          spec.steps.forEach((_, i) => {
            window.setTimeout(() => setRevealed((c) => Math.max(c, i + 1)), i * 850);
          });
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, spec.steps]);

  const title = (lang === "es" && spec.titleEs) || spec.title;
  const caption = (lang === "es" && spec.captionEs) || spec.caption;

  return (
    <section className={styles.card} ref={ref}>
      <header className={styles.head}>
        <span className={styles.badge}>
          {lang === "es" ? "Derivación paso a paso" : "Step-by-step derivation"}
        </span>
        {title ? <h4 className={styles.title}>{title}</h4> : null}
      </header>
      {caption ? <p className={styles.caption}>{caption}</p> : null}

      <div className={styles.grid}>
        <div className={styles.formula}>
          <FormulaChain
            spec={{
              steps: spec.steps.map((s) => s.latex),
              pacing: "auto",
            }}
          />
        </div>

        <ol className={styles.list}>
          {spec.steps.map((s, i) => {
            const visible = i < revealed;
            const explain = (lang === "es" && s.explainEs) || s.explain;
            return (
              <motion.li
                key={i}
                className={styles.item}
                initial={false}
                animate={{
                  opacity: visible ? 1 : 0.18,
                  x: visible ? 0 : -6,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.stepNum}>{i + 1}</span>
                <div className={styles.stepBody}>
                  <MathContent text={explain} as="div" className={styles.stepText} />
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default DerivationFlow;
