"use client";

import React, { useMemo } from "react";
import { Polygon, Vector, Text } from "mafs";
import "mafs/core.css";
import { useMafsHeight } from "../primitives/MafsStage";
import { ZoomableMafs } from "../primitives/ZoomableMafs";
import { SmartAxes, fitContent } from "../primitives/SmartAxes";
import { MathScene, type MathScenePhase } from "./MathScene";
import { easeInOutCubic, lerp, lerp2 } from "./easing";

const EMERALD = "#10B981";
const AMBER = "#FBBF24";
const BLUE = "#60A5FA";

interface MatrixTransformSceneProps {
  /** 2x2 matrix the scene transforms the basis into. */
  matrix?: number[][];
  /** Stable id for URL-hash bookmarking. */
  id?: string;
}

const PHASES: MathScenePhase[] = [
  {
    duration: 1700,
    label: "Standard basis",
    labelEs: "Base canónica",
    caption: {
      text: "Start with e₁ and e₂ — the columns of the identity matrix.",
      textEs: "Empieza con e₁ y e₂ — las columnas de la matriz identidad.",
    },
    formulaStep: 0,
  },
  {
    duration: 2000,
    label: "Read A column-by-column",
    labelEs: "Lee A columna a columna",
    caption: {
      text: "Each column of A is a target — where that basis vector lands.",
      textEs:
        "Cada columna de A es un destino — dónde cae ese vector base.",
    },
    formulaStep: 1,
  },
  {
    duration: 2400,
    label: "Move e₁",
    labelEs: "Mueve e₁",
    caption: {
      text: "e₁ slides to the first column of A.",
      textEs: "e₁ se desliza a la primera columna de A.",
    },
    formulaStep: 2,
  },
  {
    duration: 2400,
    label: "Move e₂",
    labelEs: "Mueve e₂",
    caption: {
      text: "e₂ slides to the second column of A.",
      textEs: "e₂ se desliza a la segunda columna de A.",
    },
    formulaStep: 3,
  },
  {
    duration: 2400,
    label: "The whole grid follows",
    labelEs: "La cuadrícula entera sigue",
    caption: {
      text: "Linearity carries the unit square along — the parallelogram is its image.",
      textEs:
        "La linealidad arrastra el cuadrado unidad — el paralelogramo es su imagen.",
    },
    formulaStep: 4,
  },
  {
    duration: 2400,
    label: "det A = signed area",
    labelEs: "det A = área con signo",
    caption: {
      text: "The parallelogram's signed area is exactly det(A).",
      textEs: "El área con signo del paralelogramo es exactamente det(A).",
    },
    formulaStep: 5,
  },
];

export default function MatrixTransformScene({
  matrix,
  id,
}: MatrixTransformSceneProps) {
  const A = matrix ?? [
    [2, 1],
    [1, 2],
  ];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];

  const formulaSteps = useMemo(() => {
    const a = A[0][0];
    const b = A[0][1];
    const c = A[1][0];
    const d = A[1][1];
    return [
      // 0 — Identity
      `I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}`,
      // 1 — A laid out, columns highlighted
      `A = \\begin{bmatrix} \\color{#34D399}{${a}} & \\color{#FBBF24}{${b}} \\\\ \\color{#34D399}{${c}} & \\color{#FBBF24}{${d}} \\end{bmatrix}`,
      // 2 — A e1 = first column
      `A\\,\\mathbf{e}_1 = \\begin{bmatrix} \\color{#34D399}{${a}} \\\\ \\color{#34D399}{${c}} \\end{bmatrix}`,
      // 3 — A e2 = second column
      `A\\,\\mathbf{e}_2 = \\begin{bmatrix} \\color{#FBBF24}{${b}} \\\\ \\color{#FBBF24}{${d}} \\end{bmatrix}`,
      // 4 — A applied to a generic x
      `A\\,\\mathbf{x} = x_1 \\begin{bmatrix} ${a} \\\\ ${c} \\end{bmatrix} + x_2 \\begin{bmatrix} ${b} \\\\ ${d} \\end{bmatrix}`,
      // 5 — determinant
      `\\det A = ${a}\\cdot ${d} - ${b}\\cdot ${c} = ${det}`,
    ];
  }, [A, det]);

  // Auto-fit viewport to contain origin, identity basis, and A's columns.
  const view = useMemo(() => {
    const corners = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: A[0][0], y: A[1][0] },
      { x: A[0][1], y: A[1][1] },
      { x: A[0][0] + A[0][1], y: A[1][0] + A[1][1] },
    ];
    return fitContent(corners, {
      padding: 0.25,
      minHalfSpanX: 1.6,
      minHalfSpanY: 1.6,
      centerOnZero: true,
    });
  }, [A]);

  const height = useMafsHeight(380);

  const formulaEmphasize = useMemo(
    () => ({
      2: ["mathbf{e}_1"],
      3: ["mathbf{e}_2"],
      5: [`${det}`],
    }),
    [det],
  );

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
            A={A}
            det={det}
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
  det: number;
  phaseIdx: number;
  phaseProgress: number;
  reduced: boolean;
}

