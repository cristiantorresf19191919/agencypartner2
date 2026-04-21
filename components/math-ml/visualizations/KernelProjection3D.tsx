"use client";

import React, { useMemo, useState } from "react";
import { Line, Text } from "@react-three/drei";
import Scene3D from "./Scene3D";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const RED = "#EF4444";
const AMBER = "#F59E0B";

type Vec3 = [number, number, number];
type KernelMode = "polynomial" | "rbf";

interface KernelProjection3DConfig {
  points?: { x: number; y: number; label: number }[];
  seed?: number;
  count?: number;
  rbfSigma?: number;
  showPlane?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  defaultKernel?: KernelMode;
}

interface Props {
  config: Record<string, unknown>;
}

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

// Concentric-ring dataset: inner class = 1, outer class = -1
// Classic example where polynomial/RBF lifts become linearly separable
function generateRings(seed: number, count: number) {
  const rand = mulberry32(seed);
  const pts: { x: number; y: number; label: number }[] = [];
  for (let i = 0; i < count; i++) {
    const inner = i % 2 === 0;
    const radius = inner ? 0.6 + rand() * 0.5 : 1.9 + rand() * 0.6;
    const theta = rand() * Math.PI * 2;
    pts.push({
      x: Math.cos(theta) * radius + (rand() - 0.5) * 0.1,
      y: Math.sin(theta) * radius + (rand() - 0.5) * 0.1,
      label: inner ? 1 : -1,
    });
  }
  return pts;
}

export default function KernelProjection3D({ config }: Props) {
  const cfg = (config ?? {}) as KernelProjection3DConfig;

  const [kernel, setKernel] = useState<KernelMode>(
    cfg.defaultKernel ?? "polynomial"
  );

  const points2D = useMemo(() => {
    if (cfg.points && cfg.points.length > 0) return cfg.points;
    return generateRings(cfg.seed ?? 11, cfg.count ?? 90);
  }, [cfg.points, cfg.seed, cfg.count]);

  const sigma = cfg.rbfSigma ?? 1.2;
  const showPlane = cfg.showPlane ?? true;

  // Lift to 3D: z = x^2 + y^2 (polynomial) OR z = exp(-r^2 / 2 sigma^2) scaled (rbf)
  const lifted = useMemo<
    { pos: Vec3; label: number }[]
  >(() => {
    return points2D.map((p) => {
      const r2 = p.x * p.x + p.y * p.y;
      let z: number;
      if (kernel === "polynomial") {
        z = r2 * 0.6;
      } else {
        // Use negative RBF so inner ring lifts up (inverted for visual clarity)
        const g = Math.exp(-r2 / (2 * sigma * sigma));
        z = g * 3.2;
      }
      return { pos: [p.x, p.y, z], label: p.label };
    });
  }, [points2D, kernel, sigma]);

  // Threshold for separating plane: halfway between class mean-z values
  const planeZ = useMemo(() => {
    let sumPos = 0;
    let sumNeg = 0;
    let cntPos = 0;
    let cntNeg = 0;
    for (const pt of lifted) {
      if (pt.label === 1) {
        sumPos += pt.pos[2];
        cntPos++;
      } else {
        sumNeg += pt.pos[2];
        cntNeg++;
      }
    }
    const mPos = cntPos > 0 ? sumPos / cntPos : 1;
    const mNeg = cntNeg > 0 ? sumNeg / cntNeg : 0;
    return (mPos + mNeg) / 2;
  }, [lifted]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Scene3D
        config={{
          showGrid: cfg.showGrid ?? true,
          showAxes: cfg.showAxes ?? true,
          cameraPosition: [5, 4, 6],
        }}
      >
        {/* Faint 2D original points on z=0 plane */}
        {points2D.map((p, i) => (
          <mesh key={`orig-${i}`} position={[p.x, p.y, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={p.label === 1 ? EMERALD : BLUE}
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}

        {/* Lifted points in 3D */}
        {lifted.map((pt, i) => (
          <mesh key={`lift-${i}`} position={pt.pos}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color={pt.label === 1 ? EMERALD : BLUE}
              emissive={pt.label === 1 ? EMERALD : BLUE}
              emissiveIntensity={0.25}
            />
          </mesh>
        ))}

        {/* Connection line from 2D original to lifted point (faint) */}
        {lifted.map((pt, i) => {
          const orig = points2D[i];
          return (
            <Line
              key={`conn-${i}`}
              points={[
                [orig.x, orig.y, 0],
                pt.pos,
              ]}
              color={pt.label === 1 ? EMERALD : BLUE}
              lineWidth={0.5}
              transparent
              opacity={0.18}
            />
          );
        })}

        {/* Separating plane at z = planeZ */}
        {showPlane && (
          <mesh position={[0, 0, planeZ]} rotation={[0, 0, 0]}>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial
              color={AMBER}
              transparent
              opacity={0.22}
              side={2}
            />
          </mesh>
        )}

        <Text
          position={[0, 0, planeZ + 0.25]}
          color={AMBER}
          fontSize={0.26}
          anchorX="center"
          anchorY="middle"
        >
          {`z ≈ ${planeZ.toFixed(2)}`}
        </Text>
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
        <span style={{ color: "#94A3B8" }}>Kernel:</span>
        {(["polynomial", "rbf"] as KernelMode[]).map((k) => (
          <button
            key={`k-${k}`}
            onClick={() => setKernel(k)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: `1px solid ${kernel === k ? EMERALD : "#334155"}`,
              background:
                kernel === k ? "rgba(16, 185, 129, 0.18)" : "transparent",
              color: kernel === k ? EMERALD : "#CBD5E1",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {k === "polynomial" ? "φ = (x, y, x²+y²)" : "RBF lift"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#94A3B8", fontSize: 11 }}>
          <span style={{ color: EMERALD }}>● inner</span>
          {"  "}
          <span style={{ color: BLUE }}>● outer</span>
          {"  "}
          <span style={{ color: RED }}>—</span>
        </span>
      </div>
    </div>
  );
}
