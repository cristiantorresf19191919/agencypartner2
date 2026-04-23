"use client";

import React, { useState } from "react";
import { Mafs, Coordinates, Circle, Polygon, Text } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";

type NormKey = "l1" | "l2" | "linf";

interface NormBallsConfig {
  norms?: NormKey[];
  radius?: number;
}

interface Props {
  config: Record<string, unknown>;
}

export default function NormBalls({ config }: Props) {
  const cfg = (config ?? {}) as NormBallsConfig;
  const initial = cfg.norms ?? ["l1", "l2", "linf"];
  const r = cfg.radius ?? 1;

  const [active, setActive] = useState<Record<NormKey, boolean>>({
    l1: initial.includes("l1"),
    l2: initial.includes("l2"),
    linf: initial.includes("linf"),
  });

  const toggle = (key: NormKey) =>
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));

  const l1Points: [number, number][] = [
    [r, 0],
    [0, r],
    [-r, 0],
    [0, -r],
  ];

  const linfPoints: [number, number][] = [
    [r, r],
    [-r, r],
    [-r, -r],
    [r, -r],
  ];

  const height = useMafsHeight(340);

  return (
    <>
    <MafsStage accent="amber">
      <Mafs viewBox={{ x: [-2, 2], y: [-2, 2] }} preserveAspectRatio="contain" height={height}>
        <Coordinates.Cartesian />
        {active.l1 && (
          <>
            <Polygon points={l1Points} color={AMBER} fillOpacity={0.18} />
            <Text x={r * 0.6} y={r * 0.6} color={AMBER} size={14}>
              L1
            </Text>
          </>
        )}
        {active.l2 && (
          <>
            <Circle center={[0, 0]} radius={r} color={EMERALD} fillOpacity={0.15} />
            <Text x={0} y={r * 1.05} color={EMERALD} size={14} attach="n">
              L2
            </Text>
          </>
        )}
        {active.linf && (
          <>
            <Polygon points={linfPoints} color={BLUE} fillOpacity={0.12} />
            <Text x={r * 0.92} y={r * 0.92} color={BLUE} size={14}>
              Linf
            </Text>
          </>
        )}
      </Mafs>
    </MafsStage>
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "10px 14px",
          marginTop: 8,
          borderRadius: 10,
          flexWrap: "wrap",
          border: "1px solid rgba(16, 185, 129, 0.18)",
          background: "rgba(15, 23, 42, 0.45)",
        }}
      >
        {(["l1", "l2", "linf"] as NormKey[]).map((k) => {
          const color = k === "l1" ? AMBER : k === "l2" ? EMERALD : BLUE;
          const label = k === "l1" ? "L1 (diamond)" : k === "l2" ? "L2 (circle)" : "Linf (square)";
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: `1px solid ${color}`,
                background: active[k] ? color : "transparent",
                color: active[k] ? "#0b1220" : color,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
