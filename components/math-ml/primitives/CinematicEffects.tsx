"use client";

import React, { Suspense, lazy } from "react";

type Preset = "soft" | "bold" | "flagship";

interface Props {
  preset?: Preset;
}

const Effects = lazy(async () => {
  const mod = await import("@react-three/postprocessing");
  const { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } = mod;
  const pp = await import("postprocessing");
  const { BlendFunction } = pp;

  const Inner: React.FC<Props> = ({ preset = "bold" }) => {
    const config = (() => {
      switch (preset) {
        case "soft":
          return {
            bloomIntensity: 0.55,
            bloomThreshold: 0.62,
            bloomSmoothing: 0.22,
            vignetteOffset: 0.4,
            vignetteDarkness: 0.55,
            noiseOpacity: 0.035,
            caOffset: [0.0006, 0.0006] as [number, number],
          };
        case "flagship":
          return {
            bloomIntensity: 1.15,
            bloomThreshold: 0.48,
            bloomSmoothing: 0.3,
            vignetteOffset: 0.32,
            vignetteDarkness: 0.7,
            noiseOpacity: 0.045,
            caOffset: [0.0011, 0.0011] as [number, number],
          };
        case "bold":
        default:
          return {
            bloomIntensity: 0.85,
            bloomThreshold: 0.55,
            bloomSmoothing: 0.25,
            vignetteOffset: 0.35,
            vignetteDarkness: 0.62,
            noiseOpacity: 0.04,
            caOffset: [0.0008, 0.0008] as [number, number],
          };
      }
    })();

    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={config.bloomIntensity}
          luminanceThreshold={config.bloomThreshold}
          luminanceSmoothing={config.bloomSmoothing}
          mipmapBlur={false}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={config.caOffset}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette
          offset={config.vignetteOffset}
          darkness={config.vignetteDarkness}
          eskil={false}
        />
        <Noise premultiply opacity={config.noiseOpacity} />
      </EffectComposer>
    );
  };

  return { default: Inner };
});

export function CinematicEffects({ preset = "bold" }: Props) {
  return (
    <Suspense fallback={null}>
      <Effects preset={preset} />
    </Suspense>
  );
}

export default CinematicEffects;
