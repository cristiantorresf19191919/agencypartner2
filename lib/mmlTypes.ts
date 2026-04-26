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
  | "kernel-projection-3d"
  | "formula-chain"
  | "optimizer-race";

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
  /**
   * Optional step-by-step replay triggered when the learner answers wrong.
   * The StepwiseSolution component renders these with the mistake step
   * highlighted in amber.
   */
  mistakeSteps?: Array<{
    latex?: string;
    explanation: string;
    explanationEs?: string;
    /** When true, this is the step where a typical wrong answer diverges. */
    highlight?: boolean;
  }>;
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
  /** Optional dimensional/shape badge rendered beneath the token, e.g. "[m×n]". */
  shape?: string;
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
  // Ids into lib/mmlConcepts.ts — rendered as a prerequisites rail at the top
  concepts?: string[];
  // New pedagogical primitives
  tryYourOwn?: TryYourOwnSpec[];
  predictReveals?: PredictRevealSpec[];
  compares?: SideBySideSpec[];
  mlConnection?: MLConnectionSpec;
  visualProofs?: VisualProofSpec[];
  realData?: RealDataCompanionSpec[];
  // Optional Spanish overlays — renderer prefers these when locale is "es"
  titleEs?: string;
  chapterEs?: string;
  contentEs?: string[];
  keyTakeawaysEs?: string[];
}

/* ===================================================================
   New pedagogical primitives (learning-depth features)
   =================================================================== */

/** TryYourOwn — wires a free-form matrix/vector input into any viz. */
export interface TryYourOwnSpec {
  id?: string;
  /** Which viz re-renders with the user's numbers. Must be a key in VIZ_MAP. */
  vizType: MMLVizType;
  /** Base config passed to the viz (defaults, axes, etc.). */
  baseConfig?: Record<string, unknown>;
  /** Shape of the matrix/vector the reader enters. */
  input:
    | { kind: "matrix"; rows: number; cols: number; defaultMatrix?: number[][]; configKey?: string }
    | { kind: "vector"; dim: number; defaultVector?: number[]; configKey?: string };
  title?: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  /** A short hint shown to the learner before they edit. */
  prompt?: string;
  promptEs?: string;
  insertAfterParagraph?: number;
}

/** PredictReveal — show setup, collect prediction, then cascade steps. */
export interface PredictRevealSpec {
  id?: string;
  title?: string;
  titleEs?: string;
  setup: string; // markdown-style text describing the setup
  setupEs?: string;
  prediction:
    | { kind: "numeric"; answer: number; tolerance?: number; unit?: string }
    | { kind: "vector"; dim: number; answer: number[]; tolerance?: number }
    | {
        kind: "multiple-choice";
        options: string[];
        optionsEs?: string[];
        correctIndex: number;
      };
  promptQuestion: string;
  promptQuestionEs?: string;
  steps: Array<{
    latex?: string;
    explanation: string;
    explanationEs?: string;
  }>;
  insertAfterParagraph?: number;
}

/** SideBySideCompare — two viz slots driven by a shared parameter. */
export interface SideBySideSpec {
  id?: string;
  title?: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  slider: {
    key: string;
    label: string;
    labelEs?: string;
    min: number;
    max: number;
    step?: number;
    default: number;
  };
  /** Left pane and right pane each re-render their viz as the slider moves. */
  left: {
    label: string;
    labelEs?: string;
    vizType: MMLVizType;
    /** Called with the current slider value; returns a config object for the viz. */
    makeConfig: (t: number) => Record<string, unknown>;
  };
  right: {
    label: string;
    labelEs?: string;
    vizType: MMLVizType;
    makeConfig: (t: number) => Record<string, unknown>;
  };
  insertAfterParagraph?: number;
}

/** MLConnectionSpec — end-of-lesson "why this matters in ML" panel. */
export interface MLConnectionSpec {
  technique: string;
  techniqueEs?: string;
  summary: string;
  summaryEs?: string;
  codeLanguage?: "python" | "numpy" | "pytorch" | "javascript";
  codeSnippet?: string;
  /** One-line statement of what breaks if this concept is removed. */
  ifRemoved?: string;
  ifRemovedEs?: string;
}

/** VisualProofSpec — animated geometric theorem player. */
export interface VisualProofSpec {
  id?: string;
  title: string;
  titleEs?: string;
  theorem: string; // brief statement, supports LaTeX
  theoremEs?: string;
  /** Predefined proof template, keeps types strict and avoids dynamic code eval. */
  kind:
    | "orthogonal-preserves-length"
    | "pythagorean"
    | "dot-product-projection"
    | "eigenvectors-stay-on-line";
  steps: Array<{
    caption: string;
    captionEs?: string;
    /** 0..1 progress for the built-in animation player. */
    at: number;
  }>;
  insertAfterParagraph?: number;
}

/** RealDataCompanionSpec — anchors a concept to a tiny built-in dataset. */
export interface RealDataCompanionSpec {
  id?: string;
  title?: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  /** Which dataset to visualize. Datasets ship inside the primitive. */
  dataset: "iris" | "housing-sample" | "gaussian-clusters";
  /** What to show for the chosen dataset. */
  mode:
    | "scatter"
    | "pca-axes"
    | "variance-ellipse"
    | "mean-and-spread"
    | "regression-line";
  /** Optional indices selecting which features/columns to plot. */
  featureX?: number;
  featureY?: number;
  insertAfterParagraph?: number;
}

// ----------------------------------------------------------------------------
// Formula animations (FormulaChain / FormulaReveal)
// ----------------------------------------------------------------------------

export interface FormulaChainSpec {
  /** Each entry is one LaTeX expression; the engine morphs between them. */
  steps: string[];
  /** stepIndex -> token symbol substrings to glow on that step. */
  emphasize?: Record<number, string[]>;
  /** "auto" uses default 700ms morph; otherwise per-transition ms. */
  pacing?: "auto" | number[];
  title?: string;
  titleEs?: string;
  caption?: string;
  captionEs?: string;
}

export interface FormulaRevealSpec {
  latex: string;
  staggerMs?: number;
  fadeMs?: number;
}
