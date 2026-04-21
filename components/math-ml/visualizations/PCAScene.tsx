"use client";

import React, { useMemo, useState } from "react";
import { Line, Text } from "@react-three/drei";
import Scene3D from "./Scene3D";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const VIOLET = "#A78BFA";

type Vec3 = [number, number, number];

interface PCASceneConfig {
  points?: number[][];
  seed?: number;
  count?: number;
  showAxes?: boolean;
  showGrid?: boolean;
  pointColor?: string;
  pointSize?: number;
}

interface Props {
  config: Record<string, unknown>;
}

// Seeded RNG for deterministic sample data
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSample(seed: number, count: number): Vec3[] {
  const rand = mulberry32(seed);
  const out: Vec3[] = [];
  // Generate anisotropic cloud elongated along (1,1,0.3) axis
  for (let i = 0; i < count; i++) {
    const t = (rand() - 0.5) * 6;
    const n1 = (rand() - 0.5) * 1.2;
    const n2 = (rand() - 0.5) * 0.8;
    const p: Vec3 = [t * 1 + n1, t * 1 + n2, t * 0.3 + (rand() - 0.5) * 0.5];
    out.push(p);
  }
  return out;
}

function mean(points: Vec3[]): Vec3 {
  const s: Vec3 = [0, 0, 0];
  for (const p of points) {
    s[0] += p[0];
    s[1] += p[1];
    s[2] += p[2];
  }
  const n = Math.max(points.length, 1);
  return [s[0] / n, s[1] / n, s[2] / n];
}

function covariance(points: Vec3[], mu: Vec3): number[][] {
  const n = Math.max(points.length - 1, 1);
  const c = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const p of points) {
    const d0 = p[0] - mu[0];
    const d1 = p[1] - mu[1];
    const d2 = p[2] - mu[2];
    c[0][0] += d0 * d0;
    c[0][1] += d0 * d1;
    c[0][2] += d0 * d2;
    c[1][1] += d1 * d1;
    c[1][2] += d1 * d2;
    c[2][2] += d2 * d2;
  }
  c[0][0] /= n;
  c[0][1] /= n;
  c[0][2] /= n;
  c[1][1] /= n;
  c[1][2] /= n;
  c[2][2] /= n;
  c[1][0] = c[0][1];
  c[2][0] = c[0][2];
  c[2][1] = c[1][2];
  return c;
}

function matVec3(m: number[][], v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

function norm3(v: Vec3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
}

function normalize3(v: Vec3): Vec3 {
  const n = norm3(v);
  return [v[0] / n, v[1] / n, v[2] / n];
}

function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function sub3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale3(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

// Power iteration: largest eigenvector of symmetric matrix
function powerIteration(
  m: number[][],
  iterations = 40,
  seedVec: Vec3 = [1, 1, 1]
): { vec: Vec3; val: number } {
  let v = normalize3(seedVec);
  for (let i = 0; i < iterations; i++) {
    v = normalize3(matVec3(m, v));
  }
  const mv = matVec3(m, v);
  const val = dot3(v, mv);
  return { vec: v, val };
}

// Deflate to find next principal component
function deflate(m: number[][], v: Vec3, val: number): number[][] {
  const out = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      out[i][j] = m[i][j] - val * v[i] * v[j];
    }
  }
  return out;
}

