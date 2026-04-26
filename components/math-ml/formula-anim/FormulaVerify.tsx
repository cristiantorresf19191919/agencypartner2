"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";
import type { FormulaChainSpec } from "@/lib/mmlTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormulaCanvas } from "./FormulaCanvas";
import { checkEquivalence, type EquivalenceResult } from "./equivalence";
import styles from "./FormulaAnim.module.css";

interface Props {
  spec: FormulaChainSpec;
}

interface RowState {
  value: string;
  result: EquivalenceResult | null;
  revealed: boolean;
}

function pick(
  lang: string,
  es: string | undefined,
  en: string | undefined,
): string | undefined {
  return lang === "es" && es ? es : en;
}

function renderKaTeX(latex: string): string {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      output: "html",
      trust: false,
    });
  } catch {
    return `<code>${latex}</code>`;
  }
}

function mountKaTeX(host: HTMLElement | null, latex: string): void {
  if (!host) return;
  host.replaceChildren();
  if (!latex.trim()) return;
  try {
    const html = renderKaTeX(latex);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const root = doc.body.firstElementChild;
    if (root) host.appendChild(root);
  } catch {
    const code = document.createElement("code");
    code.textContent = latex;
    host.appendChild(code);
  }
}

/**
 * Strip LaTeX dressing so a student-typed step (which we display as KaTeX)
 * can be parsed by mathjs. Handles the small set of macros that show up in
 * MML worked examples; anything else passes through unchanged.
 */
function latexToMath(input: string): string {
  return input
    .replace(/\\cdot/g, "*")
    .replace(/\\times/g, "*")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\left|\\right/g, "")
    .replace(/\^\{([^{}]+)\}/g, "^($1)")
    .replace(/\\,|\\;|\\:|\\!/g, "")
    .replace(/\\mathbf\{([^{}]+)\}/g, "$1")
    .replace(/[{}]/g, "");
}

export function FormulaVerify({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const title = pick(lang, spec.titleEs, spec.title);
  const caption = pick(lang, spec.captionEs, spec.caption);

  const startRef = useRef<HTMLDivElement | null>(null);
  const previewRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [rows, setRows] = useState<RowState[]>(() =>
    spec.steps
      .slice(1)
      .map(() => ({ value: "", result: null, revealed: false })),
  );

  useEffect(() => {
    setRows(
      spec.steps
        .slice(1)
        .map(() => ({ value: "", result: null, revealed: false })),
    );
  }, [spec.steps]);

  // Render the starting equation once (and on language change).
  useEffect(() => {
    mountKaTeX(startRef.current, spec.steps[0] ?? "");
  }, [spec.steps]);

  // Re-render input previews when their values change.
  useEffect(() => {
    rows.forEach((row, i) => mountKaTeX(previewRefs.current[i], row.value));
  }, [rows]);

  function update(i: number, patch: Partial<RowState>) {
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  function verify(i: number) {
    const value = rows[i].value.trim();
    if (!value) return;
    const prevStep =
      i === 0
        ? spec.steps[0]
        : (rows[i - 1].result?.ok && rows[i - 1].value) || spec.steps[i];
    const result = checkEquivalence(latexToMath(prevStep), latexToMath(value));
    update(i, { result });
  }

  function reveal(i: number) {
    update(i, {
      revealed: true,
      value: spec.steps[i + 1],
      result: { ok: true, kind: "equivalent" },
    });
  }

  return (
    <FormulaCanvas title={title ?? "Try it yourself"} caption={caption}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          ref={startRef}
          className={styles.formulaSlot}
          style={{ minHeight: 0, padding: "8px 0" }}
        />
        {rows.map((row, i) => {
          const status = row.result?.kind ?? "pending";
          const borderColor =
            status === "equivalent"
              ? "#10B981"
              : status === "not-equivalent" || status === "parse-error"
                ? "#F59E0B"
                : "rgba(255,255,255,0.12)";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                borderLeft: `2px solid ${borderColor}`,
                paddingLeft: 12,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Step {i + 1}
                </span>
                <input
                  type="text"
                  value={row.value}
                  placeholder={
                    i === 0
                      ? "your next step (e.g. 2y+2+3y=7)"
                      : "your next step"
                  }
                  onChange={(e) =>
                    update(i, { value: e.target.value, result: null })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      verify(i);
                    }
                  }}
                  onBlur={() => {
                    if (row.value.trim() && !row.result) verify(i);
                  }}
                  spellCheck={false}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => verify(i)}
                  disabled={!row.value.trim()}
                  aria-label="Check this step"
                >
                  Check
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => reveal(i)}
                  aria-label="Reveal this step"
                  style={{ opacity: 0.6 }}
                >
                  Reveal
                </button>
              </div>
              {row.value ? (
                <div
                  ref={(el) => {
                    previewRefs.current[i] = el;
                  }}
                  style={{ minHeight: 30, color: "#fff", paddingLeft: 4 }}
                />
              ) : null}
              {row.result ? (
                <div
                  style={{
                    fontSize: 12,
                    color:
                      row.result.kind === "equivalent"
                        ? "#10B981"
                        : "#F59E0B",
                    paddingLeft: 4,
                  }}
                >
                  {row.result.kind === "equivalent"
                    ? row.revealed
                      ? "Revealed"
                      : "✓ Equivalent to the previous step"
                    : row.result.kind === "not-equivalent"
                      ? "Not equivalent — try a different rearrangement."
                      : `Can't parse: ${row.result.message}`}
                </div>
              ) : null}
            </div>
          );
        })}
        {rows.length > 0 && rows.every((r) => r.result?.ok) ? (
          <div
            style={{
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#10B981",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            All steps verified — derivation complete.
          </div>
        ) : null}
      </div>
    </FormulaCanvas>
  );
}

export default FormulaVerify;
