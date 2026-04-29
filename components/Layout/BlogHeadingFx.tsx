"use client";

import React, { useEffect, useState } from "react";
import styles from "./BlogHeadingFx.module.css";

interface Props {
  /** Container selector. Defaults to article main. */
  rootSelector?: string;
}

/**
 * Two effects bundled into one mount-anywhere component:
 *  - On `#anchor` navigation, pulse the matching heading with the page accent.
 *  - While scrolling a long post, surface a small chip in the top-right corner
 *    showing the current `h2` so the reader always has context.
 */
export function BlogHeadingFx({ rootSelector = "main" }: Props) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [chipVisible, setChipVisible] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) return;

    /* ── Anchor-pulse on hash change or initial load ───────────────── */
    const flashHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      target.classList.remove(styles.pulse);
      // Force reflow so the animation restarts even if same hash.
      void target.offsetHeight;
      target.classList.add(styles.pulse);
      window.setTimeout(() => target.classList.remove(styles.pulse), 1400);
    };
    flashHash();
    window.addEventListener("hashchange", flashHash);

    /* ── Sticky H2 chip — track the heading nearest to the top ─────── */
    const probeY = 80;
    let h2s: HTMLHeadingElement[] = [];
    const refreshHeadings = () => {
      h2s = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2"));
    };
    refreshHeadings();

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        if (h2s.length === 0) return;
        let current: HTMLHeadingElement | null = null;
        for (const h of h2s) {
          if (h.getBoundingClientRect().top <= probeY) current = h;
          else break;
        }
        if (current) {
          setActiveHeading(current.textContent?.trim() ?? null);
          setChipVisible(window.scrollY > 300);
        } else {
          setChipVisible(false);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refreshHeadings);

    // Re-scan headings if the body mutates significantly (route transitions).
    const mo = new MutationObserver(() => {
      refreshHeadings();
      onScroll();
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("hashchange", flashHash);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refreshHeadings);
      mo.disconnect();
    };
  }, [rootSelector]);

  if (!activeHeading) return null;

  return (
    <div
      className={styles.chip}
      data-visible={chipVisible ? "true" : "false"}
      role="navigation"
      aria-label="Current section"
    >
      <span className={styles.chipDot} aria-hidden="true" />
      <span className={styles.chipLabel}>{activeHeading}</span>
    </div>
  );
}

export default BlogHeadingFx;
