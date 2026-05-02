"use client";

import React, { createContext, useContext } from "react";
import { Coordinates } from "mafs";
import type { ViewBox } from "./ZoomableMafs";

/**
 * Shared math-canvas primitives. Three jobs:
 *   • adaptive tick spacing (≈ 9 major ticks per axis, "nice" 1/2/5 × 10ⁿ steps)
 *   • origin "0" suppression (axes already mark the origin)
 *   • collision-aware tick labels (suppressed near labeled points/vectors)
 *
 * Pair with `fitContent` to derive a viewport from the actual data instead of
 * a fixed wide range — fixes the "tiny diagram in a big empty grid" problem.
 */

const ViewBoxContext = createContext<ViewBox | null>(null);
export const ViewBoxProvider = ViewBoxContext.Provider;

export function useCurrentViewBox(): ViewBox | null {
  return useContext(ViewBoxContext);
}

export function chooseStep(range: number, targetTicks = 9): number {
  if (range <= 0 || !Number.isFinite(range)) return 1;
  const raw = range / targetTicks;
  const exp = Math.floor(Math.log10(raw));
  const base = raw / 10 ** exp;
  const snapped = base < 1.5 ? 1 : base < 3.5 ? 2 : base < 7.5 ? 5 : 10;
  return snapped * 10 ** exp;
}

interface FitContentOpts {
  padding?: number;
  minHalfSpanX?: number;
  minHalfSpanY?: number;
  /** Force the viewport symmetric around the origin. */
  centerOnZero?: boolean;
  /** Width / height ratio to extend to (never crops the data). */
  aspect?: number;
  /** Always include these coordinates (e.g. axes, origin). */
  includeOrigin?: boolean;
}

/** Compute a viewBox covering `items` plus padding. */
export function fitContent(
  items: Array<{ x: number; y: number }>,
  opts: FitContentOpts = {},
): ViewBox {
  const {
    padding = 0.15,
    minHalfSpanX = 1,
    minHalfSpanY = 1,
    centerOnZero = false,
    aspect,
    includeOrigin = false,
  } = opts;

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const p of items) {
    if (Number.isFinite(p.x)) {
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
    }
    if (Number.isFinite(p.y)) {
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    }
  }
  if (includeOrigin || !Number.isFinite(xMin)) {
    xMin = Math.min(xMin, 0);
    xMax = Math.max(xMax, 0);
  }
  if (includeOrigin || !Number.isFinite(yMin)) {
    yMin = Math.min(yMin, 0);
    yMax = Math.max(yMax, 0);
  }
  if (!Number.isFinite(xMin)) {
    xMin = -minHalfSpanX;
    xMax = minHalfSpanX;
  }
  if (!Number.isFinite(yMin)) {
    yMin = -minHalfSpanY;
    yMax = minHalfSpanY;
  }

  if (centerOnZero) {
    const ax = Math.max(Math.abs(xMin), Math.abs(xMax));
    const ay = Math.max(Math.abs(yMin), Math.abs(yMax));
    xMin = -ax;
    xMax = ax;
    yMin = -ay;
    yMax = ay;
  }

  const xR = xMax - xMin;
  const yR = yMax - yMin;
  const padX = Math.max(xR * padding, minHalfSpanX * 0.05);
  const padY = Math.max(yR * padding, minHalfSpanY * 0.05);
  let xLo = xMin - padX;
  let xHi = xMax + padX;
  let yLo = yMin - padY;
  let yHi = yMax + padY;

  const cx = (xLo + xHi) / 2;
  const cy = (yLo + yHi) / 2;
  let halfX = Math.max((xHi - xLo) / 2, minHalfSpanX);
  let halfY = Math.max((yHi - yLo) / 2, minHalfSpanY);

  // Aspect-aware: extend only, never crop.
  if (aspect && aspect > 0) {
    const wantX = halfY * aspect;
    if (wantX > halfX) halfX = wantX;
    else {
      const wantY = halfX / aspect;
      if (wantY > halfY) halfY = wantY;
    }
  }

  return { x: [cx - halfX, cx + halfX], y: [cy - halfY, cy + halfY] };
}

export interface SmartAxesProps {
  /** Override viewport. Defaults to the surrounding ZoomableMafs viewBox. */
  viewBox?: ViewBox;
  /** Hide the "0" tick label where the axes cross. Default true. */
  hideZero?: boolean;
  /** x-tick label values to suppress (collision avoidance with point labels). */
  hideXNear?: number[];
  hideYNear?: number[];
  /** Target number of major ticks per axis. Default 9. */
  targetTicks?: number;
}

function makeLabelFn(
  step: number,
  hideZero: boolean,
  hideNear: number[] | undefined,
) {
  const tol = step * 0.45;
  return (v: number): React.ReactNode => {
    if (hideZero && Math.abs(v) < step * 0.001) return "";
    if (hideNear) {
      for (const r of hideNear) {
        if (Math.abs(v - r) < tol) return "";
      }
    }
    const decimals =
      step >= 1 ? 0 : Math.min(4, Math.max(1, -Math.floor(Math.log10(step))));
    return v.toFixed(decimals);
  };
}

export function SmartAxes({
  viewBox: vbProp,
  hideZero = true,
  hideXNear,
  hideYNear,
  targetTicks = 9,
}: SmartAxesProps) {
  const ctxVb = useCurrentViewBox();
  const vb = vbProp ?? ctxVb;
  if (!vb) {
    return <Coordinates.Cartesian />;
  }

  const xR = vb.x[1] - vb.x[0];
  const yR = vb.y[1] - vb.y[0];
  const xStep = chooseStep(xR, targetTicks);
  const yStep = chooseStep(yR, targetTicks);

  return (
    <Coordinates.Cartesian
      xAxis={{
        lines: xStep,
        labels: makeLabelFn(xStep, hideZero, hideXNear),
        subdivisions: 5,
      }}
      yAxis={{
        lines: yStep,
        labels: makeLabelFn(yStep, hideZero, hideYNear),
        subdivisions: 5,
      }}
      subdivisions={5}
    />
  );
}

export default SmartAxes;
