"use client";

import React, { useMemo } from "react";
import { Line, Point, Polygon, Text, Vector } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, easeOutCubic, lerp2 } from "./easing";

const EMERALD = "#10B981";
const AMBER = "#FBBF24";
const ROSE = "#F472B6";

interface GradientDescentSceneProps {
  /** Coefficient on x² (default 1). */
  ax?: number;
  /** Coefficient on y² (default 3) — anisotropy makes the path bend. */
  ay?: number;
  /** Starting point of descent. */
  start?: [number, number];
  /** Step size. */
  alpha?: number;
  /** Number of steps to animate. */
  steps?: number;
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "Contours of f",
    labelEs: "Curvas de nivel de f",
    caption: {
      text: "Each ellipse is a level set: every point on it has the same f-value.",
      textEs:
        "Cada elipse es un conjunto de nivel: todos sus puntos tienen el mismo valor de f.",
    },
    formulaStep: 0,
  },
  {
    duration: 2000,
    label: "Pick a starting point",
    labelEs: "Elige un punto inicial",
    caption: {
      text: "Drop the optimiser somewhere far from the minimum.",
      textEs: "Coloca el optimizador lejos del mínimo.",
    },
    formulaStep: 1,
  },
  {
    duration: 2400,
    label: "∇f points uphill",
    labelEs: "∇f apunta cuesta arriba",
    caption: {
      text: "The gradient at this point — straight up the steepest slope.",
      textEs: "El gradiente en este punto — directo hacia la pendiente más empinada.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Step in −∇f direction",
    labelEs: "Da un paso en dirección −∇f",
    caption: {
      text: "Move opposite to the gradient — that's the direction of fastest descent.",
      textEs:
        "Muévete opuesto al gradiente — esa es la dirección de descenso más rápido.",
    },
    formulaStep: 3,
  },
  {
    duration: 2800,
    label: "Iterate to the minimum",
    labelEs: "Itera hasta el mínimo",
    caption: {
      text: "Repeat: each step brings us closer to f's minimum at the origin.",
      textEs: "Repite: cada paso nos acerca al mínimo de f en el origen.",
    },
    formulaStep: 4,
  },
  {
    duration: 2400,
    label: "x_{t+1} = x_t − α ∇f(x_t)",
    labelEs: "x_{t+1} = x_t − α ∇f(x_t)",
    caption: {
      text: "α is the learning rate — too big diverges, too small crawls.",
      textEs:
        "α es la tasa de aprendizaje — demasiado grande diverge, demasiado pequeña gatea.",
    },
    formulaStep: 5,
  },
];

