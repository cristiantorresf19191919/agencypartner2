"use client";

import React, { useMemo } from "react";
import { Coordinates, Line, Text } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { LabeledMarker } from "../primitives/LabeledMarker";
import type { NarrationBeat } from "../primitives/Narration";

const PALETTE = ["#60A5FA", "#FBBF24", "#C4B5FD", "#F87171"] as const;
const FAR = 200;

interface LineSpec {
  /** Coefficients in `a·x + b·y = c`. */
  a: number;
  b: number;
  c: number;
  label?: string;
}

interface LineSystem2DConfig {
  lines?: LineSpec[];
  /** Coordinates of the system's intersection point, used for the marker. */
  solution?: [number, number];
  solutionLabel?: string;
  viewBox?: { x?: [number, number]; y?: [number, number] };
  narration?: NarrationBeat[];
}

interface Props {
  config: Record<string, unknown>;
}

function endpointsForLine(line: LineSpec): [[number, number], [number, number]] {
  const { a, b, c } = line;
  if (Math.abs(b) > 1e-9) {
    const y = (x: number) => (c - a * x) / b;
    return [[-FAR, y(-FAR)], [FAR, y(FAR)]];
  }
  // b == 0 → vertical line `a·x = c` ⇒ x = c/a
  if (Math.abs(a) > 1e-9) {
    const x = c / a;
    return [[x, -FAR], [x, FAR]];
  }
  return [[0, 0], [0, 0]];
}

function autoViewBox(
  solution: [number, number] | undefined,
): { x: [number, number]; y: [number, number] } {
  const cx = solution ? solution[0] : 0;
  const cy = solution ? solution[1] : 0;
  const span = Math.max(4, Math.abs(cx) + Math.abs(cy) + 4);
  return { x: [cx - span, cx + span], y: [cy - span, cy + span] };
}

export default function LineSystem2D({ config }: Props) {
  const cfg = (config ?? {}) as LineSystem2DConfig;
  const lines = cfg.lines ?? [];
  const solution = cfg.solution;
  const auto = useMemo(() => autoViewBox(solution), [solution]);
  const view = {
    x: cfg.viewBox?.x ?? auto.x,
    y: cfg.viewBox?.y ?? auto.y,
  };
  const height = useMafsHeight(360);

  return (
    <MafsStage accent="emerald" narration={cfg.narration}>
      <ZoomableMafs viewBox={view} height={height}>
        <Coordinates.Cartesian />
        {lines.map((line, i) => {
          const [p1, p2] = endpointsForLine(line);
          const color = PALETTE[i % PALETTE.length];
          return (
            <React.Fragment key={`line-${i}`}>
              <Line.ThroughPoints point1={p1} point2={p2} color={color} weight={2.6} />
              {line.label ? <LabelOnLine line={line} color={color} /> : null}
            </React.Fragment>
          );
        })}
        {solution ? (
          <LabeledMarker
            x={solution[0]}
            y={solution[1]}
            label={cfg.solutionLabel ?? `(${solution[0]}, ${solution[1]})`}
            kind="square"
            accent="emerald"
            attach="ne"
            attachDistance={18}
            size={15}
          />
        ) : null}
      </ZoomableMafs>
    </MafsStage>
  );
}

/**
 * Labels a line near a comfortable point — slightly offset from the y-axis so
 * the caption is always visible regardless of slope.
 */
function LabelOnLine({ line, color }: { line: LineSpec; color: string }) {
  const { a, b, c, label } = line;
  // Pick an x slightly off the y-axis; compute y from the equation.
  const x = Math.abs(b) > 1e-9 ? 1.6 : c / Math.max(a, 1e-9);
  const y = Math.abs(b) > 1e-9 ? (c - a * x) / b : 0;
  return (
    <Text x={x} y={y} attach="ne" attachDistance={10} color={color} size={14}>
      {label ?? ""}
    </Text>
  );
}
