"use client";

import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function Heading({ level = 1, children, className = "", ...props }: HeadingProps) {
  const sizeClasses = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  };

  const headingClasses = `font-bold ${sizeClasses[level]} ${className}`;

  switch (level) {
    case 1:
      return <h1 className={headingClasses} {...props}>{children}</h1>;
    case 2:
      return <h2 className={headingClasses} {...props}>{children}</h2>;
    case 3:
      return <h3 className={headingClasses} {...props}>{children}</h3>;
    case 4:
      return <h4 className={headingClasses} {...props}>{children}</h4>;
    case 5:
      return <h5 className={headingClasses} {...props}>{children}</h5>;
    case 6:
      return <h6 className={headingClasses} {...props}>{children}</h6>;
    default:
      return <h1 className={headingClasses} {...props}>{children}</h1>;
  }
}

