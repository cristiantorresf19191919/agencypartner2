export type DSOperation =
  | { type: "push"; value: number }
  | { type: "pop" }
  | { type: "enqueue"; value: number }
  | { type: "dequeue" }
  | { type: "insert"; index: number; value: number }
  | { type: "delete"; index: number }
  | { type: "highlight"; indices: number[] }
  | { type: "reset" };

export interface DSVisualizerProps {
  topicId: string;
  width?: number;
  height?: number;
}

export interface DSRendererProps {
  width: number;
  height: number;
  /** Current highlighted indices */
  highlighted: number[];
  /** Increments on each operation to trigger re-animation */
  animationKey: number;
}
