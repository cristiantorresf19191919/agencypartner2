"use client";

import React, { useMemo } from "react";
import { Line, Point, Text, Vector } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes, fitContent } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, easeOutCubic, lerp, lerp2 } from "./easing";

const EMERALD = "#10B981";
const AMBER = "#FBBF24";
const ROSE = "#F472B6";
const SKY = "#60A5FA";

interface DotProductSceneProps {
  /** Vector a; defaults to (3, 1). */
  a?: [number, number];
  /** Vector b; defaults to (2, 3). */
  b?: [number, number];
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "Two vectors",
    labelEs: "Dos vectores",
    caption: {
      text: "Start with vectors a and b sharing a common origin.",
      textEs: "Empieza con los vectores a y b con un origen común.",
    },
    formulaStep: 0,
  },
  {
    duration: 2400,
    label: "Multiply matching coordinates",
    labelEs: "Multiplica coordenadas correspondientes",
    caption: {
      text: "The dot product multiplies x's together, y's together, then sums.",
      textEs:
        "El producto punto multiplica las x entre sí, las y entre sí, y suma.",
    },
    formulaStep: 1,
  },
  {
    duration: 2200,
    label: "Numbers add up",
    labelEs: "Los números se suman",
    caption: {
      text: "A scalar pops out — one number that fingerprints the pair.",
      textEs: "Sale un escalar — un número que caracteriza al par.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Geometry: project a onto b",
    labelEs: "Geometría: proyecta a sobre b",
    caption: {
      text: "Drop a perpendicular from a's tip to the line through b.",
      textEs:
        "Traza una perpendicular desde la punta de a hasta la recta de b.",
    },
    formulaStep: 3,
  },
  {
    duration: 2400,
    label: "Length × length × cos θ",
    labelEs: "Longitud × longitud × cos θ",
    caption: {
      text: "The same scalar equals ‖a‖·‖b‖·cos θ — algebra meets geometry.",
      textEs:
        "Ese mismo escalar equivale a ‖a‖·‖b‖·cos θ — el álgebra se encuentra con la geometría.",
    },
    formulaStep: 4,
  },
];

export default function DotProductScene({
  a: aProp,
  b: bProp,
  id,
}: DotProductSceneProps) {
  const a: [number, number] = aProp ?? [3, 1];
  const b: [number, number] = bProp ?? [2, 3];

  const dot = a[0] * b[0] + a[1] * b[1];
  const aMag = Math.hypot(a[0], a[1]);
  const bMag = Math.hypot(b[0], b[1]);
  const cosTheta = dot / Math.max(1e-9, aMag * bMag);
  const thetaDeg = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);

  // Projection of a onto b: ((a·b) / (b·b)) * b
  const projScalar = dot / (b[0] * b[0] + b[1] * b[1]);
  const projTip: [number, number] = [b[0] * projScalar, b[1] * projScalar];

  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toString() : n.toFixed(2);

  const formulaSteps = useMemo(
    () => [
      // 0 — generic anatomy
      `\\mathbf{a} \\cdot \\mathbf{b}`,
      // 1 — coordinate-wise products
      `\\mathbf{a} \\cdot \\mathbf{b} = (${a[0]})(${b[0]}) + (${a[1]})(${b[1]})`,
      // 2 — sum collapses
      `\\mathbf{a} \\cdot \\mathbf{b} = ${fmt(a[0] * b[0])} + ${fmt(a[1] * b[1])} = ${fmt(dot)}`,
      // 3 — projection viewpoint
      `\\mathbf{a} \\cdot \\mathbf{b} = \\|\\mathbf{a}\\|\\,\\text{proj}_{\\mathbf{b}}(\\mathbf{a})`,
      // 4 — cosine identity
      `\\mathbf{a} \\cdot \\mathbf{b} = \\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|\\,\\cos\\theta`,
    ],
    [a, b, dot],
  );

  const view = useMemo(() => {
    return fitContent(
      [
        { x: 0, y: 0 },
        { x: a[0], y: a[1] },
        { x: b[0], y: b[1] },
        { x: projTip[0], y: projTip[1] },
      ],
      {
        padding: 0.45,
        minHalfSpanX: 2,
        minHalfSpanY: 2,
        centerOnZero: true,
      },
    );
  }, [a, b, projTip]);

  const height = useMafsHeight(380);

  const formulaEmphasize = useMemo(
    () => ({
      2: [`${fmt(dot)}`],
      3: ["proj"],
      4: ["cos\\theta", "cos"],
    }),
    [dot],
  );

  return (
    <MathScene
      id={id}
      phases={PHASES}
      formulaSteps={formulaSteps}
      formulaEmphasize={formulaEmphasize}
      accent="emerald"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs viewBox={view} height={height}>
          <SmartAxes />
          <SceneFigure
            a={a}
            b={b}
            projTip={projTip}
            dot={dot}
            thetaDeg={thetaDeg}
            phaseIdx={phaseIdx}
            phaseProgress={phaseProgress}
            reduced={hasReducedMotion}
          />
        </ZoomableMafs>
      )}
    />
  );
}

