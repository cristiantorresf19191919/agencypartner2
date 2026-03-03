"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Application, useApplication, useTick, extend } from "@pixi/react";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { usePixiTheme } from "@/components/pixi/usePixiTheme";
import { isWebGLAvailable } from "@/components/pixi/webgl-detect";
import type { MarbleDiagramProps } from "./MarbleDiagram";
import cssStyles from "./PixiMarbleDiagram.module.css";

extend({ Container, Graphics, Text: PixiText });

const CANVAS_W = 600;
const CANVAS_H = 160;

const MARBLE_GRADIENTS = [0x22c55e, 0xeab308, 0x3b82f6, 0xa855f7, 0xec4899];

// ─── Marble types ──────────────────────────────────────────────────

interface Marble {
  id: number;
  x: number;
  y: number;
  baseY: number;
  radius: number;
  color: number;
  speed: number;
  opacity: number;
  /** Is this marble fading out (filter removed it)? */
  fading: boolean;
}

interface TrailParticle {
  x: number;
  y: number;
  alpha: number;
  radius: number;
  color: number;
}

// ─── Operator config from slug ─────────────────────────────────────

interface OperatorConfig {
  label: string;
  type: "transform" | "filter" | "expand" | "merge" | "source";
  inputCount: 1 | 2;
  marbleCount: number;
}

function getOperatorConfig(slug: string): OperatorConfig {
  const s = slug.toLowerCase();

  if (["just", "empty", "never"].includes(s))
    return { label: s, type: "source", inputCount: 1, marbleCount: 1 };

  if (["expand", "expanddeep"].includes(s))
    return { label: s === "expanddeep" ? "expandDeep" : "expand", type: "expand", inputCount: 1, marbleCount: 1 };

  if (["filter", "take", "skip", "distinct"].includes(s))
    return { label: s, type: "filter", inputCount: 1, marbleCount: 3 };

  if (["merge", "concat", "zip", "combinelatest"].includes(s))
    return { label: s === "combinelatest" ? "combineLatest" : s, type: "merge", inputCount: 2, marbleCount: 2 };

  // Default: map-like transform
  const labelMap: Record<string, string> = {
    map: "map", flatmap: "flatMap", concatmap: "concatMap", scan: "scan",
  };
  return { label: labelMap[s] || s, type: "transform", inputCount: 1, marbleCount: 3 };
}

// ─── Internal scene ────────────────────────────────────────────────

interface SceneProps {
  config: OperatorConfig;
}

let marbleIdCounter = 0;

