"use client";

import { useEffect, useRef } from "react";
import { useApplication, useTick } from "@pixi/react";
import { Graphics } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { easeOutBack, animProgress } from "../ds-animations";
import type { DSRendererProps } from "../ds-types";

const NODES = ["Head", "12", "99", "7"];

export function PixiLinkedList({ width, height, highlighted, animationKey }: DSRendererProps) {
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

    const nodeW = 80;
    const nodeH = 40;
    const gap = 25;
    const totalW = NODES.length * nodeW + (NODES.length - 1) * gap;
    const startX = (width - totalW) / 2;
    const cy = height * 0.35;

    NODES.forEach((_, i) => {
      const p = easeOutBack(animProgress(frameRef.current, animStartRef.current + i * 8, 30));
      const isHl = highlighted.includes(i);
      const x = startX + i * (nodeW + gap);

      // Node box
      g.roundRect(x, cy - (nodeH * p) / 2 + nodeH / 2, nodeW * p, nodeH * p, 10);
      g.fill({ color: theme.secondary, alpha: isHl ? 0.3 : 0.12 });
      g.stroke({ width: 1.5, color: theme.secondary, alpha: isHl ? 1 : 0.6 });

      // Value indicator
      if (p > 0.5) {
        g.circle(x + (nodeW * p) / 2, cy + nodeH / 2, 3).fill({ color: theme.text, alpha: 0.8 });
      }

      // Arrow to next
      if (i < NODES.length - 1 && p > 0.8) {
        const ax1 = x + nodeW * p;
        const ax2 = startX + (i + 1) * (nodeW + gap);
        const ay = cy + nodeH / 2;
        g.moveTo(ax1, ay);
        g.lineTo(ax2, ay);
        g.stroke({ width: 1.5, color: theme.secondary, alpha: 0.6 });
        // Arrowhead
        g.moveTo(ax2, ay);
        g.lineTo(ax2 - 6, ay - 4);
        g.lineTo(ax2 - 6, ay + 4);
        g.closePath();
        g.fill({ color: theme.secondary, alpha: 0.6 });
      }
    });

    // Null terminator
    const lastX = startX + NODES.length * (nodeW + gap) - gap + 10;
    g.circle(lastX, cy + nodeH / 2, 8).fill({ color: theme.secondary, alpha: 0.2 });
  });

  return null;
}
