"use client";

import React, { useState, useMemo } from "react";
import { Mafs, Coordinates, Plot, Text } from "mafs";
import "mafs/core.css";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const VIOLET = "#A78BFA";

interface BayesUpdaterConfig {
  priorMu?: number;
  priorSigma?: number;
  likelihoodSigma?: number;
  observations?: number[];
}

interface Props {
  config: Record<string, unknown>;
}

function gaussianPdf(x: number, mu: number, sigma: number) {
  const s = Math.max(sigma, 1e-3);
  return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / s) ** 2);
}

/**
 * Conjugate Gaussian-Gaussian update.
 * Given prior N(mu0, sigma0^2) and likelihood variance sigmaL^2, after observing
 * n data points with mean xbar, the posterior is N(muN, sigmaN^2) where:
 *   sigmaN^2 = 1 / (1/sigma0^2 + n/sigmaL^2)
 *   muN     = sigmaN^2 * (mu0/sigma0^2 + n*xbar/sigmaL^2)
 */
function posteriorParams(
  mu0: number,
  sigma0: number,
  sigmaL: number,
  obs: number[]
) {
  if (obs.length === 0) return { mu: mu0, sigma: sigma0 };
  const n = obs.length;
  const xbar = obs.reduce((s, x) => s + x, 0) / n;
  const sigmaN2 = 1 / (1 / (sigma0 * sigma0) + n / (sigmaL * sigmaL));
  const muN = sigmaN2 * (mu0 / (sigma0 * sigma0) + (n * xbar) / (sigmaL * sigmaL));
  return { mu: muN, sigma: Math.sqrt(sigmaN2) };
}

export default function BayesUpdater({ config }: Props) {
  const cfg = (config ?? {}) as BayesUpdaterConfig;
  const mu0 = cfg.priorMu ?? 0;
  const sigma0 = cfg.priorSigma ?? 1.5;
  const sigmaL = cfg.likelihoodSigma ?? 1;
  const allObs = cfg.observations ?? [1.2, 0.8, 1.5, 0.9, 1.1, 1.3];

  const [step, setStep] = useState(0);

  const seen = allObs.slice(0, step);
  const { mu, sigma } = useMemo(
    () => posteriorParams(mu0, sigma0, sigmaL, seen),
    [mu0, sigma0, sigmaL, seen]
  );

  const priorPdf = (x: number) => gaussianPdf(x, mu0, sigma0);
  const postPdf = (x: number) => gaussianPdf(x, mu, sigma);

  const domain: [number, number] = [mu0 - 5 * sigma0, mu0 + 5 * sigma0];
  const yMax = Math.max(
    0.6,
    Math.max(gaussianPdf(mu0, mu0, sigma0), gaussianPdf(mu, mu, sigma)) * 1.15
  );

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(16, 185, 129, 0.18)",
        background: "rgba(15, 23, 42, 0.35)",
      }}
    >
      <Mafs viewBox={{ x: domain, y: [0, yMax] }} preserveAspectRatio="contain" height={320}>
        <Coordinates.Cartesian />
        <Plot.OfX y={priorPdf} domain={domain} color={BLUE} style="dashed" />
        <Plot.OfX y={postPdf} domain={domain} color={EMERALD} />
        {seen.map((x, i) => (
          <Text key={`obs-${i}`} x={x} y={0.02} color={AMBER} size={16} attach="n">
            |
          </Text>
        ))}
        <Text x={mu} y={gaussianPdf(mu, mu, sigma)} color={EMERALD} size={12} attach="n" attachDistance={10}>
          {`μ=${mu.toFixed(2)}, σ=${sigma.toFixed(2)}`}
        </Text>
      </Mafs>
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          borderTop: "1px solid rgba(16, 185, 129, 0.15)",
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={btnStyle(step === 0, VIOLET)}
        >
          ◀ Prev
        </button>
        <span style={{ color: EMERALD, fontVariantNumeric: "tabular-nums" }}>
          Observations: {seen.length} / {allObs.length}
        </span>
        <button
          onClick={() => setStep(Math.min(allObs.length, step + 1))}
          disabled={step >= allObs.length}
          style={btnStyle(step >= allObs.length, EMERALD)}
        >
          Next ▶
        </button>
        <button
          onClick={() => setStep(0)}
          style={btnStyle(false, BLUE)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function btnStyle(disabled: boolean, color: string): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: 8,
    border: `1px solid ${color}`,
    background: disabled ? "transparent" : color,
    color: disabled ? color : "#0b1220",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 600,
  };
}
