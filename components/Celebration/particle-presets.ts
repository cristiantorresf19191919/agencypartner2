import type { CelebrationPreset, ParticleData } from "@/components/pixi/types";

const CELEBRATION_COLORS = [
  0x22c55e, 0xeab308, 0x3b82f6, 0xa855f7, 0xec4899, 0x61dafb,
];

const REACTOR_COLORS = [0x4caf50, 0x8bc34a, 0xcddc39, 0xffeb3b, 0xff9800];

const SHAPES: ParticleData["shape"][] = [
  "circle",
  "star",
  "square",
  "braces",
  "tags",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticle(
  originX: number,
  originY: number,
  colors: number[],
  spread: number,
  velocityScale = 1
): ParticleData {
  const angle = randomBetween(-Math.PI / 2 - spread, -Math.PI / 2 + spread);
  const speed = randomBetween(4, 12) * velocityScale;
  return {
    x: originX,
    y: originY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.15, 0.15),
    scale: randomBetween(0.5, 1.2),
    scaleDecay: randomBetween(0.005, 0.012),
    alpha: 1,
    alphaDecay: randomBetween(0.008, 0.016),
    gravity: randomBetween(0.08, 0.15),
    color: randomFrom(colors),
    shape: randomFrom(SHAPES),
    size: randomBetween(6, 14),
  };
}

export interface BurstConfig {
  /** Delay in ms before this burst fires */
  delay: number;
  count: number;
  originX: number;
  originY: number;
  colors: number[];
  spread: number;
  velocityScale?: number;
}

export function getPresetBursts(
  preset: CelebrationPreset,
  canvasWidth: number,
  canvasHeight: number,
  streakCount?: number
): BurstConfig[] {
  const cx = canvasWidth / 2;
  const cy = canvasHeight * 0.6;

  switch (preset) {
    case "simple":
      return [
        {
          delay: 0,
          count: 120,
          originX: cx,
          originY: cy,
          colors: CELEBRATION_COLORS,
          spread: 1.0,
        },
      ];

    case "multi-burst":
      return [
        {
          delay: 0,
          count: 150,
          originX: cx,
          originY: cy,
          colors: CELEBRATION_COLORS,
          spread: 1.2,
        },
        {
          delay: 300,
          count: 80,
          originX: canvasWidth * 0.3,
          originY: canvasHeight * 0.5,
          colors: CELEBRATION_COLORS,
          spread: 0.8,
        },
        {
          delay: 500,
          count: 80,
          originX: canvasWidth * 0.7,
          originY: canvasHeight * 0.5,
          colors: CELEBRATION_COLORS,
          spread: 0.8,
        },
      ];

    case "reactor": {
      const bursts: BurstConfig[] = [];
      // Continuous side bursts over 2 seconds
      for (let t = 0; t < 2000; t += 66) {
        bursts.push({
          delay: t,
          count: 3,
          originX: 0,
          originY: cy,
          colors: REACTOR_COLORS,
          spread: 0.6,
          velocityScale: 1.2,
        });
        bursts.push({
          delay: t,
          count: 3,
          originX: canvasWidth,
          originY: cy,
          colors: REACTOR_COLORS,
          spread: 0.6,
          velocityScale: 1.2,
        });
      }
      // Big center burst after 300ms
      bursts.push({
        delay: 300,
        count: 150,
        originX: cx,
        originY: cy,
        colors: REACTOR_COLORS,
        spread: 1.2,
      });
      return bursts;
    }

    case "streak": {
      const intensity = Math.min(streakCount ?? 1, 10);
      const count = 60 + intensity * 20;
      return [
        {
          delay: 0,
          count,
          originX: cx,
          originY: cy,
          colors: CELEBRATION_COLORS,
          spread: 0.8 + intensity * 0.05,
          velocityScale: 0.8 + intensity * 0.1,
        },
      ];
    }
  }
}

export function generateParticles(burst: BurstConfig): ParticleData[] {
  const particles: ParticleData[] = [];
  for (let i = 0; i < burst.count; i++) {
    particles.push(
      createParticle(
        burst.originX,
        burst.originY,
        burst.colors,
        burst.spread,
        burst.velocityScale
      )
    );
  }
  return particles;
}
