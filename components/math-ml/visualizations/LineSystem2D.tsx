"use client";

import React, { useMemo } from "react";
import { Line, Text } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes } from "../primitives/SmartAxes";
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
  // Tight viewport: cover origin + solution + small padding. Aspect ratio is
  // not preserved, so x/y can stay independent.
  const halfX = Math.max(3, Math.abs(cx) + 2.5);
  const halfY = Math.max(3, Math.abs(cy) + 2.5);
  return { x: [cx - halfX, cx + halfX], y: [cy - halfY, cy + halfY] };
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

  const hideXNear = solution ? [solution[0]] : [];
  const hideYNear = solution ? [solution[1]] : [];

  return (
    <MafsStage accent="emerald" narration={cfg.narration}>
      <ZoomableMafs
        viewBox={view}
        height={height}
        preserveAspectRatio={false}
      >
        <SmartAxes hideXNear={hideXNear} hideYNear={hideYNear} />
        {lines.map((line, i) => {
          const [p1, p2] = endpointsForLine(line);
          const color = PALETTE[i % PALETTE.length];
          // Stagger label x-positions across lines so multi-line systems don't
          // stack labels on top of each other near the intersection.
          const labelX =
            view.x[0] + ((i + 1) * (view.x[1] - view.x[0])) / (lines.length + 1);
          return (
            <React.Fragment key={`line-${i}`}>
              <Line.ThroughPoints point1={p1} point2={p2} color={color} weight={2.6} />
              {line.label ? (
                <LabelOnLine
                  line={line}
                  color={color}
                  preferX={labelX}
                  avoid={solution}
                />
              ) : null}
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
 * Labels a line at `preferX`, but nudges away if too close to the system's
 * intersection point so equation labels don't collide with the solution dot.
 */
function LabelOnLine({
  line,
  color,
  preferX,
  avoid,
}: {
  line: LineSpec;
  color: string;
  preferX: number;
  avoid?: [number, number];
}) {
  const { a, b, c, label } = line;
  let x = preferX;
  if (avoid && Math.abs(x - avoid[0]) < 1.2) {
    // Push at least 1.5 units away from the intersection point.
    x = x < avoid[0] ? avoid[0] - 1.8 : avoid[0] + 1.8;
  }
  const isVertical = Math.abs(b) < 1e-9;
  const px = isVertical ? c / Math.max(a, 1e-9) : x;
  const py = isVertical ? 0 : (c - a * x) / b;
  return (
    <Text x={px} y={py} attach="ne" attachDistance={10} color={color} size={14}>
      {label ?? ""}
    </Text>
  );
}
