"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

// Trie nodes: [cx_ratio, cy_ratio, parentIndex, isRoot]
const NODES: [number, number, number | null, boolean][] = [
  [0.5, 0.1, null, true],    // root
  [0.27, 0.35, 0, false],    // c
  [0.73, 0.35, 0, false],    // d
  [0.16, 0.6, 1, false],     // a
  [0.38, 0.6, 1, false],     // o
  [0.73, 0.6, 2, false],     // o
  [0.16, 0.82, 3, false],    // t
];

export function PixiTrie({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    const r = 13;
    const color = 0x06b6d4; // cyan

    // Edges
    NODES.forEach(([cxR, cyR, parentIdx], i) => {
      if (parentIdx === null) return;
      const p = animProgress(frameRef.current, animStartRef.current + i * 6, 25);
      if (p < 0.3) return;
      const [pcxR, pcyR] = NODES[parentIdx];
      g.moveTo(pcxR * width, pcyR * height);
      g.lineTo(cxR * width, cyR * height);
      g.stroke({ width: 1.5, color, alpha: 0.5 * p });
    });

    // Nodes
    NODES.forEach(([cxR, cyR, , isRoot], i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 6, 30));
      const isHl = highlighted.includes(i);
      const cx = cxR * width;
      const cy = cyR * height;
      const nodeR = isRoot ? r + 1 : r;

      g.circle(cx, cy, nodeR * p);
      g.fill({ color, alpha: isRoot ? 0.25 : isHl ? 0.22 : 0.12 });
      g.stroke({ width: 1.2, color, alpha: isHl ? 1 : 0.5 });

      if (p > 0.5) {
        g.circle(cx, cy, 2.5).fill({ color: theme.text, alpha: 0.7 });
      }
    });
  });

  return null;
}
