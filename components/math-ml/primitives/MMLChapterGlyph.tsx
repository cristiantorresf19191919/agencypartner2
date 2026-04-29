"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MMLGlyph } from "@/lib/mmlChapterAccents";

interface Props {
  glyph: MMLGlyph;
  accent: string;
}

/**
 * Tiny SVG mascot rendered in the per-lesson hero block. Each chapter has its
 * own glyph that hints at the math; gentle Framer Motion animation runs on
 * mount unless the user prefers reduced motion.
 */
export function MMLChapterGlyph({ glyph, accent }: Props) {
  const reduced = useReducedMotion() ?? false;
  const dur = reduced ? 0 : 1;

  switch (glyph) {
    case "sigma":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.text
            x="32" y="44" textAnchor="middle"
            fontFamily="'Times New Roman', serif" fontSize={48} fontWeight={400}
            fill={accent}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur * 0.7, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${accent}aa)` }}
          >Σ</motion.text>
        </svg>
      );

    case "vectors":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.line
            x1="32" y1="32" x2="32" y2="32"
            stroke={accent} strokeWidth={2.5} strokeLinecap="round"
            initial={{ x2: 32, y2: 32 }}
            animate={{ x2: 56, y2: 14 }}
            transition={{ duration: dur * 0.6, ease: "easeOut" }}
          />
          <motion.line
            x1="32" y1="32" x2="32" y2="32"
            stroke={accent} strokeWidth={2.5} strokeLinecap="round"
            initial={{ x2: 32, y2: 32 }}
            animate={{ x2: 14, y2: 22 }}
            transition={{ duration: dur * 0.6, delay: dur * 0.15, ease: "easeOut" }}
          />
          <motion.circle
            cx="32" cy="32" r={3}
            fill={accent}
            animate={reduced ? { opacity: 1 } : { scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      );

    case "norm-ball":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.circle
            cx="32" cy="32" r={20}
            fill="none" stroke={accent} strokeWidth={1.6} strokeOpacity={0.9}
            initial={{ rx: 8, ry: 8 }}
            animate={reduced ? { rx: 20, ry: 20 } : { rx: [20, 26, 16, 20], ry: [20, 16, 26, 20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${accent}99)` }}
          />
          <circle cx="32" cy="32" r={2} fill={accent} />
        </svg>
      );

    case "matrix-spin":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.g
            animate={reduced ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "32px 32px" }}
          >
            <rect x="14" y="14" width="14" height="14" rx={2} fill="none" stroke={accent} strokeWidth={1.6} />
            <rect x="36" y="14" width="14" height="14" rx={2} fill="none" stroke={accent} strokeWidth={1.6} strokeOpacity={0.6} />
            <rect x="14" y="36" width="14" height="14" rx={2} fill="none" stroke={accent} strokeWidth={1.6} strokeOpacity={0.6} />
            <rect x="36" y="36" width="14" height="14" rx={2} fill={accent} fillOpacity={0.45} stroke={accent} strokeWidth={1.6} />
          </motion.g>
        </svg>
      );

    case "gradient":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          {[
            { x1: 16, y1: 48, x2: 28, y2: 36, delay: 0 },
            { x1: 32, y1: 48, x2: 32, y2: 28, delay: 0.15 },
            { x1: 48, y1: 48, x2: 36, y2: 36, delay: 0.3 },
          ].map((a, i) => (
            <motion.line
              key={i}
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke={accent} strokeWidth={2.4} strokeLinecap="round"
              animate={reduced ? { opacity: 0.95 } : { opacity: [0.4, 1, 0.4], pathLength: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: a.delay, ease: "easeInOut" }}
              style={{ filter: `drop-shadow(0 0 4px ${accent}88)` }}
            />
          ))}
          <circle cx="32" cy="22" r={3} fill={accent} />
        </svg>
      );

    case "bell-curve":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.path
            d="M 6 50 Q 22 48 28 28 T 50 50"
            fill="none" stroke={accent} strokeWidth={2.4} strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: dur * 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 4px ${accent}88)` }}
          />
          <motion.line x1="6" y1="50" x2="58" y2="50" stroke={accent} strokeOpacity={0.4} strokeWidth={1} />
          <motion.circle
            cx="29" cy="28" r={3}
            fill={accent}
            animate={reduced ? { opacity: 1 } : { x: [0, 8, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      );

    case "descent-path":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.path
            d="M 8 16 Q 22 60 32 32 T 56 48"
            fill="none" stroke={accent} strokeWidth={2.2} strokeOpacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: dur, ease: "easeOut" }}
          />
          <motion.circle
            cx="32" cy="32" r={4}
            fill={accent}
            initial={{ cx: 8, cy: 16 }}
            animate={reduced ? { cx: 56, cy: 48 } : { cx: [8, 32, 56], cy: [16, 32, 48] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${accent}aa)` }}
          />
        </svg>
      );

    case "scatter":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          {[
            [14, 48], [22, 38], [30, 30], [38, 24], [46, 18], [18, 30], [40, 36], [50, 30],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={2.5}
              fill={accent}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: dur * 0.4, delay: i * 0.06, ease: "easeOut" }}
            />
          ))}
          <motion.line
            x1="10" y1="50" x2="54" y2="14"
            stroke={accent} strokeOpacity={0.6} strokeWidth={1.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: dur, delay: dur * 0.5, ease: "easeOut" }}
          />
        </svg>
      );

    case "ellipse":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.g
            animate={reduced ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "32px 32px" }}
          >
            <ellipse cx="32" cy="32" rx={22} ry={10} fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.7} />
            <ellipse cx="32" cy="32" rx={10} ry={22} fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.4} />
          </motion.g>
          <line x1="6" y1="32" x2="58" y2="32" stroke={accent} strokeOpacity={0.18} />
          <line x1="32" y1="6" x2="32" y2="58" stroke={accent} strokeOpacity={0.18} />
          <circle cx="32" cy="32" r={2} fill={accent} />
        </svg>
      );

    case "clusters":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          {[
            { cx: 18, cy: 22, r: 9 },
            { cx: 44, cy: 24, r: 8 },
            { cx: 30, cy: 46, r: 10 },
          ].map((c, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={c.cx} cy={c.cy} r={c.r}
                fill={accent} fillOpacity={0.18}
                stroke={accent} strokeWidth={1.4} strokeOpacity={0.8}
                animate={reduced ? { opacity: 0.85 } : { scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              />
              <circle cx={c.cx} cy={c.cy} r={2} fill={accent} />
            </motion.g>
          ))}
        </svg>
      );

    case "hyperplane":
      return (
        <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden="true">
          <motion.line
            x1="6" y1="14" x2="58" y2="50"
            stroke={accent} strokeWidth={2.4} strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: dur * 0.9, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 5px ${accent}99)` }}
          />
          {[
            [14, 22], [22, 18], [16, 30],
          ].map(([cx, cy], i) => (
            <circle key={`a-${i}`} cx={cx} cy={cy} r={2.5} fill={accent} />
          ))}
          {[
            [44, 38], [50, 44], [40, 46],
          ].map(([cx, cy], i) => (
            <circle key={`b-${i}`} cx={cx} cy={cy} r={2.5} fill={accent} fillOpacity={0.5} />
          ))}
        </svg>
      );

    default:
      return null;
  }
}

export default MMLChapterGlyph;
