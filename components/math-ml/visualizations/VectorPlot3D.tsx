"use client";

import React from "react";
import { Line, Text } from "@react-three/drei";
import Scene3D from "./Scene3D";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const VIOLET = "#A78BFA";
const PALETTE = [EMERALD, BLUE, AMBER, RED, VIOLET];

type Vec3 = [number, number, number];

interface VectorPlot3DConfig {
  vectors?: number[][];
  labels?: string[];
  showCross?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  tipSize?: number;
}

interface Props {
  config: Record<string, unknown>;
}

function toVec3(v: number[] | undefined): Vec3 {
  return [Number(v?.[0] ?? 0), Number(v?.[1] ?? 0), Number(v?.[2] ?? 0)];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function Arrow({
  tip,
  color,
  label,
  tipSize = 0.12,
}: {
  tip: Vec3;
  color: string;
  label?: string;
  tipSize?: number;
}) {
  const origin: Vec3 = [0, 0, 0];
  const labelPos: Vec3 = [tip[0] * 1.1, tip[1] * 1.1 + 0.2, tip[2] * 1.1];

  return (
    <>
      <Line points={[origin, tip]} color={color} lineWidth={2.5} />
      <mesh position={tip}>
        <sphereGeometry args={[tipSize, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
      </mesh>
      {label && (
        <Text
          position={labelPos}
          color={color}
          fontSize={0.32}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </>
  );
}

export default function VectorPlot3D({ config }: Props) {
  const cfg = (config ?? {}) as VectorPlot3DConfig;
  const rawVectors = cfg.vectors ?? [
    [2, 1, 1],
    [-1, 2, 1],
  ];
  const vectors: Vec3[] = rawVectors.map(toVec3);
  const labels = cfg.labels ?? [];
  const showCross = Boolean(cfg.showCross);
  const tipSize = cfg.tipSize ?? 0.12;

  const crossVec: Vec3 | null =
    showCross && vectors.length >= 2 ? cross(vectors[0], vectors[1]) : null;

  return (
    <Scene3D
      config={{
        showGrid: cfg.showGrid ?? true,
        showAxes: cfg.showAxes ?? true,
      }}
    >
      {vectors.map((v, i) => (
        <Arrow
          key={`vec3-${i}`}
          tip={v}
          color={PALETTE[i % PALETTE.length]}
          label={labels[i]}
          tipSize={tipSize}
        />
      ))}

      {crossVec && (
        <Arrow
          tip={crossVec}
          color={AMBER}
          label="a × b"
          tipSize={tipSize}
        />
      )}
    </Scene3D>
  );
}
