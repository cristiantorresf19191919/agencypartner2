"use client";

import React, { useState, useMemo } from "react";
import { Mafs, Coordinates, Vector, Polygon } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";

interface MatrixTransform2DConfig {
  matrix?: number[][];
  showBasis?: boolean;
  showGrid?: boolean;
  viewBox?: { x?: [number, number]; y?: [number, number] };
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
  const viewBox = cfg.viewBox ?? { x: [-5, 5], y: [-5, 5] };

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
  const height = useMafsHeight(340);

  return (
    <>
    <MafsStage accent="emerald">
      <Mafs
        viewBox={{ x: viewBox.x ?? [-5, 5], y: viewBox.y ?? [-5, 5] }}
        preserveAspectRatio="contain"
        height={height}
      >
        <Coordinates.Cartesian />

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
        />

        <Polygon points={square} color={EMERALD} fillOpacity={0.22} />

        {showBasis && (
          <>
            <Vector tip={e1} color={EMERALD} />
            <Vector tip={e2} color={AMBER} />
          </>
        )}
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
