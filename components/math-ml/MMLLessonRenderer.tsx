"use client";

import React, { useEffect, useRef, useState, useCallback, type ComponentType } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./MathML.module.css";

function pickLang<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

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
const SVDFlow = dynamic(
  () => import("./visualizations/SVDFlow"),
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
  "svd-flow": SVDFlow,
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
  lang: string;
}

function VisualizationBlock({ viz, lang }: VisualizationBlockProps) {
  const Component = VIZ_MAP[viz.type];
  const is3D = viz.type.includes("3d");
  const bodyClass = is3D
    ? `${styles.vizBody} ${styles.vizBody3D}`
    : styles.vizBody;

  if (!Component) {
    return null;
  }

  const title = pickLang(lang, viz.titleEs, viz.title);
  const description = pickLang(lang, viz.descriptionEs, viz.description);

  return (
    <div className={styles.vizContainer}>
      {title && <div className={styles.vizTitle}>{title}</div>}
      {description && (
        <div className={styles.vizDescription}>
          <MathContent text={description} as="span" />
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
  lang: string;
}

function localizeExercise(exercise: MMLExercise, lang: string): MMLExercise {
  if (lang !== "es") return exercise;
  const base = {
    ...exercise,
    question: exercise.questionEs ?? exercise.question,
    hint: exercise.hintEs ?? exercise.hint,
    explanation: exercise.explanationEs ?? exercise.explanation,
  };
  if (exercise.type === "multiple-choice" && exercise.optionsEs) {
    return { ...base, options: exercise.optionsEs } as MMLExercise;
  }
  return base as MMLExercise;
}

function ExerciseBlock({ exercise, onCorrect, lang }: ExerciseBlockProps) {
  const localized = localizeExercise(exercise, lang);
  switch (localized.type) {
    case "multiple-choice":
      return <MultipleChoice exercise={localized} onCorrect={onCorrect} />;
    case "numeric-input":
      return <NumericInput exercise={localized} onCorrect={onCorrect} />;
    case "matrix-input":
      return <MatrixInput exercise={localized} onCorrect={onCorrect} />;
    case "vector-input":
      return <VectorInput exercise={localized} onCorrect={onCorrect} />;
    case "slider-explore":
      return <SliderExplore exercise={localized} onCorrect={onCorrect} />;
    case "drag-to-match":
      return <DragToMatch exercise={localized} onCorrect={onCorrect} />;
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
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
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

  const title = pickLang(lang, lesson.titleEs, lesson.title);
  const chapter = pickLang(lang, lesson.chapterEs, lesson.chapter);
  const content = pickLang(lang, lesson.contentEs, lesson.content);
  const keyTakeaways = pickLang(lang, lesson.keyTakeawaysEs, lesson.keyTakeaways);
  const chapterPrefix = lang === "es" ? "Cap." : "Ch.";
  const exerciseHeading = lang === "es" ? "Ejercicios" : "Exercises";
  const takeawaysHeading = lang === "es" ? "Puntos Clave" : "Key Takeaways";

  // Reading progress
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const total = Math.max(1, rect.height - vh);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      setProgress(scrolled / total);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const isWorkedExample = (p: string) =>
    /^\s*\*\*(Worked example|Ejemplo (resuelto|trabajado))/i.test(p);

  // Decide when to interleave visualizations with content for better rhythm.
  const vizCount = lesson.visualizations.length;
  const contentCount = content.length;
  const vizInsertAfter: Array<number | null> = (() => {
    if (vizCount === 0) return content.map(() => null);
    if (vizCount === 1) {
      const insertAt = Math.min(
        contentCount - 1,
        Math.max(1, Math.floor(contentCount / 2)),
      );
      return content.map((_, i) => (i === insertAt ? 0 : null));
    }
    // Spread viz across the body, final ones at the end
    const stride = Math.max(1, Math.floor(contentCount / vizCount));
    const map: Array<number | null> = content.map(() => null);
    for (let k = 0; k < vizCount; k++) {
      const pos = Math.min(contentCount - 1, (k + 1) * stride - 1);
      map[pos] = k;
    }
    return map;
  })();

  return (
    <div className={styles.lessonContent} ref={rootRef}>
      <div className={styles.readingProgress} aria-hidden="true">
        <div
          className={styles.readingProgressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className={styles.chapterBadge}>
        {chapterPrefix} {lesson.chapterNumber} — {chapter}
      </div>

      <h1 className={styles.lessonTitle}>{title}</h1>

      {content.map((paragraph, i) => {
        const isIntro = i === 0;
        const isWorked = isWorkedExample(paragraph);
        const className = isIntro
          ? styles.lessonIntro
          : isWorked
            ? styles.workedExample
            : styles.lessonParagraph;
        const vizIdx = vizInsertAfter[i];
        return (
          <React.Fragment key={`content-${i}`}>
            <MathContent text={paragraph} as="p" className={className} />
            {vizIdx !== null && lesson.visualizations[vizIdx] && (
              <VisualizationBlock
                key={`viz-${vizIdx}`}
                viz={lesson.visualizations[vizIdx]}
                lang={lang}
              />
            )}
            {!isWorked && i < content.length - 1 && (i + 1) % 3 === 0 && (
              <div className={styles.lessonDivider} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}

      {lesson.exercises.length > 0 && (
        <section className={styles.exerciseSection}>
          <h2 className={styles.exerciseSectionTitle}>{exerciseHeading}</h2>
          {lesson.exercises.map((exercise, i) => (
            <ExerciseBlock
              key={`exercise-${i}`}
              exercise={exercise}
              onCorrect={() => handleExerciseCorrect(i)}
              lang={lang}
            />
          ))}
        </section>
      )}

      {keyTakeaways && keyTakeaways.length > 0 && (
        <aside className={styles.takeaways}>
          <div className={styles.takeawaysTitle}>{takeawaysHeading}</div>
          <ul className={styles.takeawaysList}>
            {keyTakeaways.map((takeaway, i) => (
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
