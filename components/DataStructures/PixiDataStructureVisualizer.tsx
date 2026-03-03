"use client";

import React, { useEffect, useState } from "react";
import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { isWebGLAvailable } from "@/components/pixi/webgl-detect";
import type { DSVisualizerProps, DSRendererProps } from "./ds-types";
import cssStyles from "./PixiDataStructureVisualizer.module.css";

import { PixiArray } from "./structures/PixiArray";
import { PixiLinkedList } from "./structures/PixiLinkedList";
import { PixiStack } from "./structures/PixiStack";
import { PixiQueue } from "./structures/PixiQueue";
import { PixiHashMap } from "./structures/PixiHashMap";
import { PixiTree } from "./structures/PixiTree";
import { PixiHeap } from "./structures/PixiHeap";
import { PixiGraph } from "./structures/PixiGraph";
import { PixiTrie } from "./structures/PixiTrie";
import { PixiAdvanced } from "./structures/PixiAdvanced";

extend({ Container, Graphics });

const RENDERER_MAP: Record<string, React.ComponentType<DSRendererProps>> = {
  arrays: PixiArray,
  "linked-lists": PixiLinkedList,
  stacks: PixiStack,
  queues: PixiQueue,
  "hash-maps": PixiHashMap,
  trees: PixiTree,
  heaps: PixiHeap,
  graphs: PixiGraph,
  tries: PixiTrie,
  advanced: PixiAdvanced,
};

export function PixiDataStructureVisualizer({
  topicId,
  width = 400,
  height = 160,
}: DSVisualizerProps) {
  const [webglOk, setWebglOk] = useState(true);
  const [animationKey] = useState(0);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  const Renderer = RENDERER_MAP[topicId];

  if (!webglOk || !Renderer) return null;

  return (
    <div className={cssStyles.wrapper}>
      <Application
        width={width}
        height={height}
        backgroundAlpha={0}
        antialias
      >
        <Renderer
          width={width}
          height={height}
          highlighted={[]}
          animationKey={animationKey}
        />
      </Application>
    </div>
  );
}
