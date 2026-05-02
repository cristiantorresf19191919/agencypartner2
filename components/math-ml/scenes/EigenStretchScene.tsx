"use client";

import React, { useMemo } from "react";
import { Polygon, Vector, Line, Text, Point } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, easeOutCubic, lerp, lerp2 } from "./easing";

const EMERALD = "#10B981";
const AMBER = "#FBBF24";
const ROSE = "#F472B6";
const SLATE = "#64748B";

interface EigenStretchSceneProps {
  /** 2×2 matrix. Defaults to a symmetric matrix with non-axis eigenvectors. */
  matrix?: number[][];
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "A sweep of unit vectors",
    labelEs: "Un abanico de vectores unitarios",
    caption: {
      text: "Start with vectors of length 1 — the unit circle.",
      textEs: "Empieza con vectores de longitud 1 — el círculo unitario.",
    },
    formulaStep: 0,
  },
  {
    duration: 2400,
    label: "Apply A — most rotate and stretch",
    labelEs: "Aplica A — la mayoría rota y estira",
    caption: {
      text: "Most directions are pushed off their original lines.",
      textEs: "La mayoría de direcciones son empujadas fuera de su recta.",
    },
    formulaStep: 1,
  },
  {
    duration: 2200,
    label: "Some vectors stay on their line",
    labelEs: "Algunos vectores se quedan en su recta",
    caption: {
      text: "Two special directions only stretch — they never rotate.",
      textEs:
        "Dos direcciones especiales sólo se estiran — nunca rotan.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Eigenvalues = stretch factors",
    labelEs: "Autovalores = factores de estiramiento",
    caption: {
      text: "λ₁ and λ₂ are how much each eigenvector grows.",
      textEs: "λ₁ y λ₂ son cuánto crece cada autovector.",
    },
    formulaStep: 3,
  },
  {
    duration: 2600,
    label: "A v = λ v",
    labelEs: "A v = λ v",
    caption: {
      text: "Multiplying by A is the same as multiplying by a scalar — for these v.",
      textEs:
        "Multiplicar por A equivale a multiplicar por un escalar — para esos v.",
    },
    formulaStep: 4,
  },
];

/**
 * Compute eigen-decomposition of a real 2×2 matrix.
 *
 * For symmetric (and most well-conditioned) inputs we get two real
 * eigenvalues and orthonormal eigenvectors — that's the case the scene
 * caters to. We do not handle complex eigenvalues; callers are expected
 * to pass real-spectrum matrices (the curated default is symmetric).
 */
function eig2x2(A: number[][]): {
  lambda: [number, number];
  v: [[number, number], [number, number]];
} {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];
  const tr = a + d;
  const det = a * d - b * c;
  const disc = Math.max(0, (tr * tr) / 4 - det);
  const sq = Math.sqrt(disc);
  const l1 = tr / 2 + sq;
  const l2 = tr / 2 - sq;

  const ev = (lambda: number): [number, number] => {
    // Solve (A - λI) v = 0 by picking the more numerically stable row.
    const r1 = [a - lambda, b];
    const r2 = [c, d - lambda];
    const norm1 = Math.hypot(...r1);
    const norm2 = Math.hypot(...r2);
    let vec: [number, number];
    if (norm1 >= norm2) {
      vec = [-r1[1], r1[0]];
    } else {
      vec = [-r2[1], r2[0]];
    }
    const n = Math.hypot(vec[0], vec[1]);
    if (n < 1e-9) return [1, 0];
    return [vec[0] / n, vec[1] / n];
  };

  return { lambda: [l1, l2], v: [ev(l1), ev(l2)] };
}

