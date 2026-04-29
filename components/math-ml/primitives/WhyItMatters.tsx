"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { WhyItMattersSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "./WhyItMatters.module.css";

interface Props {
  spec: WhyItMattersSpec;
}

/**
 * "Why this matters in ML" anchor. Concise body + a row of consequence
 * chips. Tints to the lesson's chapter accent.
 */
export function WhyItMatters({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const reduced = useReducedMotion() ?? false;
  const title = (lang === "es" && spec.titleEs) || spec.title || (lang === "es" ? "Por qué importa en ML" : "Why this matters in ML");
  const body = (lang === "es" && spec.bodyEs) || spec.body;
  const bullets = (lang === "es" && spec.bulletsEs) || spec.bullets || [];

  return (
    <motion.aside
      className={styles.card}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.head}>
        <span className={styles.badge}>{lang === "es" ? "Conexión con ML" : "ML connection"}</span>
        <h4 className={styles.title}>{title}</h4>
      </header>
      <div className={styles.body}>
        <MathContent text={body} as="div" />
      </div>
      {bullets.length > 0 && (
        <ul className={styles.chips}>
          {bullets.map((b, i) => (
            <li key={i} className={styles.chip}>
              <span className={styles.chipDot} aria-hidden="true" />
              <MathContent text={b} as="span" />
            </li>
          ))}
        </ul>
      )}
    </motion.aside>
  );
}

export default WhyItMatters;
