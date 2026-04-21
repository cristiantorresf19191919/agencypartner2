export type MMLVizType =
  | "vector-2d"
  | "matrix-transform-2d"
  | "norm-balls"
  | "function-plot"
  | "gradient-field"
  | "probability-plot"
  | "bayes-updater"
  | "linear-regression-plot"
  | "svm-plot"
  | "gmm-plot"
  | "vector-3d"
  | "matrix-transform-3d"
  | "eigenspace-3d"
  | "pca-3d"
  | "svd-3d"
  | "kernel-projection-3d";

export interface MMLVisualization {
  type: MMLVizType;
  title?: string;
  description?: string;
  config: Record<string, unknown>;
}

export type MMLExerciseType =
  | "multiple-choice"
  | "numeric-input"
  | "matrix-input"
  | "vector-input"
  | "slider-explore"
  | "drag-to-match";

interface MMLExerciseBase {
  type: MMLExerciseType;
  question: string;
  hint?: string;
  explanation: string;
}

export interface MMLMultipleChoice extends MMLExerciseBase {
  type: "multiple-choice";
  options: string[];
  correctIndex: number;
}

export interface MMLNumericInput extends MMLExerciseBase {
  type: "numeric-input";
  answer: number;
  tolerance?: number;
  unit?: string;
}

export interface MMLMatrixInput extends MMLExerciseBase {
  type: "matrix-input";
  rows: number;
  cols: number;
  answer: number[][];
  tolerance?: number;
}

export interface MMLVectorInput extends MMLExerciseBase {
  type: "vector-input";
  dimensions: number;
  answer: number[];
  tolerance?: number;
  showPreview?: boolean;
}

export interface MMLSliderExplore extends MMLExerciseBase {
  type: "slider-explore";
  vizType: MMLVizType;
  vizConfig: Record<string, unknown>;
  sliderParam: string;
  sliderLabel: string;
  sliderRange: [number, number];
  sliderStep?: number;
  followUpQuestion: string;
  followUpOptions: string[];
  correctFollowUpIndex: number;
}

export interface MMLDragToMatch extends MMLExerciseBase {
  type: "drag-to-match";
  leftItems: string[];
  rightItems: string[];
  correctPairs: [number, number][];
}

export type MMLExercise =
  | MMLMultipleChoice
  | MMLNumericInput
  | MMLMatrixInput
  | MMLVectorInput
  | MMLSliderExplore
  | MMLDragToMatch;

export interface MMLLesson {
  id: string;
  step: number;
  title: string;
  chapter: string;
  chapterNumber: number;
  nextStep?: string;
  prevStep?: string;
  content: string[];
  visualizations: MMLVisualization[];
  exercises: MMLExercise[];
  keyTakeaways?: string[];
}
