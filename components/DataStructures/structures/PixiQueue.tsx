"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

const ITEMS = ["E", "D", "C", "B", "A"];

export function PixiQueue({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    const itemW = 55;
    const itemH = 35;
    const totalW = ITEMS.length * (itemW + 8);
    const startX = (width - totalW) / 2 + 20;
    const cy = height * 0.25;

    // IN arrow
    g.moveTo(startX - 25, cy + itemH / 2);
    g.lineTo(startX - 8, cy + itemH / 2);
    g.stroke({ width: 2, color: theme.accent, alpha: 0.7 });
    g.moveTo(startX - 8, cy + itemH / 2);
    g.lineTo(startX - 14, cy + itemH / 2 - 4);
    g.lineTo(startX - 14, cy + itemH / 2 + 4);
    g.closePath();
    g.fill({ color: theme.accent, alpha: 0.7 });

    ITEMS.forEach((_, i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 5, 25));
      const isHl = highlighted.includes(i);
      const x = startX + i * (itemW + 8);

      g.roundRect(x, cy, itemW * p, itemH * p, 8);
      const alpha = 0.25 - i * 0.03;
      g.fill({ color: theme.accent, alpha: isHl ? alpha + 0.2 : alpha });
      g.stroke({ width: 1.2, color: theme.accent, alpha: isHl ? 1 : 0.5 });

      if (p > 0.5) {
        g.circle(x + (itemW * p) / 2, cy + (itemH * p) / 2, 2.5).fill({ color: theme.text, alpha: 0.7 });
      }
    });

    // OUT arrow
    const endX = startX + ITEMS.length * (itemW + 8);
    g.moveTo(endX, cy + itemH / 2);
    g.lineTo(endX + 18, cy + itemH / 2);
    g.stroke({ width: 2, color: theme.accent, alpha: 0.7 });
    g.moveTo(endX + 18, cy + itemH / 2);
    g.lineTo(endX + 12, cy + itemH / 2 - 4);
    g.lineTo(endX + 12, cy + itemH / 2 + 4);
    g.closePath();
    g.fill({ color: theme.accent, alpha: 0.7 });
  });

  return null;
}
