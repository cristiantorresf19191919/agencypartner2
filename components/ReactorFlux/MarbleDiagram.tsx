"use client";

import React from "react";
import styles from "./MarbleDiagram.module.css";

export interface MarbleDiagramProps {
  /** Operator name (e.g. "expand", "just", "map") used to pick variant. */
  name?: string;
  /** Caption shown below the diagram. */
  caption?: string;
  /** Optional className for the wrapper. */
  className?: string;
}

const MARBLE_COLORS = ["#22c55e", "#eab308", "#3b82f6", "#a855f7", "#ec4899"];

/**
 * Animated marble diagram for reactive streams. Used as fallback when
 * static SVG images fail to load, or as the primary diagram display.
 */
export function MarbleDiagram({ name = "generic", caption, className = "" }: MarbleDiagramProps) {
  const slug = name.replace(/\.(svg|png|jpg)$/, "").toLowerCase();
  const isJust = slug === "just" || slug === "empty" || slug === "never";
  const isExpand = slug === "expand" || slug === "expanddeep";
  const isMap = slug === "map" || slug === "flatmap" || slug === "concatmap" || slug === "scan";
  const isMerge = slug === "merge" || slug === "concat" || slug === "zip" || slug === "combinelatest";
  const isFilter = slug === "filter" || slug === "take" || slug === "skip" || slug === "distinct";

  return (
    <figure className={`${styles.figure} ${className}`}>
      <div className={styles.diagramWrap}>
        <svg
          className={styles.diagram}
          viewBox="0 0 400 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="marbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="marbleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="marbleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="marbleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>
          {/* Timeline */}
          <line
            x1="20"
            y1="60"
            x2="380"
            y2="60"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Completion vertical line */}
          <line
            x1="360"
            y1="30"
            x2="360"
            y2="90"
            stroke="rgba(34, 197, 94, 0.9)"
            strokeWidth="2"
            className={styles.completionLine}
          />

          {isJust && (
            <>
              <circle
                cx="120"
                cy="60"
                r="14"
                fill="url(#marbleGrad1)"
                filter="url(#marbleShadow)"
                className={styles.marble}
              />
            </>
          )}

          {isExpand && (
            <>
              <circle
                cx="80"
                cy="60"
                r="12"
                fill="url(#marbleGrad1)"
                filter="url(#marbleShadow)"
                className={styles.marble}
              />
              <line x1="120" y1="60" x2="160" y2="35" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="120" y1="60" x2="160" y2="60" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="120" y1="60" x2="160" y2="85" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="200" cy="35" r="10" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="240" cy="60" r="10" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="280" cy="85" r="10" fill="url(#marbleGrad3)" filter="url(#marbleShadow)" className={styles.marble} />
            </>
          )}

          {(isMap || slug === "generic") && !isJust && !isExpand && (
            <>
              <circle cx="70" cy="60" r="11" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="120" cy="60" r="11" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="170" cy="60" r="11" fill="url(#marbleGrad3)" filter="url(#marbleShadow)" className={styles.marble} />
              <rect x="200" y="45" width="70" height="30" rx="6" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1" className={styles.operatorBox} />
              <text x="235" y="65" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="10" fontWeight="600">
                {slug === "map" ? "map" : slug === "flatmap" ? "flatMap" : slug === "scan" ? "scan" : "…"}
              </text>
              <circle cx="300" cy="60" r="10" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marbleOut} />
              <circle cx="330" cy="60" r="10" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marbleOut} />
            </>
          )}

          {isFilter && !isJust && !isExpand && !isMap && (
            <>
              <circle cx="60" cy="60" r="11" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="110" cy="60" r="11" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="160" cy="60" r="11" fill="url(#marbleGrad3)" filter="url(#marbleShadow)" className={styles.marble} />
              <rect x="195" y="45" width="60" height="30" rx="6" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1" />
              <text x="225" y="65" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="10" fontWeight="600">
                filter
              </text>
              <circle cx="290" cy="60" r="10" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marbleOut} />
              <circle cx="330" cy="60" r="10" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marbleOut} />
            </>
          )}

          {isMerge && !isJust && !isExpand && !isMap && !isFilter && (
            <>
              <line x1="30" y1="40" x2="150" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="150" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="70" cy="40" r="9" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="110" cy="80" r="9" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marble} />
              <text x="90" y="63" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">+</text>
              <circle cx="220" cy="60" r="10" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marbleOut} />
              <circle cx="260" cy="60" r="10" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marbleOut} />
            </>
          )}

          {/* Generic fallback: simple timeline with marbles */}
          {!isJust && !isExpand && !isMap && !isFilter && !isMerge && (
            <>
              <circle cx="80" cy="60" r="12" fill="url(#marbleGrad1)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="160" cy="60" r="12" fill="url(#marbleGrad2)" filter="url(#marbleShadow)" className={styles.marble} />
              <circle cx="240" cy="60" r="12" fill="url(#marbleGrad3)" filter="url(#marbleShadow)" className={styles.marble} />
            </>
          )}
        </svg>
      </div>
      {caption && (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  );
}
