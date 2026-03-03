/** Shared easing/timing utilities for data structure visualizations. */

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutElastic(t: number): number {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Returns 0..1 progress over `frames` ticks, starting from `startFrame`. */
export function animProgress(
  currentFrame: number,
  startFrame: number,
  durationFrames: number
): number {
  const elapsed = currentFrame - startFrame;
  if (elapsed < 0) return 0;
  return clamp(elapsed / durationFrames, 0, 1);
}
