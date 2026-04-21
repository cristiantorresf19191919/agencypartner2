# Mathematics for Machine Learning — Interactive Course Design

## Overview

An interactive, visualization-first course covering all 12 chapters of *Mathematics for Machine Learning* (Deisenroth, Faisal, Ong). No code editor — instead, rich 2D/3D visualizations (Mafs, React Three Fiber + Drei) paired with interactive exercises (quizzes, numeric inputs, matrix grids, sliders, drag-to-match) to solidify each concept.

**Accent color:** Emerald `#10B981`
**Total lessons:** 53 (one per book subsection)
**Approach:** Data-driven lessons + reusable visualization/exercise primitives

---

## New Dependencies

| Package | Purpose |
|---|---|
| `mafs` | 2D interactive math: vectors, plots, transforms, distributions |
| `three` | Three.js core (peer dep for R3F) |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers: OrbitControls, Text, Grid, Line, etc. |
| `katex` | LaTeX math rendering in lesson content |

---

## Data Model

### Types (`lib/mmlTypes.ts`)

```typescript
// ─── Visualization configs ───

type MMLVizType =
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

interface MMLVisualization {
  type: MMLVizType;
  title?: string;
  description?: string;
  config: Record<string, unknown>; // Type-specific params (vectors, ranges, etc.)
}

// ─── Exercise configs ───

type MMLExerciseType =
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
  explanation: string; // Shown after answering
}

interface MMLMultipleChoice extends MMLExerciseBase {
  type: "multiple-choice";
  options: string[];
  correctIndex: number;
}

interface MMLNumericInput extends MMLExerciseBase {
  type: "numeric-input";
  answer: number;
  tolerance?: number; // Default 0.01
  unit?: string;
}

interface MMLMatrixInput extends MMLExerciseBase {
  type: "matrix-input";
  rows: number;
  cols: number;
  answer: number[][];
  tolerance?: number;
}

interface MMLVectorInput extends MMLExerciseBase {
  type: "vector-input";
  dimensions: number;
  answer: number[];
  tolerance?: number;
  showPreview?: boolean; // Show vector in Mafs as user types
}

interface MMLSliderExplore extends MMLExerciseBase {
  type: "slider-explore";
  vizType: MMLVizType;
  vizConfig: Record<string, unknown>;
  sliderParam: string;
  sliderRange: [number, number];
  sliderStep?: number;
  followUpQuestion: string;
  followUpOptions: string[];
  correctFollowUpIndex: number;
}

interface MMLDragToMatch extends MMLExerciseBase {
  type: "drag-to-match";
  leftItems: string[];
  rightItems: string[];
  correctPairs: [number, number][]; // index pairs
}

type MMLExercise =
  | MMLMultipleChoice
  | MMLNumericInput
  | MMLMatrixInput
  | MMLVectorInput
  | MMLSliderExplore
  | MMLDragToMatch;

// ─── Lesson ───

interface MMLLesson {
  id: string;         // "mml-1" through "mml-53"
  step: number;
  title: string;
  chapter: string;    // Chapter name for grouping
  chapterNumber: number;
  content: string[];  // Paragraphs; supports **bold**, `code`, $latex$, $$block-latex$$
  visualizations: MMLVisualization[];
  exercises: MMLExercise[];
  keyTakeaways?: string[];
}
```

### Lesson Data (`lib/mmlCourseData.ts`)

All 53 lessons defined as a flat array, built with a `buildMMLLessons()` function that auto-assigns `id`, `step`, `nextStep`, `prevStep`. Each lesson contains:

- 3-6 content paragraphs with embedded LaTeX
- 1-3 visualizations with typed configs
- 2-4 exercises of mixed types
- 2-3 key takeaways

---

## Complete Lesson Map (53 lessons)

### Chapter 1 — Introduction and Motivation (1 lesson)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 1 | mml-1 | Why Math for ML | Roadmap diagram (static) | multiple-choice x2 |

