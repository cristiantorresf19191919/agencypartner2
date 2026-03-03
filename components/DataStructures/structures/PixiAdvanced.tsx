"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

// Union-Find: 3 sets with 2 children each
// [cx_ratio, cy_ratio, parentIndex]
const ROOTS: [number, number][] = [
  [0.18, 0.22],
  [0.5, 0.22],
  [0.82, 0.22],
];

const CHILDREN: [number, number, number][] = [
  // root 0 children
  [0.1, 0.65, 0],
  [0.26, 0.65, 0],
  // root 1 children
  [0.42, 0.65, 1],
  [0.58, 0.65, 1],
  // root 2 children
  [0.74, 0.65, 2],
  [0.9, 0.65, 2],
];

export function PixiAdvanced({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    const rootR = 18;
    const childR = 14;
    const color = 0xe11d48; // rose

    // Edges from children to roots
    CHILDREN.forEach(([cxR, cyR, rootIdx], i) => {
      const p = animProgress(frameRef.current, animStartRef.current + (i + 3) * 5, 25);
      if (p < 0.3) return;
      const [rxR, ryR] = ROOTS[rootIdx];
      g.moveTo(rxR * width, ryR * height + rootR);
      g.lineTo(cxR * width, cyR * height - childR);
      g.stroke({ width: 1, color, alpha: 0.35 * p });
    });

    // Root nodes
    ROOTS.forEach(([cxR, cyR], i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 6, 30));
      const isHl = highlighted.includes(i);
      const cx = cxR * width;
      const cy = cyR * height;

      g.circle(cx, cy, rootR * p);
      g.fill({ color, alpha: isHl ? 0.3 : 0.15 });
      g.stroke({ width: 1.5, color, alpha: isHl ? 1 : 0.6 });

      if (p > 0.5) {
        g.circle(cx, cy, 3).fill({ color: theme.text, alpha: 0.8 });
      }
    });

    // Child nodes
    CHILDREN.forEach(([cxR, cyR], i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + (i + 3) * 5, 25));
      const isHl = highlighted.includes(i + ROOTS.length);
      const cx = cxR * width;
      const cy = cyR * height;

      g.circle(cx, cy, childR * p);
      g.fill({ color, alpha: isHl ? 0.2 : 0.08 });
      g.stroke({ width: 1, color, alpha: isHl ? 0.8 : 0.35 });

      if (p > 0.5) {
        g.circle(cx, cy, 2).fill({ color: theme.textMuted, alpha: 0.6 });
      }
    });
  });

  return null;
}
