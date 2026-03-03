"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

const BUCKETS = [
  { hash: "h(0)", value: '"age" → 25' },
  { hash: "h(1)", value: '"name" → K' },
  { hash: "h(2)", value: "null" },
  { hash: "h(3)", value: '"id" → 42' },
];

export function PixiHashMap({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    const rowH = 26;
    const gap = 6;
    const bucketW = 80;
    const valueW = 120;
    const startX = (width - bucketW - valueW - 40) / 2;
    const startY = height * 0.1;

    BUCKETS.forEach((_, i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 8, 30));
      const isHl = highlighted.includes(i);
      const y = startY + i * (rowH + gap);

      // Hash bucket
      g.roundRect(startX, y, bucketW * p, rowH * p, 6);
      g.fill({ color: 0xec4899, alpha: isHl ? 0.3 : 0.15 });
      g.stroke({ width: 1, color: 0xec4899, alpha: isHl ? 1 : 0.5 });

      // Connector dashed line
      if (p > 0.5) {
        const cx1 = startX + bucketW * p;
        const cx2 = startX + bucketW + 30;
        const cy = y + (rowH * p) / 2;
        for (let dx = cx1 + 4; dx < cx2; dx += 8) {
          g.rect(dx, cy - 0.5, 4, 1).fill({ color: 0xec4899, alpha: 0.4 });
        }
      }

      // Value box
      if (p > 0.3) {
        const vx = startX + bucketW + 30;
        g.roundRect(vx, y, valueW * p, rowH * p, 6);
        g.fill({ color: 0xec4899, alpha: isHl ? 0.15 : 0.06 });
        g.stroke({ width: 1, color: 0xec4899, alpha: 0.3 });

        // Value indicator
        g.circle(vx + (valueW * p) / 2, y + (rowH * p) / 2, 2).fill({ color: theme.text, alpha: 0.6 });
      }
    });
  });

  return null;
}
