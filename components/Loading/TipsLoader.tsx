"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CODING_TIPS } from "@/lib/codingTips";
import styles from "./TipsLoader.module.css";

interface TipsLoaderProps {
  /** Override locale; if omitted, reads from LanguageContext. */
  lang?: "en" | "es";
  /** Override the eyebrow label (defaults to localized "Loading…"). */
  label?: string;
  /** Milliseconds between tip rotations. Defaults to 4500. */
  rotateMs?: number;
}

const LABELS = {
  en: "Loading",
  es: "Cargando",
};

function pickRandomIndex(length: number, exclude: number) {
  if (length <= 1) return 0;
  let i = Math.floor(Math.random() * length);
  while (i === exclude) {
    i = Math.floor(Math.random() * length);
  }
  return i;
}

export function TipsLoader({ lang, label, rotateMs = 4500 }: TipsLoaderProps) {
  const { language } = useLanguage();
  const resolvedLang: "en" | "es" = lang ?? (language === "es" ? "es" : "en");
  // Start at 0 on both server and client to avoid hydration mismatch,
  // then jump to a random tip on first effect.
  const [index, setIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * CODING_TIPS.length));
    setAnimateKey(1);
    const id = window.setInterval(() => {
      setIndex((prev) => pickRandomIndex(CODING_TIPS.length, prev));
      setAnimateKey((k) => k + 1);
    }, rotateMs);
    return () => window.clearInterval(id);
  }, [rotateMs]);

  const tip = CODING_TIPS[index];
  const eyebrow = label ?? LABELS[resolvedLang];

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.gridPattern} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.spinnerWrap} aria-hidden="true">
          <div className={styles.spinner}>
            <span className={styles.spinnerRing} />
            <span className={styles.spinnerRing} />
            <span className={styles.spinnerCore} />
          </div>
        </div>

        <div className={styles.label}>{eyebrow}</div>

        <div className={styles.tipFrame}>
          <div key={animateKey} className={styles.tip}>
            <span className={styles.emoji} aria-hidden="true">{tip.emoji}</span>
            <p className={styles.text}>{resolvedLang === "es" ? tip.es : tip.en}</p>
          </div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <div className={styles.progressFill} />
        </div>

        <div className={styles.dotsRow} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === animateKey % 5 ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TipsLoader;
