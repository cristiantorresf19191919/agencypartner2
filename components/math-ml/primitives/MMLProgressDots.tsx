"use client";

import React, { useEffect, useState } from "react";
import styles from "./MMLProgressDots.module.css";

interface Props {
  /** Number of paragraphs / sections in the lesson body. */
  count: number;
  /**
   * CSS selector for the elements that mark each section. Default targets
   * the lesson paragraphs rendered by MMLLessonRenderer.
   */
  targetSelector?: string;
}

/**
 * Vertical sticky rail of dots — one per section/paragraph — that fills in
 * as the user scrolls past each section. Pairs with the per-lesson hero so
 * the reader always knows where they are without re-reading the meta bar.
 */
export function MMLProgressDots({ count, targetSelector = "[data-mml-paragraph]" }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const update = () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(targetSelector),
      );
      if (nodes.length === 0) return;
      const probe = window.innerHeight * 0.42;
      let idx = 0;
      for (let i = 0; i < nodes.length; i++) {
        const rect = nodes[i].getBoundingClientRect();
        if (rect.top <= probe) idx = i;
      }
      setActiveIdx(idx);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);

  if (count <= 1) return null;
  const dots = Array.from({ length: count }, (_, i) => i);
  const fraction = count > 1 ? activeIdx / (count - 1) : 0;

  return (
    <nav
      className={styles.rail}
      aria-label="Reading progress"
      role="navigation"
    >
      <span
        className={styles.fill}
        style={{ transform: `scaleY(${fraction})` }}
        aria-hidden="true"
      />
      <ul className={styles.list}>
        {dots.map((i) => {
          const state =
            i < activeIdx ? "done" : i === activeIdx ? "active" : "ahead";
          const onClick = () => {
            const node = document.querySelectorAll<HTMLElement>(targetSelector)[i];
            if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
          };
          return (
            <li key={i} className={styles.item}>
              <button
                type="button"
                className={`${styles.dot} ${styles[`dot_${state}`]}`}
                onClick={onClick}
                aria-label={`Jump to section ${i + 1}`}
                aria-current={state === "active" ? "step" : undefined}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MMLProgressDots;
