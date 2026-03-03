"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

// BST: [value, cx_ratio, cy_ratio, parentIndex]
const NODES: [number, number, number, number | null][] = [
  [8, 0.5, 0.15, null],
  [4, 0.27, 0.42, 0],
  [12, 0.73, 0.42, 0],
  [2, 0.14, 0.7, 1],
  [6, 0.4, 0.7, 1],
  [10, 0.6, 0.7, 2],
  [14, 0.86, 0.7, 2],
];

export function PixiTree({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    // Draw edges first
    NODES.forEach(([, cxR, cyR, parentIdx], i) => {
      if (parentIdx === null) return;
      const p = animProgress(frameRef.current, animStartRef.current + i * 6, 25);
      if (p < 0.3) return;
      const [, pcxR, pcyR] = NODES[parentIdx];
      g.moveTo(pcxR * width, pcyR * height);
      g.lineTo(cxR * width, cyR * height);
      g.stroke({ width: 1.5, color: theme.accent, alpha: 0.5 * p });
    });

    // Draw nodes
    NODES.forEach(([, cxR, cyR], i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 6, 30));
      const isHl = highlighted.includes(i);
      const cx = cxR * width;
      const cy = cyR * height;

      g.circle(cx, cy, r * p);
      g.fill({ color: theme.accent, alpha: isHl ? 0.35 : 0.15 });
      g.stroke({ width: 1.5, color: theme.accent, alpha: isHl ? 1 : 0.6 });

      if (p > 0.5) {
        g.circle(cx, cy, 3).fill({ color: theme.text, alpha: 0.8 });
      }
    });
  });

  return null;
}
