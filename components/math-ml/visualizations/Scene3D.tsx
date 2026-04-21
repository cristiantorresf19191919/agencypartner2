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
  const background = cfg.background ?? "rgba(15, 23, 42, 0.55)";
  const border = cfg.border ?? "1px solid rgba(16, 185, 129, 0.18)";

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border,
        background,
        height,
        width: "100%",
      }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
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
    </div>
  );
}
