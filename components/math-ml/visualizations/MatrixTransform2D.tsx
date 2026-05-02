"use client";

import React, { useState, useMemo } from "react";
import { Vector, Polygon, Text } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes, fitContent } from "../primitives/SmartAxes";
import type { NarrationBeat } from "../primitives/Narration";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";

interface MatrixTransform2DConfig {
  matrix?: number[][];
  showBasis?: boolean;
  showGrid?: boolean;
  viewBox?: { x?: [number, number]; y?: [number, number] };
  narration?: NarrationBeat[];
}

interface Props {
  config: Record<string, unknown>;
}

function lerp2x2(target: number[][], t: number): number[][] {
  const id = [
    [1, 0],
    [0, 1],
  ];
  return [
    [id[0][0] + (target[0][0] - id[0][0]) * t, id[0][1] + (target[0][1] - id[0][1]) * t],
    [id[1][0] + (target[1][0] - id[1][0]) * t, id[1][1] + (target[1][1] - id[1][1]) * t],
  ];
}

export default function MatrixTransform2D({ config }: Props) {
  const cfg = (config ?? {}) as MatrixTransform2DConfig;
  const targetMatrix = cfg.matrix ?? [
    [2, 1],
    [1, 2],
  ];
  const showBasis = cfg.showBasis ?? true;
  const viewBox = cfg.viewBox;

  const [t, setT] = useState(1);

  const m = useMemo(() => lerp2x2(targetMatrix, t), [targetMatrix, t]);

  const e1: [number, number] = [m[0][0], m[1][0]];
  const e2: [number, number] = [m[0][1], m[1][1]];
  const square: [number, number][] = [
    [0, 0],
    e1,
    [e1[0] + e2[0], e1[1] + e2[1]],
    e2,
  ];

  const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const height = useMafsHeight(360);

  // Cover the unit square (always shown), the transformed parallelogram, and a
  // little padding. Centered on origin so the geometry stays balanced.
  const auto = useMemo(() => {
    const corners: Array<{ x: number; y: number }> = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: e1[0], y: e1[1] },
      { x: e2[0], y: e2[1] },
      { x: e1[0] + e2[0], y: e1[1] + e2[1] },
    ];
    return fitContent(corners, {
      padding: 0.22,
      minHalfSpanX: 1.6,
      minHalfSpanY: 1.6,
      centerOnZero: true,
    });
  }, [e1, e2]);
  const view = {
    x: viewBox?.x ?? auto.x,
    y: viewBox?.y ?? auto.y,
  };

  // Suppress tick labels under the vector-tip captions.
  const hideXNear = useMemo(() => [e1[0], e2[0]], [e1, e2]);
  const hideYNear = useMemo(() => [e1[1], e2[1]], [e1, e2]);

  return (
    <>
    <MafsStage accent="emerald" narration={cfg.narration}>
      <ZoomableMafs viewBox={view} height={height}>
        <SmartAxes hideXNear={hideXNear} hideYNear={hideYNear} />

        <Polygon
          points={[
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ]}
          color={BLUE}
          fillOpacity={0.05}
          strokeOpacity={0.3}
          weight={2}
        />

        <Polygon points={square} color={EMERALD} fillOpacity={0.22} weight={2.5} />

        {showBasis && (
          <>
            <Vector tip={e1} color={EMERALD} weight={3} />
            <Vector tip={e2} color={AMBER} weight={3} />
            <Text x={e1[0]} y={e1[1]} attach="ne" attachDistance={14} color={EMERALD} size={14}>
              e₁ →
            </Text>
            <Text x={e2[0]} y={e2[1]} attach="ne" attachDistance={14} color={AMBER} size={14}>
              e₂ →
            </Text>
          </>
        )}
      </ZoomableMafs>
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
        <label style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 220px" }}>
          <span style={{ minWidth: 92 }}>Animation t = {t.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(e) => setT(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: EMERALD }}
          />
        </label>
        <span style={{ color: EMERALD, fontVariantNumeric: "tabular-nums" }}>
          det = {det.toFixed(2)}
        </span>
      </div>
    </>
  );
}
