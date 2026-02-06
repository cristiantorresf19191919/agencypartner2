"use client";

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "developer-section-content-font-size";
const MIN = 12;
const MAX = 24;
const DEFAULT = 16;

type DeveloperSectionFontContextValue = {
  contentFontSize: number;
  setContentFontSize: (size: number | ((prev: number) => number)) => void;
};

const DeveloperSectionFontContext = createContext<DeveloperSectionFontContextValue | null>(null);

export function useDeveloperSectionFont(): DeveloperSectionFontContextValue {
  const ctx = useContext(DeveloperSectionFontContext);
  if (!ctx) {
    return {
      contentFontSize: DEFAULT,
      setContentFontSize: () => {},
    };
  }
  return ctx;
}

type DeveloperSectionFontProviderProps = {
  children: ReactNode;
};

export function DeveloperSectionFontProvider({ children }: DeveloperSectionFontProviderProps) {
  const [contentFontSize, setState] = useState(DEFAULT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved != null) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n) && n >= MIN && n <= MAX) setState(n);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(contentFontSize));
    } catch {
      // ignore
    }
  }, [mounted, contentFontSize]);

  const setContentFontSize = useCallback((size: number | ((prev: number) => number)) => {
    setState((prev) => {
      const next = typeof size === "function" ? size(prev) : size;
      return Math.min(MAX, Math.max(MIN, next));
    });
  }, []);

  return (
    <DeveloperSectionFontContext.Provider value={{ contentFontSize, setContentFontSize }}>
      <div
        data-developer-section-font-wrap
        style={{ fontSize: contentFontSize }}
      >
        {children}
      </div>
    </DeveloperSectionFontContext.Provider>
  );
}
