"use client";

import React from "react";
import styles from "./BlogTLDR.module.css";

interface BlogTLDRProps {
  /** Bullets — keep each line ~10–18 words. */
  points: string[];
  /** Override the eyebrow ("TL;DR" by default). */
  label?: string;
  /** Override the heading shown to the right of the eyebrow. */
  heading?: string;
}

export function BlogTLDR({ points, label, heading }: BlogTLDRProps) {
  if (!points || points.length === 0) return null;
  return (
    <aside className={styles.card} aria-label={label ?? "TL;DR"}>
      <div className={styles.head}>
        <span className={styles.badge}>{label ?? "TL;DR"}</span>
        {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
      </div>
      <ul className={styles.list}>
        {points.map((p, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.bullet} aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default BlogTLDR;