function Scene({ config }: SceneProps) {
  const app = useApplication();
  const theme = usePixiTheme();

  const marblesRef = useRef<Marble[]>([]);
  const trailsRef = useRef<TrailParticle[]>([]);
  const graphicsRef = useRef<import("pixi.js").Graphics | null>(null);
  const elapsedRef = useRef(0);
  const spawnTimerRef = useRef(0);

  // Create a single Graphics object for the entire scene
  useEffect(() => {
    const stage = app.app?.stage;
    if (!stage) return;

    const g = new Graphics();
    stage.addChild(g);
    graphicsRef.current = g;

    return () => {
      g.destroy();
      graphicsRef.current = null;
    };
  }, [app.app]);

  // Reset marbles when config changes
  useEffect(() => {
    marblesRef.current = [];
    trailsRef.current = [];
    spawnTimerRef.current = 0;
    elapsedRef.current = 0;
  }, [config]);

  const spawnMarble = useCallback(
    (lane: number) => {
      const marble: Marble = {
        id: marbleIdCounter++,
        x: 20,
        y: lane === 0 ? CANVAS_H * 0.4 : CANVAS_H * 0.7,
        baseY: lane === 0 ? CANVAS_H * 0.4 : CANVAS_H * 0.7,
        radius: 12,
        color: MARBLE_GRADIENTS[marbleIdCounter % MARBLE_GRADIENTS.length],
        speed: 1.2 + Math.random() * 0.4,
        opacity: 1,
        fading: false,
      };
      marblesRef.current.push(marble);
    },
    []
  );

  useTick((ticker) => {
    const g = graphicsRef.current;
    if (!g) return;

    const dt = ticker.deltaTime;
    elapsedRef.current += dt;
    spawnTimerRef.current += dt;

    // Spawn new marbles periodically
    const spawnInterval = 90; // ~1.5 seconds at 60fps
    if (spawnTimerRef.current > spawnInterval) {
      spawnTimerRef.current = 0;
      spawnMarble(0);
      if (config.inputCount === 2) {
        spawnMarble(1);
      }
    }

    // Operator box position
    const opX = CANVAS_W * 0.48;
    const opW = 80;
    const opLeft = opX - opW / 2;
    const opRight = opX + opW / 2;

    // Physics update
    const marbles = marblesRef.current;
    const trails = trailsRef.current;

    for (const m of marbles) {
      const prevX = m.x;

      // Slow down near operator box, speed up after
      if (m.x > opLeft - 30 && m.x < opLeft) {
        m.x += m.speed * 0.3 * dt;
      } else if (m.x >= opLeft && m.x < opRight) {
        m.x += m.speed * 0.5 * dt;

        // Apply operator effects when passing through
        if (config.type === "filter" && !m.fading) {
          if (m.id % 3 === 0) {
            m.fading = true;
          }
        }
        if (config.type === "transform") {
          // Shift color
          m.color = MARBLE_GRADIENTS[(MARBLE_GRADIENTS.indexOf(m.color) + 1) % MARBLE_GRADIENTS.length];
        }
        // Merge: converge to center lane
        if (config.type === "merge") {
          const targetY = CANVAS_H * 0.5;
          m.y += (targetY - m.y) * 0.05 * dt;
        }
      } else {
        m.x += m.speed * dt;
      }

      // Gentle bobbing
      m.y = m.baseY + Math.sin(elapsedRef.current * 0.03 + m.id) * 3;

      // Fading
      if (m.fading) {
        m.opacity -= 0.015 * dt;
      }

      // Trail particles
      if (m.x > 40 && m.opacity > 0.3 && Math.abs(m.x - prevX) > 0.5) {
        trails.push({
          x: prevX,
          y: m.y,
          alpha: 0.4,
          radius: m.radius * 0.3,
          color: m.color,
        });
      }
    }

    // Update trails
    for (let i = trails.length - 1; i >= 0; i--) {
      trails[i].alpha -= 0.02 * dt;
      if (trails[i].alpha <= 0) {
        trails.splice(i, 1);
      }
    }

    // Remove dead marbles
    for (let i = marbles.length - 1; i >= 0; i--) {
      if (marbles[i].x > CANVAS_W + 30 || marbles[i].opacity <= 0) {
        marbles.splice(i, 1);
      }
    }

    // ── Draw everything ──

    g.clear();

    // Timeline(s)
    const timelineY1 = CANVAS_H * 0.4;
    const timelineY2 = CANVAS_H * 0.7;
    const outputY = config.inputCount === 2 ? CANVAS_H * 0.5 : timelineY1;

    g.setStrokeStyle({ width: 2, color: theme.textMuted, alpha: 0.3 });

    // Input timeline(s)
    drawDashedLine(g, 30, timelineY1, CANVAS_W - 30, timelineY1, 4, 4);
    if (config.inputCount === 2) {
      drawDashedLine(g, 30, timelineY2, CANVAS_W - 30, timelineY2, 4, 4);
      // Output timeline (merged)
      drawDashedLine(g, opRight + 10, outputY, CANVAS_W - 30, outputY, 4, 4);
    }

    // Completion marker
    g.setStrokeStyle({ width: 2, color: theme.accent, alpha: 0.8 });
    g.moveTo(CANVAS_W - 40, timelineY1 - 25);
    g.lineTo(CANVAS_W - 40, timelineY1 + 25);
    g.stroke();

    // Operator box
    g.roundRect(opLeft, CANVAS_H * 0.25, opW, CANVAS_H * 0.5, 8);
    g.fill({ color: theme.secondary, alpha: 0.15 });
    g.stroke({ width: 1.5, color: theme.secondary, alpha: 0.5 });

    // Trail particles
    for (const t of trails) {
      g.circle(t.x, t.y, t.radius).fill({ color: t.color, alpha: t.alpha });
    }

    // Marbles
    for (const m of marbles) {
      if (m.opacity <= 0) continue;
      // Shadow
      g.circle(m.x + 1, m.y + 2, m.radius).fill({ color: 0x000000, alpha: 0.2 * m.opacity });
      // Body
      g.circle(m.x, m.y, m.radius).fill({ color: m.color, alpha: m.opacity });
      // Highlight
      g.circle(m.x - m.radius * 0.25, m.y - m.radius * 0.25, m.radius * 0.35)
        .fill({ color: 0xffffff, alpha: 0.25 * m.opacity });
    }
  });

  // Operator label is rendered as a PixiJS text via @pixi/react
  return (
    <pixiText
      text={config.label}
      x={CANVAS_W * 0.48}
      y={CANVAS_H * 0.5}
      anchor={0.5}
      style={{
        fontSize: 13,
        fontWeight: "600",
        fill: theme.text,
        fontFamily: "monospace",
      }}
    />
  );
}

// ─── Dashed line helper ────────────────────────────────────────────

function drawDashedLine(
  g: import("pixi.js").Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dashLen: number,
  gapLen: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;
  let pos = 0;
  let drawing = true;

  g.moveTo(x1, y1);
  while (pos < dist) {
    const step = drawing ? dashLen : gapLen;
    pos = Math.min(pos + step, dist);
    const px = x1 + ux * pos;
    const py = y1 + uy * pos;
    if (drawing) {
      g.lineTo(px, py);
      g.stroke();
    }
    g.moveTo(px, py);
    drawing = !drawing;
  }
}

// ─── Public component ──────────────────────────────────────────────

export function PixiMarbleDiagram({
  name = "generic",
  caption,
  className = "",
}: MarbleDiagramProps) {
  const slug = name.replace(/\.(svg|png|jpg)$/, "").toLowerCase();
  const config = getOperatorConfig(slug);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (!webglOk) return null; // fallback handled by parent

  return (
    <figure className={`${cssStyles.wrapper} ${className}`}>
      <Application
        width={CANVAS_W}
        height={CANVAS_H}
        backgroundAlpha={0}
        antialias
      >
        <Scene config={config} />
      </Application>
      {caption && <figcaption className={cssStyles.caption}>{caption}</figcaption>}
    </figure>
  );
}
