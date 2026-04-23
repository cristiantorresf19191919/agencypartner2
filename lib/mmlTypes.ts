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
  | "svd-flow"
  | "kernel-projection-3d";

export interface MMLVisualization {
  type: MMLVizType;
  title?: string;
  description?: string;
  titleEs?: string;
  descriptionEs?: string;
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
  questionEs?: string;
  hintEs?: string;
  explanationEs?: string;
}

export interface MMLMultipleChoice extends MMLExerciseBase {
  type: "multiple-choice";
  options: string[];
  correctIndex: number;
  optionsEs?: string[];
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

export interface AnnotatedFormulaToken {
  text: string;
  size?: "xl" | "l" | "m";
  color?: string;
  label?: string;
  labelEs?: string;
  labelColor?: string;
}

export interface AnnotatedFormulaSpec {
  id?: string;
  title?: string;
  titleEs?: string;
  caption?: string;
  captionEs?: string;
  tokens: AnnotatedFormulaToken[];
  insertAfterParagraph?: number;
}

export interface FormulaExplorerSlot {
  key: string;
  label: string;
  labelEs?: string;
  min: number;
  max: number;
  step?: number;
  default: number;
  color?: string;
}

export type FormulaExplorerKind =
  | "linear" // m*x + b       slots: m, b
  | "quadratic" // a*x^2 + b*x + c   slots: a, b, c
  | "sigmoid" // 1/(1+exp(-(w*x+b)))  slots: w, b
  | "gaussian" // exp(-((x-mu)^2)/(2*sigma^2))  slots: mu, sigma
  | "sine" // A*sin(w*x + phi)   slots: A, w, phi
  | "exponential" // A*exp(k*x)  slots: A, k
  | "power"; // A*x^p          slots: A, p

export interface FormulaExplorerSpec {
  id?: string;
  title?: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  formula: string;
  kind: FormulaExplorerKind;
  slots: FormulaExplorerSlot[];
  plot?: {
    xDomain: [number, number];
    yDomain: [number, number];
  };
  insertAfterParagraph?: number;
}

export interface StepSolutionSpec {
  id?: string;
  title?: string;
  titleEs?: string;
  steps: Array<{
    latex?: string;
    explanation: string;
    explanationEs?: string;
  }>;
  insertAfterParagraph?: number;
}

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
  // Optional interactive / pedagogical enrichments
  annotatedFormulas?: AnnotatedFormulaSpec[];
  formulaExplorers?: FormulaExplorerSpec[];
  stepSolutions?: StepSolutionSpec[];
  analogy?: { en: string; es?: string };
  pitfall?: { en: string; es?: string };
  // Optional Spanish overlays — renderer prefers these when locale is "es"
  titleEs?: string;
  chapterEs?: string;
  contentEs?: string[];
  keyTakeawaysEs?: string[];
}
