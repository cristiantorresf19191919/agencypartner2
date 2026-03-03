"use client";

import { useCallback, useRef, useState } from "react";
import type { CelebrationPreset } from "@/components/pixi/types";
import { isWebGLAvailable } from "@/components/pixi/webgl-detect";

export interface CelebrationState {
  active: boolean;
  preset: CelebrationPreset;
  streakCount?: number;
}

export interface UseCelebrationReturn {
  /** Current celebration state — pass to <CelebrationOverlay /> */
  celebration: CelebrationState;
  /** Fire a celebration. Falls back to canvas-confetti if WebGL unavailable. */
  celebrate: (preset?: CelebrationPreset, streakCount?: number) => void;
  /** Called when the PixiJS animation finishes */
  onComplete: () => void;
}

async function fallbackConfetti(preset: CelebrationPreset) {
  try {
    const { default: confetti } = await import("canvas-confetti");
    switch (preset) {
      case "simple":
      case "streak":
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        break;
      case "multi-burst":
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        setTimeout(
          () =>
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.5, x: 0.3 },
            }),
          300
        );
        setTimeout(
          () =>
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.5, x: 0.7 },
            }),
          500
        );
        break;
      case "reactor": {
        const colors = ["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ff9800"];
        const end = Date.now() + 2000;
        (function frame() {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors,
          });
        }, 300);
        break;
      }
    }
  } catch {
    // canvas-confetti not available — silently fail
  }
}

export function useCelebration(): UseCelebrationReturn {
  const [celebration, setCelebration] = useState<CelebrationState>({
    active: false,
    preset: "simple",
  });
  const webglCheckedRef = useRef<boolean | null>(null);

  const celebrate = useCallback(
    (preset: CelebrationPreset = "simple", streakCount?: number) => {
      if (webglCheckedRef.current === null) {
        webglCheckedRef.current = isWebGLAvailable();
      }

      if (!webglCheckedRef.current) {
        fallbackConfetti(preset);
        return;
      }

      setCelebration({ active: true, preset, streakCount });
    },
    []
  );

  const onComplete = useCallback(() => {
    setCelebration((prev) => ({ ...prev, active: false }));
  }, []);

  return { celebration, celebrate, onComplete };
}
