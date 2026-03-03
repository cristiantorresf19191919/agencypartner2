"use client";

import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { PixiThemeColors } from "./types";

const DARK_COLORS: PixiThemeColors = {
  bg: 0x0f1117,
  surface: 0x1a1d27,
  text: 0xe6f0ff,
  textMuted: 0x7b9ad0,
  primary: 0x61dafb,
  secondary: 0xa78bfa,
  accent: 0x22c55e,
  success: 0x4caf50,
  warning: 0xf59e0b,
  error: 0xef4444,
  border: 0x2a2f3e,
};

const LIGHT_COLORS: PixiThemeColors = {
  bg: 0xffffff,
  surface: 0xf3f4f6,
  text: 0x1f2937,
  textMuted: 0x6b7280,
  primary: 0x0ea5e9,
  secondary: 0x7c3aed,
  accent: 0x16a34a,
  success: 0x22c55e,
  warning: 0xd97706,
  error: 0xdc2626,
  border: 0xd1d5db,
};

export function usePixiTheme(): PixiThemeColors {
  const { theme } = useTheme();
  return useMemo(
    () => (theme === "dark" ? DARK_COLORS : LIGHT_COLORS),
    [theme]
  );
}