### Chapter 2 — Linear Algebra (8 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 2 | mml-2 | Systems of Linear Equations | vector-2d (intersecting lines) | numeric-input, multiple-choice |
| 3 | mml-3 | Matrices | matrix-transform-2d | matrix-input, multiple-choice |
| 4 | mml-4 | Solving Systems of Linear Equations | vector-2d (Gaussian elimination stepper) | matrix-input, numeric-input |
| 5 | mml-5 | Vector Spaces | vector-2d (span visualization) | multiple-choice x2, drag-to-match |
| 6 | mml-6 | Linear Independence | vector-2d (drag to see dependence) | multiple-choice, vector-input |
| 7 | mml-7 | Basis and Rank | vector-2d (basis vectors, dimension) | numeric-input, multiple-choice |
| 8 | mml-8 | Linear Mappings | matrix-transform-2d (drag + animate) | matrix-input, multiple-choice |
| 9 | mml-9 | Affine Spaces | vector-2d (affine subspaces) | multiple-choice, vector-input |

### Chapter 3 — Analytic Geometry (8 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 10 | mml-10 | Norms | norm-balls (L1/L2/Linf toggle) | slider-explore, multiple-choice |
| 11 | mml-11 | Inner Products | vector-2d (angle + projection) | numeric-input, multiple-choice |
| 12 | mml-12 | Lengths and Distances | vector-2d (distance metrics) | numeric-input x2 |
| 13 | mml-13 | Angles and Orthogonality | vector-2d (drag to find perpendicular) | numeric-input, multiple-choice |
| 14 | mml-14 | Orthonormal Basis | vector-2d (Gram-Schmidt step-by-step) | vector-input, multiple-choice |
| 15 | mml-15 | Orthogonal Complement | vector-2d (complement subspace) | multiple-choice, drag-to-match |
| 16 | mml-16 | Orthogonal Projections | vector-2d + vector-3d (project onto plane) | vector-input, numeric-input |
| 17 | mml-17 | Rotations | matrix-transform-3d (orbit + slider) | matrix-input, slider-explore |

### Chapter 4 — Matrix Decompositions (7 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 18 | mml-18 | Determinant and Trace | matrix-transform-2d (area scaling) | numeric-input x2, multiple-choice |
| 19 | mml-19 | Eigenvalues and Eigenvectors | eigenspace-3d (vectors stay on line) | numeric-input, vector-input |
| 20 | mml-20 | Cholesky Decomposition | matrix-transform-2d (positive definite) | matrix-input, multiple-choice |
| 21 | mml-21 | Eigendecomposition and Diagonalization | matrix-transform-2d (decompose animation) | matrix-input, multiple-choice |
| 22 | mml-22 | Singular Value Decomposition | svd-3d (rotate-scale-rotate) | multiple-choice, numeric-input |
| 23 | mml-23 | Matrix Approximation | function-plot (rank-k approx slider) | slider-explore, numeric-input |
| 24 | mml-24 | Matrix Phylogeny | Relationship diagram (static) | drag-to-match, multiple-choice |

### Chapter 5 — Vector Calculus (7 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 25 | mml-25 | Differentiation of Univariate Functions | function-plot (tangent line, drag point) | numeric-input x2 |
| 26 | mml-26 | Partial Derivatives and Gradients | gradient-field (2D gradient arrows) | vector-input, multiple-choice |
| 27 | mml-27 | Gradients of Vector-Valued Functions | function-plot (Jacobian viz) | matrix-input, multiple-choice |
| 28 | mml-28 | Gradients of Matrices | (content-heavy, minimal viz) | multiple-choice x2, numeric-input |
| 29 | mml-29 | Backpropagation and Automatic Differentiation | gradient-field (computational graph) | numeric-input, multiple-choice x2 |
| 30 | mml-30 | Higher-Order Derivatives | function-plot (Hessian curvature) | numeric-input, matrix-input |
| 31 | mml-31 | Linearization and Taylor Series | function-plot (order slider: 1,2,3,...,n) | slider-explore, numeric-input |

### Chapter 6 — Probability and Distributions (7 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 32 | mml-32 | Construction of a Probability Space | probability-plot (sample space) | multiple-choice x2, drag-to-match |
| 33 | mml-33 | Discrete and Continuous Probabilities | probability-plot (PMF bars vs PDF curve) | multiple-choice, numeric-input |
| 34 | mml-34 | Sum Rule, Product Rule, and Bayes' Theorem | bayes-updater (interactive prior→posterior) | numeric-input x2, multiple-choice |
| 35 | mml-35 | Summary Statistics and Independence | probability-plot (drag points, watch mean/var) | numeric-input, multiple-choice |
| 36 | mml-36 | Gaussian Distribution | probability-plot (mu/sigma sliders, 2D contour) | slider-explore, numeric-input |
| 37 | mml-37 | Conjugacy and the Exponential Family | probability-plot (prior × likelihood = posterior) | multiple-choice x2 |
| 38 | mml-38 | Change of Variables | probability-plot (transform PDF, see warp) | multiple-choice, numeric-input |