interface FigureProps {
  a: [number, number];
  b: [number, number];
  projTip: [number, number];
  dot: number;
  thetaDeg: number;
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function SceneFigure({
  a,
  b,
  projTip,
  dot,
  thetaDeg,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  // Phase 1 — shadow vectors emphasising x then y components.
  const componentT =
    phaseIdx < 1
      ? 0
      : phaseIdx === 1
        ? eff(easeInOutCubic(phaseProgress))
        : 1;

  // Phase 3 — projection drop animates from a's tip down to its projection.
  const projT =
    phaseIdx < 3
      ? 0
      : phaseIdx === 3
        ? eff(easeOutCubic(phaseProgress))
        : 1;

  // Phase 4 — the angle arc + cos reading appears.
  const angleT =
    phaseIdx < 4
      ? 0
      : phaseIdx === 4
        ? eff(easeOutCubic(phaseProgress))
        : 1;

  // Build a circular arc for the angle indicator (phase 4).
  const arcRadius = 0.7;
  const arcPoints: [number, number][] = useMemo(() => {
    const aAngle = Math.atan2(a[1], a[0]);
    const bAngle = Math.atan2(b[1], b[0]);
    let start = aAngle;
    let end = bAngle;
    if (end < start) [start, end] = [end, start];
    const steps = 24;
    const out: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ang = lerp(start, end, t);
      out.push([Math.cos(ang) * arcRadius, Math.sin(ang) * arcRadius]);
    }
    return out;
  }, [a, b]);

  const arcVisibleCount = Math.max(
    0,
    Math.floor(arcPoints.length * eff(angleT)),
  );

  return (
    <>
      {/* Vectors a and b — always visible. */}
      <Vector tip={a} color={EMERALD} weight={3.2} />
      <Vector tip={b} color={AMBER} weight={3.2} />
      <Text x={a[0]} y={a[1]} attach="ne" attachDistance={14} color={EMERALD} size={14}>
        a
      </Text>
      <Text x={b[0]} y={b[1]} attach="ne" attachDistance={14} color={AMBER} size={14}>
        b
      </Text>

      {/* Phase 1 — coordinate axes "ghost" trace from origin to tips, x first then y. */}
      {phaseIdx >= 1 && (
        <>
          {/* Horizontal stub from origin to (a[0], 0). */}
          <Line.Segment
            point1={[0, 0]}
            point2={[a[0] * Math.min(1, componentT * 2), 0]}
            color={EMERALD}
            opacity={0.45}
            style="dashed"
            weight={1.5}
          />
          <Line.Segment
            point1={[a[0] * Math.min(1, componentT * 2), 0]}
            point2={[
              a[0] * Math.min(1, componentT * 2),
              a[1] * Math.max(0, Math.min(1, componentT * 2 - 1)),
            ]}
            color={EMERALD}
            opacity={0.45}
            style="dashed"
            weight={1.5}
          />
          {/* Same for b in amber. */}
          <Line.Segment
            point1={[0, 0]}
            point2={[b[0] * Math.min(1, componentT * 2), 0]}
            color={AMBER}
            opacity={0.45}
            style="dashed"
            weight={1.5}
          />
          <Line.Segment
            point1={[b[0] * Math.min(1, componentT * 2), 0]}
            point2={[
              b[0] * Math.min(1, componentT * 2),
              b[1] * Math.max(0, Math.min(1, componentT * 2 - 1)),
            ]}
            color={AMBER}
            opacity={0.45}
            style="dashed"
            weight={1.5}
          />
        </>
      )}

      {/* Phase 3 — projection of a onto b: line from origin along b up to projTip,
          plus a perpendicular from a's tip down to projTip. */}
      {phaseIdx >= 3 && (
        <>
          {/* The projection segment along b. */}
          <Line.Segment
            point1={[0, 0]}
            point2={lerp2([0, 0], projTip, eff(projT))}
            color={ROSE}
            opacity={0.85}
            weight={3}
          />
          {/* Perpendicular from a tip to projTip. */}
          <Line.Segment
            point1={a}
            point2={lerp2(a, projTip, eff(projT))}
            color={ROSE}
            opacity={0.7}
            style="dashed"
            weight={1.8}
          />
          <Point
            x={projTip[0]}
            y={projTip[1]}
            color={ROSE}
            opacity={projT}
            svgCircleProps={{
              r: 4.5,
              style: { filter: "drop-shadow(0 0 6px rgba(244, 114, 182, 0.7))" },
            }}
          />
          {projT >= 0.85 && (
            <Text
              x={projTip[0]}
              y={projTip[1]}
              attach="se"
              attachDistance={14}
              color={ROSE}
              size={13}
            >
              {`proj_b(a) = ${fmt(dot / Math.max(1e-9, Math.hypot(b[0], b[1])))}`}
            </Text>
          )}
        </>
      )}

      {/* Phase 4 — angle arc + θ label. */}
      {phaseIdx >= 4 && arcVisibleCount > 1 && (
        <>
          {arcPoints.slice(0, arcVisibleCount).map((p, i) => {
            const next = arcPoints[Math.min(i + 1, arcPoints.length - 1)];
            return (
              <Line.Segment
                key={i}
                point1={p}
                point2={next}
                color={SKY}
                opacity={0.9}
                weight={2.2}
              />
            );
          })}
          {angleT >= 0.6 && (
            <Text
              x={Math.cos(
                Math.atan2((a[1] + b[1]) / 2, (a[0] + b[0]) / 2),
              ) * arcRadius * 1.55}
              y={Math.sin(
                Math.atan2((a[1] + b[1]) / 2, (a[0] + b[0]) / 2),
              ) * arcRadius * 1.55}
              attach="ne"
              attachDistance={4}
              color={SKY}
              size={13}
            >
              {`θ ≈ ${fmt(thetaDeg)}°`}
            </Text>
          )}
        </>
      )}
    </>
  );
}

function fmt(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}
