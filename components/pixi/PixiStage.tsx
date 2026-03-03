"use client";

import React, { useRef, useEffect, useState, type ReactNode } from "react";
import { Application } from "@pixi/react";
import "@/components/pixi/extend-registry";
import { isWebGLAvailable } from "./webgl-detect";

export interface PixiStageProps {
  width?: number;
  height?: number;
  /** CSS class for the wrapping div */
  className?: string;
  /** Fallback rendered when WebGL is unavailable */
  fallback?: ReactNode;
  /** Whether the canvas should resize to its parent container */
  resizeToParent?: boolean;
  /** Background color (hex number) */
  background?: number;
  /** Whether the background should be transparent */
  backgroundAlpha?: number;
  children?: ReactNode;
}

export function PixiStage({
  width = 800,
  height = 400,
  className,
  fallback,
  resizeToParent = false,
  background = 0x0f1117,
  backgroundAlpha = 1,
  children,
}: PixiStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (!webglOk) {
    return <>{fallback ?? null}</>;
  }

  return (
    <div ref={containerRef} className={className}>
      <Application
        resizeTo={resizeToParent ? containerRef : undefined}
        background={background}
        backgroundAlpha={backgroundAlpha}
        width={width}
        height={height}
        antialias
      >
        {children}
      </Application>
    </div>
  );
}
