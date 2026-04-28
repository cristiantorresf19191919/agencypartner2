"use client";

import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getPyodide } from "./usePyodide";
import { FormulaCanvas } from "../formula-anim/FormulaCanvas";
import styles from "../formula-anim/FormulaAnim.module.css";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
      }}
    >
      Loading editor…
    </div>
  ),
});

interface Props {
  code: string;
  /** Pyodide packages to preload before first run; defaults to ["numpy"]. */
  packages?: string[];
  title?: string;
  caption?: string;
  /** Initial editor height in px. Defaults to 220. */
  height?: number;
}

type RunState =
  | { kind: "idle" }
  | { kind: "loading-runtime"; message: string }
  | { kind: "running" }
  | { kind: "done"; output: string; result?: string; durationMs: number }
  | { kind: "error"; message: string; output: string };

export function PythonCell({
  code: initialCode,
  packages = ["numpy"],
  title,
  caption,
  height = 220,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [state, setState] = useState<RunState>({ kind: "idle" });
  const buffersRef = useRef<{ stdout: string[]; stderr: string[] }>({
    stdout: [],
    stderr: [],
  });

  const run = useCallback(async () => {
    buffersRef.current = { stdout: [], stderr: [] };
    setState({ kind: "loading-runtime", message: "Loading Python runtime…" });
    const t0 = performance.now();
    let py: Awaited<ReturnType<typeof getPyodide>>;
    try {
      py = await getPyodide(packages);
    } catch (err) {
      setState({
        kind: "error",
        message: `Couldn't load Python: ${(err as Error).message}`,
        output: "",
      });
      return;
    }
    py.setStdout({ batched: (s) => buffersRef.current.stdout.push(s) });
    py.setStderr({ batched: (s) => buffersRef.current.stderr.push(s) });
    setState({ kind: "running" });
    try {
      const result = await py.runPythonAsync(code);
      const ms = Math.round(performance.now() - t0);
      const stdout = buffersRef.current.stdout.join("");
      const stderr = buffersRef.current.stderr.join("");
      const output = stdout + (stderr ? `\n[stderr]\n${stderr}` : "");
      setState({
        kind: "done",
        output,
        result:
          result === undefined || result === null ? undefined : String(result),
        durationMs: ms,
      });
    } catch (err) {
      const stdout = buffersRef.current.stdout.join("");
      const stderr = buffersRef.current.stderr.join("");
      const message = (err as Error).message ?? String(err);
      setState({
        kind: "error",
        message,
        output: stdout + (stderr ? `\n[stderr]\n${stderr}` : ""),
      });
    }
  }, [code, packages]);

  const reset = useCallback(() => {
    setCode(initialCode);
    setState({ kind: "idle" });
  }, [initialCode]);

  const statusLine =
    state.kind === "loading-runtime"
      ? state.message
      : state.kind === "running"
        ? "Running…"
        : state.kind === "done"
          ? `Done in ${state.durationMs} ms`
          : state.kind === "error"
            ? "Error"
            : "Ready — click Run to execute in your browser.";

  const statusColor =
    state.kind === "error"
      ? "#F59E0B"
      : state.kind === "done"
        ? "#10B981"
        : "rgba(255,255,255,0.55)";

  return (
    <FormulaCanvas title={title ?? "Python (in browser)"} caption={caption}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <MonacoEditor
            height={height}
            language="python"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              tabSize: 4,
              lineNumbers: "on",
              padding: { top: 10, bottom: 10 },
              renderLineHighlight: "line",
              fixedOverflowWidgets: true,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className={styles.btn}
            onClick={run}
            disabled={state.kind === "loading-runtime" || state.kind === "running"}
            aria-label="Run Python code"
          >
            {state.kind === "loading-runtime" || state.kind === "running"
              ? "Running…"
              : "Run"}
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={reset}
            disabled={code === initialCode && state.kind === "idle"}
            aria-label="Reset code"
            style={{ opacity: 0.7 }}
          >
            Reset
          </button>
          <span
            style={{
              fontSize: 12,
              color: statusColor,
              marginLeft: "auto",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {statusLine}
          </span>
        </div>
        {(state.kind === "done" || state.kind === "error") &&
        (state.output || (state.kind === "done" && state.result) || state.kind === "error") ? (
          <pre
            style={{
              margin: 0,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.55)",
              border: `1px solid ${state.kind === "error" ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.25)"}`,
              color: state.kind === "error" ? "#FCD34D" : "#E5E7EB",
              fontSize: 13,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: 280,
              overflow: "auto",
            }}
          >
            {state.kind === "error"
              ? `${state.output}${state.output ? "\n" : ""}${state.message}`
              : state.output ||
                (state.result ? `=> ${state.result}` : "(no output)")}
          </pre>
        ) : null}
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
          }}
        >
          Python runs entirely in your browser via Pyodide (~6 MB on first
          Run, cached after).
        </p>
      </div>
    </FormulaCanvas>
  );
}

export default PythonCell;
