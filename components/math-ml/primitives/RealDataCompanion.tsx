"use client";

import React, { useMemo, useState } from "react";
import { DatasetRounded as DatasetIcon } from "@mui/icons-material";
import type { RealDataCompanionSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getDataset,
  mean,
  variance,
  covarianceMatrix2D,
  eig2x2,
} from "./datasets";
import styles from "../MathML.module.css";

interface Props {
  spec: RealDataCompanionSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

const CLASS_COLORS = ["#34D399", "#60A5FA", "#C4B5FD", "#FBBF24", "#F472B6"];

export function RealDataCompanion({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";

  const ds = getDataset(spec.dataset);
  const [fx, setFx] = useState<number>(spec.featureX ?? 0);
  const [fy, setFy] = useState<number>(
    spec.featureY ?? Math.min(1, (ds?.features.length ?? 2) - 1),
  );

  if (!ds) return null;

  const xs = ds.rows.map((r) => r.values[fx]);
  const ys = ds.rows.map((r) => r.values[fy]);

  const title =
    pick(lang, spec.titleEs, spec.title) ??
    (lang === "es" ? "Datos reales" : "Real data");
  const description = pick(lang, spec.descriptionEs, spec.description);
  const features = (lang === "es" && ds.featuresEs) ? ds.featuresEs : ds.features;

  const stats = useMemo(() => {
    const mx = mean(xs);
    const my = mean(ys);
    const vx = variance(xs);
    const vy = variance(ys);
    const cov = covarianceMatrix2D(xs, ys);
    const { lambdas, vectors } = eig2x2(cov);
    return { mx, my, vx, vy, cov, lambdas, vectors };
  }, [xs, ys]);

  // SVG layout
  const W = 520;
  const H = 320;
  const PAD = 36;
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const xR = xMax - xMin || 1;
  const yR = yMax - yMin || 1;
  const sx = (x: number) => PAD + ((x - xMin) / xR) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - yMin) / yR) * (H - 2 * PAD);

  // Mode-specific overlay
  const overlay = renderOverlay(spec.mode, {
    sx,
    sy,
    stats,
    xs,
    ys,
    xDomain: [xMin, xMax] as [number, number],
    yDomain: [yMin, yMax] as [number, number],
  });

