"use client";

import React, { useMemo, useState } from "react";
import type {
  FormulaExplorerSpec,
  FormulaExplorerKind,
} from "@/lib/mmlTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface Props {
  spec: FormulaExplorerSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

function evaluateKind(
  kind: FormulaExplorerKind,
  values: Record<string, number>,
  x: number,
): number {
  const v = (k: string, d = 0) =>
    Number.isFinite(values[k]) ? values[k] : d;
  switch (kind) {
    case "linear":
      return v("m", 1) * x + v("b", 0);
    case "quadratic":
      return v("a", 1) * x * x + v("b", 0) * x + v("c", 0);
    case "sigmoid":
      return 1 / (1 + Math.exp(-(v("w", 1) * x + v("b", 0))));
    case "gaussian": {
      const mu = v("mu", 0);
      const s = Math.max(0.01, v("sigma", 1));
      return Math.exp(-((x - mu) * (x - mu)) / (2 * s * s));
    }
    case "sine":
      return v("A", 1) * Math.sin(v("w", 1) * x + v("phi", 0));
    case "exponential":
      return v("A", 1) * Math.exp(v("k", 0.5) * x);
    case "power":
      return v("A", 1) * Math.pow(Math.max(0, x), v("p", 2));
    default:
      return 0;
  }
}

export function FormulaExplorer({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";

  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const s of spec.slots) init[s.key] = s.default;
    return init;
  });

  const title = pick(lang, spec.titleEs, spec.title);
  const description = pick(lang, spec.descriptionEs, spec.description);

  const formulaParts = useMemo(() => {
    const template = spec.formula;
    const parts: Array<{ text: string; color?: string; highlight?: boolean }> = [];
    let i = 0;
    while (i < template.length) {
      const open = template.indexOf("{", i);
      if (open === -1) {
        parts.push({ text: template.slice(i) });
        break;
      }
      if (open > i) parts.push({ text: template.slice(i, open) });
      const close = template.indexOf("}", open + 1);
      if (close === -1) {
        parts.push({ text: template.slice(open) });
        break;
      }
      const key = template.slice(open + 1, close);
      const slot = spec.slots.find((s) => s.key === key);
      if (slot) {
        const val = values[key] ?? slot.default;
        parts.push({
          text: val.toFixed(slot.step && slot.step < 1 ? 2 : 0),
          color: slot.color ?? "#34D399",
          highlight: true,
        });
      } else {
        parts.push({ text: template.slice(open, close + 1) });
      }
      i = close + 1;
    }
    return parts;
  }, [spec.formula, spec.slots, values]);

  const plot = spec.plot;
  const plotPath = useMemo(() => {
    if (!plot) return null;
    const [xMin, xMax] = plot.xDomain;
    const [yMin, yMax] = plot.yDomain;
    const W = 320;
    const H = 220;
    const samples = 140;
    const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
    const sy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;
    let d = "";
    for (let i = 0; i <= samples; i++) {
      const x = xMin + (i / samples) * (xMax - xMin);
      const y = evaluateKind(spec.kind, values, x);
      if (!Number.isFinite(y)) continue;
      const py = Math.max(-50, Math.min(H + 50, sy(y)));
      d += `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${py.toFixed(1)} `;
    }
    return { d, W, H, sx, sy };
  }, [plot, spec.kind, values]);

  return (
    <div className={styles.formulaExplorer}>
      <div className={styles.formulaExplorerHead}>
        <span className={styles.formulaExplorerTag}>
          {lang === "es" ? "Interactivo" : "Interactive"}
        </span>
        {title && (
          <div className={styles.formulaExplorerTitle}>{title}</div>
        )}
        {description && (
          <div className={styles.formulaExplorerDesc}>
            <MathContent text={description} as="span" />
          </div>
        )}
      </div>

      <div className={styles.formulaExplorerBody}>
        <div className={styles.formulaExplorerFormula}>
          {formulaParts.map((p, i) => (
            <span
              key={`fp-${i}`}
              className={
                p.highlight
                  ? styles.formulaExplorerValue
                  : styles.formulaExplorerGlyph
              }
              style={p.color ? { color: p.color } : undefined}
            >
              {p.text}
            </span>
          ))}
        </div>

        {plotPath && plot && (
          <div className={styles.formulaExplorerPlot}>
            <svg
              viewBox={`0 0 ${plotPath.W} ${plotPath.H}`}
              preserveAspectRatio="xMidYMid meet"
              className={styles.formulaExplorerPlotSvg}
            >
              {Array.from({ length: 11 }).map((_, i) => {
                const x = (i / 10) * plotPath.W;
                return (
                  <line
                    key={`gx-${i}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={plotPath.H}
                    stroke="rgba(148,163,184,0.08)"
                    strokeWidth={1}
                  />
                );
              })}
              {Array.from({ length: 9 }).map((_, i) => {
                const y = (i / 8) * plotPath.H;
                return (
                  <line
                    key={`gy-${i}`}
                    x1={0}
                    y1={y}
                    x2={plotPath.W}
                    y2={y}
                    stroke="rgba(148,163,184,0.08)"
                    strokeWidth={1}
                  />
                );
              })}
              {plot.xDomain[0] <= 0 && plot.xDomain[1] >= 0 && (
                <line
                  x1={plotPath.sx(0)}
                  y1={0}
                  x2={plotPath.sx(0)}
                  y2={plotPath.H}
                  stroke="rgba(148,163,184,0.3)"
                  strokeWidth={1}
                />
              )}
              {plot.yDomain[0] <= 0 && plot.yDomain[1] >= 0 && (
                <line
                  x1={0}
                  y1={plotPath.sy(0)}
                  x2={plotPath.W}
                  y2={plotPath.sy(0)}
                  stroke="rgba(148,163,184,0.3)"
                  strokeWidth={1}
                />
              )}
              <path
                d={plotPath.d}
                fill="none"
                stroke="#34D399"
                strokeWidth={6}
                strokeOpacity={0.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={plotPath.d}
                fill="none"
                stroke="#34D399"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <div className={styles.formulaExplorerSliders}>
          {spec.slots.map((slot) => {
            const val = values[slot.key] ?? slot.default;
            const label = pick(lang, slot.labelEs, slot.label);
            const color = slot.color ?? "#34D399";
            return (
              <label
                key={slot.key}
                className={styles.formulaExplorerSlider}
              >
                <div className={styles.formulaExplorerSliderHead}>
                  <span
                    className={styles.formulaExplorerSliderKey}
                    style={{ color }}
                  >
                    {slot.key}
                  </span>
                  <span className={styles.formulaExplorerSliderLabel}>
                    {label}
                  </span>
                  <span
                    className={styles.formulaExplorerSliderValue}
                    style={{ color }}
                  >
                    {val.toFixed(slot.step && slot.step < 1 ? 2 : 0)}
                  </span>
                </div>
                <input
                  type="range"
                  min={slot.min}
                  max={slot.max}
                  step={slot.step ?? 0.01}
                  value={val}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [slot.key]: parseFloat(e.target.value),
                    }))
                  }
                  className={styles.formulaExplorerRange}
                  style={{ accentColor: color }}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FormulaExplorer;
