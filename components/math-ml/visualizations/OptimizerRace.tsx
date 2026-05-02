"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mafs, Plot, Point, Polyline } from "mafs";
import { SmartAxes, ViewBoxProvider } from "../primitives/SmartAxes";
import "mafs/core.css";
import { MafsStage, useMafsHeight } from "../primitives/MafsStage";

const COLORS = {
  sgd: "#EF4444",
  momentum: "#3B82F6",
  adam: "#10B981",
} as const;

type SurfaceKey = "paraboloid" | "saddle" | "rosenbrock" | "noisy-bowl";

interface Surface {
  /** f(x, y) — for level-set rendering. */
  f: (x: number, y: number) => number;
  /** ∇f(x, y) returning [df/dx, df/dy]. */
  grad: (x: number, y: number) => [number, number];
  /** Suggested view box for plotting. */
  viewBox: { x: [number, number]; y: [number, number] };
  /** Default starting point. */
  start: [number, number];
  /** Levels for contour curves. */
  levels: number[];
  label: string;
}

const SURFACES: Record<SurfaceKey, Surface> = {
  paraboloid: {
    f: (x, y) => x * x + y * y,
    grad: (x, y) => [2 * x, 2 * y],
    viewBox: { x: [-4, 4], y: [-4, 4] },
    start: [3, 2.5],
    levels: [0.5, 2, 4.5, 8, 12.5, 18],
    label: "Paraboloid  f = x² + y²",
  },
  saddle: {
    f: (x, y) => x * x - y * y,
    grad: (x, y) => [2 * x, -2 * y],
    viewBox: { x: [-4, 4], y: [-4, 4] },
    start: [0.05, 3],
    levels: [-12, -6, -2, 0, 2, 6, 12],
    label: "Saddle  f = x² − y²",
  },
  rosenbrock: {
    f: (x, y) => (1 - x) ** 2 + 10 * (y - x * x) ** 2,
    grad: (x, y) => [
      -2 * (1 - x) - 40 * x * (y - x * x),
      20 * (y - x * x),
    ],
    viewBox: { x: [-2, 2], y: [-1, 3] },
    start: [-1.4, 2.4],
    levels: [0.5, 2, 8, 25, 80, 200],
    label: "Rosenbrock  f = (1−x)² + 10(y − x²)²",
  },
  "noisy-bowl": {
    f: (x, y) => x * x + y * y + 0.4 * Math.sin(2.5 * x) * Math.cos(2.5 * y),
    grad: (x, y) => [
      2 * x + 0.4 * 2.5 * Math.cos(2.5 * x) * Math.cos(2.5 * y),
      2 * y - 0.4 * 2.5 * Math.sin(2.5 * x) * Math.sin(2.5 * y),
    ],
    viewBox: { x: [-4, 4], y: [-4, 4] },
    start: [3, 2.6],
    levels: [0.5, 2, 4.5, 8, 12.5, 18],
    label: "Noisy bowl  f = x² + y² + 0.4·sin(2.5x)cos(2.5y)",
  },
};

interface OptimizerState {
  pos: [number, number];
  /** SGD has no extra state. Momentum stores velocity. Adam stores m, v, t. */
  vel?: [number, number];
  m?: [number, number];
  v?: [number, number];
  t?: number;
}

interface Hyperparams {
  lr: number;        // learning rate (η)
  beta: number;      // momentum coefficient (β)
  beta1: number;     // Adam β₁
  beta2: number;     // Adam β₂
  epsilon: number;   // Adam ε
}

function stepSGD(s: OptimizerState, g: [number, number], h: Hyperparams): OptimizerState {
  return {
    pos: [s.pos[0] - h.lr * g[0], s.pos[1] - h.lr * g[1]],
  };
}

function stepMomentum(
  s: OptimizerState,
  g: [number, number],
  h: Hyperparams,
): OptimizerState {
  const v0 = s.vel ?? [0, 0];
  const v: [number, number] = [
    h.beta * v0[0] + g[0],
    h.beta * v0[1] + g[1],
  ];
  return {
    pos: [s.pos[0] - h.lr * v[0], s.pos[1] - h.lr * v[1]],
    vel: v,
  };
}

