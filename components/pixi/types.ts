/** Shared PixiJS types used across all Pixi components. */

export interface PixiThemeColors {
  bg: number;
  surface: number;
  text: number;
  textMuted: number;
  primary: number;
  secondary: number;
  accent: number;
  success: number;
  warning: number;
  error: number;
  border: number;
}

export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  scaleDecay: number;
  alpha: number;
  alphaDecay: number;
  gravity: number;
  color: number;
  shape: "circle" | "star" | "square" | "braces" | "tags";
  size: number;
}

export type CelebrationPreset = "simple" | "multi-burst" | "reactor" | "streak";
