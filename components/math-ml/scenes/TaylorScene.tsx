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
const VIOLET = "#A78BFA";

interface TaylorSceneProps {
  /** Centre of expansion. Defaults to 0. */
  center?: number;
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "The function we want to approximate",
    labelEs: "La función a aproximar",
    caption: {
      text: "f(x) = sin(x) — non-polynomial, but smooth.",
      textEs: "f(x) = sin(x) — no polinomial, pero suave.",
    },
    formulaStep: 0,
  },
  {
    duration: 2200,
    label: "T₁ — the tangent line",
    labelEs: "T₁ — la recta tangente",
    caption: {
      text: "Match the value AND the slope at x = 0. Accurate near 0, drifts fast.",
      textEs:
        "Iguala el valor Y la pendiente en x = 0. Precisa cerca de 0, diverge rápido.",
    },
    formulaStep: 1,
  },
  {
    duration: 2400,
    label: "T₃ — add the cubic term",
    labelEs: "T₃ — añade el término cúbico",
    caption: {
      text: "Match the third derivative too. The hump now bends with the curve.",
      textEs:
        "Iguala también la tercera derivada. La curva ya se dobla con la función.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "T₅ — add the quintic term",
    labelEs: "T₅ — añade el término quíntico",
    caption: {
      text: "Each new term widens the agreement zone.",
      textEs: "Cada nuevo término amplía la zona de coincidencia.",
    },
    formulaStep: 3,
  },
  {
    duration: 2400,
    label: "Higher orders fit further out",
    labelEs: "Órdenes mayores ajustan más lejos",
    caption: {
      text: "T₇ is nearly indistinguishable from sin(x) across [-π, π].",
      textEs:
        "T₇ es casi indistinguible de sin(x) en [-π, π].",
    },
    formulaStep: 4,
  },
  {
    duration: 2600,
    label: "Taylor's theorem",
    labelEs: "Teorema de Taylor",
    caption: {
      text: "f(x) ≈ Σ f⁽ⁿ⁾(a)·(x-a)ⁿ/n! — every smooth function is locally a polynomial.",
      textEs:
        "f(x) ≈ Σ f⁽ⁿ⁾(a)·(x-a)ⁿ/n! — toda función suave es localmente un polinomio.",
    },
    formulaStep: 5,
  },
];

const fact = (n: number): number => {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};

/** Taylor approximation of sin(x) around x = 0 with given odd-degree terms. */
function sinTaylor(x: number, degree: number): number {
  let sum = 0;
  for (let k = 0; k <= degree; k += 2) {
    // sin's Taylor series uses odd powers only: x - x³/3! + x⁵/5! - ...
    const sign = (k / 2) % 2 === 0 ? 1 : -1;
    const power = k + 1;
    sum += (sign * x ** power) / fact(power);
  }
  return sum;
}

export default function TaylorScene({ center = 0, id }: TaylorSceneProps) {
  const formulaSteps = useMemo(
    () => [
      `f(x) = \\sin(x)`,
      `T_1(x) = x`,
      `T_3(x) = x - \\dfrac{x^3}{3!}`,
      `T_5(x) = x - \\dfrac{x^3}{3!} + \\dfrac{x^5}{5!}`,
      `T_7(x) = x - \\dfrac{x^3}{3!} + \\dfrac{x^5}{5!} - \\dfrac{x^7}{7!}`,
      `f(x) \\approx \\sum_{n=0}^{N} \\dfrac{f^{(n)}(a)}{n!}\\,(x-a)^n`,
    ],
    [],
  );

  const formulaEmphasize = useMemo(
    () => ({
      1: ["x"],
      2: ["x^3"],
      3: ["x^5"],
      4: ["x^7"],
    }),
    [],
  );

  const view = useMemo(
    () => ({
      x: [-Math.PI - 0.6, Math.PI + 0.6] as [number, number],
      y: [-1.6, 1.6] as [number, number],
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
      accent="amber"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs viewBox={view} height={height}>
          <SmartAxes />
          <SceneFigure
            center={center}
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
  center: number;
  view: { x: [number, number]; y: [number, number] };
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function SceneFigure({
  center,
  view,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  // Reveal each Taylor polynomial in sequence by extending its plot domain
  // outward from the centre.
  const revealT = (introPhase: number): number => {
    if (phaseIdx < introPhase) return 0;
    if (phaseIdx === introPhase) return eff(easeInOutCubic(phaseProgress));
    return 1;
  };

  const t1T = revealT(1);
  const t3T = revealT(2);
  const t5T = revealT(3);
  const t7T = revealT(4);

  const expandDomain = (t: number): [number, number] => {
    const halfWidth = (view.x[1] - center) * t;
    return [center - halfWidth, center + halfWidth];
  };

  return (
    <>
      {/* Always-on f(x) = sin(x) — the truth, in emerald. */}
      <Plot.OfX
        y={(x) => Math.sin(x)}
        domain={view.x}
        color={EMERALD}
        weight={3.2}
      />

      {/* T1 — line. */}
      {t1T > 0 && (
        <Plot.OfX
          y={(x) => sinTaylor(x - center, 1)}
          domain={expandDomain(t1T)}
          color={SKY}
          opacity={phaseIdx >= 4 ? 0.45 : 1}
          weight={2.4}
        />
      )}

      {/* T3 — cubic. */}
      {t3T > 0 && (
        <Plot.OfX
          y={(x) => sinTaylor(x - center, 3)}
          domain={expandDomain(t3T)}
          color={AMBER}
          opacity={phaseIdx >= 4 ? 0.45 : 1}
          weight={2.4}
        />
      )}

      {/* T5 — quintic. */}
      {t5T > 0 && (
        <Plot.OfX
          y={(x) => sinTaylor(x - center, 5)}
          domain={expandDomain(t5T)}
          color={ROSE}
          opacity={phaseIdx >= 4 ? 0.55 : 1}
          weight={2.4}
        />
      )}

      {/* T7 — septic, only in phase 4+ */}
      {t7T > 0 && (
        <Plot.OfX
          y={(x) => sinTaylor(x - center, 7)}
          domain={expandDomain(t7T)}
          color={VIOLET}
          weight={2.6}
        />
      )}

      {/* Centre marker — the expansion point. */}
      <Point
        x={center}
        y={Math.sin(center)}
        color={EMERALD}
        svgCircleProps={{
          r: 5,
          style: { filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.7))" },
        }}
      />
      <Text
        x={center}
        y={Math.sin(center)}
        attach="ne"
        attachDistance={12}
        color={EMERALD}
        size={13}
      >
        {`a = ${formatPretty(center)}`}
      </Text>
    </>
  );
}

function formatPretty(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2);
}
