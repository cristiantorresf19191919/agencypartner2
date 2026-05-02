/**
 * Easing helpers shared across scenes. Pure math — safe to call during render.
 */

export const easeInOutCubic = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};

export const easeOutCubic = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - (1 - t) ** 3;
};

export const easeOutQuint = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - (1 - t) ** 5;
};

export const easeInOutQuart = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 8 * t * t * t * t : 1 - (-2 * t + 2) ** 4 / 2;
};

/** Linear interpolation between a and b. */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/** Lerp a 2-tuple. */
export const lerp2 = (
  a: [number, number],
  b: [number, number],
  t: number,
): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