export default function EigenStretchScene({ matrix, id }: EigenStretchSceneProps) {
  // Default — a symmetric matrix with eigenvectors at ±45°.
  const A = matrix ?? [
    [3, 1],
    [1, 3],
  ];

  const { lambda, v } = useMemo(() => eig2x2(A), [A]);
  const lambda1 = lambda[0];
  const lambda2 = lambda[1];
  const v1 = v[0];
  const v2 = v[1];

  const formulaSteps = useMemo(() => {
    const fmt = (n: number) =>
      Number.isInteger(n) ? n.toString() : n.toFixed(2);
    return [
      // 0 — unit vectors, ‖v‖ = 1
      `\\|\\mathbf{v}\\| = 1`,
      // 1 — generic action of A
      `\\mathbf{v} \\;\\longmapsto\\; A\\,\\mathbf{v}`,
      // 2 — the "stay on the line" property
      `A\\,\\mathbf{v} \\;\\parallel\\; \\mathbf{v}`,
      // 3 — eigenvalue specifics
      `\\lambda_1 = ${fmt(lambda1)}, \\quad \\lambda_2 = ${fmt(lambda2)}`,
      // 4 — eigen-equation
      `A\\,\\mathbf{v} = \\lambda\\,\\mathbf{v}`,
    ];
  }, [lambda1, lambda2]);

  // Pre-compute a fan of test vectors (unit circle samples). Use a fixed seed
  // by deriving angles deterministically — keeps SSR/CSR stable.
  const fanCount = 16;
  const fan = useMemo(() => {
    const out: { from: [number, number]; isEigenLike: boolean }[] = [];
    for (let i = 0; i < fanCount; i++) {
      const angle = (i / fanCount) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      // Heuristic: skip the ones that are essentially eigenvectors so the
      // dedicated eigen-render isn't double-painted.
      const isEigenLike =
        Math.abs(x * v1[1] - y * v1[0]) < 0.06 ||
        Math.abs(x * v2[1] - y * v2[0]) < 0.06;
      out.push({ from: [x, y], isEigenLike });
    }
    return out;
  }, [v1, v2]);

  // Largest reach we'll ever need (for viewport).
  const maxReach = useMemo(() => {
    const reach1 = Math.abs(lambda1);
    const reach2 = Math.abs(lambda2);
    return Math.max(1, reach1, reach2) + 0.4;
  }, [lambda1, lambda2]);

  const view = useMemo(
    () => ({
      x: [-maxReach, maxReach] as [number, number],
      y: [-maxReach, maxReach] as [number, number],
    }),
    [maxReach],
  );

  const height = useMafsHeight(420);

  const formulaEmphasize = useMemo(
    () => ({
      2: ["A\\mathbf{v}", "\\mathbf{v}"],
      3: ["lambda_1", "lambda_2"],
      4: ["lambda"],
    }),
    [],
  );

  return (
    <MathScene
      id={id}
      phases={PHASES}
      formulaSteps={formulaSteps}
      formulaEmphasize={formulaEmphasize}
      accent="violet"
      renderFigure={({ phaseIdx, phaseProgress, hasReducedMotion }) => (
        <ZoomableMafs viewBox={view} height={height}>
          <SmartAxes />
          <SceneFigure
            A={A}
            v1={v1}
            v2={v2}
            lambda1={lambda1}
            lambda2={lambda2}
            fan={fan}
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
  A: number[][];
  v1: [number, number];
  v2: [number, number];
  lambda1: number;
  lambda2: number;
  fan: { from: [number, number]; isEigenLike: boolean }[];
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

function applyMatrix(
  A: number[][],
  v: [number, number],
): [number, number] {
  return [
    A[0][0] * v[0] + A[0][1] * v[1],
    A[1][0] * v[0] + A[1][1] * v[1],
  ];
}

function SceneFigure({
  A,
  v1,
  v2,
  lambda1,
  lambda2,
  fan,
  phaseIdx,
  phaseProgress,
  reduced,
}: FigureProps) {
  const eff = (t: number) => (reduced ? 1 : t);

  // Phase 1: morph t for the fan from identity to A.
  // We want most of the visual stretch to happen in phase 1; phases 2-4
  // can hold the "after" state and add layers (eigen lines, λ labels).
  const fanMorphT =
    phaseIdx === 0
      ? 0
      : phaseIdx === 1
        ? eff(easeInOutCubic(phaseProgress))
        : 1;

  // Eigen-line emphasis appears in phase 2.
  const eigenLineT =
    phaseIdx < 2
      ? 0
      : phaseIdx === 2
        ? eff(easeOutCubic(phaseProgress))
        : 1;

  // λ-label appearance in phase 3.
  const lambdaLabelT =
    phaseIdx < 3
      ? 0
      : phaseIdx === 3
        ? eff(easeOutCubic(phaseProgress))
        : 1;

  // Build every fan vector's current tip via lerp(start, A·start, t).
  // In phase 0 we render the unit circle as a faint outline.
  const showCircle = phaseIdx <= 1;

  // Eigenvector arrows — always rendered, but their full λ stretch only
  // engages from phase 2 onward (matches the rest of the fan).
  const v1Tip: [number, number] = lerp2(v1, [v1[0] * lambda1, v1[1] * lambda1], fanMorphT);
  const v2Tip: [number, number] = lerp2(v2, [v2[0] * lambda2, v2[1] * lambda2], fanMorphT);

  // Eigen-lines extend beyond the eigenvector tips so we can show "stays on
  // the line" — sits behind the arrow as a soft rail.
  const eigenLine1 = useMemo(() => {
    const reach = Math.max(1.2, Math.abs(lambda1) + 0.4);
    return [
      [-v1[0] * reach, -v1[1] * reach],
      [v1[0] * reach, v1[1] * reach],
    ] as [[number, number], [number, number]];
  }, [v1, lambda1]);

  const eigenLine2 = useMemo(() => {
    const reach = Math.max(1.2, Math.abs(lambda2) + 0.4);
    return [
      [-v2[0] * reach, -v2[1] * reach],
      [v2[0] * reach, v2[1] * reach],
    ] as [[number, number], [number, number]];
  }, [v2, lambda2]);

  return (
    <>
      {/* Faint reference unit circle, drawn as a polygon for cheap fidelity. */}
      {showCircle && (
        <Polygon
          points={Array.from({ length: 80 }).map((_, i) => {
            const a = (i / 80) * Math.PI * 2;
            return [Math.cos(a), Math.sin(a)] as [number, number];
          })}
          color={SLATE}
          fillOpacity={0.04}
          strokeOpacity={0.45}
          weight={1.5}
        />
      )}

      {/* Fan of test vectors — most of them rotate; eigen-aligned ones stay put. */}
      {fan.map((f, i) => {
        if (f.isEigenLike) return null;
        const target = applyMatrix(A, f.from);
        const tip = lerp2(f.from, target, fanMorphT);
        // Color: dim grey as they morph; subtle highlight at high stretch.
        return (
          <Vector
            key={`fan-${i}`}
            tip={tip}
            color="#94A3B8"
            opacity={lerp(0.7, 0.45, fanMorphT)}
            weight={1.3}
          />
        );
      })}

      {/* Eigen-rails — emphasised in phase 2 onward. */}
      {eigenLineT > 0 && (
        <>
          <Line.Segment
            point1={eigenLine1[0]}
            point2={eigenLine1[1]}
            color={EMERALD}
            opacity={0.35 * eigenLineT}
            style="dashed"
            weight={1.5}
          />
          <Line.Segment
            point1={eigenLine2[0]}
            point2={eigenLine2[1]}
            color={AMBER}
            opacity={0.35 * eigenLineT}
            style="dashed"
            weight={1.5}
          />
        </>
      )}

      {/* The two eigenvectors — they stretch with λ but never leave their line. */}
      <Vector tip={v1Tip} color={EMERALD} weight={3.2} />
      <Vector tip={v2Tip} color={AMBER} weight={3.2} />

      <Text x={v1Tip[0]} y={v1Tip[1]} attach="ne" attachDistance={14} color={EMERALD} size={14}>
        v₁
      </Text>
      <Text x={v2Tip[0]} y={v2Tip[1]} attach="ne" attachDistance={14} color={AMBER} size={14}>
        v₂
      </Text>

      {/* λ labels and pulsing tip points appear in phase 3. */}
      {lambdaLabelT > 0 && (
        <>
          <Point
            x={v1Tip[0]}
            y={v1Tip[1]}
            color={EMERALD}
            opacity={lambdaLabelT}
            svgCircleProps={{
              r: 5,
              style: { filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))" },
            }}
          />
          <Point
            x={v2Tip[0]}
            y={v2Tip[1]}
            color={AMBER}
            opacity={lambdaLabelT}
            svgCircleProps={{
              r: 5,
              style: { filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))" },
            }}
          />
          <Text
            x={v1Tip[0] * 1.15}
            y={v1Tip[1] * 1.15}
            attach="ne"
            attachDistance={4}
            color={EMERALD}
            size={13}
          >
            {`λ₁ = ${formatLambda(lambda1)}`}
          </Text>
          <Text
            x={v2Tip[0] * 1.15}
            y={v2Tip[1] * 1.15}
            attach="ne"
            attachDistance={4}
            color={AMBER}
            size={13}
          >
            {`λ₂ = ${formatLambda(lambda2)}`}
          </Text>
        </>
      )}

      {/* Phase 4 — origin marker pulses with rose to anchor the equation. */}
      {phaseIdx >= 4 && (
        <Point
          x={0}
          y={0}
          color={ROSE}
          opacity={0.85}
          svgCircleProps={{
            r: 3.5,
          }}
        />
      )}
    </>
  );
}

function formatLambda(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2);
}
