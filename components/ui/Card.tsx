"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  children: React.ReactNode;
}

export function Card({ variant = "default", children, className = "", ...props }: CardProps) {
  const baseClasses = "rounded-lg transition-all";
  const variantClasses = {
    default: "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
    outlined: "bg-transparent border-2 border-zinc-300 dark:border-zinc-600",
    elevated: "bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

