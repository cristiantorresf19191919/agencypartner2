"use client";

import React, { useEffect, useState } from "react";
import {
  LocalFireDepartment as FireIcon,
  Bolt as BoltIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import {
  getStreakState,
  maybeResetStreak,
  type StreakState,
} from "@/lib/courseProgress";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StreakXP.module.css";

/**
 * Compact streak / XP / best-streak chip set rendered alongside the
 * Continue rail on the developer-section landing.
 */
export function StreakXP() {
  const [state, setState] = useState<StreakState>({ xp: 0, streak: 0, bestStreak: 0 });
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";

  useEffect(() => {
    maybeResetStreak();
    setState(getStreakState());
    const refresh = () => setState(getStreakState());
    window.addEventListener("streak-changed", refresh);
    window.addEventListener("course-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("streak-changed", refresh);
      window.removeEventListener("course-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (state.xp === 0 && state.streak === 0 && state.bestStreak === 0) {
    return null;
  }

  const dayLabel = lang === "es" ? (state.streak === 1 ? "día" : "días") : state.streak === 1 ? "day" : "days";

  return (
    <section className={styles.section} aria-label={lang === "es" ? "Racha y XP" : "Streak and XP"}>
      <div className={`${styles.tile} ${styles.tileFire}`}>
        <FireIcon className={styles.icon} fontSize="small" />
        <span className={styles.tileBody}>
          <span className={styles.tileValue}>{state.streak}</span>
          <span className={styles.tileLabel}>
            {lang === "es" ? "racha actual" : "current streak"} · {dayLabel}
          </span>
        </span>
      </div>
      <div className={`${styles.tile} ${styles.tileTrophy}`}>
        <TrophyIcon className={styles.icon} fontSize="small" />
        <span className={styles.tileBody}>
          <span className={styles.tileValue}>{state.bestStreak}</span>
          <span className={styles.tileLabel}>
            {lang === "es" ? "racha máxima" : "best streak"}
          </span>
        </span>
      </div>
      <div className={`${styles.tile} ${styles.tileXp}`}>
        <BoltIcon className={styles.icon} fontSize="small" />
        <span className={styles.tileBody}>
          <span className={styles.tileValue}>{state.xp.toLocaleString(lang === "es" ? "es-ES" : "en-US")}</span>
          <span className={styles.tileLabel}>XP</span>
        </span>
      </div>
    </section>
  );
}

export default StreakXP;
