"use client";

import React, { useMemo } from "react";
import { Line, Point, Text, Vector } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes, fitContent } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, easeOutCubic, lerp2 } from "./easing";

const EMERALD = "#10B981";
const AMBER = "#FBBF24";
const ROSE = "#F472B6";
const SKY = "#60A5FA";

interface ProjectionSceneProps {
  /** Vector to be projected; defaults to (3, 2). */
  v?: [number, number];
  /** Direction to project onto; defaults to (4, 1). */
  u?: [number, number];
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "A vector and a direction",
    labelEs: "Un vector y una dirección",
    caption: {
      text: "v is the vector to decompose; u defines the line we project onto.",
      textEs: "v es el vector a descomponer; u define la recta sobre la que proyectamos.",
    },
    formulaStep: 0,
  },
  {
    duration: 2200,
    label: "Extend u into a line",
    labelEs: "Extiende u a una recta",
    caption: {
      text: "Every scalar multiple of u traces the line we will project onto.",
      textEs:
        "Cada múltiplo escalar de u traza la recta sobre la que proyectaremos.",
    },
    formulaStep: 1,
  },
  {
    duration: 2400,
    label: "Drop the perpendicular",
    labelEs: "Traza la perpendicular",
    caption: {
      text: "The shortest path from v's tip to the line is perpendicular to u.",
      textEs:
        "El camino más corto desde la punta de v a la recta es perpendicular a u.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Foot of the perpendicular = proj",
    labelEs: "Pie de la perpendicular = proyección",
    caption: {
      text: "Where the perpendicular hits the line is the projection of v onto u.",
      textEs:
        "Donde la perpendicular toca la recta está la proyección de v sobre u.",
    },
    formulaStep: 3,
  },
  {
    duration: 2400,
    label: "Residual closes the triangle",
    labelEs: "El residuo cierra el triángulo",
    caption: {
      text: "v splits into proj_u(v) along u, plus a residual perpendicular to u.",
      textEs:
        "v se separa en proj_u(v) sobre u, más un residuo perpendicular a u.",
    },
    formulaStep: 4,
  },
  {
    duration: 2600,
    label: "v = (v·u / u·u) u + r",
    labelEs: "v = (v·u / u·u) u + r",
    caption: {
      text: "The scalar (v·u)/(u·u) tells us how far along u the projection goes.",
      textEs:
        "El escalar (v·u)/(u·u) dice cuánto avanza la proyección a lo largo de u.",
    },
    formulaStep: 5,
  },
];

