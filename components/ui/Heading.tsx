"use client";

import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function Heading({ level = 1, children, className = "", ...props }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  };

  return (
    <Component className={`font-bold ${sizeClasses[level]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

