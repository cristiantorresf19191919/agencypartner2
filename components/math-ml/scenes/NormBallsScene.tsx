"use client";

import React, { useMemo } from "react";
import { Polygon, Text, Point } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, easeOutCubic, lerp } from "./easing";

const EMERALD = "#10B981";
const AMBER = "#FBBF24";
const ROSE = "#F472B6";
const SKY = "#60A5FA";

interface NormBallsSceneProps {
  /** Number of points used to discretise the unit ball curves. */
  resolution?: number;
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "What's a unit ball?",
    labelEs: "¿Qué es una bola unitaria?",
    caption: {
      text: "A unit ball is the set of points at distance exactly 1 — depends on the norm.",
      textEs:
        "Una bola unitaria es el conjunto de puntos a distancia exactamente 1 — depende de la norma.",
    },
    formulaStep: 0,
  },
  {
    duration: 2400,
    label: "L¹ — taxicab norm: a diamond",
    labelEs: "L¹ — norma taxi: un rombo",
    caption: {
      text: "‖x‖₁ = |x₁| + |x₂|. The unit ball is the diamond of taxicab distance.",
      textEs:
        "‖x‖₁ = |x₁| + |x₂|. La bola unitaria es el rombo de la distancia taxi.",
    },
    formulaStep: 1,
  },
  {
    duration: 2400,
    label: "L² — Euclidean norm: the circle",
    labelEs: "L² — norma euclidiana: el círculo",
    caption: {
      text: "‖x‖₂ = √(x₁² + x₂²). The familiar straight-line distance gives a circle.",
      textEs:
        "‖x‖₂ = √(x₁² + x₂²). La distancia recta da un círculo.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "L∞ — Chebyshev norm: a square",
    labelEs: "L∞ — norma Chebyshev: un cuadrado",
    caption: {
      text: "‖x‖∞ = max(|x₁|, |x₂|). The largest coordinate alone — gives an axis-aligned square.",
      textEs:
        "‖x‖∞ = max(|x₁|, |x₂|). La coordenada mayor — da un cuadrado alineado a los ejes.",
    },
    formulaStep: 3,
  },
  {
    duration: 2600,
    label: "All three side by side",
    labelEs: "Las tres juntas",
    caption: {
      text: "L¹ ⊆ L² ⊆ L∞: stricter norms shrink the ball; Lp interpolates between them.",
      textEs:
        "L¹ ⊆ L² ⊆ L∞: normas más estrictas encogen la bola; Lp interpola entre ellas.",
    },
    formulaStep: 4,
  },
];

function l1Ball(n: number): [number, number][] {
  // Diamond: |x| + |y| = 1 → 4 vertices (1,0), (0,1), (-1,0), (0,-1).
  // We sample n points around it for a smooth animated polygon.
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 4;
    const segIdx = Math.floor(t) % 4;
    const u = t - Math.floor(t);
    const verts: [number, number][] = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    const a = verts[segIdx];
    const b = verts[(segIdx + 1) % 4];
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
}

function l2Ball(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    out.push([Math.cos(t), Math.sin(t)]);
  }
  return out;
}

function lInfBall(n: number): [number, number][] {
  // Axis-aligned unit square — 4 vertices, sample n points.
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 4;
    const segIdx = Math.floor(t) % 4;
    const u = t - Math.floor(t);
    const verts: [number, number][] = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
    const a = verts[segIdx];
    const b = verts[(segIdx + 1) % 4];
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
}

