"use client";

import React, { useMemo } from "react";
import { Line, Point, Polygon, Text, Vector } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, easeOutCubic, lerp, lerp2 } from "./easing";

const EMERALD = "#10B981";
const BLUE = "#60A5FA";
const AMBER = "#FBBF24";
const ROSE = "#F472B6";

interface LineEq {
  /** ax + by = c — standard form, lets us draw vertical lines too. */
  a: number;
  b: number;
  c: number;
}

interface LinearSystemSceneProps {
  /** Two equations of the form ax + by = c. Defaults to a friendly pair. */
  line1?: LineEq;
  line2?: LineEq;
  /** Override the viewport. Defaults to a square frame around the solution. */
  viewBox?: { x: [number, number]; y: [number, number] };
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

/**
 * Solve the 2x2 system (assumes a unique solution; the curated default does).
 */
function solveSystem(L1: LineEq, L2: LineEq): [number, number] {
  const det = L1.a * L2.b - L2.a * L1.b;
  if (Math.abs(det) < 1e-9) return [0, 0];
  const x = (L1.c * L2.b - L2.c * L1.b) / det;
  const y = (L1.a * L2.c - L2.a * L1.c) / det;
  return [x, y];
}

function lineY(L: LineEq, x: number): number {
  // Scenes use friendly equations where b ≠ 0.
  return (L.c - L.a * x) / L.b;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "Set up",
    labelEs: "Planteamiento",
    caption: {
      text: "Two equations, two unknowns — the solution is where both lines meet.",
      textEs:
        "Dos ecuaciones, dos incógnitas — la solución es donde ambas rectas se cruzan.",
    },
    formulaStep: 0,
  },
  {
    duration: 1900,
    label: "Draw line 1",
    labelEs: "Traza la recta 1",
    caption: {
      text: "Equation 1 traces every (x, y) that satisfies it.",
      textEs: "La ecuación 1 traza cada (x, y) que la satisface.",
    },
    formulaStep: 1,
  },
  {
    duration: 1900,
    label: "Draw line 2",
    labelEs: "Traza la recta 2",
    caption: {
      text: "Equation 2 traces its own line of valid points.",
      textEs: "La ecuación 2 traza su propia recta de puntos válidos.",
    },
    formulaStep: 2,
  },
  {
    duration: 2200,
    label: "Reveal intersection",
    labelEs: "Revelar intersección",
    caption: {
      text: "Where the lines meet, both equations hold simultaneously.",
      textEs:
        "Donde las rectas se cruzan, ambas ecuaciones se cumplen a la vez.",
    },
    formulaStep: 3,
  },
  {
    duration: 2400,
    label: "Read x and y",
    labelEs: "Lee x e y",
    caption: {
      text: "The unique solution is the coordinates of that single point.",
      textEs:
        "La solución única son las coordenadas de ese único punto.",
    },
    formulaStep: 4,
  },
  {
    duration: 2400,
    label: "Recast as Ax = b",
    labelEs: "Reescribe como Ax = b",
    caption: {
      text: "Stack coefficients into a matrix A; constants into a vector b.",
      textEs:
        "Apila los coeficientes en una matriz A; las constantes en un vector b.",
    },
    formulaStep: 5,
  },
];

