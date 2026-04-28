"use client";

import React, { useMemo } from "react";
import { Coordinates, Plot, Point, Text, useMovablePoint } from "mafs";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { LabeledMarker, type AccentName, type MarkerKind } from "../primitives/LabeledMarker";
import type { NarrationBeat } from "../primitives/Narration";

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const AMBER = "#F59E0B";
const VIOLET = "#A78BFA";

type FnKey =
  | "x^2"
  | "x^3"
  | "sin"
  | "cos"
  | "exp"
  | "ln"
  | "sigmoid"
  | "relu";

interface MarkerSpec {
  x: number;
  y: number;
  label: string;
  kind?: MarkerKind;
  accent?: AccentName;
}

interface FunctionPlotConfig {
  fn?: FnKey;
  domain?: [number, number];
  showTangent?: boolean;
  taylorOrder?: number;
  /** Optional annotated points (minima, inflection, etc). */
  markers?: MarkerSpec[];
  /** Manim-style captions; fade in sequentially on scroll. */
  narration?: NarrationBeat[];
  /** Vertical viewport bounds; auto-fits to function range when omitted. */
  yDomain?: [number, number];
}

interface Props {
  config: Record<string, unknown>;
}

function pickFn(k: FnKey | undefined) {
  switch (k) {
    case "x^3":
      return {
        f: (x: number) => x * x * x,
        df: (x: number) => 3 * x * x,
        d2: (x: number) => 6 * x,
        d3: (_x: number) => 6,
      };
    case "sin":
      return {
        f: Math.sin,
        df: Math.cos,
        d2: (x: number) => -Math.sin(x),
        d3: (x: number) => -Math.cos(x),
      };
    case "cos":
      return {
        f: Math.cos,
        df: (x: number) => -Math.sin(x),
        d2: (x: number) => -Math.cos(x),
        d3: Math.sin,
      };
    case "exp":
      return {
        f: Math.exp,
        df: Math.exp,
        d2: Math.exp,
        d3: Math.exp,
      };
    case "ln":
      return {
        f: (x: number) => Math.log(Math.max(x, 1e-6)),
        df: (x: number) => 1 / Math.max(x, 1e-6),
        d2: (x: number) => -1 / Math.pow(Math.max(x, 1e-6), 2),
        d3: (x: number) => 2 / Math.pow(Math.max(x, 1e-6), 3),
      };
    case "sigmoid": {
      const sig = (x: number) => 1 / (1 + Math.exp(-x));
      return {
        f: sig,
        df: (x: number) => sig(x) * (1 - sig(x)),
        d2: (x: number) => {
          const s = sig(x);
          return s * (1 - s) * (1 - 2 * s);
        },
        d3: (x: number) => {
          const s = sig(x);
          return s * (1 - s) * (1 - 6 * s + 6 * s * s);
        },
      };
    }
    case "relu":
      return {
        f: (x: number) => Math.max(0, x),
        df: (x: number) => (x > 0 ? 1 : 0),
        d2: (_x: number) => 0,
        d3: (_x: number) => 0,
      };
    case "x^2":
    default:
      return {
        f: (x: number) => x * x,
        df: (x: number) => 2 * x,
        d2: (_x: number) => 2,
        d3: (_x: number) => 0,
      };
  }
}

function autoYDomain(
  f: (x: number) => number,
  domain: [number, number],
): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const x = domain[0] + ((domain[1] - domain[0]) * i) / steps;
    const y = f(x);
    if (Number.isFinite(y)) {
      lo = Math.min(lo, y);
      hi = Math.max(hi, y);
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [-5, 5];
  const pad = Math.max(0.5, (hi - lo) * 0.15);
  return [lo - pad, hi + pad];
}

export default function FunctionPlot({ config }: Props) {
  const cfg = (config ?? {}) as FunctionPlotConfig;
  const domain: [number, number] = cfg.domain ?? [-5, 5];
  const showTangent = cfg.showTangent ?? true;
  const taylorOrder = cfg.taylorOrder ?? 0;

  const { f, df, d2, d3 } = useMemo(() => pickFn(cfg.fn ?? "x^2"), [cfg.fn]);

  const a = useMovablePoint([1, 0], { constrain: "horizontal", color: EMERALD });
  const ax = a.x;
  const fa = f(ax);
  const dfa = df(ax);

  const tangentY = (x: number) => fa + dfa * (x - ax);
  const taylor = (x: number) => {
    let acc = fa;
    if (taylorOrder >= 1) acc += dfa * (x - ax);
    if (taylorOrder >= 2) acc += (d2(ax) * Math.pow(x - ax, 2)) / 2;
    if (taylorOrder >= 3) acc += (d3(ax) * Math.pow(x - ax, 3)) / 6;
    return acc;
  };

  const height = useMafsHeight(360);
  const yDomain = useMemo(
    () => cfg.yDomain ?? autoYDomain(f, domain),
    [cfg.yDomain, f, domain],
  );

  return (
    <MafsStage accent="blue" narration={cfg.narration}>
      <ZoomableMafs viewBox={{ x: domain, y: yDomain }} height={height}>
        <Coordinates.Cartesian />
        <Plot.OfX y={f} domain={domain} color={BLUE} weight={2.6} />
        {showTangent && (
          <Plot.OfX y={tangentY} domain={domain} color={AMBER} style="dashed" weight={2.2} />
        )}
        {taylorOrder > 0 && (
          <Plot.OfX y={taylor} domain={domain} color={VIOLET} weight={2.4} />
        )}
        {(cfg.markers ?? []).map((m, i) => (
          <LabeledMarker
            key={`mk-${i}`}
            x={m.x}
            y={m.y}
            label={m.label}
            kind={m.kind ?? "star"}
            accent={m.accent ?? "emerald"}
          />
        ))}
        <Point x={ax} y={fa} color={EMERALD} />
        {a.element}
        <Text x={ax} y={fa} attach="ne" attachDistance={14} color={EMERALD} size={14}>
          {`a=${ax.toFixed(2)},  f'(a)=${dfa.toFixed(2)}`}
        </Text>
      </ZoomableMafs>
    </MafsStage>
  );
}