  return (
    <section className={styles.realData}>
      <div className={styles.realDataHead}>
        <div className={styles.realDataIcon}>
          <DatasetIcon fontSize="small" />
        </div>
        <div className={styles.realDataHeadText}>
          <span className={styles.realDataTag}>
            {lang === "es" ? "Datos reales" : "Real-data companion"}
          </span>
          <div className={styles.realDataTitle}>{title}</div>
          <div className={styles.realDataDatasetName}>
            {(lang === "es" && ds.nameEs) ? ds.nameEs : ds.name}
          </div>
          {description && (
            <div className={styles.realDataDesc}>
              <MathContent text={description} as="span" />
            </div>
          )}
        </div>
      </div>

      <div className={styles.realDataGrid}>
        <div className={styles.realDataPlotWrap}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={styles.realDataSvg}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* background grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`gx-${i}`}
                x1={PAD + (i / 8) * (W - 2 * PAD)}
                y1={PAD}
                x2={PAD + (i / 8) * (W - 2 * PAD)}
                y2={H - PAD}
                stroke="rgba(148,163,184,0.08)"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`gy-${i}`}
                x1={PAD}
                y1={PAD + (i / 6) * (H - 2 * PAD)}
                x2={W - PAD}
                y2={PAD + (i / 6) * (H - 2 * PAD)}
                stroke="rgba(148,163,184,0.08)"
                strokeWidth={1}
              />
            ))}
            {/* axes */}
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(148,163,184,0.4)" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(148,163,184,0.4)" />

            {/* data points */}
            {ds.rows.map((row, i) => (
              <circle
                key={`pt-${i}`}
                cx={sx(row.values[fx])}
                cy={sy(row.values[fy])}
                r={4}
                fill={CLASS_COLORS[row.classIndex % CLASS_COLORS.length]}
                fillOpacity={0.85}
                stroke="rgba(2,6,23,0.6)"
                strokeWidth={0.5}
              />
            ))}

            {overlay}

            {/* axis labels */}
            <text
              x={W / 2}
              y={H - 8}
              textAnchor="middle"
              fill="rgba(226,232,240,0.65)"
              fontSize={12}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {features[fx]}
            </text>
            <text
              x={12}
              y={H / 2}
              textAnchor="middle"
              fill="rgba(226,232,240,0.65)"
              fontSize={12}
              transform={`rotate(-90, 12, ${H / 2})`}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {features[fy]}
            </text>
          </svg>

          <div className={styles.realDataLegend}>
            {(lang === "es" && ds.classesEs
              ? ds.classesEs
              : ds.classes
            ).map((label, i) => (
              <span key={`lg-${i}`} className={styles.realDataLegendItem}>
                <span
                  className={styles.realDataLegendDot}
                  style={{ background: CLASS_COLORS[i % CLASS_COLORS.length] }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.realDataSidebar}>
          <div className={styles.realDataFeaturePicker}>
            <div className={styles.realDataPickerLabel}>
              {lang === "es" ? "Eje X" : "X axis"}
            </div>
            <div className={styles.realDataPickerRow}>
              {features.map((f, i) => (
                <button
                  key={`fx-${i}`}
                  type="button"
                  className={`${styles.realDataPickerBtn} ${i === fx ? styles.realDataPickerBtnActive : ""}`}
                  onClick={() => setFx(i)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className={styles.realDataPickerLabel}>
              {lang === "es" ? "Eje Y" : "Y axis"}
            </div>
            <div className={styles.realDataPickerRow}>
              {features.map((f, i) => (
                <button
                  key={`fy-${i}`}
                  type="button"
                  className={`${styles.realDataPickerBtn} ${i === fy ? styles.realDataPickerBtnActive : ""}`}
                  onClick={() => setFy(i)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.realDataStats}>
            <StatRow label={lang === "es" ? "Media X" : "mean X"} value={stats.mx} />
            <StatRow label={lang === "es" ? "Media Y" : "mean Y"} value={stats.my} />
            <StatRow label={lang === "es" ? "Var X" : "var X"} value={stats.vx} />
            <StatRow label={lang === "es" ? "Var Y" : "var Y"} value={stats.vy} />
            <StatRow label="cov(X,Y)" value={stats.cov[0][1]} />
            <StatRow label="λ₁" value={stats.lambdas[0]} accent />
            <StatRow label="λ₂" value={stats.lambdas[1]} accent />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`${styles.realDataStatRow} ${accent ? styles.realDataStatRowAccent : ""}`}>
      <span className={styles.realDataStatLabel}>{label}</span>
      <span className={styles.realDataStatValue}>{value.toFixed(2)}</span>
    </div>
  );
}

function renderOverlay(
  mode: RealDataCompanionSpec["mode"],
  ctx: {
    sx: (x: number) => number;
    sy: (y: number) => number;
    stats: {
      mx: number;
      my: number;
      vx: number;
      vy: number;
      cov: [[number, number], [number, number]];
      lambdas: [number, number];
      vectors: [[number, number], [number, number]];
    };
    xs: number[];
    ys: number[];
    xDomain: [number, number];
    yDomain: [number, number];
  },
): React.ReactNode {
  const { sx, sy, stats } = ctx;
  if (mode === "mean-and-spread") {
    const sdx = Math.sqrt(stats.vx);
    const sdy = Math.sqrt(stats.vy);
    return (
      <g>
        <line
          x1={sx(stats.mx - sdx)}
          y1={sy(stats.my)}
          x2={sx(stats.mx + sdx)}
          y2={sy(stats.my)}
          stroke="#FBBF24"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <line
          x1={sx(stats.mx)}
          y1={sy(stats.my - sdy)}
          x2={sx(stats.mx)}
          y2={sy(stats.my + sdy)}
          stroke="#FBBF24"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={sx(stats.mx)} cy={sy(stats.my)} r={5} fill="#FBBF24" />
      </g>
    );
  }

  if (mode === "variance-ellipse" || mode === "pca-axes") {
    const ang = Math.atan2(stats.vectors[0][1], stats.vectors[0][0]);
    const rx = Math.sqrt(Math.max(0, stats.lambdas[0])) * 2;
    const ry = Math.sqrt(Math.max(0, stats.lambdas[1])) * 2;
    const e1x = stats.vectors[0][0];
    const e1y = stats.vectors[0][1];
    const e2x = stats.vectors[1][0];
    const e2y = stats.vectors[1][1];
    const len1 = Math.sqrt(Math.max(0, stats.lambdas[0])) * 2;
    const len2 = Math.sqrt(Math.max(0, stats.lambdas[1])) * 2;
    return (
      <g>
        <ellipse
          cx={sx(stats.mx)}
          cy={sy(stats.my)}
          rx={Math.abs(sx(stats.mx + rx) - sx(stats.mx))}
          ry={Math.abs(sy(stats.my + ry) - sy(stats.my))}
          fill="rgba(52,211,153,0.08)"
          stroke="#34D399"
          strokeWidth={2}
          transform={`rotate(${(ang * 180) / Math.PI} ${sx(stats.mx)} ${sy(stats.my)})`}
          style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.4))" }}
        />
        {mode === "pca-axes" && (
          <>
            <line
              x1={sx(stats.mx - e1x * len1)}
              y1={sy(stats.my - e1y * len1)}
              x2={sx(stats.mx + e1x * len1)}
              y2={sy(stats.my + e1y * len1)}
              stroke="#FBBF24"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <line
              x1={sx(stats.mx - e2x * len2)}
              y1={sy(stats.my - e2y * len2)}
              x2={sx(stats.mx + e2x * len2)}
              y2={sy(stats.my + e2y * len2)}
              stroke="#60A5FA"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </>
        )}
        <circle cx={sx(stats.mx)} cy={sy(stats.my)} r={5} fill="#FBBF24" />
      </g>
    );
  }

  if (mode === "regression-line") {
    // Least-squares slope + intercept using stats we already have
    const mx = stats.mx;
    const my = stats.my;
    const cxy = stats.cov[0][1];
    const slope = cxy / Math.max(1e-9, stats.vx);
    const intercept = my - slope * mx;
    const [xMin, xMax] = ctx.xDomain;
    return (
      <line
        x1={sx(xMin)}
        y1={sy(slope * xMin + intercept)}
        x2={sx(xMax)}
        y2={sy(slope * xMax + intercept)}
        stroke="#34D399"
        strokeWidth={3}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.45))" }}
      />
    );
  }

  return null;
}

export default RealDataCompanion;