export default function LinearSystemScene({
  line1: line1Override,
  line2: line2Override,
  viewBox: viewBoxOverride,
  id,
}: LinearSystemSceneProps) {
  // Default scene: 2x + y = 4, x − y = -1 → solution (1, 2).
  const L1: LineEq = line1Override ?? { a: 2, b: 1, c: 4 };
  const L2: LineEq = line2Override ?? { a: 1, b: -1, c: -1 };

  const [sx, sy] = useMemo(() => solveSystem(L1, L2), [L1, L2]);

  const formulaSteps = useMemo(() => {
    // Render as nicely-typeset LaTeX so KaTeX morphs cleanly.
    const sign = (n: number) => (n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`);
    const eq1 = `${L1.a}x ${sign(L1.b)}y = ${L1.c}`;
    const eq2 = `${L2.a}x ${sign(L2.b)}y = ${L2.c}`;
    return [
      // 0 — both equations
      `\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}`,
      // 1 — emphasis on equation 1
      `\\begin{cases} \\color{#34D399}{${eq1}} \\\\ ${eq2} \\end{cases}`,
      // 2 — emphasis on equation 2
      `\\begin{cases} ${eq1} \\\\ \\color{#FBBF24}{${eq2}} \\end{cases}`,
      // 3 — both highlighted
      `\\begin{cases} \\color{#34D399}{${eq1}} \\\\ \\color{#FBBF24}{${eq2}} \\end{cases}`,
      // 4 — solution revealed
      `(x, y) = (${sx}, ${sy})`,
      // 5 — Ax = b matrix form
      `\\begin{bmatrix} ${L1.a} & ${L1.b} \\\\ ${L2.a} & ${L2.b} \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} ${L1.c} \\\\ ${L2.c} \\end{bmatrix}`,
    ];
  }, [L1, L2, sx, sy]);

  const view = useMemo(
    () =>
      viewBoxOverride ?? {
        x: [Math.min(-1, sx - 3), Math.max(4, sx + 3)] as [number, number],
        y: [Math.min(-1, sy - 3), Math.max(4, sy + 3)] as [number, number],
      },
    [viewBoxOverride, sx, sy],
  );

  const formulaEmphasize = useMemo(
    () => ({
      1: ["color{#34D399}"],
      2: ["color{#FBBF24}"],
      3: ["color{#34D399}", "color{#FBBF24}"],
      4: [`(${sx}, ${sy})`],
    }),
    [sx, sy],
  );

  const height = useMafsHeight(380);

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
            line1={L1}
            line2={L2}
            sx={sx}
            sy={sy}
            phaseIdx={phaseIdx}
            phaseProgress={phaseProgress}
            view={view}
            reduced={hasReducedMotion}
          />
        </ZoomableMafs>
      )}
    />
  );
}

interface FigureProps {
  line1: LineEq;
  line2: LineEq;
  sx: number;
  sy: number;
  phaseIdx: number;
  phaseProgress: number;
  view: { x: [number, number]; y: [number, number] };
  reduced: boolean;
}

/**
 * The Mafs figure for the linear-system scene. Splits cleanly so the parent
 * stays readable.
 *
 * Phase choreography:
 *   0  set up — empty axes, faint x/y guide vectors fade in
 *   1  line 1 grows from left-to-right, emerald
 *   2  line 1 dims, line 2 grows, amber
 *   3  both lines visible; intersection point pulses in with rose
 *   4  drop x/y coordinate guides from the solution to the axes
 *   5  matrix form — soft "frame" around the diagram, no big motion
 */
