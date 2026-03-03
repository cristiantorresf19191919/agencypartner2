"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

// [cx_ratio, cy_ratio]
const VERTICES: [number, number][] = [
  [0.17, 0.2],  // A
  [0.23, 0.6],  // B
  [0.6, 0.75],  // C
  [0.83, 0.27], // D
  [0.5, 0.2],   // E
];

// [from, to]
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 1], [4, 2],
];

export function PixiGraph({ width, height, highlighted, animationKey }: DSRendererProps) {
  const app = useApplication();
  const theme = usePixiTheme();
  const gRef = useRef<Graphics | null>(null);
  const frameRef = useRef(0);
  const animStartRef = useRef(0);

  useEffect(() => {
    const stage = app.app?.stage;
    if (!stage) return;
    const g = new Graphics();
    stage.addChild(g);
    gRef.current = g;
    return () => { g.destroy(); gRef.current = null; };
  }, [app.app]);

  useEffect(() => { animStartRef.current = frameRef.current; }, [animationKey]);

  useTick((ticker) => {
    frameRef.current += ticker.deltaTime;
    const g = gRef.current;
    if (!g) return;
    g.clear();

    const r = 18;

    // Edges
    EDGES.forEach(([from, to], i) => {
      const p = animProgress(frameRef.current, animStartRef.current + i * 4, 20);
      if (p < 0.2) return;
      const [fxR, fyR] = VERTICES[from];
      const [txR, tyR] = VERTICES[to];
      g.moveTo(fxR * width, fyR * height);
      g.lineTo(txR * width, tyR * height);
      g.stroke({ width: 1.5, color: theme.secondary, alpha: 0.35 * p });
    });

    // Vertices
    VERTICES.forEach(([cxR, cyR], i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 6, 30));
      const isHl = highlighted.includes(i);
      const cx = cxR * width;
      const cy = cyR * height;

      g.circle(cx, cy, r * p);
      g.fill({ color: theme.secondary, alpha: isHl ? 0.35 : 0.15 });
      g.stroke({ width: 1.5, color: theme.secondary, alpha: isHl ? 1 : 0.6 });

      if (p > 0.5) {
        g.circle(cx, cy, 3).fill({ color: theme.text, alpha: 0.8 });
      }
    });
  });

  return null;
}
