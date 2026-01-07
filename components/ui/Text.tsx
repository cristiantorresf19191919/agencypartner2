"use client";

import React from "react";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  children: React.ReactNode;
}

export function Text({ size = "base", children, className = "", ...props }: TextProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <p className={`${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </p>
  );
}

