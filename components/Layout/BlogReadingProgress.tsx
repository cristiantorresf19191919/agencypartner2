"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./BlogReadingProgress.module.css";

/**
 * Sticky thin gradient bar at the very top of the viewport showing how far
 * the user has scrolled through the blog post content area. Hidden when the
 * page is too short to scroll.
 */
export function BlogReadingProgress({ targetSelector = "main" }: { targetSelector?: string } = {}) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const el = document.querySelector<HTMLElement>(targetSelector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = Math.max(1, rect.height - vh);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const fraction = total > vh ? scrolled / total : 0;
      setProgress(fraction);
      setVisible(rect.height > vh + 80);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        compute();
        rafRef.current = null;
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetSelector]);

  return (
    <div
      className={styles.bar}
      data-visible={visible ? "true" : "false"}
      aria-hidden="true"
    >
      <div
        className={styles.fill}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

export default BlogReadingProgress;
