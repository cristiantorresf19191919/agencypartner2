"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

interface Scene3DConfig {
  showGrid?: boolean;
  showAxes?: boolean;
  cameraPosition?: [number, number, number];
  background?: string;
  border?: string;
}

interface Props {
  config?: Record<string, unknown>;
  children: React.ReactNode;
  height?: number;
}

export default function Scene3D({ config, children, height = 420 }: Props) {
  const cfg = (config ?? {}) as Scene3DConfig;
  const showGrid = cfg.showGrid ?? true;
  const showAxes = cfg.showAxes ?? true;
  const cameraPosition = cfg.cameraPosition ?? [5, 4, 6];
  const background = cfg.background ?? "transparent";
  const border = cfg.border ?? "1px solid rgba(16, 185, 129, 0.22)";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        border,
        background,
        height,
        width: "100%",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 20% 10%, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 55%), radial-gradient(100% 70% at 85% 90%, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0) 60%), linear-gradient(180deg, #0b1224 0%, #040814 100%)",
          pointerEvents: "none",
        }}
      />
      <Canvas
        camera={{ position: cameraPosition, fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: 0 }}
        flat
        style={{ position: "relative" }}
      >
        <color attach="background" args={["#060b1a"]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 8, 6]} intensity={0.9} />
        <directionalLight position={[-6, -4, -6]} intensity={0.25} />

        {showAxes && <axesHelper args={[4]} />}

        {showGrid && (
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.6}
            cellColor="#334155"
            sectionSize={5}
            sectionThickness={1.1}
            sectionColor="#10B981"
            fadeDistance={24}
            fadeStrength={1}
            infiniteGrid={false}
            position={[0, 0, 0]}
          />
        )}

        {children}

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          makeDefault
          minDistance={2}
          maxDistance={30}
        />
      </Canvas>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(2, 6, 23, 0.45) 100%)",
        }}
      />
    </div>
  );
}
