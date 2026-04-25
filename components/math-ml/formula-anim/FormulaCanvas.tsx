"use client";

import React from "react";
import styles from "./FormulaAnim.module.css";

interface Props {
  title?: string;
  caption?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function FormulaCanvas({ title, caption, children, controls }: Props) {
  return (
    <div className={styles.canvas}>
      {title ? <p className={styles.title}>{title}</p> : null}
      {caption ? <p className={styles.caption}>{caption}</p> : null}
      <div className={styles.formulaSlot}>{children}</div>
      {controls ? <div className={styles.controls}>{controls}</div> : null}
    </div>
  );
}
