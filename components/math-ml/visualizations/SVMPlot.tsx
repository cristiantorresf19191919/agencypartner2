"use client";

import React, { useMemo } from "react";
import { Mafs, Coordinates, Plot, Point, Line } from "mafs";
import "mafs/core.css";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const RED = "#EF4444";

interface ClassifiedPoint {
  x: number;
  y: number;
  label: 1 | -1;
}

interface SVMPlotConfig {
  points?: { x: number; y: number; label: 1 | -1 }[];
  showMargin?: boolean;
  viewBox?: { x?: [number, number]; y?: [number, number] };
}

interface Props {
  config: Record<string, unknown>;
}

/**
 * Lightweight "SVM-like" linear classifier fit via a few steps of gradient descent
 * on a hinge loss surrogate. Not a production SVM solver, but renders a plausible
 * separating hyperplane for the given classified points.
 */
function fitHingeClassifier(points: ClassifiedPoint[]): {
  w: [number, number];
  b: number;
} {
  let w: [number, number] = [0.1, 0.1];
  let b = 0;
  const lr = 0.05;
  const C = 1;
  const iters = 300;
  const n = points.length || 1;
  for (let it = 0; it < iters; it++) {
    let dw: [number, number] = [w[0], w[1]]; // regularization gradient
    let db = 0;
    for (const p of points) {
      const margin = p.label * (w[0] * p.x + w[1] * p.y + b);
      if (margin < 1) {
        dw[0] -= (C * p.label * p.x) / n;
        dw[1] -= (C * p.label * p.y) / n;
        db -= (C * p.label) / n;
      }
    }
    w = [w[0] - lr * dw[0], w[1] - lr * dw[1]];
    b = b - lr * db;
  }
  return { w, b };
}

export default function SVMPlot({ config }: Props) {
  const cfg = (config ?? {}) as SVMPlotConfig;
  const defaults: ClassifiedPoint[] = [
    { x: -2, y: -1.5, label: -1 },
    { x: -1.5, y: -2, label: -1 },
    { x: -2.5, y: -2.5, label: -1 },
    { x: -1, y: -1, label: -1 },
    { x: 2, y: 1.5, label: 1 },
    { x: 1.5, y: 2, label: 1 },
    { x: 2.5, y: 2.5, label: 1 },
    { x: 1, y: 1, label: 1 },
  ];
  const rawPts = (cfg.points as ClassifiedPoint[] | undefined) ?? defaults;
  const pts: ClassifiedPoint[] = rawPts.map((p) => ({
    x: Number(p.x) || 0,
    y: Number(p.y) || 0,
    label: (p.label === 1 || p.label === -1 ? p.label : 1) as 1 | -1,
  }));
  const showMargin = cfg.showMargin ?? true;
  const viewBox = cfg.viewBox ?? { x: [-4, 4], y: [-4, 4] };

  const { w, b } = useMemo(() => fitHingeClassifier(pts), [pts]);

  // decision boundary: w0 x + w1 y + b = 0  =>  y = -(w0 x + b) / w1
  const decision = (x: number) => (Math.abs(w[1]) < 1e-6 ? 0 : -(w[0] * x + b) / w[1]);
  const marginUp = (x: number) => (Math.abs(w[1]) < 1e-6 ? 0 : -(w[0] * x + b - 1) / w[1]);
  const marginDown = (x: number) => (Math.abs(w[1]) < 1e-6 ? 0 : -(w[0] * x + b + 1) / w[1]);

  // support-vector candidates: those with |margin| near 1
  const supports = pts.filter((p) => {
    const m = p.label * (w[0] * p.x + w[1] * p.y + b);
    return m < 1.05;
  });

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(16, 185, 129, 0.18)",
        background: "rgba(15, 23, 42, 0.35)",
      }}
    >
      <Mafs
        viewBox={{ x: viewBox.x ?? [-4, 4], y: viewBox.y ?? [-4, 4] }}
        preserveAspectRatio="contain"
        height={360}
      >
        <Coordinates.Cartesian />

        <Plot.OfX y={decision} domain={viewBox.x ?? [-4, 4]} color={EMERALD} />
        {showMargin && (
          <>
            <Plot.OfX y={marginUp} domain={viewBox.x ?? [-4, 4]} color={EMERALD} style="dashed" opacity={0.6} />
            <Plot.OfX y={marginDown} domain={viewBox.x ?? [-4, 4]} color={EMERALD} style="dashed" opacity={0.6} />
          </>
        )}

        {pts.map((p, i) => (
          <Point
            key={`pt-${i}`}
            x={p.x}
            y={p.y}
            color={p.label === 1 ? BLUE : RED}
          />
        ))}

        {supports.map((p, i) => (
          <Point key={`sv-${i}`} x={p.x} y={p.y} color={AMBER} opacity={0.5} />
        ))}

        {/* explicit ref to Line so import is used even in odd configs */}
        {false && <Line.Segment point1={[0, 0]} point2={[1, 1]} color={EMERALD} />}
      </Mafs>
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          borderTop: "1px solid rgba(16, 185, 129, 0.15)",
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: EMERALD }}>
          w = [{w[0].toFixed(2)}, {w[1].toFixed(2)}], b = {b.toFixed(2)}
        </span>
        <span style={{ color: AMBER }}>
          margin ≈ {(1 / Math.max(Math.hypot(w[0], w[1]), 1e-6)).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
