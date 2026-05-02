"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { IntuitionSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "./IntuitionCard.module.css";

interface Props {
  spec: IntuitionSpec;
}

/**
 * Soft glassmorphic card with a built-in glyph that explains a concept via
 * an analogy. Inherits the lesson's `--mml-accent` so it tints to the
 * current chapter.
 */
export function IntuitionCard({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const reduced = useReducedMotion() ?? false;
  const title = (lang === "es" && spec.titleEs) || spec.title || (lang === "es" ? "Intuición" : "Intuition");
  const body = (lang === "es" && spec.bodyEs) || spec.body;
  const takeaway = (lang === "es" && spec.takeawayEs) || spec.takeaway;

  return (
    <motion.aside
      className={styles.card}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.glyphSlot} aria-hidden="true">
        <Glyph kind={spec.glyph ?? "lightbulb"} />
      </div>
      <div className={styles.body}>
        <header className={styles.head}>
          <span className={styles.badge}>{lang === "es" ? "Intuición" : "Intuition"}</span>
          {title ? <h4 className={styles.title}>{title}</h4> : null}
        </header>
        <div className={styles.text}>
          <MathContent text={body} as="div" />
        </div>
        {takeaway ? (
          <p className={styles.takeaway}>
            <span className={styles.takeawayIcon} aria-hidden="true">★</span>{" "}
            <MathContent text={takeaway} as="span" />
          </p>
        ) : null}
      </div>
    </motion.aside>
  );
}

function Glyph({ kind }: { kind: NonNullable<IntuitionSpec["glyph"]> }) {
  const stroke = "var(--mml-accent, #7cf4ff)";
  const fill = "var(--mml-accent-soft, rgba(124, 244, 255, 0.10))";
  const reduced = useReducedMotion() ?? false;
  switch (kind) {
    case "arrow":
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <motion.line x1="10" y1="44" x2="44" y2="14" stroke={stroke} strokeWidth={2.6} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }} />
          <polygon points="44,14 36,18 40,22" fill={stroke} />
          <circle cx="10" cy="44" r="3" fill={stroke} />
        </svg>
      );
    case "scale":
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <line x1="10" y1="20" x2="46" y2="20" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
          <line x1="28" y1="14" x2="28" y2="46" stroke={stroke} strokeWidth={2} />
          <rect x="6" y="22" width="14" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x="36" y="22" width="14" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth={1.5} />
          <circle cx="28" cy="14" r="3" fill={stroke} />
        </svg>
      );
    case "lens":
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <motion.circle cx="22" cy="22" r="14" fill={fill} stroke={stroke} strokeWidth={2.4}
            animate={reduced ? { opacity: 1 } : { scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "22px 22px" }} />
          <line x1="32" y1="32" x2="46" y2="46" stroke={stroke} strokeWidth={3.2} strokeLinecap="round" />
          <circle cx="22" cy="22" r="6" fill="none" stroke={stroke} strokeWidth={1.4} strokeOpacity={0.5} />
        </svg>
      );
    case "spiral":
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <motion.path d="M 28 28 m 0 -2 a 2 2 0 1 1 4 4 a 4 4 0 1 1 -8 0 a 6 6 0 1 1 12 0 a 8 8 0 1 1 -16 0 a 10 10 0 1 1 20 0"
            fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 1.2, ease: "easeOut" }} />
        </svg>
      );
    case "puzzle":
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <path d="M8 8 h18 v6 a4 4 0 0 0 8 0 v-6 h14 v18 h-6 a4 4 0 0 1 0 8 h6 v14 H8 V32 h6 a4 4 0 0 0 0 -8 H8 V8 z"
            fill={fill} stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <motion.g animate={reduced ? { rotate: 0 } : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "28px 28px" }}>
            <polygon points="28,8 24,28 28,28" fill={stroke} />
            <polygon points="28,48 32,28 28,28" fill={stroke} fillOpacity={0.5} />
          </motion.g>
          <circle cx="28" cy="28" r="22" fill="none" stroke={stroke} strokeWidth={1.6} />
          <circle cx="28" cy="28" r="2.4" fill={stroke} />
        </svg>
      );
    case "lightbulb":
    default:
      return (
        <svg viewBox="0 0 56 56" width={42} height={42}>
          <motion.path d="M28 8 c -8 0 -14 6 -14 13 c 0 5 3 9 7 12 v6 h14 v-6 c 4 -3 7 -7 7 -12 c 0 -7 -6 -13 -14 -13 z"
            fill={fill} stroke={stroke} strokeWidth={2}
            animate={reduced ? { opacity: 1 } : { opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
          <line x1="22" y1="44" x2="34" y2="44" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
          <line x1="24" y1="48" x2="32" y2="48" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
  }
}

export default IntuitionCard;
