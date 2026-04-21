"use client";

import React, { useState, useCallback, type ComponentType } from "react";
import dynamic from "next/dynamic";
import type {
  MMLLesson,
  MMLVisualization,
  MMLExercise,
  MMLVizType,
} from "@/lib/mmlTypes";
import { MathContent } from "./MathContent";
import { useCelebration } from "@/components/Celebration/useCelebration";
import { CelebrationOverlay } from "@/components/Celebration/CelebrationOverlay";
import styles from "./MathML.module.css";

// --- Dynamically imported visualization components (ssr: false) ---
// Mafs (2D) and react-three-fiber (3D) both need browser APIs.
// All viz components are default exports.
type VizComponent = ComponentType<{ config: Record<string, unknown> }>;

const VectorPlot2D = dynamic(
  () => import("./visualizations/VectorPlot2D"),
  { ssr: false }
) as VizComponent;
const MatrixTransform2D = dynamic(
  () => import("./visualizations/MatrixTransform2D"),
  { ssr: false }
) as VizComponent;
const NormBalls = dynamic(
  () => import("./visualizations/NormBalls"),
  { ssr: false }
) as VizComponent;
const FunctionPlot = dynamic(
  () => import("./visualizations/FunctionPlot"),
  { ssr: false }
) as VizComponent;
const GradientField = dynamic(
  () => import("./visualizations/GradientField"),
  { ssr: false }
) as VizComponent;
const ProbabilityPlot = dynamic(
  () => import("./visualizations/ProbabilityPlot"),
  { ssr: false }
) as VizComponent;
const BayesUpdater = dynamic(
  () => import("./visualizations/BayesUpdater"),
  { ssr: false }
) as VizComponent;
const LinearRegressionPlot = dynamic(
  () => import("./visualizations/LinearRegressionPlot"),
  { ssr: false }
) as VizComponent;
const SVMPlot = dynamic(
  () => import("./visualizations/SVMPlot"),
  { ssr: false }
) as VizComponent;
const GMMPlot = dynamic(
  () => import("./visualizations/GMMPlot"),
  { ssr: false }
) as VizComponent;

const VectorPlot3D = dynamic(
  () => import("./visualizations/VectorPlot3D"),
  { ssr: false }
) as VizComponent;
const MatrixTransform3D = dynamic(
  () => import("./visualizations/MatrixTransform3D"),
  { ssr: false }
) as VizComponent;
const PCAScene = dynamic(
  () => import("./visualizations/PCAScene"),
  { ssr: false }
) as VizComponent;
const KernelProjection3D = dynamic(
  () => import("./visualizations/KernelProjection3D"),
  { ssr: false }
) as VizComponent;

// eigenspace-3d reuses VectorPlot3D (eigenvectors passed as vector configs)
// svd-3d reuses MatrixTransform3D
const VIZ_MAP: Record<MMLVizType, VizComponent> = {
  "vector-2d": VectorPlot2D,
  "matrix-transform-2d": MatrixTransform2D,
  "norm-balls": NormBalls,
  "function-plot": FunctionPlot,
  "gradient-field": GradientField,
  "probability-plot": ProbabilityPlot,
  "bayes-updater": BayesUpdater,
  "linear-regression-plot": LinearRegressionPlot,
  "svm-plot": SVMPlot,
  "gmm-plot": GMMPlot,
  "vector-3d": VectorPlot3D,
  "matrix-transform-3d": MatrixTransform3D,
  "eigenspace-3d": VectorPlot3D,
  "pca-3d": PCAScene,
  "svd-3d": MatrixTransform3D,
  "kernel-projection-3d": KernelProjection3D,
};

// --- Dynamically imported exercise components (named exports) ---
const MultipleChoice = dynamic(
  () => import("./exercises/MultipleChoice").then((m) => m.MultipleChoice),
  { ssr: false }
);
const NumericInput = dynamic(
  () => import("./exercises/NumericInput").then((m) => m.NumericInput),
  { ssr: false }
);
const MatrixInput = dynamic(
  () => import("./exercises/MatrixInput").then((m) => m.MatrixInput),
  { ssr: false }
);
const VectorInput = dynamic(
  () => import("./exercises/VectorInput").then((m) => m.VectorInput),
  { ssr: false }
);
const SliderExplore = dynamic(
  () => import("./exercises/SliderExplore").then((m) => m.SliderExplore),
  { ssr: false }
);
const DragToMatch = dynamic(
  () => import("./exercises/DragToMatch").then((m) => m.DragToMatch),
  { ssr: false }
);

