"use client";

import React, { useMemo } from "react";
import { Vector, Point, Line, Text } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes, fitContent } from "../primitives/SmartAxes";
import { LabeledMarker, type AccentName, type MarkerKind } from "../primitives/LabeledMarker";
import type { NarrationBeat } from "../primitives/Narration";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const VIOLET = "#A78BFA";
const PALETTE = [EMERALD, BLUE, AMBER, RED, VIOLET];

interface MarkerSpec {
  x: number;
  y: number;
  label: string;
  kind?: MarkerKind;
  accent?: AccentName;
}

interface VectorPlot2DConfig {
  vectors?: number[][];
  labels?: string[];
  showSum?: boolean;
  showSpan?: boolean;
  viewBox?: { x?: [number, number]; y?: [number, number] };
  markers?: MarkerSpec[];
  narration?: NarrationBeat[];
}

interface Props {
  config: Record<string, unknown>;
}

export default function VectorPlot2D({ config }: Props) {
  const cfg = (config ?? {}) as VectorPlot2DConfig;
  const vectors: [number, number][] = (cfg.vectors ?? [[2, 1], [-1, 2]]).map(
    (v) => [Number(v[0]) || 0, Number(v[1]) || 0]
  );
  const labels = cfg.labels ?? [];
  const showSum = Boolean(cfg.showSum);
  const showSpan = Boolean(cfg.showSpan);

  const sum: [number, number] = vectors.reduce<[number, number]>(
    (acc, v) => [acc[0] + v[0], acc[1] + v[1]],
    [0, 0]
  );

  const auto = useMemo(() => {
    const items = vectors.map(([x, y]) => ({ x, y }));
    if (showSum) items.push({ x: sum[0], y: sum[1] });
    return fitContent(items, {
      padding: 0.18,
      minHalfSpanX: 1.5,
      minHalfSpanY: 1.5,
      centerOnZero: true,
      includeOrigin: true,
    });
  }, [vectors, showSum, sum]);

  const viewBox = {
    x: cfg.viewBox?.x ?? auto.x,
    y: cfg.viewBox?.y ?? auto.y,
  };

  // Vector tip labels are placed at v * 1.08 — suppress axis ticks there.
  const hideXNear = vectors.map(([x]) => x * 1.08);
  const hideYNear = vectors.map(([, y]) => y * 1.08);
  if (showSum) {
    hideXNear.push(sum[0] * 1.08);
    hideYNear.push(sum[1] * 1.08);
  }

  const height = useMafsHeight(360);

  return (
    <MafsStage accent="emerald" narration={cfg.narration}>
      <ZoomableMafs viewBox={viewBox} height={height}>
        <SmartAxes hideXNear={hideXNear} hideYNear={hideYNear} />

        {showSpan && vectors[0] && (
          <Line.ThroughPoints
            point1={[-vectors[0][0] * 20, -vectors[0][1] * 20]}
            point2={[vectors[0][0] * 20, vectors[0][1] * 20]}
            color={EMERALD}
            style="dashed"
            opacity={0.35}
            weight={2}
          />
        )}

        {vectors.map((v, i) => (
          <React.Fragment key={`vec-${i}`}>
            <Vector tip={v} color={PALETTE[i % PALETTE.length]} weight={3} />
            {labels[i] && (
              <Text x={v[0] * 1.08} y={v[1] * 1.08} color={PALETTE[i % PALETTE.length]} size={18}>
                {labels[i]}
              </Text>
            )}
          </React.Fragment>
        ))}

        {showSum && vectors.length >= 2 && (
          <>
            <Vector
              tail={vectors[0]}
              tip={sum}
              color={BLUE}
              opacity={0.55}
              style="dashed"
              weight={2.4}
            />
            <Vector tip={sum} color={AMBER} weight={3.4} />
            <Text x={sum[0] * 1.08} y={sum[1] * 1.08} color={AMBER} size={18}>
              sum
            </Text>
            <Point x={sum[0]} y={sum[1]} color={AMBER} />
          </>
        )}

        {(cfg.markers ?? []).map((m, i) => (
          <LabeledMarker
            key={`mk-${i}`}
            x={m.x}
            y={m.y}
            label={m.label}
            kind={m.kind ?? "square"}
            accent={m.accent ?? "emerald"}
          />
        ))}
      </ZoomableMafs>
    </MafsStage>
  );
}