function stepAdam(
  s: OptimizerState,
  g: [number, number],
  h: Hyperparams,
): OptimizerState {
  const m0 = s.m ?? [0, 0];
  const v0 = s.v ?? [0, 0];
  const t = (s.t ?? 0) + 1;
  const m: [number, number] = [
    h.beta1 * m0[0] + (1 - h.beta1) * g[0],
    h.beta1 * m0[1] + (1 - h.beta1) * g[1],
  ];
  const v: [number, number] = [
    h.beta2 * v0[0] + (1 - h.beta2) * g[0] * g[0],
    h.beta2 * v0[1] + (1 - h.beta2) * g[1] * g[1],
  ];
  const mHat: [number, number] = [m[0] / (1 - h.beta1 ** t), m[1] / (1 - h.beta1 ** t)];
  const vHat: [number, number] = [v[0] / (1 - h.beta2 ** t), v[1] / (1 - h.beta2 ** t)];
  return {
    pos: [
      s.pos[0] - (h.lr * mHat[0]) / (Math.sqrt(vHat[0]) + h.epsilon),
      s.pos[1] - (h.lr * mHat[1]) / (Math.sqrt(vHat[1]) + h.epsilon),
    ],
    m,
    v,
    t,
  };
}

const STEP_INTERVAL_MS = 80;
const MAX_STEPS = 250;

function clampPoint(
  p: [number, number],
  bounds: { x: [number, number]; y: [number, number] },
): [number, number] {
  return [
    Math.max(bounds.x[0], Math.min(bounds.x[1], p[0])),
    Math.max(bounds.y[0], Math.min(bounds.y[1], p[1])),
  ];
}

interface Props {
  config?: Record<string, unknown>;
}

