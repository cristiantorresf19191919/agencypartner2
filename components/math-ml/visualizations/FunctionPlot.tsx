"use client";

import React, { useMemo } from "react";
import { Mafs, Coordinates, Plot, Point, Text, useMovablePoint } from "mafs";
import "mafs/core.css";

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

interface FunctionPlotConfig {
  fn?: FnKey;
  domain?: [number, number];
  showTangent?: boolean;
  taylorOrder?: number;
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

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(16, 185, 129, 0.18)",
        background: "rgba(15, 23, 42, 0.35)",
      }}
    >
      <Mafs viewBox={{ x: domain, y: [-5, 5] }} preserveAspectRatio="contain" height={360}>
        <Coordinates.Cartesian />
        <Plot.OfX y={f} domain={domain} color={BLUE} />
        {showTangent && (
          <Plot.OfX y={tangentY} domain={domain} color={AMBER} style="dashed" />
        )}
        {taylorOrder > 0 && (
          <Plot.OfX y={taylor} domain={domain} color={VIOLET} />
        )}
        <Point x={ax} y={fa} color={EMERALD} />
        {a.element}
        <Text x={ax} y={fa} attach="ne" attachDistance={14} color={EMERALD} size={14}>
          {`a=${ax.toFixed(2)}`}
        </Text>
      </Mafs>
    </div>
  );
}