// --- VisualizationBlock ---
interface VisualizationBlockProps {
  viz: MMLVisualization;
}

function VisualizationBlock({ viz }: VisualizationBlockProps) {
  const Component = VIZ_MAP[viz.type];
  const is3D = viz.type.includes("3d");
  const bodyClass = is3D
    ? `${styles.vizBody} ${styles.vizBody3D}`
    : styles.vizBody;

  if (!Component) {
    return null;
  }

  return (
    <div className={styles.vizContainer}>
      {viz.title && <div className={styles.vizTitle}>{viz.title}</div>}
      {viz.description && (
        <div className={styles.vizDescription}>
          <MathContent text={viz.description} as="span" />
        </div>
      )}
      <div className={bodyClass}>
        <Component config={viz.config} />
      </div>
    </div>
  );
}

// --- ExerciseBlock ---
interface ExerciseBlockProps {
  exercise: MMLExercise;
  onCorrect: () => void;
}

function ExerciseBlock({ exercise, onCorrect }: ExerciseBlockProps) {
  switch (exercise.type) {
    case "multiple-choice":
      return <MultipleChoice exercise={exercise} onCorrect={onCorrect} />;
    case "numeric-input":
      return <NumericInput exercise={exercise} onCorrect={onCorrect} />;
    case "matrix-input":
      return <MatrixInput exercise={exercise} onCorrect={onCorrect} />;
    case "vector-input":
      return <VectorInput exercise={exercise} onCorrect={onCorrect} />;
    case "slider-explore":
      return <SliderExplore exercise={exercise} onCorrect={onCorrect} />;
    case "drag-to-match":
      return <DragToMatch exercise={exercise} onCorrect={onCorrect} />;
    default:
      return null;
  }
}

// --- Main orchestrator ---
export interface MMLLessonRendererProps {
  lesson: MMLLesson;
}

export function MMLLessonRenderer({ lesson }: MMLLessonRendererProps) {
  const { celebration, celebrate, onComplete } = useCelebration();
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(
    new Set()
  );

  const handleExerciseCorrect = useCallback(
    (index: number) => {
      setCompletedIndexes((prev) => {
        if (prev.has(index)) return prev;
        const next = new Set(prev);
        next.add(index);
        return next;
      });
      celebrate("simple");
    },
    [celebrate]
  );

  // Reference completedIndexes so tooling doesn't flag it as unused;
  // it's kept in state for future progress features.
  void completedIndexes;

  return (
    <div className={styles.lessonContent}>
      <div className={styles.chapterBadge}>
        Ch. {lesson.chapterNumber} — {lesson.chapter}
      </div>

      <h1 className={styles.lessonTitle}>{lesson.title}</h1>

      {lesson.content.map((paragraph, i) => (
        <MathContent
          key={`content-${i}`}
          text={paragraph}
          as="p"
          className={styles.lessonParagraph}
        />
      ))}

      {lesson.visualizations.map((viz, i) => (
        <VisualizationBlock key={`viz-${i}`} viz={viz} />
      ))}

      {lesson.exercises.length > 0 && (
        <section className={styles.exerciseSection}>
          <h2 className={styles.exerciseSectionTitle}>Exercises</h2>
          {lesson.exercises.map((exercise, i) => (
            <ExerciseBlock
              key={`exercise-${i}`}
              exercise={exercise}
              onCorrect={() => handleExerciseCorrect(i)}
            />
          ))}
        </section>
      )}

      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <aside className={styles.takeaways}>
          <div className={styles.takeawaysTitle}>Key Takeaways</div>
          <ul className={styles.takeawaysList}>
            {lesson.keyTakeaways.map((takeaway, i) => (
              <li key={`takeaway-${i}`} className={styles.takeawayItem}>
                <span className={styles.takeawayBullet}>•</span>
                <MathContent text={takeaway} as="span" />
              </li>
            ))}
          </ul>
        </aside>
      )}

      <CelebrationOverlay
        celebration={celebration}
        onComplete={onComplete}
      />
    </div>
  );
}

export default MMLLessonRenderer;
