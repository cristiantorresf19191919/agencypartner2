"use client";

import type { ReactNode } from "react";

export interface InThisSectionCalloutProps {
  /** Topic items shown as a scannable list (avoids long single-line truncation on mobile). */
  items: string[];
  /** Optional label, default "In this section:" */
  label?: ReactNode;
  /** Root wrapper class (e.g. infoBox + infoBoxPurple) */
  className?: string;
  /** Class for the label line */
  labelClassName?: string;
  /** Class for the <ul> list */
  listClassName?: string;
}

export function InThisSectionCallout({
  items,
  label = "In this section:",
  className,
  labelClassName,
  listClassName,
}: InThisSectionCalloutProps) {
  return (
    <div className={className} role="complementary" aria-label="Topics in this section">
      {label != null && (
        <p className={labelClassName}>
          <strong>{"📋 "}{label}</strong>
        </p>
      )}
      <ul className={listClassName}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
