"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AnnotatedFormulaSpec, AnnotatedFormulaToken } from "@/lib/mmlTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

interface Props {
  spec: AnnotatedFormulaSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function AnnotatedFormula({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tokenRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [arrows, setArrows] = useState<
    Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      idx: number;
    }>
  >([]);

  const title = pick(lang, spec.titleEs, spec.title);
  const caption = pick(lang, spec.captionEs, spec.caption);

  useLayoutEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const next: typeof arrows = [];
      spec.tokens.forEach((tok, i) => {
        if (!tok.label) return;
        const tokEl = tokenRefs.current[i];
        const labEl = labelRefs.current[i];
        if (!tokEl || !labEl) return;
        const tRect = tokEl.getBoundingClientRect();
        const lRect = labEl.getBoundingClientRect();
        const x1 = lRect.left + lRect.width / 2 - cRect.left;
        const y1 = lRect.top - cRect.top - 6;
        const x2 = tRect.left + tRect.width / 2 - cRect.left;
        const y2 = tRect.bottom - cRect.top + 4;
        next.push({
          x1,
          y1,
          x2,
          y2,
          color: tok.labelColor ?? tok.color ?? "#34D399",
          idx: i,
        });
      });
      setArrows(next);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [spec.tokens, lang]);

  return (
    <div className={styles.annotatedFormula}>
      {title && <div className={styles.annotatedFormulaTitle}>{title}</div>}
      <div ref={containerRef} className={styles.annotatedFormulaStage}>
        <svg
          className={styles.annotatedFormulaArrows}
          aria-hidden="true"
        >
          <defs>
            {arrows.map((a) => (
              <marker
                key={`m-${a.idx}`}
                id={`afArrow-${spec.id ?? "x"}-${a.idx}`}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill={a.color} />
              </marker>
            ))}
          </defs>
          {arrows.map((a) => (
            <motion.line
              key={`l-${a.idx}`}
              x1={a.x1}
              y1={a.y1}
              x2={a.x2}
              y2={a.y2}
              stroke={a.color}
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 * a.idx }}
              markerEnd={`url(#afArrow-${spec.id ?? "x"}-${a.idx})`}
              style={{ filter: `drop-shadow(0 0 6px ${a.color}66)` }}
            />
          ))}
        </svg>

        <div className={styles.annotatedFormulaFormulaRow}>
          {spec.tokens.map((tok, i) => (
            <TokenSpan
              key={`t-${i}`}
              token={tok}
              refCb={(el) => {
                tokenRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        <div className={styles.annotatedFormulaLabelRow}>
          {spec.tokens.map((tok, i) => {
            const label = pick(lang, tok.labelEs, tok.label);
            if (!label) return <span key={`lbl-${i}`} />;
            return (
              <motion.span
                key={`lbl-${i}`}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className={styles.annotatedFormulaLabel}
                style={{ color: tok.labelColor ?? tok.color ?? "#34D399" }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 * i + 0.4 }}
              >
                {label}
              </motion.span>
            );
          })}
        </div>
      </div>

      {caption && (
        <div className={styles.annotatedFormulaCaption}>{caption}</div>
      )}
    </div>
  );
}

function TokenSpan({
  token,
  refCb,
}: {
  token: AnnotatedFormulaToken;
  refCb: (el: HTMLSpanElement | null) => void;
}) {
  const sizeClass =
    token.size === "xl"
      ? styles.annotatedFormulaTokenXL
      : token.size === "m"
        ? styles.annotatedFormulaTokenM
        : styles.annotatedFormulaTokenL;
  const color = token.color ?? "#E5E7EB";
  return (
    <span className={styles.annotatedFormulaTokenWrap}>
      <span
        ref={refCb}
        className={`${styles.annotatedFormulaToken} ${sizeClass}`}
        style={{
          color,
          textShadow: token.label
            ? `0 0 18px ${color}55`
            : `0 0 10px ${color}22`,
        }}
      >
        {token.text}
      </span>
      {token.shape && (
        <span
          className={styles.annotatedFormulaShape}
          style={{ color: `${color}cc`, borderColor: `${color}55` }}
          aria-label={`Shape ${token.shape}`}
        >
          {token.shape}
        </span>
      )}
    </span>
  );
}

export default AnnotatedFormula;
