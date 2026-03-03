"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

const DATA = [42, 17, 93, 8, 56, 31, 74];

export function PixiArray({ width, height, highlighted, animationKey }: DSRendererProps) {
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

  useEffect(() => {
    animStartRef.current = frameRef.current;
  }, [animationKey]);

  useTick((ticker) => {
    frameRef.current += ticker.deltaTime;
    const g = gRef.current;
    if (!g) return;
    g.clear();

    const cellW = Math.min(52, (width - 40) / DATA.length);
    const cellH = 48;
    const startX = (width - cellW * DATA.length) / 2;
    const baseY = height * 0.22;

    DATA.forEach((val, i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 5, 30));
      const scale = p;
      const isHl = highlighted.includes(i);
      const cx = startX + i * cellW;
      const cy = baseY;

      // Cell
      g.roundRect(cx, cy - (cellH * scale) / 2 + cellH / 2, cellW - 4, cellH * scale, 8);
      g.fill({ color: theme.primary, alpha: isHl ? 0.35 : 0.15 });
      g.stroke({ width: 1.5, color: theme.primary, alpha: isHl ? 1 : 0.6 });
    });

    // Text is drawn as simple rectangles for the value indicators
    DATA.forEach((val, i) => {
      const p = animProgress(frameRef.current, animStartRef.current + i * 5, 30);
      if (p < 0.5) return;
      const cx = startX + i * cellW + (cellW - 4) / 2;
      // Small dot to indicate value presence
      g.circle(cx, baseY + cellH / 2, 3).fill({ color: theme.text, alpha: 0.8 });
      // Index indicator
      g.circle(cx, baseY + cellH + 12, 2).fill({ color: theme.textMuted, alpha: 0.6 });
    });

    // Description line
    const descY = height - 16;
    g.rect(width * 0.2, descY, width * 0.6, 1).fill({ color: theme.textMuted, alpha: 0.3 });
  });

  return null;
}
