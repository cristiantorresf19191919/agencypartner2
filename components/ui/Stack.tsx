"use client";

import React from "react";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  children: React.ReactNode;
}

export function Stack({
  direction = "row",
  gap = "md",
  align,
  justify,
  children,
  className = "",
  ...props
}: StackProps) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
  };

  const gapClasses = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const classes = [
    "flex",
    directionClasses[direction],
    gapClasses[gap],
    align && alignClasses[align],
    justify && justifyClasses[justify],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

