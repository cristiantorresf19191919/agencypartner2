"use client";

import React, { useState, useMemo } from "react";
import { Mafs, Coordinates, Plot } from "mafs";
import "mafs/core.css";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";

type DistributionKey = "gaussian" | "uniform" | "beta" | "exponential";

interface ProbabilityPlotConfig {
  distribution?: DistributionKey;
  params?: Record<string, number>;
  interactive?: boolean;
  viewBox?: { x?: [number, number]; y?: [number, number] };
}

interface Props {
  config: Record<string, unknown>;
}

function gaussianPdf(x: number, mu: number, sigma: number) {
  const s = Math.max(sigma, 1e-3);
  return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / s) ** 2);
}

function uniformPdf(x: number, a: number, b: number) {
  return x >= a && x <= b ? 1 / Math.max(b - a, 1e-3) : 0;
}

function gammaFn(z: number): number {
  // Lanczos approximation
  const g = 7;
  const coeff = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFn(1 - z));
  z -= 1;
  let a = coeff[0];
  const t = z + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += coeff[i] / (z + i);
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * a;
}

function betaPdf(x: number, a: number, b: number) {
  if (x <= 0 || x >= 1) return 0;
  const B = (gammaFn(a) * gammaFn(b)) / gammaFn(a + b);
  return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)) / B;
}

function expPdf(x: number, lambda: number) {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
}

export default function ProbabilityPlot({ config }: Props) {
  const cfg = (config ?? {}) as ProbabilityPlotConfig;
  const dist = cfg.distribution ?? "gaussian";
  const init = cfg.params ?? {};

  const [mu, setMu] = useState((init.mu as number) ?? 0);
  const [sigma, setSigma] = useState((init.sigma as number) ?? 1);
  const [a, setA] = useState((init.a as number) ?? (dist === "beta" ? 2 : -1));
  const [b, setB] = useState((init.b as number) ?? (dist === "beta" ? 5 : 1));
  const [lambda, setLambda] = useState((init.lambda as number) ?? 1);

  const viewBox = cfg.viewBox ?? { x: [-5, 5], y: [0, 1] };

  const pdf = useMemo(() => {
    if (dist === "gaussian") return (x: number) => gaussianPdf(x, mu, sigma);
    if (dist === "uniform") return (x: number) => uniformPdf(x, a, b);
    if (dist === "beta") return (x: number) => betaPdf(x, a, b);
    if (dist === "exponential") return (x: number) => expPdf(x, lambda);
    return () => 0;
  }, [dist, mu, sigma, a, b, lambda]);

  let domain: [number, number] = (viewBox.x as [number, number]) ?? [-5, 5];
  let yMax: number = (viewBox.y as [number, number])?.[1] ?? 1;
  if (dist === "beta") {
    domain = [0, 1];
    yMax = 4;
  } else if (dist === "exponential") {
    domain = [0, 6];
    yMax = Math.max(1, lambda * 1.1);
  } else if (dist === "gaussian") {
    domain = [mu - 5 * sigma, mu + 5 * sigma];
    yMax = Math.max(0.5, 1 / (sigma * Math.sqrt(2 * Math.PI)) + 0.1);
  }

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
        <Plot.OfX y={pdf} domain={domain} color={EMERALD} />
        <Plot.Inequality y={{ "<": pdf, ">": () => 0 }} color={EMERALD} fillOpacity={0.15} />
      </Mafs>
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          borderTop: "1px solid rgba(16, 185, 129, 0.15)",
          fontSize: 13,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        {dist === "gaussian" && (
          <>
            <Slider label={`μ = ${mu.toFixed(2)}`} min={-4} max={4} step={0.05} value={mu} onChange={setMu} />
            <Slider label={`σ = ${sigma.toFixed(2)}`} min={0.2} max={3} step={0.05} value={sigma} onChange={setSigma} />
          </>
        )}
        {dist === "uniform" && (
          <>
            <Slider label={`a = ${a.toFixed(2)}`} min={-4} max={b - 0.1} step={0.1} value={a} onChange={setA} />
            <Slider label={`b = ${b.toFixed(2)}`} min={a + 0.1} max={4} step={0.1} value={b} onChange={setB} />
          </>
        )}
        {dist === "beta" && (
          <>
            <Slider label={`α = ${a.toFixed(2)}`} min={0.5} max={10} step={0.1} value={a} onChange={setA} />
            <Slider label={`β = ${b.toFixed(2)}`} min={0.5} max={10} step={0.1} value={b} onChange={setB} />
          </>
        )}
        {dist === "exponential" && (
          <Slider label={`λ = ${lambda.toFixed(2)}`} min={0.1} max={3} step={0.05} value={lambda} onChange={setLambda} />
        )}
        <span style={{ color: BLUE, opacity: 0.75 }}>Distribution: {dist}</span>
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ minWidth: 92 }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: EMERALD }}
      />
    </label>
  );
}
