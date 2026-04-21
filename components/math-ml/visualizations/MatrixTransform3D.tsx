"use client";

import React, { useMemo, useState } from "react";
import { Line } from "@react-three/drei";
import Scene3D from "./Scene3D";

const EMERALD = "#10B981";
const FAINT = "#64748B";

type Vec3 = [number, number, number];

interface MatrixTransform3DConfig {
  matrix?: number[][];
  showOriginal?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
}

interface Props {
  config: Record<string, unknown>;
}

const IDENTITY_3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

function lerp3x3(target: number[][], t: number): number[][] {
  return IDENTITY_3.map((row, i) =>
    row.map((val, j) => val + (target[i][j] - val) * t)
  );
}

function applyMatrix(m: number[][], v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

// 8 corners of unit cube centered at origin (from -0.5 to 0.5 feels small,
// use 0..1 cube to match basis vectors)
const CUBE_VERTICES: Vec3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
];

const CUBE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export default function MatrixTransform3D({ config }: Props) {
  const cfg = (config ?? {}) as MatrixTransform3DConfig;
  const targetMatrix = cfg.matrix ?? [
    [1.2, 0.5, 0],
    [0, 1.5, 0.3],
    [0.2, 0, 1.1],
  ];
  const showOriginal = cfg.showOriginal ?? true;

  const [t, setT] = useState(1);

  const currentMatrix = useMemo(() => lerp3x3(targetMatrix, t), [targetMatrix, t]);

  const transformedVertices = useMemo(
    () => CUBE_VERTICES.map((v) => applyMatrix(currentMatrix, v)),
    [currentMatrix]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Scene3D
        config={{
          showGrid: cfg.showGrid ?? true,
          showAxes: cfg.showAxes ?? true,
        }}
      >
        {showOriginal &&
          CUBE_EDGES.map(([a, b], idx) => (
            <Line
              key={`orig-${idx}`}
              points={[CUBE_VERTICES[a], CUBE_VERTICES[b]]}
              color={FAINT}
              lineWidth={1}
              transparent
              opacity={0.35}
            />
          ))}

        {CUBE_EDGES.map(([a, b], idx) => (
          <Line
            key={`xform-${idx}`}
            points={[transformedVertices[a], transformedVertices[b]]}
            color={EMERALD}
            lineWidth={2}
          />
        ))}
      </Scene3D>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 12px",
          borderRadius: 10,
          background: "rgba(15, 23, 42, 0.45)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          color: "#E2E8F0",
          fontSize: 13,
        }}
      >
        <label htmlFor="matrix3d-t" style={{ whiteSpace: "nowrap" }}>
          t = {t.toFixed(2)}
        </label>
        <input
          id="matrix3d-t"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          style={{ flex: 1, accentColor: EMERALD }}
        />
        <span style={{ color: FAINT }}>
          identity → target
        </span>
      </div>
    </div>
  );
}
