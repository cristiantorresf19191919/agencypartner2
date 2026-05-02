"use client";

import React, { useState, useMemo } from "react";
import { Mafs, Plot, Line, Point } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { SmartAxes, ViewBoxProvider } from "../primitives/SmartAxes";

const EMERALD = "#10B981";
const AMBER = "#F59E0B";
const RED = "#EF4444";

type FnKey = "bowl" | "saddle" | "rosenbrock";

interface GradientFieldConfig {
  fn?: FnKey;
  showTrajectory?: boolean;
  learningRate?: number;
  startPoint?: [number, number];
  steps?: number;
  viewBox?: { x?: [number, number]; y?: [number, number] };
}

interface Props {
  config: Record<string, unknown>;
}

function pickFn(k: FnKey | undefined) {
  switch (k) {
    case "saddle":
      // f = x^2 - y^2; grad = [2x, -2y]
      return { grad: (p: [number, number]): [number, number] => [2 * p[0], -2 * p[1]] };
    case "rosenbrock": {
      // Simplified: f = (1-x)^2 + 10*(y - x^2)^2
      return {
        grad: (p: [number, number]): [number, number] => {
          const [x, y] = p;
          return [-2 * (1 - x) - 40 * x * (y - x * x), 20 * (y - x * x)];
        },
      };
    }
    case "bowl":
    default:
      // f = x^2 + y^2; grad = [2x, 2y]
      return { grad: (p: [number, number]): [number, number] => [2 * p[0], 2 * p[1]] };
  }
}

export default function GradientField({ config }: Props) {
  const cfg = (config ?? {}) as GradientFieldConfig;
  const viewBox = cfg.viewBox ?? { x: [-4, 4], y: [-4, 4] };
  const showTraj = cfg.showTrajectory ?? true;
  const [lr, setLr] = useState(cfg.learningRate ?? 0.1);
  const start: [number, number] = cfg.startPoint ?? [2.5, 2.5];
  const steps = cfg.steps ?? 25;

  const { grad } = useMemo(() => pickFn(cfg.fn ?? "bowl"), [cfg.fn]);

  // scaled vector field for arrows: scale down for visibility
  const fieldFn = useMemo(() => {
    return (p: [number, number]): [number, number] => {
      const [gx, gy] = grad(p);
      // negative gradient (descent direction), scaled to a visible length
      const mag = Math.sqrt(gx * gx + gy * gy) + 1e-9;
      const k = 0.35 / Math.max(0.35, mag * 0.25);
      return [-gx * k * 0.4, -gy * k * 0.4];
    };
  }, [grad]);

  const trajectory = useMemo(() => {
    if (!showTraj) return [] as [number, number][];
    const pts: [number, number][] = [start];
    let cur: [number, number] = start;
    for (let i = 0; i < steps; i++) {
      const [gx, gy] = grad(cur);
      cur = [cur[0] - lr * gx, cur[1] - lr * gy];
      if (!Number.isFinite(cur[0]) || !Number.isFinite(cur[1])) break;
      if (Math.abs(cur[0]) > 20 || Math.abs(cur[1]) > 20) break;
      pts.push(cur);
    }
    return pts;
  }, [grad, lr, steps, start, showTraj]);

  const height = useMafsHeight(360);

  return (
    <>
    <MafsStage accent="emerald">
      <Mafs
        viewBox={{ x: viewBox.x ?? [-4, 4], y: viewBox.y ?? [-4, 4] }}
        preserveAspectRatio="contain"
        height={height}
      >
        <ViewBoxProvider value={{ x: viewBox.x ?? [-4, 4], y: viewBox.y ?? [-4, 4] }}>
        <SmartAxes />
        <Plot.VectorField xy={fieldFn} step={0.6} color={EMERALD} />

        {showTraj &&
          trajectory.map((p, i) => {
            if (i === 0) return null;
            const prev = trajectory[i - 1];
            return (
              <Line.Segment
                key={`traj-${i}`}
                point1={prev}
                point2={p}
                color={AMBER}
                weight={2}
              />
            );
          })}

        {showTraj && trajectory[0] && (
          <Point x={trajectory[0][0]} y={trajectory[0][1]} color={RED} />
        )}
        </ViewBoxProvider>
      </Mafs>
    </MafsStage>
      <div
        style={{
          padding: "10px 14px",
          marginTop: 8,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          border: "1px solid rgba(16, 185, 129, 0.18)",
          background: "rgba(15, 23, 42, 0.45)",
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 240px" }}>
          <span style={{ minWidth: 120 }}>Learning rate = {lr.toFixed(3)}</span>
          <input
            type="range"
            min={0.01}
            max={0.5}
            step={0.005}
            value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: EMERALD }}
          />
        </label>
      </div>
    </>
  );
}