function SceneFigure({
  line1,
  line2,
  sx,
  sy,
  phaseIdx,
  phaseProgress,
  view,
  reduced,
}: FigureProps) {
  const xMin = view.x[0];
  const xMax = view.x[1];

  // Line growth helpers — the "growing line" is a polyline from a left anchor
  // to the right anchor, but we mask it by clipping to a sub-segment.
  const line1Right = useMemo(() => {
    return phaseIdx >= 1 ? lerp(xMin, xMax, easeInOutCubic(phaseProgress)) : xMin;
  }, [phaseIdx, phaseProgress, xMin, xMax]);

  const line2Right = useMemo(() => {
    return phaseIdx >= 2 ? lerp(xMin, xMax, easeInOutCubic(phaseProgress)) : xMin;
  }, [phaseIdx, phaseProgress, xMin, xMax]);

  // Fully drawn for any phase past their intro.
  const line1Done = phaseIdx > 1 || (phaseIdx === 1 && phaseProgress >= 1);
  const line2Done = phaseIdx > 2 || (phaseIdx === 2 && phaseProgress >= 1);

  // Intersection appearance.
  const intersectionT =
    phaseIdx >= 3
      ? phaseIdx === 3
        ? easeOutCubic(phaseProgress)
        : 1
      : 0;

  // Coordinate guide drop in phase 4.
  const guideT =
    phaseIdx >= 4
      ? phaseIdx === 4
        ? easeOutCubic(phaseProgress)
        : 1
      : 0;

  // Phase-5 "frame box" — render the bounding outline of the data area as a
  // gentle accent that hints "this is the system's geometry packaged".
  const frameT = phaseIdx >= 5 ? easeOutCubic(phaseProgress) : 0;

  // Reduced motion: snap everything to its end state.
  const eff = (t: number) => (reduced ? 1 : t);

  return (
    <>
      {/* Line 1 — emerald */}
      {phaseIdx >= 1 && (
        <DrawnLine
          from={[xMin, lineY(line1, xMin)]}
          to={[
            line1Done ? xMax : eff(line1Right),
            lineY(line1, line1Done ? xMax : eff(line1Right)),
          ]}
          color={EMERALD}
          opacity={line1Done && phaseIdx > 1 ? 0.55 : 1}
          weight={3}
        />
      )}

      {/* Line 2 — amber */}
      {phaseIdx >= 2 && (
        <DrawnLine
          from={[xMin, lineY(line2, xMin)]}
          to={[
            line2Done ? xMax : eff(line2Right),
            lineY(line2, line2Done ? xMax : eff(line2Right)),
          ]}
          color={AMBER}
          opacity={line2Done && phaseIdx > 2 ? 0.55 : 1}
          weight={3}
        />
      )}

      {/* Intersection point with a pulsing halo, rose. */}
      {phaseIdx >= 3 && (
        <>
          <Point
            x={sx}
            y={sy}
            color={ROSE}
            opacity={eff(intersectionT)}
            svgCircleProps={{
              r: 6,
              style: { filter: "drop-shadow(0 0 8px rgba(244, 114, 182, 0.7))" },
            }}
          />
          <Text
            x={sx}
            y={sy}
            attach="ne"
            attachDistance={18}
            color={ROSE}
            size={15}
          >
            {`(${sx}, ${sy})`}
          </Text>
        </>
      )}

      {/* x and y coordinate guides — dotted lines from the solution to each axis. */}
      {phaseIdx >= 4 && (
        <>
          <Line.Segment
            point1={[sx, 0]}
            point2={lerp2([sx, 0], [sx, sy], eff(guideT))}
            color={ROSE}
            opacity={0.7}
            style="dashed"
            weight={2}
          />
          <Line.Segment
            point1={[0, sy]}
            point2={lerp2([0, sy], [sx, sy], eff(guideT))}
            color={ROSE}
            opacity={0.7}
            style="dashed"
            weight={2}
          />
          <Text
            x={sx}
            y={0}
            attach="s"
            attachDistance={16}
            color={ROSE}
            size={14}
          >
            {`x = ${sx}`}
          </Text>
          <Text
            x={0}
            y={sy}
            attach="w"
            attachDistance={16}
            color={ROSE}
            size={14}
          >
            {`y = ${sy}`}
          </Text>
        </>
      )}

      {/* Phase 5 — gentle bounding frame to "package" the system. */}
      {phaseIdx >= 5 && (
        <Polygon
          points={[
            [xMin + 0.4, view.y[0] + 0.4],
            [xMax - 0.4, view.y[0] + 0.4],
            [xMax - 0.4, view.y[1] - 0.4],
            [xMin + 0.4, view.y[1] - 0.4],
          ]}
          color={BLUE}
          fillOpacity={0.04 * eff(frameT)}
          strokeOpacity={0.45 * eff(frameT)}
          weight={1.5}
        />
      )}

      {/* Phase 0 — faint origin compass: a hint that we're working in the plane. */}
      {phaseIdx === 0 && (
        <>
          <Vector tip={[1.2, 0]} color={EMERALD} opacity={0.6} weight={2} />
          <Vector tip={[0, 1.2]} color={AMBER} opacity={0.6} weight={2} />
        </>
      )}
    </>
  );
}

/**
 * A line that supports a "draw-on" effect by parameterising its endpoints.
 * Mafs' Line.Segment doesn't expose a stroke-dash, so we just animate the
 * second endpoint along the line. We keep this as a thin wrapper so the
 * polyline-style stroke parameters stay consistent.
 */
interface DrawnLineProps {
  from: [number, number];
  to: [number, number];
  color: string;
  opacity?: number;
  weight?: number;
}

function DrawnLine({ from, to, color, opacity = 1, weight = 3 }: DrawnLineProps) {
  return (
    <Line.Segment
      point1={from}
      point2={to}
      color={color}
      opacity={opacity}
      weight={weight}
    />
  );
}
