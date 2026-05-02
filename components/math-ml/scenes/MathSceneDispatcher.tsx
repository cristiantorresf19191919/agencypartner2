"use client";

import React from "react";
import LinearSystemScene from "./LinearSystemScene";
import MatrixTransformScene from "./MatrixTransformScene";
import EigenStretchScene from "./EigenStretchScene";
import DotProductScene from "./DotProductScene";
import ProjectionScene from "./ProjectionScene";
import GradientDescentScene from "./GradientDescentScene";
import GaussianScene from "./GaussianScene";
import NormBallsScene from "./NormBallsScene";
import ChainRuleScene from "./ChainRuleScene";
import TaylorScene from "./TaylorScene";

export type MathSceneKind =
  | "linear-system"
  | "matrix-transform"
  | "eigen-stretch"
  | "dot-product"
  | "projection"
  | "gradient-descent"
  | "gaussian"
  | "norm-balls"
  | "chain-rule"
  | "taylor";

interface DispatcherProps {
  config: Record<string, unknown>;
}

/**
 * Single entry-point that the renderer's VIZ_MAP wires up. Reads `config.kind`
 * and forwards the rest of `config` to the chosen curated scene. Keeps the
 * `MMLVizType` union short — one type covers the whole scene library.
 */
export default function MathSceneDispatcher({ config }: DispatcherProps) {
  const kind = (config?.kind as MathSceneKind) ?? "linear-system";
  // The id flows from lesson data; if missing, we synthesize one from the kind
  // so deep-linking still works for default-configured scenes.
  const id = (config?.id as string | undefined) ?? `default-${kind}`;

  switch (kind) {
    case "linear-system":
      return (
        <LinearSystemScene
          id={id}
          line1={config.line1 as { a: number; b: number; c: number } | undefined}
          line2={config.line2 as { a: number; b: number; c: number } | undefined}
          viewBox={
            config.viewBox as
              | { x: [number, number]; y: [number, number] }
              | undefined
          }
        />
      );
    case "matrix-transform":
      return (
        <MatrixTransformScene
          id={id}
          matrix={config.matrix as number[][] | undefined}
        />
      );
    case "eigen-stretch":
      return (
        <EigenStretchScene
          id={id}
          matrix={config.matrix as number[][] | undefined}
        />
      );
    case "dot-product":
      return (
        <DotProductScene
          id={id}
          a={config.a as [number, number] | undefined}
          b={config.b as [number, number] | undefined}
        />
      );
    case "projection":
      return (
        <ProjectionScene
          id={id}
          v={config.v as [number, number] | undefined}
          u={config.u as [number, number] | undefined}
        />
      );
    case "gradient-descent":
      return (
        <GradientDescentScene
          id={id}
          ax={config.ax as number | undefined}
          ay={config.ay as number | undefined}
          start={config.start as [number, number] | undefined}
          alpha={config.alpha as number | undefined}
          steps={config.steps as number | undefined}
        />
      );
    case "gaussian":
      return (
        <GaussianScene
          id={id}
          mu={config.mu as number | undefined}
          sigma={config.sigma as number | undefined}
        />
      );
    case "norm-balls":
      return (
        <NormBallsScene
          id={id}
          resolution={config.resolution as number | undefined}
        />
      );
    case "chain-rule":
      return (
        <ChainRuleScene
          id={id}
          sampleX={config.sampleX as number | undefined}
        />
      );
    case "taylor":
      return (
        <TaylorScene
          id={id}
          center={config.center as number | undefined}
        />
      );
    default: {
      // Exhaustiveness check — TypeScript will complain here if a new
      // MathSceneKind is added without a matching case.
      const _exhaustive: never = kind;
      void _exhaustive;
      return null;
    }
  }
}
