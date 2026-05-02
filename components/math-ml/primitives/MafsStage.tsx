"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useVizFullscreen } from "./VizFullscreenContext";
import { Narration, type NarrationBeat } from "./Narration";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

export function useMafsHeight(defaultHeight: number, fullscreenMargin = 260): number {
  const isFullscreen = useVizFullscreen();
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    if (!isFullscreen) {
      setHeight(defaultHeight);
      return;
    }
    const compute = () => {
      if (typeof window === "undefined") return;
      setHeight(Math.max(defaultHeight, window.innerHeight - fullscreenMargin));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [isFullscreen, defaultHeight, fullscreenMargin]);

  return height;
}

interface ParticleCfg {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function useParticles(count: number, seed = 7) {
  return useMemo<ParticleCfg[]>(() => {
    let s = seed;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const arr: ParticleCfg[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * 100,
        y: rnd() * 100,
        size: 1 + rnd() * 2,
        delay: rnd() * 4,
        duration: 4 + rnd() * 6,
      });
    }
    return arr;
  }, [count, seed]);
}

interface MafsStageProps {
  children: React.ReactNode;
  accent?: "emerald" | "blue" | "violet" | "amber";
  /**
   * Optional Manim-style caption overlay. Beats fade in sequentially when the
   * stage scrolls into view.
   */
  narration?: NarrationBeat[];
}

export function MafsStage({
  children,
  accent = "emerald",
  narration,
}: MafsStageProps) {
  const isFullscreen = useVizFullscreen();
  const particles = useParticles(14);
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";

  const accentClass =
    accent === "blue"
      ? styles.mafsStageAccentBlue
      : accent === "violet"
        ? styles.mafsStageAccentViolet
        : accent === "amber"
          ? styles.mafsStageAccentAmber
          : styles.mafsStageAccentEmerald;

  return (
    <div
      className={`${styles.mafsStage} ${accentClass} ${isFullscreen ? styles.mafsStageFullscreen : ""}`}
    >
      <div className={styles.mafsStageBg} aria-hidden="true" />
      <motion.div
        className={styles.mafsStageAurora}
        aria-hidden="true"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <div className={styles.mafsStageGrid} aria-hidden="true" />
      <div className={styles.mafsStageParticles} aria-hidden="true">
        {particles.map((p, i) => (
          <motion.span
            key={`p-${i}`}
            className={styles.mafsStageParticle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {narration && narration.length > 0 ? (
        <Narration beats={narration} lang={lang} />
      ) : null}
      <div className={styles.mafsStageContent}>{children}</div>
      <div className={styles.mafsStageGlow} aria-hidden="true" />
      <div className={styles.mafsStageVignette} aria-hidden="true" />
    </div>
  );
}

export default MafsStage;