### Chapter 7 — Continuous Optimization (3 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 39 | mml-39 | Gradient Descent | gradient-field (step on surface, LR slider) | slider-explore, numeric-input |
| 40 | mml-40 | Constrained Optimization and Lagrange Multipliers | gradient-field (contours + constraint line) | numeric-input, multiple-choice |
| 41 | mml-41 | Convex Optimization | function-plot (convex vs non-convex, local/global) | multiple-choice x2, drag-to-match |

### Chapter 8 — When Models Meet Data (3 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 42 | mml-42 | Data, Models, and Learning | linear-regression-plot (underfitting/overfitting) | slider-explore, multiple-choice |
| 43 | mml-43 | Parameter Estimation (MLE & MAP) | probability-plot (likelihood surface) | numeric-input, multiple-choice |
| 44 | mml-44 | Probabilistic Modeling and Model Selection | probability-plot (BIC/AIC curves) | multiple-choice x2 |

### Chapter 9 — Linear Regression (3 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 45 | mml-45 | Linear Regression: Problem Formulation | linear-regression-plot (drag data, fit line) | numeric-input, multiple-choice |
| 46 | mml-46 | Bayesian Linear Regression | linear-regression-plot (uncertainty bands grow/shrink) | slider-explore, multiple-choice |
| 47 | mml-47 | Maximum Likelihood as Orthogonal Projection | vector-2d (geometric MLE) | multiple-choice, vector-input |

### Chapter 10 — PCA (2 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 48 | mml-48 | PCA: Maximum Variance Perspective | pca-3d (rotate cloud, project onto axes) | multiple-choice, numeric-input |
| 49 | mml-49 | PCA in Practice | function-plot (scree plot, reconstruction slider) | slider-explore, multiple-choice |

### Chapter 11 — Gaussian Mixture Models (2 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 50 | mml-50 | GMM and EM Algorithm | gmm-plot (watch clusters form, step-by-step) | multiple-choice x2 |
| 51 | mml-51 | GMM: Latent Variable Perspective | gmm-plot (responsibility coloring) | numeric-input, multiple-choice |

### Chapter 12 — SVMs (2 lessons)
| # | ID | Title | Vizs | Exercises |
|---|---|---|---|---|
| 52 | mml-52 | SVM: Separating Hyperplanes and Margins | svm-plot (drag points, watch margin) | multiple-choice, numeric-input |
| 53 | mml-53 | SVM: Kernels | kernel-projection-3d (lift 2D→3D with kernel) | multiple-choice, slider-explore |

---

## Visualization Components

### 2D Components (Mafs-based)

All wrapped in `<Mafs>` with consistent styling (emerald accent, dark/light theme support).

1. **VectorPlot2D** — Renders vectors as arrows, supports draggable endpoints, labels, addition/subtraction overlays. Config: `{ vectors: Vector2[], draggable?: boolean, showSum?: boolean, showSpan?: boolean }`

2. **MatrixTransform2D** — Shows how a 2x2 matrix transforms the unit square and basis vectors. Slider or drag to interpolate from identity to target matrix. Config: `{ matrix: number[][], animateFromIdentity?: boolean, showGrid?: boolean, showBasis?: boolean }`

3. **NormBalls** — Toggle between L1, L2, Linf unit balls. Config: `{ norms: ("l1"|"l2"|"linf")[], interactive?: boolean }`

4. **FunctionPlot** — Plot arbitrary functions with optional tangent line at a draggable point, Taylor approximation overlay. Config: `{ fn: string (math expression), domain?: [number, number], showTangent?: boolean, taylorOrder?: number }`

5. **GradientField** — 2D vector field showing gradient arrows on a scalar surface, with optional trajectory tracing (gradient descent path). Config: `{ fn: string, showContours?: boolean, showTrajectory?: boolean, learningRate?: number }`

