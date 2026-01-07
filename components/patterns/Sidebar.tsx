"use client";

import React, { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  width?: string;
}

export function Sidebar({ children, width = "w-64" }: SidebarProps) {
  return (
    <aside className={`${width} bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4`}>
      {children}
    </aside>
  );
}

