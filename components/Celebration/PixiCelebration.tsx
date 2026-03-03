"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Application, useApplication, useTick, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import type { ParticleData, CelebrationPreset } from "@/components/pixi/types";
import {
  getPresetBursts,
  generateParticles,
  type BurstConfig,
} from "./particle-presets";
import { isWebGLAvailable } from "@/components/pixi/webgl-detect";
import styles from "./PixiCelebration.module.css";

extend({ Container, Graphics });

// ---- Particle renderer (inside Application) ----

function drawShape(
  g: import("pixi.js").Graphics,
  p: ParticleData,
) {
  g.clear();

  const { shape, size, color, alpha } = p;
  const halfSize = size / 2;

  switch (shape) {
    case "circle":
      g.circle(0, 0, halfSize).fill({ color, alpha });
      break;
    case "square":
      g.rect(-halfSize, -halfSize, size, size).fill({ color, alpha });
      break;
    case "star": {
      const points: number[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? halfSize : halfSize * 0.4;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        points.push(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      g.poly(points).fill({ color, alpha });
      break;
    }
    case "braces":
      g.rect(-halfSize, -halfSize, size * 0.3, size).fill({ color, alpha });
      g.rect(halfSize * 0.4, -halfSize, size * 0.3, size).fill({ color, alpha });
      break;
    case "tags":
      g.rect(-halfSize, -size * 0.15, size * 0.4, size * 0.3).fill({ color, alpha });
      g.rect(halfSize * 0.2, -size * 0.15, size * 0.4, size * 0.3).fill({ color, alpha });
      break;
  }
}

interface ParticleSystemProps {
  bursts: BurstConfig[];
  onComplete: () => void;
}

function ParticleSystem({ bursts, onComplete }: ParticleSystemProps) {
  const app = useApplication();
  const particlesRef = useRef<ParticleData[]>([]);
  const graphicsRef = useRef<import("pixi.js").Graphics[]>([]);
  const startTimeRef = useRef(Date.now());
  const firedBurstsRef = useRef(new Set<number>());

  // Spawn bursts based on their delay
  useEffect(() => {
    startTimeRef.current = Date.now();
    firedBurstsRef.current.clear();
    particlesRef.current = [];

    return () => {
      // Cleanup graphics
      graphicsRef.current.forEach((g) => {
        g.destroy();
      });
      graphicsRef.current = [];
    };
  }, [bursts]);

  useTick(() => {
    const elapsed = Date.now() - startTimeRef.current;

    // Fire any pending bursts
    bursts.forEach((burst, idx) => {
      if (!firedBurstsRef.current.has(idx) && elapsed >= burst.delay) {
        firedBurstsRef.current.add(idx);
        const newParticles = generateParticles(burst);
        particlesRef.current.push(...newParticles);

        // Create graphics objects for new particles
        const stage = app.app?.stage;
        if (stage) {
          newParticles.forEach(() => {
            const g = new Graphics();
            stage.addChild(g);
            graphicsRef.current.push(g);
          });
        }
      }
    });

    // Update particle physics
    const particles = particlesRef.current;
    const graphics = graphicsRef.current;

    let aliveCount = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0 || p.scale <= 0) {
        if (graphics[i]) graphics[i].visible = false;
        continue;
      }

      aliveCount++;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.alphaDecay;
      p.scale -= p.scaleDecay;

      if (p.alpha < 0) p.alpha = 0;
      if (p.scale < 0) p.scale = 0;

      const g = graphics[i];
      if (g) {
        g.position.set(p.x, p.y);
        g.rotation = p.rotation;
        g.scale.set(p.scale);
        drawShape(g, p);
      }
    }

    // All bursts fired and no alive particles → done
    if (
      firedBurstsRef.current.size === bursts.length &&
      aliveCount === 0 &&
      particles.length > 0
    ) {
      onComplete();
    }
  });

  return null;
}

// ---- Public overlay component ----

export interface PixiCelebrationProps {
  preset: CelebrationPreset;
  active: boolean;
  streakCount?: number;
  onComplete?: () => void;
}

export function PixiCelebration({
  preset,
  active,
  streakCount,
  onComplete,
}: PixiCelebrationProps) {
  const [mounted, setMounted] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (active) {
      setShowCanvas(true);
    }
  }, [active]);

  const handleComplete = useCallback(() => {
    setShowCanvas(false);
    onComplete?.();
  }, [onComplete]);

  if (!mounted || !showCanvas) return null;

  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  const bursts = getPresetBursts(preset, w, h, streakCount);

  return createPortal(
    <div className={styles.overlay}>
      <Application
        width={w}
        height={h}
        backgroundAlpha={0}
        antialias
      >
        <ParticleSystem bursts={bursts} onComplete={handleComplete} />
      </Application>
    </div>,
    document.body
  );
}
