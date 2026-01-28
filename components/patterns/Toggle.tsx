"use client";

import React, { useState, ReactNode } from "react";

interface ToggleProps {
  children: (props: { on: boolean; toggle: () => void }) => ReactNode;
  initialOn?: boolean;
}

export function Toggle({ children, initialOn = false }: ToggleProps) {
  const [on, setOn] = useState(initialOn);
  
  const toggle = () => {
    setOn((prev) => !prev);
  };

  return <>{children({ on, toggle })}</>;
}

