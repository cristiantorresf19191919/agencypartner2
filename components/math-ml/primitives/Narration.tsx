"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "../MathML.module.css";

export interface NarrationBeat {
  /** Caption text. Plain string — keep it short (≤ 64 chars). */
  text: string;
  /** Spanish overlay; renderer picks based on lesson locale (handled upstream). */
  textEs?: string;
  /**
   * Legacy anchor — kept for backwards compatibility but no longer affects
   * placement. Beats now render in a strip above the canvas.
   */
  anchor?: "tl" | "tr" | "bl" | "br";
}

interface NarrationProps {
  /** 2–3 beats are ideal. The component fades them in sequentially on scroll. */
  beats: NarrationBeat[];
  /** Per-beat dwell after fade-in. Default 1400ms. */
  dwellMs?: number;
  /** Per-beat fade duration. Default 500ms. */
  fadeMs?: number;
  /** Locale; if "es" and `textEs` is present, that copy is used. */
  lang?: "en" | "es";
}

/**
 * Cinematic caption overlay for any viz wrapped in MafsStage. Captions fade in
 * one at a time when the stage scrolls into view, then linger together — a
 * Manim-style "voice-over" without audio.
 */
export function Narration({
  beats,
  dwellMs = 1400,
  fadeMs = 500,
  lang = "en",
}: NarrationProps) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (reduced || beats.length === 0) {
      setVisibleCount(beats.length);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let played = false;
    let timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || played) continue;
          played = true;
          observer.disconnect();
          for (let i = 0; i < beats.length; i++) {
            timers.push(
              window.setTimeout(
                () => setVisibleCount((c) => Math.max(c, i + 1)),
                i * dwellMs,
              ),
            );
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };
  }, [beats.length, dwellMs, reduced]);

  if (beats.length === 0) return null;

  return (
    <div ref={ref} className={styles.narrationLayer} aria-live="polite">
      {beats.map((beat, i) => {
        const text = lang === "es" && beat.textEs ? beat.textEs : beat.text;
        const visible = i < visibleCount;
        return (
          <motion.span
            key={`beat-${i}`}
            className={styles.narrationBeat}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -4 }}
            transition={{ duration: fadeMs / 1000, ease: "easeOut" }}
          >
            <span className={styles.narrationDot} aria-hidden="true" />
            {text}
          </motion.span>
        );
      })}
    </div>
  );
}

export default Narration;