export default function OptimizerRace({ config }: Props) {
  const cfgSurface = (config?.surface as SurfaceKey) ?? "paraboloid";
  const [surfaceKey, setSurfaceKey] = useState<SurfaceKey>(cfgSurface);
  const surface = SURFACES[surfaceKey];

  const [hp, setHp] = useState<Hyperparams>({
    lr: (config?.lr as number) ?? 0.08,
    beta: (config?.beta as number) ?? 0.85,
    beta1: 0.9,
    beta2: 0.999,
    epsilon: 1e-8,
  });

  const [start, setStart] = useState<[number, number]>(surface.start);
  const [running, setRunning] = useState(false);
  const [trajectories, setTrajectories] = useState<{
    sgd: [number, number][];
    momentum: [number, number][];
    adam: [number, number][];
  }>({ sgd: [start], momentum: [start], adam: [start] });

  const stateRef = useRef<{ sgd: OptimizerState; momentum: OptimizerState; adam: OptimizerState }>({
    sgd: { pos: start },
    momentum: { pos: start, vel: [0, 0] },
    adam: { pos: start, m: [0, 0], v: [0, 0], t: 0 },
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepCountRef = useRef(0);

  const reset = useCallback(
    (newStart?: [number, number]) => {
      const s = newStart ?? start;
      stateRef.current = {
        sgd: { pos: s },
        momentum: { pos: s, vel: [0, 0] },
        adam: { pos: s, m: [0, 0], v: [0, 0], t: 0 },
      };
      stepCountRef.current = 0;
      setTrajectories({ sgd: [s], momentum: [s], adam: [s] });
      setRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [start],
  );

  // When the surface changes, reset to its default start.
  useEffect(() => {
    setStart(surface.start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surfaceKey]);

  // When start changes, reset trajectories to begin from the new start.
  useEffect(() => {
    reset(start);
  }, [start, reset]);

  const tick = useCallback(() => {
    stepCountRef.current += 1;
    if (stepCountRef.current > MAX_STEPS) {
      setRunning(false);
      return;
    }
    const s = stateRef.current;
    const gSgd = surface.grad(...s.sgd.pos);
    const gMom = surface.grad(...s.momentum.pos);
    const gAdam = surface.grad(...s.adam.pos);
    const next = {
      sgd: stepSGD(s.sgd, gSgd, hp),
      momentum: stepMomentum(s.momentum, gMom, hp),
      adam: stepAdam(s.adam, gAdam, hp),
    };
    next.sgd.pos = clampPoint(next.sgd.pos, surface.viewBox);
    next.momentum.pos = clampPoint(next.momentum.pos, surface.viewBox);
    next.adam.pos = clampPoint(next.adam.pos, surface.viewBox);
    stateRef.current = next;
    setTrajectories((prev) => ({
      sgd: [...prev.sgd, next.sgd.pos],
      momentum: [...prev.momentum, next.momentum.pos],
      adam: [...prev.adam, next.adam.pos],
    }));
  }, [hp, surface]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, STEP_INTERVAL_MS);
    intervalRef.current = id;
    return () => clearInterval(id);
  }, [running, tick]);

  const height = useMafsHeight(420);

  // Contour curves: f(x,y) = c -> render as implicit by sampling a grid is heavy.
  // For the four surfaces we pre-compute parametric or analytic level curves where we can,
  // and fall back to using mafs <Plot.OfX> with multiple samples for level sets.
  // For simplicity we just plot the raw surface as a visual aid via filled contour proxies:
  // a few level circles for paraboloid/noisy-bowl, hyperbolas for saddle, and a sparse
  // grid sampling for rosenbrock.

  const trailLine = (
    points: [number, number][],
    color: string,
  ): React.ReactElement | null =>
    points.length >= 2 ? (
      <Polyline points={points} color={color} />
    ) : null;

  const onCanvasClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget.querySelector("svg");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const fracX = px / rect.width;
    const fracY = py / rect.height;
    const wx =
      surface.viewBox.x[0] + fracX * (surface.viewBox.x[1] - surface.viewBox.x[0]);
    const wy =
      surface.viewBox.y[1] - fracY * (surface.viewBox.y[1] - surface.viewBox.y[0]);
    setStart([wx, wy]);
  };

  // Background level curves rendered as Plot.OfX where solvable for y; otherwise
  // skip and rely on the trajectory + start marker for orientation.
  const levelLines = useMemo(() => {
    const out: React.ReactElement[] = [];
    if (surfaceKey === "paraboloid" || surfaceKey === "noisy-bowl") {
      surface.levels.forEach((c, i) => {
        const r = Math.sqrt(c);
        // approximate as a ring of points
        const pts: [number, number][] = [];
        const N = 64;
        for (let k = 0; k <= N; k++) {
          const t = (k / N) * Math.PI * 2;
          pts.push([r * Math.cos(t), r * Math.sin(t)]);
        }
        out.push(
          <Polyline
            key={`lvl-${i}`}
            points={pts}
            color="rgba(255,255,255,0.18)"
                     />,
        );
      });
    } else if (surfaceKey === "saddle") {
      surface.levels.forEach((c, i) => {
        if (Math.abs(c) < 1e-6) {
          // x^2 = y^2 -> y = +-x
          out.push(
            <Polyline
              key={`lvl-${i}-a`}
              points={[
                [-4, -4],
                [4, 4],
              ]}
              color="rgba(255,255,255,0.12)"
                         />,
          );
          out.push(
            <Polyline
              key={`lvl-${i}-b`}
              points={[
                [-4, 4],
                [4, -4],
              ]}
              color="rgba(255,255,255,0.12)"
                         />,
          );
        } else {
          // x^2 - y^2 = c  ->  y = +-sqrt(x^2 - c) when defined
          const ptsA: [number, number][] = [];
          const ptsB: [number, number][] = [];
          for (let x = -4; x <= 4; x += 0.1) {
            const r = x * x - c;
            if (r >= 0) {
              ptsA.push([x, Math.sqrt(r)]);
              ptsB.push([x, -Math.sqrt(r)]);
            }
          }
          if (ptsA.length >= 2)
            out.push(
              <Polyline
                key={`lvl-${i}-up`}
                points={ptsA}
                color="rgba(255,255,255,0.15)"
                             />,
            );
          if (ptsB.length >= 2)
            out.push(
              <Polyline
                key={`lvl-${i}-dn`}
                points={ptsB}
                color="rgba(255,255,255,0.15)"
                             />,
            );
        }
      });
    }
    return out;
  }, [surfaceKey, surface.levels]);

  // For Rosenbrock, draw the "valley" curve y = x^2 (which is the locus of low values).
  const rosenValley = useMemo(() => {
    if (surfaceKey !== "rosenbrock") return null;
    const pts: [number, number][] = [];
    for (let x = -2; x <= 2; x += 0.05) pts.push([x, x * x]);
    return (
      <Polyline points={pts} color="rgba(255,255,255,0.18)" />
    );
  }, [surfaceKey]);

  const sliderRow = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    min: number,
    max: number,
    step = 0.001,
  ) => (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: "rgba(255,255,255,0.78)",
      }}
    >
      <span style={{ width: 84, fontVariantNumeric: "tabular-nums" }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: "#10B981" }}
      />
      <span
        style={{
          width: 56,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          color: "#10B981",
        }}
      >
        {value < 0.001 ? value.toExponential(1) : value.toFixed(3)}
      </span>
    </label>
  );

  return (
    <MafsStage accent="emerald">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <select
            value={surfaceKey}
            onChange={(e) => setSurfaceKey(e.target.value as SurfaceKey)}
            style={{
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 13,
            }}
          >
            {(Object.keys(SURFACES) as SurfaceKey[]).map((k) => (
              <option key={k} value={k}>
                {SURFACES[k].label}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Legend color={COLORS.sgd} label="SGD" />
            <Legend color={COLORS.momentum} label="Momentum" />
            <Legend color={COLORS.adam} label="Adam" />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              style={btnStyle}
              aria-label={running ? "Pause" : "Run"}
            >
              {running ? "Pause" : "Run"}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              style={btnStyle}
              aria-label="Reset"
            >
              Reset
            </button>
          </div>
        </div>

        <div onClick={onCanvasClick} style={{ cursor: "crosshair" }}>
          <Mafs
            viewBox={surface.viewBox}
            preserveAspectRatio="contain"
            height={height}
          >
            <ViewBoxProvider value={surface.viewBox}>
            <SmartAxes />
            {levelLines}
            {rosenValley}
            {trailLine(trajectories.sgd, COLORS.sgd)}
            {trailLine(trajectories.momentum, COLORS.momentum)}
            {trailLine(trajectories.adam, COLORS.adam)}
            <Point x={start[0]} y={start[1]} color="#fff" opacity={0.5} />
            <Point
              x={stateRef.current.sgd.pos[0]}
              y={stateRef.current.sgd.pos[1]}
              color={COLORS.sgd}
            />
            <Point
              x={stateRef.current.momentum.pos[0]}
              y={stateRef.current.momentum.pos[1]}
              color={COLORS.momentum}
            />
            <Point
              x={stateRef.current.adam.pos[0]}
              y={stateRef.current.adam.pos[1]}
              color={COLORS.adam}
            />
            </ViewBoxProvider>
          </Mafs>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 24px",
            padding: "10px 12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: 4,
          }}
        >
          {sliderRow("η (lr)", hp.lr, (v) => setHp((p) => ({ ...p, lr: v })), 0.001, 0.5, 0.001)}
          {sliderRow(
            "β (momentum)",
            hp.beta,
            (v) => setHp((p) => ({ ...p, beta: v })),
            0,
            0.99,
            0.01,
          )}
          {sliderRow("Adam β₁", hp.beta1, (v) => setHp((p) => ({ ...p, beta1: v })), 0, 0.999, 0.001)}
          {sliderRow("Adam β₂", hp.beta2, (v) => setHp((p) => ({ ...p, beta2: v })), 0.9, 0.9999, 0.0001)}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
          }}
        >
          Click on the canvas to set a new start point.
        </p>
      </div>
    </MafsStage>
  );
}

const btnStyle: React.CSSProperties = {
  background: "rgba(16, 185, 129, 0.08)",
  border: "1px solid rgba(16, 185, 129, 0.4)",
  color: "#10B981",
  borderRadius: 6,
  padding: "4px 12px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "rgba(255,255,255,0.78)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          background: color,
          borderRadius: 999,
        }}
      />
      {label}
    </span>
  );
}
