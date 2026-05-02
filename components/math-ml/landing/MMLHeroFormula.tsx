"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./MMLHeroFormula.module.css";

// FormulaChain is client-only (KaTeX + framer-motion). Lazy-load it so the
// MML index ship-cost stays small.
const FormulaChain = dynamic(
  () => import("@/components/math-ml/formula-anim/FormulaChain").then((m) => m.FormulaChain),
  { ssr: false, loading: () => null },
);

const ICONIC_FORMULAS: string[] = [
  "\\nabla L(\\mathbf{w})",
  "A\\mathbf{v} = \\lambda \\mathbf{v}",
  "A = U \\Sigma V^\\top",
  "\\arg\\min_{\\mathbf{w}} \\;\\| \\mathbf{y} - X\\mathbf{w} \\|_2^2",
  "p(\\theta \\mid x) \\propto p(x \\mid \\theta)\\, p(\\theta)",
  "\\mathrm{softmax}\\!\\left(\\dfrac{QK^\\top}{\\sqrt{d}}\\right)",
];

/**
 * Lightweight hero band that runs above the MML landing title. Six iconic
 * equations cycle through the FormulaChain morph engine — gives the page a
 * kinetic, "course directed by Manim" feel.
 */
export function MMLHeroFormula() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <motion.div
      ref={ref}
      className={styles.band}
      initial={{ opacity: 0, y: 6 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <div className={styles.aurora} />
      <div className={styles.frame}>
        {shown ? (
          <FormulaChain
            spec={{
              steps: ICONIC_FORMULAS,
              pacing: "auto",
            }}
          />
        ) : null}
      </div>
    </motion.div>
  );
}

export default MMLHeroFormula;