6. **ProbabilityPlot** — Renders PMF bars or PDF curves, supports mu/sigma sliders for Gaussian, area-under-curve shading. Config: `{ distribution: "gaussian"|"uniform"|"bernoulli"|"beta"|..., params: Record<string, number>, showArea?: [number, number] }`

7. **BayesUpdater** — Prior distribution + likelihood → posterior. Step through observations, watch posterior update. Config: `{ prior: DistConfig, likelihood: DistConfig, observations?: number[] }`

8. **LinearRegressionPlot** — Scatter points (draggable), fit line/curve, residual lines, uncertainty bands. Config: `{ points: Point[], degree?: number, showResiduals?: boolean, showUncertainty?: boolean }`

9. **SVMPlot** — 2D points with classes, separating hyperplane, margin, support vectors highlighted. Drag points to see margin change. Config: `{ points: ClassifiedPoint[], kernel?: "linear"|"rbf", showMargin?: boolean }`

10. **GMMPlot** — 2D point clusters with Gaussian ellipses. Step through EM iterations. Config: `{ points: Point[], k: number, stepMode?: boolean }`

### 3D Components (React Three Fiber + Drei)

All wrapped in `<Scene3D>` which provides `<Canvas>`, `<OrbitControls>`, lighting, grid, and theme integration.

11. **Scene3D** (wrapper) — Standard R3F Canvas setup: orbit controls, ambient + directional light, grid helper, responsive sizing. Config: `{ showGrid?: boolean, showAxes?: boolean, cameraPosition?: [number, number, number] }`

12. **VectorPlot3D** — 3D arrows with labels, draggable via Drei's `useDrag`. Config: `{ vectors: Vector3[], draggable?: boolean, showCrossProduct?: boolean }`

13. **MatrixTransform3D** — Animate a 3x3 matrix transforming the unit cube. Config: `{ matrix: number[][], animateFromIdentity?: boolean }`

14. **PCAScene** — 3D point cloud with principal component axes. Slider to project onto PC1, PC1+PC2. Config: `{ points: Point3D[], showAxes?: boolean, projectionDim?: 1|2|3 }`

15. **KernelProjection3D** — Lift 2D data into 3D using a kernel function, show separating hyperplane. Config: `{ points2D: ClassifiedPoint[], kernel: "polynomial"|"rbf" }`

---

## Exercise Components

All exercises share: question text (with KaTeX), optional hint (collapsible), submit button, feedback (correct/incorrect + explanation), celebration animation on correct.

1. **MultipleChoice** — Radio buttons, instant feedback on submit. Shuffles options if configured.

2. **NumericInput** — Single number input, validated with configurable tolerance (default 0.01). Shows "close but not exact" hints when within 2x tolerance.

3. **MatrixInput** — Grid of `<input type="number">` sized by rows x cols. Tab-navigable. Validates element-wise with tolerance.

4. **VectorInput** — Like MatrixInput but single row/column. Optional live preview: renders the vector in a small Mafs plot as user types.

5. **SliderExplore** — Embeds a visualization with a connected slider. User adjusts slider, observes effect, then answers a follow-up multiple-choice question about what they observed.

6. **DragToMatch** — Two columns of items. Drag from left to right to create pairs. Visual feedback on submit.

---

## Page Structure

### Landing Page (`app/[locale]/developer-section/mathematics-ml/page.tsx`)

- Uses existing `DeveloperHeader`, `Footer`, shared `ChallengesPage.module.css`
- Hero section with emerald accent: title, subtitle, badge count ("53 lessons"), chapter count ("12 chapters")
- Chapters rendered as collapsible accordion sections
- Each chapter shows its lessons as cards in a grid
- Each card: step number, title, completion status (via `devHubStore`)
- Framer Motion animations matching existing course landing pages

### Lesson Page (`app/[locale]/developer-section/mathematics-ml/[slug]/page.tsx`)

- Uses existing `CourseSidebar` component (lessons grouped by chapter in sidebar)
- Uses existing `ChallengePlay.module.css` for layout
- Content layout (single column, no code editor split):
  1. Chapter badge + lesson title
  2. Content paragraphs rendered via `MathContent` (KaTeX for `$...$` and `$$...$$`)
  3. Visualizations rendered inline at configured positions via `MMLLessonRenderer`
  4. Exercises section at bottom
  5. Key takeaways summary box
  6. Next/prev lesson navigation
