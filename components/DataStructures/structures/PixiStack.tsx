"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

const ITEMS = ["TOP", "B", "A", "Bottom"];

export function PixiStack({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    const itemW = 120;
    const itemH = 28;
    const cx = width / 2;
    const baseY = height * 0.12;

    ITEMS.forEach((_, i) => {
      const revI = ITEMS.length - 1 - i;
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + revI * 6, 25));
      const isHl = highlighted.includes(i);
      const y = baseY + i * (itemH + 4);
      const alpha = 0.3 - i * 0.05;

      g.roundRect(cx - (itemW * p) / 2, y, itemW * p, itemH * p, 6);
      g.fill({ color: theme.warning, alpha: isHl ? alpha + 0.2 : alpha });
      g.stroke({ width: 1.2, color: theme.warning, alpha: isHl ? 1 : 0.5 });

      if (p > 0.5) {
        g.circle(cx, y + (itemH * p) / 2, 2.5).fill({ color: theme.text, alpha: 0.7 });
      }
    });
  });

  return null;
}