export default function NormBallsScene({
  resolution = 96,
  id,
}: NormBallsSceneProps) {
  const formulaSteps = useMemo(
    () => [
      // 0 — generic
      `\\{\\,\\mathbf{x} : \\|\\mathbf{x}\\| = 1\\,\\}`,
      // 1 — L1
      `\\|\\mathbf{x}\\|_1 = |x_1| + |x_2|`,
      // 2 — L2
      `\\|\\mathbf{x}\\|_2 = \\sqrt{x_1^2 + x_2^2}`,
      // 3 — L∞
      `\\|\\mathbf{x}\\|_\\infty = \\max(|x_1|, |x_2|)`,
      // 4 — Lp
      `\\|\\mathbf{x}\\|_p = \\left(\\sum_i |x_i|^p\\right)^{1/p}`,
    ],
    [],
  );

  const formulaEmphasize = useMemo(
    () => ({
      1: ["x"],
      2: ["sqrt"],
      3: ["max"],
      4: ["1/p"],
    }),
    [],
  );

  const view = useMemo(
    () => ({
      x: [-1.6, 1.6] as [number, number],
      y: [-1.6, 1.6] as [number, number],
    }),
    [],
  );

  const height = useMafsHeight(380);

  // Pre-compute ball geometries — cheap and stable.
  const balls = useMemo(
    () => ({
      l1: l1Ball(resolution),
      l2: l2Ball(resolution),
      lInf: lInfBall(resolution),
    }),
    [resolution],
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
            balls={balls}
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
  balls: {
    l1: [number, number][];
    l2: [number, number][];
    lInf: [number, number][];
  };
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

/**
 * Ball-growth choreography:
 *   Phase 0 — origin point + axis hints
 *   Phase 1 — L1 diamond grows from origin
 *   Phase 2 — L1 dims; L2 circle grows
 *   Phase 3 — L2 dims; L∞ square grows
 *   Phase 4 — All three rendered together at full opacity
 */
function SceneFigure({ balls, phaseIdx, phaseProgress, reduced }: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  const l1T =
    phaseIdx < 1 ? 0 : phaseIdx === 1 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const l2T =
    phaseIdx < 2 ? 0 : phaseIdx === 2 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const lInfT =
    phaseIdx < 3 ? 0 : phaseIdx === 3 ? eff(easeInOutCubic(phaseProgress)) : 1;

  // In phases 1-3, the active ball is full opacity, others fade to 0.4 once they're done.
  const l1Opacity =
    phaseIdx === 1 ? l1T : phaseIdx === 4 ? 0.85 : phaseIdx > 1 ? 0.45 : 0;
  const l2Opacity =
    phaseIdx === 2 ? l2T : phaseIdx === 4 ? 0.85 : phaseIdx > 2 ? 0.45 : 0;
  const lInfOpacity =
    phaseIdx === 3 ? lInfT : phaseIdx === 4 ? 0.85 : phaseIdx > 3 ? 0.45 : 0;

  // Scale ball radius for growth animation.
  const scale = (pts: [number, number][], s: number): [number, number][] =>
    pts.map(([x, y]) => [x * s, y * s]);

  return (
    <>
      {/* Phase 0 — gentle compass: just the origin and axis ticks. */}
      {phaseIdx === 0 && (
        <Point
          x={0}
          y={0}
          color={SKY}
          opacity={eff(easeOutCubic(phaseProgress))}
          svgCircleProps={{
            r: 5,
            style: { filter: "drop-shadow(0 0 6px rgba(96, 165, 250, 0.7))" },
          }}
        />
      )}

      {/* L1 — Diamond, emerald. */}
      {l1Opacity > 0 && (
        <Polygon
          points={scale(balls.l1, l1T)}
          color={EMERALD}
          fillOpacity={l1Opacity * 0.18}
          strokeOpacity={l1Opacity}
          weight={2.5}
        />
      )}

      {/* L2 — Circle, amber. */}
      {l2Opacity > 0 && (
        <Polygon
          points={scale(balls.l2, l2T)}
          color={AMBER}
          fillOpacity={l2Opacity * 0.18}
          strokeOpacity={l2Opacity}
          weight={2.5}
        />
      )}

      {/* L∞ — Square, rose. */}
      {lInfOpacity > 0 && (
        <Polygon
          points={scale(balls.lInf, lInfT)}
          color={ROSE}
          fillOpacity={lInfOpacity * 0.16}
          strokeOpacity={lInfOpacity}
          weight={2.5}
        />
      )}

      {/* Labels — vertex annotations identify each ball when it's active or in overlay. */}
      {l1Opacity >= 0.6 && (
        <Text x={1} y={0} attach="ne" attachDistance={12} color={EMERALD} size={13}>
          L¹
        </Text>
      )}
      {l2Opacity >= 0.6 && (
        <Text
          x={Math.cos(Math.PI / 4)}
          y={Math.sin(Math.PI / 4)}
          attach="ne"
          attachDistance={12}
          color={AMBER}
          size={13}
        >
          L²
        </Text>
      )}
      {lInfOpacity >= 0.6 && (
        <Text x={1} y={1} attach="ne" attachDistance={12} color={ROSE} size={13}>
          L∞
        </Text>
      )}
    </>
  );
}