export default function PCAScene({ config }: Props) {
  const cfg = (config ?? {}) as PCASceneConfig;

  const [projDim, setProjDim] = useState<1 | 2 | 3>(3);

  const rawPoints: Vec3[] = useMemo(() => {
    if (cfg.points && cfg.points.length > 0) {
      return cfg.points.map(
        (p): Vec3 => [Number(p?.[0] ?? 0), Number(p?.[1] ?? 0), Number(p?.[2] ?? 0)]
      );
    }
    return generateSample(cfg.seed ?? 7, cfg.count ?? 140);
  }, [cfg.points, cfg.seed, cfg.count]);

  const { mu, pcs, projected } = useMemo(() => {
    const muLocal = mean(rawPoints);
    const cov = covariance(rawPoints, muLocal);
    const { vec: pc1, val: l1 } = powerIteration(cov, 50, [1, 1, 1]);
    const cov2 = deflate(cov, pc1, l1);
    const { vec: pc2, val: l2 } = powerIteration(cov2, 50, [1, -1, 0.5]);
    const cov3 = deflate(cov2, pc2, l2);
    const { vec: pc3 } = powerIteration(cov3, 50, [0.3, 0.5, 1]);
    const principal: Vec3[] = [pc1, pc2, pc3];

    // Project each centered point onto the first `projDim` PCs then reconstruct
    const projectedPts: Vec3[] = rawPoints.map((p) => {
      const centered = sub3(p, muLocal);
      let recon: Vec3 = [0, 0, 0];
      for (let k = 0; k < projDim; k++) {
        const coeff = dot3(centered, principal[k]);
        recon = [
          recon[0] + coeff * principal[k][0],
          recon[1] + coeff * principal[k][1],
          recon[2] + coeff * principal[k][2],
        ];
      }
      return [recon[0] + muLocal[0], recon[1] + muLocal[1], recon[2] + muLocal[2]];
    });

    return { mu: muLocal, pcs: principal, projected: projectedPts };
  }, [rawPoints, projDim]);

  const pcColors = [EMERALD, AMBER, VIOLET];
  const pcLabels = ["PC1", "PC2", "PC3"];
  const pcLengths = [3.5, 2.5, 1.8];

  const pointColor = cfg.pointColor ?? BLUE;
  const pointSize = cfg.pointSize ?? 0.06;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Scene3D
        config={{
          showGrid: cfg.showGrid ?? true,
          showAxes: cfg.showAxes ?? false,
        }}
      >
        {/* Original points, faint when a projection is active */}
        {rawPoints.map((p, i) => (
          <mesh key={`pt-${i}`} position={p}>
            <sphereGeometry args={[pointSize, 8, 8]} />
            <meshStandardMaterial
              color={pointColor}
              transparent
              opacity={projDim < 3 ? 0.35 : 0.9}
            />
          </mesh>
        ))}

        {/* Projected points */}
        {projDim < 3 &&
          projected.map((p, i) => (
            <mesh key={`proj-${i}`} position={p}>
              <sphereGeometry args={[pointSize * 1.1, 8, 8]} />
              <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.25} />
            </mesh>
          ))}

        {/* Principal component axes through the mean */}
        {pcs.map((v, k) => {
          const L = pcLengths[k];
          const a: Vec3 = [mu[0] - v[0] * L, mu[1] - v[1] * L, mu[2] - v[2] * L];
          const b: Vec3 = [mu[0] + v[0] * L, mu[1] + v[1] * L, mu[2] + v[2] * L];
          return (
            <React.Fragment key={`pc-${k}`}>
              <Line points={[a, b]} color={pcColors[k]} lineWidth={2.6} />
              <Text
                position={[b[0] * 1.02, b[1] * 1.02 + 0.25, b[2] * 1.02]}
                color={pcColors[k]}
                fontSize={0.3}
                anchorX="center"
                anchorY="middle"
              >
                {pcLabels[k]}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Mean marker */}
        <mesh position={mu}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.3} />
        </mesh>
      </Scene3D>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 10,
          background: "rgba(15, 23, 42, 0.45)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          color: "#E2E8F0",
          fontSize: 13,
        }}
      >
        <span style={{ color: "#94A3B8" }}>Project onto:</span>
        {[1, 2, 3].map((d) => (
          <button
            key={`dim-${d}`}
            onClick={() => setProjDim(d as 1 | 2 | 3)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: `1px solid ${projDim === d ? EMERALD : "#334155"}`,
              background: projDim === d ? "rgba(16, 185, 129, 0.18)" : "transparent",
              color: projDim === d ? EMERALD : "#CBD5E1",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {d}D
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#94A3B8", fontSize: 11 }}>
          {projDim === 3 ? "Original cloud" : `Reconstructed from top ${projDim} PC${projDim > 1 ? "s" : ""}`}
        </span>
      </div>
    </div>
  );
}
