"use client";

import React from "react";
import styles from "./BlogInline.module.css";

interface KeyInsightProps {
  /** Optional eyebrow label. Defaults to "Key insight". */
  label?: string;
  /** Headline text. */
  title?: string;
  children: React.ReactNode;
}

/**
 * A gradient-bordered callout for the most important takeaway in a blog post
 * section. Pulls the surrounding `--blog-accent-*` variables so it tints to
 * the post's category color.
 */
export function KeyInsight({ label = "Key insight", title, children }: KeyInsightProps) {
  return (
    <aside className={styles.insight}>
      <div className={styles.insightAccent} aria-hidden="true" />
      <div className={styles.insightContent}>
        <div className={styles.insightHead}>
          <span className={styles.insightLabel}>{label}</span>
          {title ? <h3 className={styles.insightTitle}>{title}</h3> : null}
        </div>
        <div className={styles.insightBody}>{children}</div>
      </div>
    </aside>
  );
}

interface PullQuoteProps {
  /** Optional attribution: name, role, source. */
  cite?: string;
  /** When provided, link the citation. */
  href?: string;
  /** Larger serif quote text. */
  children: React.ReactNode;
}

/**
 * Display a striking pull-quote in the article body — useful to break up walls
 * of prose with a memorable line.
 */
export function PullQuote({ cite, href, children }: PullQuoteProps) {
  return (
    <figure className={styles.quote}>
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>
      <blockquote className={styles.quoteBody}>{children}</blockquote>
      {cite ? (
        <figcaption className={styles.quoteCite}>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer">
              — {cite}
            </a>
          ) : (
            <>— {cite}</>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default { KeyInsight, PullQuote };