/**
 * Drives a smooth identity → A morph in two halves, then surfaces the determinant.
 * Phases 0..1 keep the identity; phase 2 morphs e1; phase 3 morphs e2; phase 4
 * shows the unit square parallelogram fully; phase 5 highlights det.
 */
function SceneFigure({ A, det, phaseIdx, phaseProgress, reduced }: FigureProps) {
  // Per-phase eased progress for each basis vector. Vectors morph
  // independently — e1 in phase 2, e2 in phase 3 — so the eye can follow each.
  const eff = (t: number) => (reduced ? 1 : t);

  const aCol1: [number, number] = [A[0][0], A[1][0]];
  const aCol2: [number, number] = [A[0][1], A[1][1]];

  const e1T =
    phaseIdx < 2
      ? 0
      : phaseIdx === 2
        ? eff(easeInOutCubic(phaseProgress))
        : 1;

  const e2T =
    phaseIdx < 3
      ? 0
      : phaseIdx === 3
        ? eff(easeInOutCubic(phaseProgress))
        : 1;

  const e1: [number, number] = lerp2([1, 0], aCol1, e1T);
  const e2: [number, number] = lerp2([0, 1], aCol2, e2T);

  // Parallelogram derived from current basis.
  const parallelogram: [number, number][] = [
    [0, 0],
    e1,
    [e1[0] + e2[0], e1[1] + e2[1]],
    e2,
  ];

  // The unit square always renders as a faint reference outline.
  const showFinalSquare = phaseIdx >= 4;
  const determinantHighlight =
    phaseIdx >= 5 ? eff(easeInOutCubic(phaseProgress)) : 0;

  // Phase 0 — show only the identity outline; phase 1 onward shows both
  // the original square and the (currently morphing) parallelogram.
  return (
    <>
      {/* Reference unit square — always visible after the intro tick. */}
      <Polygon
        points={[
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ]}
        color={BLUE}
        fillOpacity={phaseIdx >= 1 ? 0.05 : 0.1}
        strokeOpacity={phaseIdx >= 1 ? 0.32 : 0.55}
        weight={phaseIdx >= 1 ? 1.5 : 2.2}
      />

      {/* Live parallelogram — the determinant tint scales with phase 5. */}
      {phaseIdx >= 2 && (
        <Polygon
          points={parallelogram}
          color={EMERALD}
          fillOpacity={lerp(0.18, 0.32, determinantHighlight)}
          strokeOpacity={1}
          weight={2.5}
        />
      )}

      {/* Basis vectors — emerald e1 + amber e2. */}
      <Vector tip={e1} color={EMERALD} weight={3} />
      <Vector tip={e2} color={AMBER} weight={3} />

      {/* Labels — e1 / e2 follow the tips. */}
      <Text x={e1[0]} y={e1[1]} attach="ne" attachDistance={14} color={EMERALD} size={14}>
        {phaseIdx >= 2 && e1T >= 1 ? "Ae₁" : "e₁"}
      </Text>
      <Text x={e2[0]} y={e2[1]} attach="ne" attachDistance={14} color={AMBER} size={14}>
        {phaseIdx >= 3 && e2T >= 1 ? "Ae₂" : "e₂"}
      </Text>

      {/* det readout floats at parallelogram centroid in phase 5. */}
      {phaseIdx >= 5 && (
        <Text
          x={(e1[0] + e2[0]) / 2}
          y={(e1[1] + e2[1]) / 2}
          attach="n"
          attachDistance={2}
          color="#FFFFFF"
          size={15}
        >
          {`det = ${det}`}
        </Text>
      )}

      {/* Origin pin — gentle anchor. */}
      <Vector
        tip={[0.0001, 0.0001]}
        tail={[0, 0]}
        color="#94A3B8"
        opacity={0.5}
        weight={1}
      />
      {showFinalSquare && null /* final square is the reference one above */}
    </>
  );
}
