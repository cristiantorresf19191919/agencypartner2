"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Mafs } from "mafs";
import "mafs/core.css";
import styles from "../MathML.module.css";

export interface ViewBox {
  x: [number, number];
  y: [number, number];
}

export interface ZoomableMafsProps {
  viewBox: ViewBox;
  height: number;
  preserveAspectRatio?: "contain" | false;
  /** Min/max half-span across both axes. Prevents zooming past the math. */
  minSpan?: number;
  maxSpan?: number;
  children: React.ReactNode;
}

const ZOOM_STEP = 1.25;
const WHEEL_SENSITIVITY = 0.0015;

function zoomVB(vb: ViewBox, factor: number, anchor?: [number, number]): ViewBox {
  const cx = anchor ? anchor[0] : (vb.x[0] + vb.x[1]) / 2;
  const cy = anchor ? anchor[1] : (vb.y[0] + vb.y[1]) / 2;
  return {
    x: [cx + (vb.x[0] - cx) * factor, cx + (vb.x[1] - cx) * factor],
    y: [cy + (vb.y[0] - cy) * factor, cy + (vb.y[1] - cy) * factor],
  };
}

function panVB(vb: ViewBox, dx: number, dy: number): ViewBox {
  return {
    x: [vb.x[0] + dx, vb.x[1] + dx],
    y: [vb.y[0] + dy, vb.y[1] + dy],
  };
}

function clampSpan(vb: ViewBox, minSpan: number, maxSpan: number): ViewBox {
  const w = vb.x[1] - vb.x[0];
  const h = vb.y[1] - vb.y[0];
  const minDim = Math.min(w, h);
  const maxDim = Math.max(w, h);
  if (minDim < minSpan * 2) {
    const factor = (minSpan * 2) / minDim;
    return zoomVB(vb, factor);
  }
  if (maxDim > maxSpan * 2) {
    const factor = (maxSpan * 2) / maxDim;
    return zoomVB(vb, factor);
  }
  return vb;
}

/**
 * Wraps a Mafs canvas with viewport state, mouse-wheel zoom (Ctrl/Cmd or Shift
 * to disambiguate from page scroll), drag-to-pan, and floating +/−/⌂ controls.
 * Drop-in for the 2D viz components.
 */
export function ZoomableMafs({
  viewBox: initialViewBox,
  height,
  preserveAspectRatio = "contain",
  minSpan = 0.1,
  maxSpan = 100,
  children,
}: ZoomableMafsProps) {
  const initialRef = useRef(initialViewBox);
  const [viewBox, setViewBox] = useState<ViewBox>(initialViewBox);

  // Reset whenever the upstream initial viewport changes (e.g. user changes
  // matrix sliders that auto-fit).
  useEffect(() => {
    initialRef.current = initialViewBox;
    setViewBox(initialViewBox);
  }, [initialViewBox]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const reset = useCallback(() => setViewBox(initialRef.current), []);
  const zoomIn = useCallback(
    () => setViewBox((vb) => clampSpan(zoomVB(vb, 1 / ZOOM_STEP), minSpan, maxSpan)),
    [minSpan, maxSpan],
  );
  const zoomOut = useCallback(
    () => setViewBox((vb) => clampSpan(zoomVB(vb, ZOOM_STEP), minSpan, maxSpan)),
    [minSpan, maxSpan],
  );

  // Wheel zoom (Ctrl/Cmd or Shift to disambiguate). Anchor at cursor position.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const interactive = e.ctrlKey || e.metaKey || e.shiftKey;
      if (!interactive) return; // let the page scroll
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setViewBox((vb) => {
        const ax = vb.x[0] + px * (vb.x[1] - vb.x[0]);
        const ay = vb.y[1] - py * (vb.y[1] - vb.y[0]); // y flipped (screen vs math)
        const factor = Math.exp(e.deltaY * WHEEL_SENSITIVITY);
        return clampSpan(zoomVB(vb, factor, [ax, ay]), minSpan, maxSpan);
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [minSpan, maxSpan]);

  // Drag to pan
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startVB: ViewBox;
    width: number;
    height: number;
  } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Skip if user clicked a Mafs interactive (movable point) or our buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-mafs-movable]")) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startVB: viewBox,
      width: rect.width,
      height: rect.height,
    };
    el.setPointerCapture(e.pointerId);
  }, [viewBox]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dxPx = e.clientX - drag.startX;
      const dyPx = e.clientY - drag.startY;
      const xRange = drag.startVB.x[1] - drag.startVB.x[0];
      const yRange = drag.startVB.y[1] - drag.startVB.y[0];
      const dx = -(dxPx / drag.width) * xRange;
      const dy = (dyPx / drag.height) * yRange; // y flipped
      setViewBox(panVB(drag.startVB, dx, dy));
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = null;
      const el = containerRef.current;
      if (el && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    },
    [],
  );

  // Pinch zoom on touch (basic two-finger gesture)
  const pinchRef = useRef<{ startDist: number; startVB: ViewBox } | null>(null);
  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 2) return;
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      pinchRef.current = {
        startDist: Math.hypot(dx, dy),
        startVB: viewBox,
      };
    },
    [viewBox],
  );
  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const pinch = pinchRef.current;
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = pinch.startDist / dist;
      setViewBox(clampSpan(zoomVB(pinch.startVB, factor), minSpan, maxSpan));
    },
    [minSpan, maxSpan],
  );
  const onTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  const memoChildren = useMemo(() => children, [children]);

  return (
    <div
      ref={containerRef}
      className={styles.zoomableMafs}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="application"
      aria-label="Zoomable diagram. Hold Shift or Ctrl and scroll to zoom; drag to pan."
    >
      <Mafs
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        height={height}
      >
        {memoChildren}
      </Mafs>

      <div className={styles.zoomControls} aria-hidden="false">
        <button
          type="button"
          className={styles.zoomBtn}
          onClick={zoomIn}
          aria-label="Zoom in"
          title="Zoom in (Shift+wheel)"
        >
          +
        </button>
        <button
          type="button"
          className={styles.zoomBtn}
          onClick={zoomOut}
          aria-label="Zoom out"
          title="Zoom out (Shift+wheel)"
        >
          −
        </button>
        <button
          type="button"
          className={styles.zoomBtn}
          onClick={reset}
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          ⌂
        </button>
      </div>
    </div>
  );
}

export default ZoomableMafs;