export default function GradientDescentScene({
  ax = 1,
  ay = 3,
  start = [4, 2],
  alpha = 0.12,
  steps: stepsCount = 18,
  id,
}: GradientDescentSceneProps) {
  // Trajectory pre-computed (deterministic — gives us a stable visual + lets us
  // animate growth in phase 4 by exposing prefixes).
  const trajectory = useMemo(() => {
    const out: [number, number][] = [start];
    let p: [number, number] = [...start] as [number, number];
    for (let i = 0; i < stepsCount; i++) {
      const grad: [number, number] = [2 * ax * p[0], 2 * ay * p[1]];
      p = [p[0] - alpha * grad[0], p[1] - alpha * grad[1]];
      out.push(p);
    }
    return out;
  }, [ax, ay, start, alpha, stepsCount]);

  // Contour ellipses for f = c, where f(x,y) = ax·x² + ay·y².
  // Choose levels that pass roughly through key trajectory points so the
  // visual matches the descent.
  const contours = useMemo(() => {
    const fAt = (p: [number, number]) => ax * p[0] * p[0] + ay * p[1] * p[1];
    const levels = [0.3, 0.8, 2, 4, 8, 16, 28, 44].filter(
      (c) => c <= fAt(start) * 1.2,
    );
    return levels.map((c) => {
      const rx = Math.sqrt(c / ax);
      const ry = Math.sqrt(c / ay);
      const points: [number, number][] = [];
      const segs = 64;
      for (let i = 0; i < segs; i++) {
        const t = (i / segs) * Math.PI * 2;
        points.push([rx * Math.cos(t), ry * Math.sin(t)]);
      }
      return points;
    });
  }, [ax, ay, start]);

  const formulaSteps = useMemo(() => {
    const fmtCoef = (n: number) =>
      n === 1 ? "" : Number.isInteger(n) ? `${n}\\,` : `${n.toFixed(2)}\\,`;
    return [
      // 0 — function definition
      `f(x, y) = ${fmtCoef(ax)}x^2 + ${fmtCoef(ay)}y^2`,
      // 1 — initial point
      `x_0 = (${start[0]}, ${start[1]})`,
      // 2 — gradient at x0
      `\\nabla f(x_0) = (${fmtCoef(2 * ax)}x_0, ${fmtCoef(2 * ay)}y_0) = (${2 * ax * start[0]}, ${2 * ay * start[1]})`,
      // 3 — single update
      `x_1 = x_0 - \\alpha\\,\\nabla f(x_0)`,
      // 4 — iteration
      `x_{t+1} = x_t - \\alpha\\,\\nabla f(x_t)`,
      // 5 — annotated
      `x_{t+1} = x_t - \\color{#34D399}{\\alpha}\\,\\color{#FBBF24}{\\nabla f(x_t)}`,
    ];
  }, [ax, ay, start]);

  const view = useMemo(() => {
    const m = Math.max(Math.abs(start[0]), Math.abs(start[1])) + 1;
    return {
      x: [-m, m] as [number, number],
      y: [-m, m] as [number, number],
    };
  }, [start]);

  const height = useMafsHeight(420);

  const formulaEmphasize = useMemo(
    () => ({
      4: ["alpha", "nabla"],
      5: ["alpha", "nabla"],
    }),
    [],
  );

  return (
    <MathScene
      id={id}
      phases={PHASES}
      formulaSteps={formulaSteps}
      formulaEmphasize={formulaEmphasize}
      accent="amber"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs viewBox={view} height={height}>
          <SmartAxes />
          <SceneFigure
            ax={ax}
            ay={ay}
            trajectory={trajectory}
            contours={contours}
            alpha={alpha}
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
  ax: number;
  ay: number;
  trajectory: [number, number][];
  contours: [number, number][][];
  alpha: number;
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function SceneFigure({
  ax,
  ay,
  trajectory,
  contours,
  alpha,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  // Phase 0 — contours fade in.
  const contoursT =
    phaseIdx === 0 ? eff(easeOutCubic(phaseProgress)) : 1;

  // Phase 1 — starting point pulses.
  const startT =
    phaseIdx < 1 ? 0 : phaseIdx === 1 ? eff(easeOutCubic(phaseProgress)) : 1;

  // Phase 2 — gradient arrow at x0 grows out.
  const gradT =
    phaseIdx < 2 ? 0 : phaseIdx === 2 ? eff(easeInOutCubic(phaseProgress)) : 1;

  // Phase 3 — first step.
  const stepT =
    phaseIdx < 3 ? 0 : phaseIdx === 3 ? eff(easeInOutCubic(phaseProgress)) : 1;

  // Phase 4 — full trajectory growth.
  const trajT =
    phaseIdx < 4 ? 0 : phaseIdx === 4 ? eff(easeInOutCubic(phaseProgress)) : 1;

  const x0 = trajectory[0];
  const x1 = trajectory[1];
  const grad: [number, number] = [2 * ax * x0[0], 2 * ay * x0[1]];

  // Number of trajectory points to render in phase 4.
  const trajCount = Math.max(
    1,
    Math.floor(trajectory.length * (phaseIdx < 4 ? (phaseIdx === 3 ? 1 + stepT : 1) : 1 + (trajectory.length - 1) * trajT)),
  );

  // Current ball position — slides along trajectory in phase 4.
  const ballPos = useMemo<[number, number]>(() => {
    if (phaseIdx < 3) return x0;
    if (phaseIdx === 3) return lerp2(x0, x1, stepT);
    if (phaseIdx === 4) {
      const total = trajectory.length - 1;
      const exact = total * eff(easeInOutCubic(phaseProgress));
      const lo = Math.floor(exact);
      const hi = Math.min(lo + 1, total);
      const t = exact - lo;
      return lerp2(trajectory[lo], trajectory[hi], t);
    }
    return trajectory[trajectory.length - 1];
  }, [phaseIdx, phaseProgress, trajectory, x0, x1, stepT, eff]);

  return (
    <>
      {/* Contour ellipses — innermost brightest. */}
      {contours.map((pts, i) => {
        const opacity = 0.18 + 0.05 * (contours.length - i);
        return (
          <Polygon
            key={`c-${i}`}
            points={pts}
            color={AMBER}
            fillOpacity={0}
            strokeOpacity={opacity * eff(contoursT)}
            weight={1.2}
          />
        );
      })}

      {/* Origin marker — the minimum. */}
      <Point
        x={0}
        y={0}
        color={EMERALD}
        opacity={0.6}
        svgCircleProps={{ r: 3 }}
      />

      {/* Trajectory polyline — shown progressively in phase 4 (and fully in phase 5). */}
      {phaseIdx >= 4 && trajCount > 1 && (
        <>
          {trajectory.slice(0, trajCount).map((p, i) => {
            if (i === 0) return null;
            const prev = trajectory[i - 1];
            return (
              <Line.Segment
                key={`tr-${i}`}
                point1={prev}
                point2={p}
                color={ROSE}
                opacity={0.7}
                weight={1.6}
              />
            );
          })}
          {/* Trajectory dots */}
          {trajectory.slice(0, trajCount).map((p, i) => (
            <Point
              key={`td-${i}`}
              x={p[0]}
              y={p[1]}
              color={ROSE}
              opacity={0.6}
              svgCircleProps={{ r: 2 }}
            />
          ))}
        </>
      )}

      {/* Phase 3 — first step segment from x0 to x1. */}
      {phaseIdx === 3 && (
        <Line.Segment
          point1={x0}
          point2={lerp2(x0, x1, stepT)}
          color={ROSE}
          opacity={0.95}
          weight={2.4}
        />
      )}

      {/* Phase 2 — gradient arrow from x0 in the +∇ direction (uphill). */}
      {phaseIdx >= 2 && phaseIdx < 4 && (
        <Vector
          tail={x0}
          tip={[
            x0[0] + alpha * grad[0] * gradT,
            x0[1] + alpha * grad[1] * gradT,
          ]}
          color={AMBER}
          opacity={0.95}
          weight={2.6}
        />
      )}

      {/* The "ball" — current position, prominent. */}
      {phaseIdx >= 1 && (
        <Point
          x={ballPos[0]}
          y={ballPos[1]}
          color={ROSE}
          opacity={1}
          svgCircleProps={{
            r: 6,
            style: {
              filter: "drop-shadow(0 0 8px rgba(244, 114, 182, 0.85))",
              transformOrigin: "center",
              transform: `scale(${0.7 + 0.3 * eff(startT)})`,
              transition: "transform 220ms ease-out",
            },
          }}
        />
      )}

      {/* Labels appear at appropriate phases. */}
      {phaseIdx >= 1 && phaseIdx <= 3 && (
        <Text
          x={ballPos[0]}
          y={ballPos[1]}
          attach="ne"
          attachDistance={14}
          color={ROSE}
          size={13}
        >
          {phaseIdx >= 3 ? "x₁" : "x₀"}
        </Text>
      )}
      {phaseIdx >= 5 && (
        <Text
          x={trajectory[trajectory.length - 1][0]}
          y={trajectory[trajectory.length - 1][1]}
          attach="ne"
          attachDistance={12}
          color={EMERALD}
          size={13}
        >
          x*
        </Text>
      )}
    </>
  );
}
