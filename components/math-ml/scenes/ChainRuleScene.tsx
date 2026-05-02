"use client";

import React, { useMemo } from "react";
import { Plot, Line, Point, Text } from "mafs";
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

interface ChainRuleSceneProps {
  /** The current x to highlight in the derivative-product phase. */
  sampleX?: number;
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "Two functions",
    labelEs: "Dos funciones",
    caption: {
      text: "Pick an inner function g and an outer function f.",
      textEs: "Elige una función interna g y una externa f.",
    },
    formulaStep: 0,
  },
  {
    duration: 2200,
    label: "Inner: g(x) = 2x",
    labelEs: "Interna: g(x) = 2x",
    caption: {
      text: "g stretches the input by a factor of 2.",
      textEs: "g estira la entrada por un factor de 2.",
    },
    formulaStep: 1,
  },
  {
    duration: 2200,
    label: "Outer: f(u) = sin(u)",
    labelEs: "Externa: f(u) = sin(u)",
    caption: {
      text: "f wraps its input through a sine wave.",
      textEs: "f envuelve su entrada con una onda sinusoidal.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Compose: f(g(x)) = sin(2x)",
    labelEs: "Compón: f(g(x)) = sin(2x)",
    caption: {
      text: "The composition runs g first, then f — twice the wiggle frequency.",
      textEs:
        "La composición ejecuta g primero, luego f — el doble de frecuencia de oscilación.",
    },
    formulaStep: 3,
  },
  {
    duration: 2400,
    label: "Tangent slopes multiply",
    labelEs: "Las pendientes tangentes se multiplican",
    caption: {
      text: "Slope of f(g(x)) = slope of f at g(x) times slope of g at x.",
      textEs:
        "La pendiente de f(g(x)) = pendiente de f en g(x) por la pendiente de g en x.",
    },
    formulaStep: 4,
  },
  {
    duration: 2600,
    label: "(f∘g)'(x) = f'(g(x)) · g'(x)",
    labelEs: "(f∘g)'(x) = f'(g(x)) · g'(x)",
    caption: {
      text: "The chain rule — every backprop step in deep learning is this, repeated.",
      textEs:
        "La regla de la cadena — cada paso de backprop en deep learning es esto, repetido.",
    },
    formulaStep: 5,
  },
];

const innerG = (x: number) => 2 * x;
const innerGPrime = (_x: number) => 2;
const outerF = (u: number) => Math.sin(u);
const outerFPrime = (u: number) => Math.cos(u);
const composed = (x: number) => outerF(innerG(x));
const composedPrime = (x: number) => outerFPrime(innerG(x)) * innerGPrime(x);

