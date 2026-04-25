"use client";

import React, { useMemo, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Science as ScienceIcon, RestartAlt as RestartIcon } from "@mui/icons-material";
import type { MMLVizType, TryYourOwnSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

type VizComponent = ComponentType<{ config: Record<string, unknown> }>;

// Re-import viz components. These are the same modules used in MMLLessonRenderer.
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
const FormulaChainViz = dynamic(
  () => import("../formula-anim/FormulaChain"),
  { ssr: false },
) as VizComponent;

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
  "formula-chain": FormulaChainViz,
};

interface Props {
  spec: TryYourOwnSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function TryYourOwn({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";

  const defaultMatrix = useMemo<number[][]>(() => {
    const input = spec.input;
    if (input.kind !== "matrix") return [[]];
    if (input.defaultMatrix) return input.defaultMatrix;
    return Array.from({ length: input.rows }, (_, r) =>
      Array.from({ length: input.cols }, (_, c) => (r === c ? 1 : 0)),
    );
  }, [spec.input]);

  const defaultVector = useMemo<number[]>(() => {
    const input = spec.input;
    if (input.kind !== "vector") return [];
    if (input.defaultVector) return input.defaultVector;
    return Array.from({ length: input.dim }, (_, i) => (i === 0 ? 1 : 0));
  }, [spec.input]);

  const [matrix, setMatrix] = useState<number[][]>(defaultMatrix);
  const [vector, setVector] = useState<number[]>(defaultVector);

  const Component = VIZ_MAP[spec.vizType];
  if (!Component) return null;

  const configKey =
    (spec.input.kind === "matrix" && spec.input.configKey) ||
    (spec.input.kind === "vector" && spec.input.configKey) ||
    (spec.input.kind === "matrix" ? "matrix" : "vectors");

  const config = useMemo<Record<string, unknown>>(() => {
    const base = spec.baseConfig ? { ...spec.baseConfig } : {};
    if (spec.input.kind === "matrix") {
      base[configKey] = matrix;
    } else {
      // Most viz accept `vectors: number[][]`; if user configured a different key
      // via configKey, fall back to that (e.g., "vector" singular).
      base[configKey] = configKey === "vectors" ? [vector] : vector;
    }
    return base;
  }, [spec.baseConfig, spec.input.kind, configKey, matrix, vector]);

  const title = pick(lang, spec.titleEs, spec.title) ?? (lang === "es" ? "Pruébalo tú" : "Try your own");
  const description = pick(lang, spec.descriptionEs, spec.description);
  const prompt = pick(lang, spec.promptEs, spec.prompt);

  const reset = () => {
    setMatrix(defaultMatrix);
    setVector(defaultVector);
  };

  return (
    <section className={styles.tryYourOwn}>
      <div className={styles.tryYourOwnHead}>
        <div className={styles.tryYourOwnIcon}>
          <ScienceIcon fontSize="small" />
        </div>
        <div className={styles.tryYourOwnHeadText}>
          <span className={styles.tryYourOwnTag}>
            {lang === "es" ? "Pruébalo tú" : "Sandbox"}
          </span>
          <div className={styles.tryYourOwnTitle}>{title}</div>
          {description && (
            <div className={styles.tryYourOwnDesc}>
              <MathContent text={description} as="span" />
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.tryYourOwnReset}
          onClick={reset}
          aria-label={lang === "es" ? "Restablecer" : "Reset"}
        >
          <RestartIcon fontSize="small" />
          <span>{lang === "es" ? "Restablecer" : "Reset"}</span>
        </button>
      </div>

      {prompt && (
        <div className={styles.tryYourOwnPrompt}>
          <MathContent text={prompt} as="span" />
        </div>
      )}

      <div className={styles.tryYourOwnGrid}>
        <div className={styles.tryYourOwnInputs}>
          {spec.input.kind === "matrix" ? (
            <MatrixGrid
              matrix={matrix}
              onChange={setMatrix}
              rows={spec.input.rows}
              cols={spec.input.cols}
            />
          ) : (
            <VectorRow vector={vector} onChange={setVector} dim={spec.input.dim} />
          )}
        </div>
        <motion.div
          className={styles.tryYourOwnViz}
          key={JSON.stringify({ matrix, vector })}
          initial={{ opacity: 0.7, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Component config={config} />
        </motion.div>
      </div>
    </section>
  );
}

function MatrixGrid({
  matrix,
  onChange,
  rows,
  cols,
}: {
  matrix: number[][];
  onChange: (m: number[][]) => void;
  rows: number;
  cols: number;
}) {
  const setCell = (r: number, c: number, raw: string) => {
    const parsed = parseFloat(raw);
    const next = matrix.map((row) => row.slice());
    next[r][c] = Number.isFinite(parsed) ? parsed : 0;
    onChange(next);
  };
  return (
    <div className={styles.matrixGrid}>
      <div
        className={styles.matrixGridInner}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(46px, 1fr))`,
          gridTemplateRows: `repeat(${rows}, auto)`,
        }}
      >
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <input
              key={`${r}-${c}`}
              type="number"
              inputMode="decimal"
              step={0.1}
              value={matrix[r]?.[c] ?? 0}
              onChange={(e) => setCell(r, c, e.target.value)}
              className={styles.matrixCell}
              aria-label={`Row ${r + 1}, column ${c + 1}`}
            />
          )),
        )}
      </div>
    </div>
  );
}

function VectorRow({
  vector,
  onChange,
  dim,
}: {
  vector: number[];
  onChange: (v: number[]) => void;
  dim: number;
}) {
  const set = (i: number, raw: string) => {
    const parsed = parseFloat(raw);
    const next = vector.slice();
    next[i] = Number.isFinite(parsed) ? parsed : 0;
    onChange(next);
  };
  return (
    <div className={styles.vectorRow}>
      {Array.from({ length: dim }).map((_, i) => (
        <input
          key={`v-${i}`}
          type="number"
          inputMode="decimal"
          step={0.1}
          value={vector[i] ?? 0}
          onChange={(e) => set(i, e.target.value)}
          className={styles.matrixCell}
          aria-label={`Vector component ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default TryYourOwn;
