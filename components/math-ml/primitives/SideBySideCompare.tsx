"use client";

import React, { useMemo, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { CompareArrows as CompareIcon } from "@mui/icons-material";
import type { MMLVizType, SideBySideSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

type VizComponent = ComponentType<{ config: Record<string, unknown> }>;

const VectorPlot2D = dynamic(() => import("../visualizations/VectorPlot2D"), {
  ssr: false,
}) as VizComponent;
const MatrixTransform2D = dynamic(
  () => import("../visualizations/MatrixTransform2D"),
  { ssr: false },
) as VizComponent;
const NormBalls = dynamic(() => import("../visualizations/NormBalls"), {
  ssr: false,
}) as VizComponent;
const FunctionPlot = dynamic(() => import("../visualizations/FunctionPlot"), {
  ssr: false,
}) as VizComponent;
const GradientField = dynamic(() => import("../visualizations/GradientField"), {
  ssr: false,
}) as VizComponent;
const ProbabilityPlot = dynamic(
  () => import("../visualizations/ProbabilityPlot"),
  { ssr: false },
) as VizComponent;
const BayesUpdater = dynamic(() => import("../visualizations/BayesUpdater"), {
  ssr: false,
}) as VizComponent;
const LinearRegressionPlot = dynamic(
  () => import("../visualizations/LinearRegressionPlot"),
  { ssr: false },
) as VizComponent;
const SVMPlot = dynamic(() => import("../visualizations/SVMPlot"), {
  ssr: false,
}) as VizComponent;
const GMMPlot = dynamic(() => import("../visualizations/GMMPlot"), {
  ssr: false,
}) as VizComponent;
const VectorPlot3D = dynamic(() => import("../visualizations/VectorPlot3D"), {
  ssr: false,
}) as VizComponent;
const MatrixTransform3D = dynamic(
  () => import("../visualizations/MatrixTransform3D"),
  { ssr: false },
) as VizComponent;
const PCAScene = dynamic(() => import("../visualizations/PCAScene"), {
  ssr: false,
}) as VizComponent;
const KernelProjection3D = dynamic(
  () => import("../visualizations/KernelProjection3D"),
  { ssr: false },
) as VizComponent;
const SVDFlow = dynamic(() => import("../visualizations/SVDFlow"), {
  ssr: false,
}) as VizComponent;

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

interface Props {
  spec: SideBySideSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function SideBySideCompare({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [t, setT] = useState<number>(spec.slider.default);

  const Left = VIZ_MAP[spec.left.vizType];
  const Right = VIZ_MAP[spec.right.vizType];
  const leftConfig = useMemo(() => spec.left.makeConfig(t), [spec.left, t]);
  const rightConfig = useMemo(() => spec.right.makeConfig(t), [spec.right, t]);

  const title = pick(lang, spec.titleEs, spec.title);
  const description = pick(lang, spec.descriptionEs, spec.description);
  const leftLabel = pick(lang, spec.left.labelEs, spec.left.label);
  const rightLabel = pick(lang, spec.right.labelEs, spec.right.label);
  const sliderLabel = pick(lang, spec.slider.labelEs, spec.slider.label);

  return (
    <section className={styles.compareBlock}>
      <div className={styles.compareHead}>
        <div className={styles.compareIcon}>
          <CompareIcon fontSize="small" />
        </div>
        <div>
          <span className={styles.compareTag}>
            {lang === "es" ? "Compara" : "Compare"}
          </span>
          {title && <div className={styles.compareTitle}>{title}</div>}
          {description && (
            <div className={styles.compareDesc}>
              <MathContent text={description} as="span" />
            </div>
          )}
        </div>
      </div>

      <div className={styles.compareGrid}>
        <div className={styles.comparePane}>
          <div className={styles.comparePaneLabel}>{leftLabel}</div>
          {Left && <Left config={leftConfig} />}
        </div>
        <div className={styles.comparePane}>
          <div className={`${styles.comparePaneLabel} ${styles.comparePaneLabelRight}`}>
            {rightLabel}
          </div>
          {Right && <Right config={rightConfig} />}
        </div>
      </div>

      <div className={styles.compareSlider}>
        <div className={styles.compareSliderHead}>
          <span className={styles.compareSliderKey}>{spec.slider.key}</span>
          <span className={styles.compareSliderLabel}>{sliderLabel}</span>
          <span className={styles.compareSliderValue}>{t.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={spec.slider.min}
          max={spec.slider.max}
          step={spec.slider.step ?? 0.01}
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          className={styles.compareSliderRange}
        />
      </div>
    </section>
  );
}

export default SideBySideCompare;
