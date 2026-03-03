"use client";

import dynamic from "next/dynamic";
import type { CelebrationState } from "./useCelebration";

const PixiCelebration = dynamic(
  () =>
    import("./PixiCelebration").then((mod) => ({
      default: mod.PixiCelebration,
    })),
  { ssr: false }
);

interface CelebrationOverlayProps {
  celebration: CelebrationState;
  onComplete: () => void;
}

export function CelebrationOverlay({
  celebration,
  onComplete,
}: CelebrationOverlayProps) {
  return (
    <PixiCelebration
      preset={celebration.preset}
      active={celebration.active}
      streakCount={celebration.streakCount}
      onComplete={onComplete}
    />
  );
}
