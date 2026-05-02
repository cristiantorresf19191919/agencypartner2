"use client";

import React, { useMemo } from "react";
import { Plot, Line, Text, Point } from "mafs";
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

interface GaussianSceneProps {
  /** Final mean. Scene starts at 0 and slides to this in phase 1. */
  mu?: number;
  /** Final standard deviation. Scene starts at 1. */
  sigma?: number;
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "Standard normal",
    labelEs: "Normal estándar",
    caption: {
      text: "N(0, 1) — symmetric, peak at 0, total area = 1.",
      textEs: "N(0, 1) — simétrica, pico en 0, área total = 1.",
    },
    formulaStep: 0,
  },
  {
    duration: 2200,
    label: "Shift the mean μ",
    labelEs: "Desplaza la media μ",
    caption: {
      text: "Changing μ slides the bell horizontally without distorting its shape.",
      textEs:
        "Cambiar μ desliza la campana horizontalmente sin deformar su forma.",
    },
    formulaStep: 1,
  },
  {
    duration: 2400,
    label: "Widen σ — variance grows",
    labelEs: "Ensancha σ — la varianza crece",
    caption: {
      text: "Larger σ flattens the peak and spreads the mass wider.",
      textEs: "Un σ mayor aplana el pico y reparte la masa.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Area under the curve = 1",
    labelEs: "El área bajo la curva = 1",
    caption: {
      text: "Probability is mass: total mass under any normal density is exactly 1.",
      textEs:
        "La probabilidad es masa: la masa total bajo cualquier densidad normal es exactamente 1.",
    },
    formulaStep: 3,
  },
  {
    duration: 2800,
    label: "The 68 / 95 / 99.7 rule",
    labelEs: "La regla 68 / 95 / 99.7",
    caption: {
      text: "≈68% within 1σ, 95% within 2σ, 99.7% within 3σ — every Gaussian.",
      textEs:
        "≈68% dentro de 1σ, 95% en 2σ, 99.7% en 3σ — todas las gaussianas.",
    },
    formulaStep: 4,
  },
];

function gaussianPdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return (
    Math.exp(-0.5 * z * z) /
    (sigma * Math.sqrt(2 * Math.PI))
  );
}

/**
 * The Mafs canvas plots numbers literally — and the standard normal peaks at
 * about 0.4, which makes SmartAxes generate a forest of crammed sub-tick
 * labels. We scale all displayed heights by a constant so the y-axis lives in
 * a "comfortable for ticks" range. The formula shown in the formula chain
 * still reports the true PDF, so this is a pure rendering optimisation.
 */
const Y_SCALE = 16;
function pdfDisplay(x: number, mu: number, sigma: number): number {
  return gaussianPdf(x, mu, sigma) * Y_SCALE;
}