export default function ChainRuleScene({
  sampleX = 0.6,
  id,
}: ChainRuleSceneProps) {
  const formulaSteps = useMemo(
    () => [
      `f \\circ g`,
      `g(x) = 2x`,
      `f(u) = \\sin(u)`,
      `f(g(x)) = \\sin(2x)`,
      `\\frac{d}{dx} f(g(x)) = f'(g(x)) \\cdot g'(x)`,
      `\\frac{d}{dx} \\sin(2x) = \\cos(2x)\\cdot 2`,
    ],
    [],
  );

  const formulaEmphasize = useMemo(
    () => ({
      4: ["f'", "g'"],
      5: ["cos", "2"],
    }),
    [],
  );

  const view = useMemo(
    () => ({
      x: [-3, 3] as [number, number],
      y: [-2.2, 2.2] as [number, number],
    }),
    [],
  );

  const height = useMafsHeight(380);

  return (
    <MathScene
      id={id}
      phases={PHASES}
      formulaSteps={formulaSteps}
      formulaEmphasize={formulaEmphasize}
      accent="blue"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs viewBox={view} height={height}>
          <SmartAxes />
          <SceneFigure
            sampleX={sampleX}
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
  sampleX: number;
  view: { x: [number, number]; y: [number, number] };
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function SceneFigure({
  sampleX,
  view,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  const gT =
    phaseIdx < 1 ? 0 : phaseIdx === 1 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const fT =
    phaseIdx < 2 ? 0 : phaseIdx === 2 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const compT =
    phaseIdx < 3 ? 0 : phaseIdx === 3 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const slopeT =
    phaseIdx < 4 ? 0 : phaseIdx === 4 ? eff(easeOutCubic(phaseProgress)) : 1;

  // x sample for the derivative-product visualization, sliding in phase 4.
  const x =
    phaseIdx < 4
      ? sampleX
      : phaseIdx === 4
        ? lerp(-1.2, sampleX, eff(easeInOutCubic(phaseProgress)))
        : sampleX;

  const gx = innerG(x);
  const fgx = composed(x);
  const slope = composedPrime(x);

  // Curve domains — grow from 0 outward as phase progresses.
  const gDomain: [number, number] = [
    view.x[0] * gT,
    view.x[1] * gT,
  ];
  const fDomain: [number, number] = [
    view.x[0] * fT,
    view.x[1] * fT,
  ];
  const compDomain: [number, number] = [
    view.x[0] * compT,
    view.x[1] * compT,
  ];

  return (
    <>
      {/* Phase 1 — inner g(x) = 2x — drawn in emerald (also dimmed once phase 3 takes over). */}
      {gT > 0 && (
        <Plot.OfX
          y={(xx) => innerG(xx)}
          domain={gDomain}
          color={EMERALD}
          opacity={phaseIdx >= 3 ? 0.45 : 1}
          weight={2.4}
        />
      )}

      {/* Phase 2 — outer f(u) = sin(u) plotted as f vs u (we share the x axis as u). */}
      {fT > 0 && (
        <Plot.OfX
          y={(u) => outerF(u)}
          domain={fDomain}
          color={AMBER}
          opacity={phaseIdx >= 3 ? 0.45 : 1}
          weight={2.4}
        />
      )}

      {/* Phase 3 — composition f(g(x)) = sin(2x). */}
      {compT > 0 && (
        <Plot.OfX
          y={(xx) => composed(xx)}
          domain={compDomain}
          color={ROSE}
          weight={3}
        />
      )}

      {/* Phase 4-5 — slope-product visualization at the sampled x. */}
      {phaseIdx >= 4 && (
        <>
          {/* Vertical guide at current x */}
          <Line.Segment
            point1={[x, view.y[0]]}
            point2={[x, fgx]}
            color={SKY}
            opacity={0.45}
            style="dashed"
            weight={1.4}
          />

          {/* Tangent line at (x, fgx) — slope = (fg)'(x). */}
          {(() => {
            const span = 0.9;
            const x0 = x - span;
            const x1 = x + span;
            const y0 = fgx + slope * (x0 - x);
            const y1 = fgx + slope * (x1 - x);
            return (
              <Line.Segment
                point1={[x0, y0]}
                point2={[x1, y1]}
                color={SKY}
                opacity={0.95 * eff(slopeT)}
                weight={2.6}
              />
            );
          })()}

          {/* The (x, f(g(x))) marker */}
          <Point
            x={x}
            y={fgx}
            color={ROSE}
            opacity={1}
            svgCircleProps={{
              r: 5,
              style: { filter: "drop-shadow(0 0 7px rgba(244, 114, 182, 0.85))" },
            }}
          />

          {/* Derivative readout */}
          <Text
            x={x}
            y={fgx}
            attach="ne"
            attachDistance={14}
            color={SKY}
            size={13}
          >
            {`(f∘g)'(${formatPretty(x)}) = ${formatPretty(slope)}`}
          </Text>

          {/* The intermediate g(x) value as a small annotation on the y-axis. */}
          <Point
            x={0}
            y={gx}
            color={EMERALD}
            opacity={0.85}
            svgCircleProps={{ r: 3.5 }}
          />
          <Text
            x={0}
            y={gx}
            attach="w"
            attachDistance={10}
            color={EMERALD}
            size={12}
          >
            {`g(${formatPretty(x)}) = ${formatPretty(gx)}`}
          </Text>
        </>
      )}
    </>
  );
}

function formatPretty(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2);
}
