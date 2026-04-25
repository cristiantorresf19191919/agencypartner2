"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { tokenize } from "./tokenize";
import styles from "./FormulaAnim.module.css";

interface Props {
  latex: string;
  staggerMs?: number;
  fadeMs?: number;
  displayMode?: boolean;
  className?: string;
}

/**
 * Static formula that renders KaTeX (with token annotations) on mount and
 * fades each token in left-to-right the first time the element scrolls into
 * view. Respects `prefers-reduced-motion`.
 */
export function FormulaReveal({
  latex,
  staggerMs = 40,
  fadeMs = 300,
  displayMode = true,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const playedRef = useRef(false);
  const [renderedKey, setRenderedKey] = useState(0);

  // Render KaTeX into the host span using safe DOM appends (no innerHTML).
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren();
    try {
      const t = tokenize(latex, displayMode);
      const doc = new DOMParser().parseFromString(t.html, "text/html");
      const root = doc.body.firstElementChild;
      if (root) host.appendChild(root);
    } catch {
      const fallback = document.createElement("code");
      fallback.textContent = latex;
      host.appendChild(fallback);
    }
    playedRef.current = false;
    setRenderedKey((k) => k + 1);
  }, [latex, displayMode]);

  // Scroll-in observer: stagger token fade-up.
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || playedRef.current) continue;
          playedRef.current = true;
          observer.disconnect();
          if (reduced) return;
          const tokens = host.querySelectorAll<HTMLElement>("[data-tok-id]");
          tokens.forEach((tok, i) => {
            tok.style.opacity = "0";
            tok.style.transform = "translateY(8px)";
            void animate(
              tok,
              {
                opacity: [0, 1],
                transform: ["translateY(8px)", "translateY(0px)"],
              },
              {
                duration: fadeMs / 1000,
                delay: (i * staggerMs) / 1000,
                ease: "easeOut",
              },
            ).then(() => {
              tok.style.opacity = "";
              tok.style.transform = "";
            });
          });
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [renderedKey, fadeMs, staggerMs]);

  return (
    <span
      ref={ref}
      className={`${styles.revealRoot} ${className ?? ""}`}
    />
  );
}

export default FormulaReveal;
