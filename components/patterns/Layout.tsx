"use client";

import React, { ReactNode } from "react";

interface LayoutProps {
  headerSlot?: ReactNode;
  sidebarSlot?: ReactNode;
  contentSlot?: ReactNode;
  footerSlot?: ReactNode;
}

export function Layout({ headerSlot, sidebarSlot, contentSlot, footerSlot }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {headerSlot && (
        <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          {headerSlot}
        </header>
      )}
      <div className="flex flex-1">
        {sidebarSlot && (
          <aside className="w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
            {sidebarSlot}
          </aside>
        )}
        <main className="flex-1 p-6">
          {contentSlot}
        </main>
      </div>
      {footerSlot && (
        <footer className="bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
          {footerSlot}
        </footer>
      )}
    </div>
  );
}

