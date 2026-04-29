"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TheoremSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "./TheoremCard.module.css";

interface Props {
  spec: TheoremSpec;
}

/**
 * Boxed math callout for theorems / definitions / lemmas / corollaries.
 * Each kind has its own glyph + accent tone. Optional collapsible proof.
 */
export function TheoremCard({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const reduced = useReducedMotion() ?? false;
  const [proofOpen, setProofOpen] = useState(false);

  const labels = LABELS[spec.kind][lang];
  const glyph = GLYPHS[spec.kind];
  const accent = ACCENT_BY_KIND[spec.kind];

  const name = (lang === "es" && spec.nameEs) || spec.name;
  const statement = (lang === "es" && spec.statementEs) || spec.statement;
  const proof = (lang === "es" && spec.proofEs) || spec.proof;

  return (
    <motion.aside
      className={`${styles.card} ${styles[`card_${spec.kind}`]}`}
      style={{ ["--theorem-tone" as string]: accent }}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.head}>
        <span className={styles.glyph} aria-hidden="true">
          {glyph}
        </span>
        <span className={styles.kind}>{labels.kind}</span>
        {name ? <h4 className={styles.name}>{name}</h4> : null}
      </div>

      <div className={styles.statement}>
        <MathContent text={statement} as="div" />
      </div>

      {proof ? (
        <>
          <button
            type="button"
            className={styles.proofToggle}
            onClick={() => setProofOpen((v) => !v)}
            aria-expanded={proofOpen}
          >
            <span className={styles.proofChevron} data-open={proofOpen}>
              ▸
            </span>
            {proofOpen ? labels.hideProof : labels.showProof}
          </button>
          <AnimatePresence initial={false}>
            {proofOpen ? (
              <motion.div
                key="proof"
                className={styles.proof}
                initial={reduced ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className={styles.proofInner}>
                  <span className={styles.proofLabel}>{labels.proof}</span>
                  <MathContent text={proof} as="div" />
                  <span className={styles.qed} aria-hidden="true">∎</span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      ) : null}
    </motion.aside>
  );
}

const GLYPHS: Record<TheoremSpec["kind"], string> = {
  theorem: "Θ",
  definition: "≝",
  lemma: "Λ",
  corollary: "∴",
};

const ACCENT_BY_KIND: Record<TheoremSpec["kind"], string> = {
  // Falls back to the lesson chapter accent via var() if the spec doesn't
  // override.  These provide a subtle hue distinction between kinds when the
  // chapter accent is the same.
  theorem: "var(--mml-accent, #7cf4ff)",
  definition: "#60a5fa",
  lemma: "#fbbf24",
  corollary: "#34d399",
};

const LABELS: Record<TheoremSpec["kind"], Record<"en" | "es", { kind: string; showProof: string; hideProof: string; proof: string }>> = {
  theorem: {
    en: { kind: "Theorem", showProof: "Show proof", hideProof: "Hide proof", proof: "Proof" },
    es: { kind: "Teorema", showProof: "Ver demostración", hideProof: "Ocultar demostración", proof: "Demostración" },
  },
  definition: {
    en: { kind: "Definition", showProof: "Notes", hideProof: "Hide notes", proof: "Notes" },
    es: { kind: "Definición", showProof: "Notas", hideProof: "Ocultar notas", proof: "Notas" },
  },
  lemma: {
    en: { kind: "Lemma", showProof: "Show proof", hideProof: "Hide proof", proof: "Proof" },
    es: { kind: "Lema", showProof: "Ver demostración", hideProof: "Ocultar demostración", proof: "Demostración" },
  },
  corollary: {
    en: { kind: "Corollary", showProof: "Show proof", hideProof: "Hide proof", proof: "Proof" },
    es: { kind: "Corolario", showProof: "Ver demostración", hideProof: "Ocultar demostración", proof: "Demostración" },
  },
};

export default TheoremCard;