- `CelebrationOverlay` on correct exercise answers
- All visualizations dynamically imported (no SSR) since Mafs and R3F need browser APIs

### Lesson Renderer (`components/math-ml/MMLLessonRenderer.tsx`)

Orchestrator component that takes an `MMLLesson` and renders:
- Content paragraphs through `MathContent`
- Visualization components via a lookup map (`vizType → Component`)
- Exercise components via a lookup map (`exerciseType → Component`)
- Handles state for exercise completion tracking

---

## Hub Integration

Add to `contentGroups` in `app/[locale]/developer-section/page.tsx`:

```typescript
{
  id: "mathematics-ml",
  category: "course",
  href: "/developer-section/mathematics-ml",
  icon: FunctionsIcon,
  titleKey: "mml-card-title",
  descKey: "mml-card-desc",
  ctaKey: "start-course",
  difficulty: "intermediate",
  tags: ["general"],
}
```

### Translation Keys (both `en` and `es`)

```
mml-card-title: "Mathematics for Machine Learning" / "Matematicas para Machine Learning"
mml-card-desc: "Interactive visualizations covering linear algebra, calculus, probability, and ML applications" / "Visualizaciones interactivas de algebra lineal, calculo, probabilidad y aplicaciones de ML"
mml-course-pill: "Interactive Math" / "Matematicas Interactivas"
mml-course-title: "Mathematics for Machine Learning" / "Matematicas para Machine Learning"
mml-course-subtitle: "Master the math behind ML with interactive 2D and 3D visualizations" / "Domina las matematicas detras del ML con visualizaciones interactivas 2D y 3D"
```

---

## File Organization Summary

```
# New files
lib/mmlTypes.ts                                    # Type definitions
lib/mmlCourseData.ts                               # 53 lessons data

components/math-ml/
├── MathContent.tsx                                 # KaTeX renderer
├── MMLLessonRenderer.tsx                           # Lesson orchestrator
├── visualizations/
│   ├── VectorPlot2D.tsx
│   ├── MatrixTransform2D.tsx
│   ├── NormBalls.tsx
│   ├── FunctionPlot.tsx
│   ├── GradientField.tsx
│   ├── ProbabilityPlot.tsx
│   ├── BayesUpdater.tsx
│   ├── LinearRegressionPlot.tsx
│   ├── SVMPlot.tsx
│   ├── GMMPlot.tsx
│   ├── Scene3D.tsx
│   ├── VectorPlot3D.tsx
│   ├── MatrixTransform3D.tsx
│   ├── PCAScene.tsx
│   └── KernelProjection3D.tsx
├── exercises/
│   ├── MultipleChoice.tsx
│   ├── NumericInput.tsx
│   ├── MatrixInput.tsx
│   ├── VectorInput.tsx
│   ├── SliderExplore.tsx
│   └── DragToMatch.tsx
└── MathML.module.css                               # Course-specific styles

app/[locale]/developer-section/mathematics-ml/
├── page.tsx                                         # Landing page
└── [slug]/page.tsx                                  # Lesson player

# Modified files
lib/translations.ts                                  # Add translation keys
app/[locale]/developer-section/page.tsx              # Add hub card
```

---

## Design Decisions

1. **No code editor** — This course is visualization-first. Users learn by manipulating interactive diagrams and answering exercises, not writing code.

2. **KaTeX over MathJax** — Faster rendering, smaller bundle, sufficient for the math notation needed.

3. **Dynamic imports for all viz** — Mafs and R3F both require browser APIs. Every visualization component is dynamically imported with `ssr: false`.

4. **Data-driven architecture** — Follows the existing course pattern. Adding/editing lessons means editing `mmlCourseData.ts`, not creating new page components.

5. **Reusable viz primitives** — ~15 visualization components cover all 53 lessons. Most lessons use 1-3 visualizations composed from these primitives.

6. **Exercise variety** — 6 exercise types ensure each lesson can test understanding in the way most appropriate to the topic (numeric for calculations, matrix for linear algebra, slider for exploration, etc.).

7. **Emerald accent** — `#10B981` is visually distinct from all existing course colors and evokes a "science/data" feel.
