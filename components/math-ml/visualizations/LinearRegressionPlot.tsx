"use client";

import React, { useMemo } from "react";
import { Plot, Point, Line } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes, fitContent } from "../primitives/SmartAxes";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const RED = "#EF4444";

interface LinearRegressionPlotConfig {
  points?: number[][];
  showResiduals?: boolean;
  viewBox?: { x?: [number, number]; y?: [number, number] };
}

interface Props {
  config: Record<string, unknown>;
}

function ordinaryLeastSquares(points: [number, number][]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0 };
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-9) return { slope: 0, intercept: sumY / n };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function LinearRegressionPlot({ config }: Props) {
  const cfg = (config ?? {}) as LinearRegressionPlotConfig;
  const raw = cfg.points ?? [
    [-3, -2],
    [-1.5, -1.2],
    [-0.5, 0.3],
    [0.5, 0.9],
    [1.2, 1.5],
    [2, 2.3],
    [3, 3.2],
  ];
  const pts: [number, number][] = raw.map((p) => [Number(p[0]) || 0, Number(p[1]) || 0]);
  const showResiduals = cfg.showResiduals ?? true;
  const auto = useMemo(
    () => fitContent(pts.map(([x, y]) => ({ x, y })), { padding: 0.18 }),
    [pts],
  );
  const viewBox = {
    x: cfg.viewBox?.x ?? auto.x,
    y: cfg.viewBox?.y ?? auto.y,
  };

  const { slope, intercept } = useMemo(() => ordinaryLeastSquares(pts), [pts]);

  const fitLine = (x: number) => slope * x + intercept;

  const mse = useMemo(() => {
    if (pts.length === 0) return 0;
    let s = 0;
    for (const [x, y] of pts) {
      const r = y - fitLine(x);
      s += r * r;
    }
    return s / pts.length;
  }, [pts, slope, intercept]);

  const height = useMafsHeight(360);

  return (
    <>
    <MafsStage accent="blue">
      <ZoomableMafs
        viewBox={viewBox}
        preserveAspectRatio={false}
        height={height}
      >
        <SmartAxes />
        <Plot.OfX y={fitLine} domain={viewBox.x} color={EMERALD} />
        {showResiduals &&
          pts.map((p, i) => (
            <Line.Segment
              key={`res-${i}`}
              point1={p}
              point2={[p[0], fitLine(p[0])]}
              color={RED}
              style="dashed"
              opacity={0.6}
            />
          ))}
        {pts.map((p, i) => (
          <Point key={`pt-${i}`} x={p[0]} y={p[1]} color={BLUE} />
        ))}
      </ZoomableMafs>
    </MafsStage>
      <div
        style={{
          padding: "10px 14px",
          marginTop: 8,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          border: "1px solid rgba(16, 185, 129, 0.18)",
          background: "rgba(15, 23, 42, 0.45)",
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: EMERALD }}>
          y = {slope.toFixed(3)}·x + {intercept.toFixed(3)}
        </span>
        <span style={{ color: AMBER }}>MSE = {mse.toFixed(3)}</span>
        <span style={{ opacity: 0.7 }}>{pts.length} points</span>
      </div>
    </>
  );
}