export default function GaussianScene({
  mu: muProp,
  sigma: sigmaProp,
  id,
}: GaussianSceneProps) {
  const targetMu = muProp ?? 1.5;
  const targetSigma = sigmaProp ?? 1.5;

  const formulaSteps = useMemo(() => {
    const fmt = (n: number) =>
      Number.isInteger(n) ? n.toString() : n.toFixed(2);
    return [
      // 0 — standard normal
      `\\mathcal{N}(0, 1) : f(x) = \\frac{1}{\\sqrt{2\\pi}}\\,e^{-x^2/2}`,
      // 1 — general with mu
      `\\mathcal{N}(\\mu, 1) : f(x) = \\frac{1}{\\sqrt{2\\pi}}\\,e^{-(x-\\mu)^2/2}`,
      // 2 — full general
      `\\mathcal{N}(\\mu, \\sigma^2) : f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\,e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}`,
      // 3 — area
      `\\int_{-\\infty}^{\\infty} f(x)\\,dx = 1`,
      // 4 — concrete
      `\\mu = ${fmt(targetMu)}, \\;\\; \\sigma = ${fmt(targetSigma)}`,
    ];
  }, [targetMu, targetSigma]);

  // Viewport — show ±3.2σ horizontal range (covers 99.7% rule). We size y to
  // an integer-friendly range (peak ≈ 6.4 with Y_SCALE = 16, σ = 1) so
  // SmartAxes lays out tick labels on whole numbers instead of cramming
  // 0.05-step labels.
  const view = useMemo(() => {
    const halfX =
      Math.max(3.2, Math.abs(targetMu) + 3.2 * targetSigma) + 0.4;
    return {
      x: [-halfX + targetMu * 0.5, halfX + targetMu * 0.5] as [number, number],
      y: [-1.5, 7.5] as [number, number],
    };
  }, [targetMu, targetSigma]);

  const height = useMafsHeight(380);

  const formulaEmphasize = useMemo(
    () => ({
      1: ["mu"],
      2: ["sigma"],
      3: ["int", "1"],
    }),
    [],
  );

  return (
    <MathScene
      id={id}
      phases={PHASES}
      formulaSteps={formulaSteps}
      formulaEmphasize={formulaEmphasize}
      accent="blue"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs
          viewBox={view}
          height={height}
          preserveAspectRatio={false}
        >
          <SmartAxes />
          <SceneFigure
            targetMu={targetMu}
            targetSigma={targetSigma}
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
  targetMu: number;
  targetSigma: number;
  view: { x: [number, number]; y: [number, number] };
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function SceneFigure({
  targetMu,
  targetSigma,
  view,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  // Drive μ from 0 to targetMu in phase 1, σ from 1 to targetSigma in phase 2.
  const muT =
    phaseIdx < 1 ? 0 : phaseIdx === 1 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const sigmaT =
    phaseIdx < 2 ? 0 : phaseIdx === 2 ? eff(easeInOutCubic(phaseProgress)) : 1;
  const fillT =
    phaseIdx < 3 ? 0 : phaseIdx === 3 ? eff(easeOutCubic(phaseProgress)) : 1;
  const ruleT =
    phaseIdx < 4 ? 0 : phaseIdx === 4 ? eff(easeOutCubic(phaseProgress)) : 1;

  const mu = lerp(0, targetMu, muT);
  const sigma = lerp(1, targetSigma, sigmaT);

  const peakY = pdfDisplay(mu, mu, sigma);

  return (
    <>
      {/* PDF curve — Mafs Plot.OfX redraws when the function reference changes. */}
      <Plot.OfX
        y={(x) => pdfDisplay(x, mu, sigma)}
        domain={view.x}
        color={EMERALD}
        weight={2.6}
      />

      {/* Phase 3 — shaded area under curve (filling animation by clipping range). */}
      {phaseIdx >= 3 && (
        <Plot.Inequality
          y={{
            "<": (x) => pdfDisplay(x, mu, sigma),
            ">": () => 0,
          }}
          color={EMERALD}
          fillOpacity={0.18 * fillT}
          strokeOpacity={0}
        />
      )}

      {/* Phase 4 — 68/95/99.7 colored bands. */}
      {phaseIdx >= 4 && (
        <>
          {/* ±1σ band — emerald */}
          <Plot.Inequality
            y={{
              "<": (x) =>
                Math.abs(x - mu) <= sigma ? pdfDisplay(x, mu, sigma) : 0,
              ">": () => 0,
            }}
            color={EMERALD}
            fillOpacity={0.32 * ruleT}
            strokeOpacity={0}
          />
          {/* ±2σ ring — sky */}
          <Plot.Inequality
            y={{
              "<": (x) =>
                Math.abs(x - mu) <= 2 * sigma && Math.abs(x - mu) > sigma
                  ? pdfDisplay(x, mu, sigma)
                  : 0,
              ">": () => 0,
            }}
            color={SKY}
            fillOpacity={0.28 * ruleT}
            strokeOpacity={0}
          />
          {/* ±3σ ring — violet */}
          <Plot.Inequality
            y={{
              "<": (x) =>
                Math.abs(x - mu) <= 3 * sigma && Math.abs(x - mu) > 2 * sigma
                  ? pdfDisplay(x, mu, sigma)
                  : 0,
              ">": () => 0,
            }}
            color={VIOLET}
            fillOpacity={0.22 * ruleT}
            strokeOpacity={0}
          />
        </>
      )}

      {/* Mean marker — vertical line + label. */}
      <Line.Segment
        point1={[mu, 0]}
        point2={[mu, peakY]}
        color={AMBER}
        opacity={0.7}
        weight={1.6}
        style="dashed"
      />
      <Point
        x={mu}
        y={0}
        color={AMBER}
        svgCircleProps={{ r: 4 }}
      />
      <Text
        x={mu}
        y={0}
        attach="s"
        attachDistance={16}
        color={AMBER}
        size={13}
      >
        {`μ = ${mu.toFixed(2)}`}
      </Text>

      {/* σ markers — appear once σ has begun to grow. */}
      {phaseIdx >= 2 && (
        <>
          <Line.Segment
            point1={[mu - sigma, 0]}
            point2={[mu - sigma, pdfDisplay(mu - sigma, mu, sigma)]}
            color={ROSE}
            opacity={0.55}
            weight={1.4}
            style="dashed"
          />
          <Line.Segment
            point1={[mu + sigma, 0]}
            point2={[mu + sigma, pdfDisplay(mu + sigma, mu, sigma)]}
            color={ROSE}
            opacity={0.55}
            weight={1.4}
            style="dashed"
          />
          <Text
            x={mu + sigma}
            y={0}
            attach="s"
            attachDistance={16}
            color={ROSE}
            size={12}
          >
            {`+σ = ${sigma.toFixed(2)}`}
          </Text>
        </>
      )}

      {/* Phase 4 — percentage tags. */}
      {phaseIdx >= 4 && ruleT >= 0.5 && (
        <>
          <Text x={mu} y={peakY * 0.5} attach="n" attachDistance={2} color={EMERALD} size={13}>
            68%
          </Text>
          <Text
            x={mu - sigma * 1.55}
            y={pdfDisplay(mu - sigma * 1.55, mu, sigma)}
            attach="n"
            attachDistance={6}
            color={SKY}
            size={12}
          >
            95%
          </Text>
          <Text
            x={mu + sigma * 2.55}
            y={pdfDisplay(mu + sigma * 2.55, mu, sigma)}
            attach="n"
            attachDistance={6}
            color={VIOLET}
            size={12}
          >
            99.7%
          </Text>
        </>
      )}
    </>
  );
}