export default function ProjectionScene({
  v: vProp,
  u: uProp,
  id,
}: ProjectionSceneProps) {
  const v: [number, number] = vProp ?? [3, 2];
  const u: [number, number] = uProp ?? [4, 1];

  const dotVU = v[0] * u[0] + v[1] * u[1];
  const dotUU = u[0] * u[0] + u[1] * u[1];
  const scalar = dotVU / Math.max(1e-9, dotUU);
  const projTip: [number, number] = [u[0] * scalar, u[1] * scalar];
  const residual: [number, number] = [v[0] - projTip[0], v[1] - projTip[1]];

  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toString() : n.toFixed(2);

  const formulaSteps = useMemo(
    () => [
      // 0 — labels
      `\\mathbf{v}, \\;\\mathbf{u}`,
      // 1 — line through u
      `\\mathrm{span}(\\mathbf{u}) = \\{\\,t\\,\\mathbf{u} : t \\in \\mathbb{R}\\,\\}`,
      // 2 — perpendicularity statement
      `(\\mathbf{v} - \\mathrm{proj}_{\\mathbf{u}}\\mathbf{v}) \\perp \\mathbf{u}`,
      // 3 — definition of projection
      `\\mathrm{proj}_{\\mathbf{u}}\\mathbf{v} = \\frac{\\mathbf{v}\\cdot\\mathbf{u}}{\\mathbf{u}\\cdot\\mathbf{u}}\\,\\mathbf{u}`,
      // 4 — orthogonal decomposition
      `\\mathbf{v} = \\mathrm{proj}_{\\mathbf{u}}\\mathbf{v} + \\mathbf{r}`,
      // 5 — concrete numbers
      `\\mathbf{v} = ${fmt(scalar)}\\,\\mathbf{u} + \\mathbf{r}`,
    ],
    [scalar],
  );

  const view = useMemo(() => {
    return fitContent(
      [
        { x: 0, y: 0 },
        { x: v[0], y: v[1] },
        { x: u[0], y: u[1] },
        { x: projTip[0], y: projTip[1] },
        { x: -u[0] * 0.6, y: -u[1] * 0.6 },
      ],
      {
        padding: 0.4,
        minHalfSpanX: 2,
        minHalfSpanY: 2,
        centerOnZero: true,
      },
    );
  }, [v, u, projTip]);

  const height = useMafsHeight(380);

  const formulaEmphasize = useMemo(
    () => ({
      3: ["mathrm{proj}", "frac"],
      4: ["mathrm{proj}", "mathbf{r}"],
      5: [`${fmt(scalar)}`, "mathbf{r}"],
    }),
    [scalar],
  );

  return (
    <MathScene
      id={id}
      phases={PHASES}
      formulaSteps={formulaSteps}
      formulaEmphasize={formulaEmphasize}
      accent="violet"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs viewBox={view} height={height}>
          <SmartAxes />
          <SceneFigure
            v={v}
            u={u}
            projTip={projTip}
            residual={residual}
            scalar={scalar}
            view={view}
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
  v: [number, number];
  u: [number, number];
  projTip: [number, number];
  residual: [number, number];
  scalar: number;
  view: { x: [number, number]; y: [number, number] };
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function SceneFigure({
  v,
  u,
  projTip,
  residual,
  scalar,
  view,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  // Span line growth in phase 1.
  const lineT =
    phaseIdx < 1 ? 0 : phaseIdx === 1 ? eff(easeInOutCubic(phaseProgress)) : 1;

  const dropT =
    phaseIdx < 2 ? 0 : phaseIdx === 2 ? eff(easeOutCubic(phaseProgress)) : 1;

  const projT =
    phaseIdx < 3 ? 0 : phaseIdx === 3 ? eff(easeOutCubic(phaseProgress)) : 1;

  const residualT =
    phaseIdx < 4 ? 0 : phaseIdx === 4 ? eff(easeOutCubic(phaseProgress)) : 1;

  // Compute the line endpoints to fit nicely in the viewport (extend along u).
  const lineEndpoints = useMemo(() => {
    const uMag = Math.hypot(u[0], u[1]);
    if (uMag < 1e-9) return null;
    const ux = u[0] / uMag;
    const uy = u[1] / uMag;
    // Extend until it leaves the viewport.
    const maxExtent = Math.max(
      Math.abs(view.x[0]),
      Math.abs(view.x[1]),
      Math.abs(view.y[0]),
      Math.abs(view.y[1]),
    ) * 1.4;
    return {
      neg: [-ux * maxExtent, -uy * maxExtent] as [number, number],
      pos: [ux * maxExtent, uy * maxExtent] as [number, number],
    };
  }, [u, view]);

  return (
    <>
      {/* Span line — appears in phase 1, grows symmetrically from origin. */}
      {lineEndpoints && (
        <>
          <Line.Segment
            point1={[0, 0]}
            point2={lerp2([0, 0], lineEndpoints.pos, lineT)}
            color={AMBER}
            opacity={0.55 + 0.25 * lineT}
            weight={1.8}
            style="dashed"
          />
          <Line.Segment
            point1={[0, 0]}
            point2={lerp2([0, 0], lineEndpoints.neg, lineT)}
            color={AMBER}
            opacity={0.45 + 0.25 * lineT}
            weight={1.8}
            style="dashed"
          />
        </>
      )}

      {/* The two source vectors, always present. */}
      <Vector tip={u} color={AMBER} weight={3.2} />
      <Vector tip={v} color={EMERALD} weight={3.2} />

      <Text x={v[0]} y={v[1]} attach="ne" attachDistance={14} color={EMERALD} size={14}>
        v
      </Text>
      <Text x={u[0]} y={u[1]} attach="ne" attachDistance={14} color={AMBER} size={14}>
        u
      </Text>

      {/* Phase 2 — perpendicular drops from v's tip to projTip. */}
      {phaseIdx >= 2 && (
        <Line.Segment
          point1={v}
          point2={lerp2(v, projTip, dropT)}
          color={SKY}
          opacity={0.85}
          style="dashed"
          weight={2}
        />
      )}

      {/* Phase 3 — proj segment along u (origin → projTip) and the foot point. */}
      {phaseIdx >= 3 && (
        <>
          <Line.Segment
            point1={[0, 0]}
            point2={lerp2([0, 0], projTip, projT)}
            color={ROSE}
            opacity={0.95}
            weight={3.2}
          />
          <Point
            x={projTip[0]}
            y={projTip[1]}
            color={ROSE}
            opacity={projT}
            svgCircleProps={{
              r: 4.5,
              style: { filter: "drop-shadow(0 0 7px rgba(244, 114, 182, 0.75))" },
            }}
          />
          {projT >= 0.7 && (
            <Text
              x={projTip[0]}
              y={projTip[1]}
              attach="s"
              attachDistance={14}
              color={ROSE}
              size={12}
            >
              {`proj_u(v) = ${fmt(scalar)} u`}
            </Text>
          )}
        </>
      )}

      {/* Phase 4 — residual r drawn FROM projTip TO v (closes the triangle). */}
      {phaseIdx >= 4 && (
        <>
          <Vector
            tip={lerp2(projTip, v, residualT)}
            tail={projTip}
            color={SKY}
            opacity={0.95}
            weight={3}
          />
          {residualT >= 0.7 && (
            <Text
              x={projTip[0] + residual[0] / 2}
              y={projTip[1] + residual[1] / 2}
              attach="e"
              attachDistance={10}
              color={SKY}
              size={13}
            >
              r
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
