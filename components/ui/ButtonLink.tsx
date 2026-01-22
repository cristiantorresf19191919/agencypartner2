"use client";

import React from "react";
import Link from "next/link";

interface ButtonLinkProps {
  href: string;
  variant?: "primary" | "secondary" | "outline" | "nav";
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  target,
  rel,
}: ButtonLinkProps) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-out";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950",
    nav: "group relative px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] min-w-[140px]",
  };

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`} target={target} rel={rel}>
      {children}
    </Link>
  );
}

