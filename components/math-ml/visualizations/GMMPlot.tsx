"use client";

import React, { useState, useMemo } from "react";
import { Mafs, Coordinates, Point, Ellipse } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";

const PALETTE = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#A78BFA"];

interface GMMPlotConfig {
  points?: number[][];
  k?: number;
  viewBox?: { x?: [number, number]; y?: [number, number] };
}

interface Props {
  config: Record<string, unknown>;
}

type Vec2 = [number, number];

function emStep(
  points: Vec2[],
  means: Vec2[],
  variances: number[]
): { means: Vec2[]; variances: number[]; responsibilities: number[][] } {
  const K = means.length;
  const N = points.length;

  // E-step: compute responsibilities using isotropic Gaussians (for simplicity)
  const resp: number[][] = Array.from({ length: N }, () => new Array(K).fill(0));
  for (let i = 0; i < N; i++) {
    const p = points[i];
    let sum = 0;
    for (let k = 0; k < K; k++) {
      const m = means[k];
      const v = Math.max(variances[k], 0.05);
      const d2 = (p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2;
      const val = Math.exp(-d2 / (2 * v)) / (2 * Math.PI * v);
      resp[i][k] = val;
      sum += val;
    }
    if (sum > 0) {
      for (let k = 0; k < K; k++) resp[i][k] /= sum;
    }
  }

  // M-step
  const newMeans: Vec2[] = [];
  const newVars: number[] = [];
  for (let k = 0; k < K; k++) {
    let nk = 0;
    let mx = 0;
    let my = 0;
    for (let i = 0; i < N; i++) {
      nk += resp[i][k];
      mx += resp[i][k] * points[i][0];
      my += resp[i][k] * points[i][1];
    }
    if (nk < 1e-6) {
      newMeans.push(means[k]);
      newVars.push(variances[k]);
      continue;
    }
    const cx = mx / nk;
    const cy = my / nk;
    let varSum = 0;
    for (let i = 0; i < N; i++) {
      const d2 = (points[i][0] - cx) ** 2 + (points[i][1] - cy) ** 2;
      varSum += resp[i][k] * d2;
    }
    const variance = Math.max(varSum / nk / 2, 0.05);
    newMeans.push([cx, cy]);
    newVars.push(variance);
  }
  return { means: newMeans, variances: newVars, responsibilities: resp };
}

export default function GMMPlot({ config }: Props) {
  const cfg = (config ?? {}) as GMMPlotConfig;
  const rawPoints = cfg.points ?? [
    [-2, -2], [-2.3, -1.7], [-1.8, -2.3], [-2.1, -1.5], [-2.5, -2.1], [-1.6, -1.8],
    [2, 2], [2.3, 1.7], [1.8, 2.3], [2.1, 1.5], [2.5, 2.1], [1.6, 1.8],
    [2, -2], [2.3, -1.7], [1.8, -2.3], [2.1, -1.5], [2.5, -2.1], [1.6, -1.8],
  ];
  const points: Vec2[] = rawPoints.map((p) => [Number(p[0]) || 0, Number(p[1]) || 0]);
  const K = Math.min(cfg.k ?? 3, PALETTE.length);
  const viewBox = cfg.viewBox ?? { x: [-4, 4], y: [-4, 4] };

  // initial means: deterministic (first K points scaled)
  const initialMeans: Vec2[] = useMemo(() => {
    const arr: Vec2[] = [];
    for (let k = 0; k < K; k++) {
      const angle = (2 * Math.PI * k) / K;
      arr.push([Math.cos(angle) * 2.5, Math.sin(angle) * 2.5]);
    }
    return arr;
  }, [K]);

  const initialVars = useMemo(() => new Array(K).fill(1), [K]);

  const [iteration, setIteration] = useState(0);

  const { means, variances, responsibilities } = useMemo(() => {
    let m = initialMeans;
    let v = initialVars;
    let r: number[][] = points.map(() => new Array(K).fill(1 / K));
    for (let i = 0; i < iteration; i++) {
      const stepResult = emStep(points, m, v);
      m = stepResult.means;
      v = stepResult.variances;
      r = stepResult.responsibilities;
    }
    return { means: m, variances: v, responsibilities: r };
  }, [points, initialMeans, initialVars, iteration, K]);

  const height = useMafsHeight(380);

  return (
    <>
    <MafsStage accent="violet">
      <Mafs
        viewBox={{ x: viewBox.x ?? [-4, 4], y: viewBox.y ?? [-4, 4] }}
        preserveAspectRatio="contain"
        height={height}
      >
        <Coordinates.Cartesian />

        {/* Gaussian ellipses (isotropic approximation, 2σ boundary) */}
        {means.map((m, k) => {
          const sigma = Math.sqrt(variances[k]);
          return (
            <Ellipse
              key={`ell-${k}`}
              center={m}
              radius={[sigma * 2, sigma * 2]}
              color={PALETTE[k % PALETTE.length]}
              fillOpacity={0.12}
              strokeOpacity={0.8}
            />
          );
        })}

        {/* Data points colored by assignment */}
        {points.map((p, i) => {
          let bestK = 0;
          let bestR = -1;
          for (let k = 0; k < K; k++) {
            if (responsibilities[i][k] > bestR) {
              bestR = responsibilities[i][k];
              bestK = k;
            }
          }
          return (
            <Point
              key={`p-${i}`}
              x={p[0]}
              y={p[1]}
              color={PALETTE[bestK % PALETTE.length]}
            />
          );
        })}

        {/* Cluster centers */}
        {means.map((m, k) => (
          <Point key={`mu-${k}`} x={m[0]} y={m[1]} color={PALETTE[k % PALETTE.length]} />
        ))}
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
        <button
          onClick={() => setIteration(Math.max(0, iteration - 1))}
          disabled={iteration === 0}
          style={btnStyle(iteration === 0, "#A78BFA")}
        >
          ◀ Prev
        </button>
        <span style={{ color: "#10B981", fontVariantNumeric: "tabular-nums" }}>
          EM iteration {iteration}
        </span>
        <button
          onClick={() => setIteration(Math.min(20, iteration + 1))}
          disabled={iteration >= 20}
          style={btnStyle(iteration >= 20, "#10B981")}
        >
          Step ▶
        </button>
        <button onClick={() => setIteration(0)} style={btnStyle(false, "#3B82F6")}>
          Reset
        </button>
        <span style={{ opacity: 0.7 }}>K = {K}</span>
      </div>
    </>
  );
}

function btnStyle(disabled: boolean, color: string): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: 8,
    border: `1px solid ${color}`,
    background: disabled ? "transparent" : color,
    color: disabled ? color : "#0b1220",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 600,
  };
}
